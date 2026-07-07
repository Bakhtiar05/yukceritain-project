"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getDiscountCodes() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching discount codes:", error);
    return { success: false, error: error.message || "Gagal mengambil data diskon" };
  }
}

export async function createDiscountCode(data: { code: string; discount_percentage: number; max_uses: number | null }) {
  try {
    const supabase = createAdminClient();
    
    // Check if code already exists
    const normalizedCode = data.code.trim().toUpperCase();
    const { data: existing } = await supabase
      .from("discount_codes")
      .select("id")
      .ilike("code", normalizedCode)
      .single();
      
    if (existing) {
      return { success: false, error: "Kode diskon sudah ada" };
    }

    const { error } = await supabase
      .from("discount_codes")
      .insert({
        code: normalizedCode,
        discount_percentage: data.discount_percentage,
        max_uses: data.max_uses,
        is_active: true
      });

    if (error) throw error;
    
    revalidatePath("/admin/konseling/discounts");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating discount code:", error);
    return { success: false, error: error.message || "Gagal membuat kode diskon" };
  }
}

export async function updateDiscountCode(id: string, data: { discount_percentage: number; max_uses: number | null }) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("discount_codes")
      .update({
        discount_percentage: data.discount_percentage,
        max_uses: data.max_uses
      })
      .eq("id", id);

    if (error) throw error;
    
    revalidatePath("/admin/konseling/discounts");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating discount code:", error);
    return { success: false, error: error.message || "Gagal mengupdate kode diskon" };
  }
}

export async function toggleDiscountStatus(id: string, is_active: boolean) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("discount_codes")
      .update({ is_active })
      .eq("id", id);

    if (error) throw error;
    
    revalidatePath("/admin/konseling/discounts");
    return { success: true };
  } catch (error: any) {
    console.error("Error toggling discount status:", error);
    return { success: false, error: error.message || "Gagal merubah status kode diskon" };
  }
}
