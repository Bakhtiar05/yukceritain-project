import React from "react";
import { getDiscountCodes } from "@/app/actions/adminDiscounts";
import DiscountsClient from "./DiscountsClient";

export const dynamic = "force-dynamic";

export default async function DiscountsPage() {
  const result = await getDiscountCodes();
  const discounts = result.success ? (result.data || []) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Discount Codes</h1>
        <p className="text-sm text-slate-500">
          Kelola kode diskon untuk pemesanan konseling. Anda dapat membuat kode diskon baru, mengubah batas penggunaan, dan menonaktifkannya.
        </p>
      </div>

      <DiscountsClient initialDiscounts={discounts} />
    </div>
  );
}
