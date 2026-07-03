'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'

export interface CounselorAvailability {
  id?: string;
  counselor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

// Admin only (requires auth)
export async function getCounselorAvailability(counselorId: string): Promise<CounselorAvailability[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('counselor_availability')
    .select('*')
    .eq('counselor_id', counselorId)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) {
    console.error('Error fetching counselor availability:', error)
    return []
  }

  return data as CounselorAvailability[]
}

// Admin only (requires auth)
export async function updateCounselorAvailability(
  counselorId: string, 
  schedules: Omit<CounselorAvailability, 'id' | 'counselor_id'>[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Delete existing schedules for this counselor
    const { error: deleteError } = await supabase
      .from('counselor_availability')
      .delete()
      .eq('counselor_id', counselorId)

    if (deleteError) throw deleteError

    // Insert new schedules
    if (schedules.length > 0) {
      const { error: insertError } = await supabase
        .from('counselor_availability')
        .insert(
          schedules.map(s => ({
            counselor_id: counselorId,
            day_of_week: s.day_of_week,
            start_time: s.start_time,
            end_time: s.end_time,
            is_available: s.is_available
          }))
        )

      if (insertError) throw insertError
    }

    revalidatePath(`/admin/konseling/counselors/${counselorId}/schedule`)
    return { success: true }
  } catch (error: any) {
    console.error('Error updating counselor availability:', error)
    return { success: false, error: error.message }
  }
}

// Generate 1-hour slots from start to end (e.g. 09:00 to 12:00 -> 09:00 - 10:00 WIB)
function generateHourlySlots(startTime: string, endTime: string): string[] {
  const slots: string[] = []
  
  // Format is expected to be HH:mm or HH:mm:ss
  let [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)

  while (startH < endH || (startH === endH && startM < endM)) {
    let nextH = startH + 1;
    let nextM = startM;
    if (nextH > 23) break; // prevent overflowing the day
    
    // Stop if next slot exceeds end time
    if (nextH > endH || (nextH === endH && nextM > endM)) {
      break;
    }

    const sTimeStr = `${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}`
    const eTimeStr = `${nextH.toString().padStart(2, '0')}:${nextM.toString().padStart(2, '0')}`
    slots.push(`${sTimeStr} - ${eTimeStr} WIB`)
    
    startH = nextH;
    startM = nextM;
  }
  
  return slots;
}

// Public access (via Server Components or Server Actions)
export async function getDynamicTimeSlots(date: Date, counselorId?: string): Promise<string[]> {
  try {
    const supabase = createAdminClient();
    const dayOfWeek = date.getDay(); // 0 (Sun) to 6 (Sat)
    const dateStr = format(date, "yyyy-MM-dd");

    // 1. Fetch Availability from DB
    let availabilityQuery = supabase
      .from('counselor_availability')
      .select('counselor_id, start_time, end_time')
      .eq('day_of_week', dayOfWeek)
      .eq('is_available', true);

    if (counselorId) {
      availabilityQuery = availabilityQuery.eq('counselor_id', counselorId);
    } else {
      // For Auto mode, we only want availability of active & public counselors
      const { data: activeCounselors } = await supabase
        .from('counselors')
        .select('id')
        .eq('is_active', true)
        .eq('is_public', true);
      
      const activeIds = activeCounselors?.map(c => c.id) || [];
      if (activeIds.length === 0) return [];
      availabilityQuery = availabilityQuery.in('counselor_id', activeIds);
    }

    const { data: availabilities, error: availError } = await availabilityQuery;
    
    if (availError || !availabilities || availabilities.length === 0) {
      return []; // No one is available on this day
    }

    // 2. Generate Potential Slots per counselor
    // Map: slot string -> set of available counselor IDs
    const potentialSlots = new Map<string, Set<string>>();

    for (const avail of availabilities) {
      const slots = generateHourlySlots(avail.start_time, avail.end_time);
      for (const slot of slots) {
        if (!potentialSlots.has(slot)) {
          potentialSlots.set(slot, new Set());
        }
        potentialSlots.get(slot)!.add(avail.counselor_id);
      }
    }

    // 3. Fetch Existing Bookings for this date
    let bookingsQuery = supabase
      .from("consultation_requests")
      .select("counselor_id, waktu_konsultasi")
      .eq("tanggal_konsultasi", dateStr)
      .in("db_status", ["Menunggu Verifikasi", "Disetujui", "Waiting Payment", "Waiting Admin Confirmation", "Processing"]);

    if (counselorId) {
      bookingsQuery = bookingsQuery.eq("counselor_id", counselorId);
    }

    const { data: existingBookings } = await bookingsQuery;

    // Remove booked slots from counselor's availability
    if (existingBookings && existingBookings.length > 0) {
      for (const booking of existingBookings) {
        if (booking.counselor_id && booking.waktu_konsultasi) {
          const counselorsAtSlot = potentialSlots.get(booking.waktu_konsultasi);
          if (counselorsAtSlot) {
            counselorsAtSlot.delete(booking.counselor_id);
            if (counselorsAtSlot.size === 0) {
              potentialSlots.delete(booking.waktu_konsultasi);
            }
          }
        }
      }
    }

    // The keys of potentialSlots are the final available slots
    const finalSlots = Array.from(potentialSlots.keys()).sort();
    return finalSlots;
  } catch (error) {
    console.error("Failed to calculate dynamic time slots:", error);
    return [];
  }
}
