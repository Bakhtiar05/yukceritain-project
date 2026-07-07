import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { validateDiscountCode } from "@/app/actions/discount";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { BookingFormData } from "@/lib/schemas/booking";
import { StepTransition } from "../components/StepTransition";
import { BookingStepProps } from "../types/booking";
import { getPublicCounselors } from "@/lib/actions/counselors";

const Card = ({ title, onEditClick, children }: { title: string, onEditClick?: () => void, children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
      <h3 className="font-bold text-slate-900">{title}</h3>
      {onEditClick && (
        <button onClick={onEditClick} className="text-sm font-medium text-blue-600 hover:text-blue-700">
          Ubah
        </button>
      )}
    </div>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const Item = ({ label, value }: { label: string, value: any }) => (
  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between py-1 gap-1 sm:gap-4">
    <span className="text-sm text-slate-500 min-w-[120px]">{label}</span>
    <span className="text-sm font-medium text-slate-900 sm:text-right">{value || "-"}</span>
  </div>
);

export function ReviewStep({ onEdit }: BookingStepProps) {
  const { watch, setValue } = useFormContext<BookingFormData>();
  const data = watch();
  const [counselorName, setCounselorName] = useState<string>("");
  const [discountInput, setDiscountInput] = useState<string>(data.discount_code || "");
  const [discountStatus, setDiscountStatus] = useState<{ type: "success" | "error" | null, message: string }>({ type: null, message: "" });
  const [isCheckingDiscount, setIsCheckingDiscount] = useState(false);

  useEffect(() => {
    async function loadCounselor() {
      if (data.counselor_preference === "manual" && data.counselor_id) {
        const result = await getPublicCounselors({ limit: 100 });
        const counselor = result.counselors.find(c => c.id === data.counselor_id);
        if (counselor) {
          setCounselorName(counselor.full_name);
        }
      }
    }
    loadCounselor();
  }, [data.counselor_preference, data.counselor_id]);

  const handleApplyDiscount = async () => {
    if (!discountInput.trim()) {
      setDiscountStatus({ type: "error", message: "Masukkan kode diskon" });
      setValue("discount_code", "");
      return;
    }
    
    setIsCheckingDiscount(true);
    setDiscountStatus({ type: null, message: "" });
    
    try {
      const result = await validateDiscountCode(discountInput);
      if (result.success) {
        setDiscountStatus({ type: "success", message: `Kode berhasil diterapkan! Diskon ${result.discount_percentage}%` });
        setValue("discount_code", result.code);
      } else {
        setDiscountStatus({ type: "error", message: result.error || "Kode diskon tidak valid" });
        setValue("discount_code", "");
      }
    } catch (err) {
      setDiscountStatus({ type: "error", message: "Gagal memeriksa kode diskon" });
      setValue("discount_code", "");
    } finally {
      setIsCheckingDiscount(false);
    }
  };

  return (
    <StepTransition className="max-w-3xl mx-auto space-y-4 md:space-y-6 pb-6 md:pb-12">
      <div className="text-center mb-6 md:mb-10">
        <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Tinjau Ringkasan Anda</h2>
        <p className="text-slate-500">Pastikan seluruh data sudah sesuai sebelum mengirimkan permohonan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card title="Pilihan Konselor" onEditClick={() => onEdit?.(1)}>
          <div className="py-2">
            {data.counselor_preference === "manual" ? (
              <div>
                <p className="text-sm text-slate-500 mb-1">Konselor Terpilih</p>
                <p className="font-semibold text-slate-900">{counselorName || "Memuat..."}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-100">
                  "Sistem akan mencocokkan Anda dengan salah satu konselor profesional kami yang tersedia."
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card title="Data Diri">
          <Item label="Nama Lengkap" value={data.nama_lengkap} />
          <Item label="Nama Panggilan" value={data.nama_panggilan} />
          <Item label="Email" value={data.email} />
          <Item label="Nomor HP" value={data.nomor_hp} />
          <Item label="Tanggal Lahir" value={data.tanggal_lahir ? format(data.tanggal_lahir, "dd MMM yyyy", { locale: idLocale }) : ""} />
          <Item label="Jenis Kelamin" value={data.jenis_kelamin} />
          <Item label="NIK" value={data.nik} />
        </Card>

        <Card title="Info Konsultasi" onEditClick={() => onEdit?.(12)}>
          <Item label="Metode" value={data.metode_konsultasi} />
          <Item label="Tanggal" value={data.tanggal_konsultasi ? format(data.tanggal_konsultasi, "dd MMM yyyy", { locale: idLocale }) : ""} />
          <Item label="Waktu" value={data.waktu_konsultasi} />
          <Item label="Status" value={data.status === "Lainnya" ? data.status_lainnya : data.status} />
          <Item label="Konseling Ke-" value={data.urutan_konseling} />
        </Card>

        <div className="md:col-span-2">
          <Card title="Alamat & Topik">
            <Item label="Provinsi" value={data.provinsi} />
            <Item label="Alamat Lengkap" value={data.alamat_lengkap} />
            <div className="pt-3 mt-3 border-t border-slate-100">
              <p className="text-sm text-slate-500 mb-2">Topik yang dipilih:</p>
              <div className="flex flex-wrap gap-2">
                {data.topik_permasalahan?.map(t => (
                  <span key={t} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                    {t === "Lainnya" ? data.topik_lainnya : t}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card title="Situasi Anda" onEditClick={() => onEdit?.(11)}>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-xl">
              {data.ceritakan_permasalahan}
            </p>
          </Card>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 pb-4 border-b border-slate-100">Kode Diskon (Opsional)</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Masukkan kode diskon"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  disabled={isCheckingDiscount}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase transition-all"
                />
                {discountStatus.type === "error" && (
                  <p className="text-sm text-red-500 mt-2">{discountStatus.message}</p>
                )}
                {discountStatus.type === "success" && (
                  <p className="text-sm text-emerald-600 mt-2">{discountStatus.message}</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleApplyDiscount}
                disabled={isCheckingDiscount || !discountInput.trim()}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
              >
                {isCheckingDiscount ? "Memeriksa..." : "Terapkan"}
              </button>
            </div>
            
            {data.discount_code && discountStatus.type === "success" && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-emerald-800">Total Pembayaran</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Setelah diskon {discountStatus.message.match(/\d+%/)?.[0]}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 line-through">Rp 20.000</p>
                  <p className="text-lg font-bold text-emerald-700">Rp 0</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StepTransition>
  );
}
