"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function validateDiscountCode(code: string) {
  try {
    const supabase = createAdminClient();
    
    // Normalize code (uppercase, trim)
    const normalizedCode = code.trim().toUpperCase();
    
    if (!normalizedCode) {
      return { success: false, error: "Kode diskon tidak boleh kosong" };
    }

    const { data: discount, error } = await supabase
      .from("discount_codes")
      .select("*")
      .ilike("code", normalizedCode)
      .single();

    if (error || !discount) {
      return { success: false, error: "Kode diskon tidak valid atau tidak ditemukan" };
    }

    if (!discount.is_active) {
      return { success: false, error: "Kode diskon sudah tidak aktif" };
    }

    if (discount.max_uses !== null && discount.current_uses >= discount.max_uses) {
      return { success: false, error: "Kode diskon sudah mencapai batas penggunaan" };
    }

    return { 
      success: true, 
      discount_percentage: discount.discount_percentage,
      code: discount.code 
    };
  } catch (error: any) {
    console.error("Error validating discount code:", error);
    return { success: false, error: "Gagal memvalidasi kode diskon" };
  }
}
