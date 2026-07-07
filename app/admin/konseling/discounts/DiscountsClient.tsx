"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Plus, Percent, PenTool, CheckCircle2, XCircle } from "lucide-react";
import { 
  createDiscountCode, 
  updateDiscountCode, 
  toggleDiscountStatus 
} from "@/app/actions/adminDiscounts";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DiscountCode {
  id: string;
  code: string;
  discount_percentage: number;
  is_active: boolean;
  max_uses: number | null;
  current_uses: number;
  created_at: string;
}

export default function DiscountsClient({ initialDiscounts }: { initialDiscounts: DiscountCode[] }) {
  const [discounts, setDiscounts] = useState<DiscountCode[]>(initialDiscounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("100");
  const [maxUses, setMaxUses] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const handleOpenModal = (discount?: DiscountCode) => {
    if (discount) {
      setEditingId(discount.id);
      setCode(discount.code);
      setDiscountPercentage(discount.discount_percentage.toString());
      setMaxUses(discount.max_uses ? discount.max_uses.toString() : "");
    } else {
      setEditingId(null);
      setCode("");
      setDiscountPercentage("100");
      setMaxUses("");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Kode diskon wajib diisi" });
      return;
    }

    setIsSubmitting(true);
    try {
      const p = parseInt(discountPercentage, 10) || 100;
      const m = maxUses.trim() ? parseInt(maxUses, 10) : null;

      if (editingId) {
        const res = await updateDiscountCode(editingId, { discount_percentage: p, max_uses: m });
        if (res.success) {
          toast({ title: "Berhasil", description: "Kode diskon berhasil diupdate" });
          setDiscounts(prev => prev.map(d => d.id === editingId ? { ...d, discount_percentage: p, max_uses: m } : d));
          handleCloseModal();
        } else {
          toast({ variant: "destructive", title: "Gagal", description: res.error });
        }
      } else {
        const res = await createDiscountCode({ code, discount_percentage: p, max_uses: m });
        if (res.success) {
          toast({ title: "Berhasil", description: "Kode diskon berhasil dibuat" });
          // Note: Next.js revalidatePath will refresh the page data shortly,
          // but we reload window here to ensure immediate UI consistency for new items
          window.location.reload();
        } else {
          toast({ variant: "destructive", title: "Gagal", description: res.error });
        }
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: "Terjadi kesalahan sistem" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    // Optimistic update
    setDiscounts(prev => prev.map(d => d.id === id ? { ...d, is_active: newStatus } : d));
    
    const res = await toggleDiscountStatus(id, newStatus);
    if (!res.success) {
      toast({ variant: "destructive", title: "Gagal", description: res.error });
      // Revert if failed
      setDiscounts(prev => prev.map(d => d.id === id ? { ...d, is_active: currentStatus } : d));
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Diskon Baru
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">KODE</th>
                <th className="px-6 py-4">DISKON</th>
                <th className="px-6 py-4">PENGGUNAAN</th>
                <th className="px-6 py-4">DIBUAT PADA</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {discounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Belum ada kode diskon.
                  </td>
                </tr>
              ) : (
                discounts.map((discount) => (
                  <tr key={discount.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 font-mono font-medium px-2 py-1 rounded-md text-xs">
                        <Percent className="w-3 h-3 text-slate-400" />
                        {discount.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-emerald-600">
                      {discount.discount_percentage}%
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {discount.current_uses} / {discount.max_uses ? discount.max_uses : "∞"}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {format(new Date(discount.created_at), "d MMM yyyy", { locale: idLocale })}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleToggle(discount.id, discount.is_active)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          discount.is_active 
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" 
                            : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                        }`}
                      >
                        {discount.is_active ? (
                          <><CheckCircle2 className="w-3.5 h-3.5" /> Aktif</>
                        ) : (
                          <><XCircle className="w-3.5 h-3.5" /> Nonaktif</>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleOpenModal(discount)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <PenTool className="w-4 h-4 mr-2" /> Edit
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingId ? "Edit Kode Diskon" : "Buat Kode Diskon Baru"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kode Diskon</label>
                <input 
                  type="text" 
                  value={code} 
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  disabled={!!editingId} // Code cannot be changed once created
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase disabled:bg-slate-50 disabled:text-slate-500"
                  placeholder="e.g. GRATIS100"
                  required
                />
                {editingId && <p className="text-xs text-slate-500 mt-1">Kode tidak dapat diubah setelah dibuat.</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Persentase Diskon (%)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="100"
                  value={discountPercentage} 
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Batas Penggunaan (Opsional)</label>
                <input 
                  type="number" 
                  min="1" 
                  value={maxUses} 
                  onChange={(e) => setMaxUses(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Kosongkan jika tanpa batas"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
