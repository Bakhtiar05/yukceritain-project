import React from "react";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { BookingFormData } from "@/lib/schemas/booking";
import { StepTransition } from "../components/StepTransition";
import { BookingStepProps } from "../types/booking";

const Card = ({ title, onEditClick, children }: { title: string, onEditClick: () => void, children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
      <h3 className="font-bold text-slate-900">{title}</h3>
      <button onClick={onEditClick} className="text-sm font-medium text-blue-600 hover:text-blue-700">
        Ubah
      </button>
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
  const { watch } = useFormContext<BookingFormData>();
  const data = watch();

  return (
    <StepTransition className="max-w-3xl mx-auto space-y-4 md:space-y-6 pb-6 md:pb-12">
      <div className="text-center mb-6 md:mb-10">
        <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Tinjau Ringkasan Anda</h2>
        <p className="text-slate-500">Pastikan seluruh data sudah sesuai sebelum mengirimkan permohonan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card title="Data Diri" onEditClick={() => onEdit?.(1)}>
          <Item label="Nama Lengkap" value={data.nama_lengkap} />
          <Item label="Nama Panggilan" value={data.nama_panggilan} />
          <Item label="Email" value={data.email} />
          <Item label="Nomor HP" value={data.nomor_hp} />
          <Item label="Tanggal Lahir" value={data.tanggal_lahir ? format(data.tanggal_lahir, "dd MMM yyyy", { locale: idLocale }) : ""} />
          <Item label="Jenis Kelamin" value={data.jenis_kelamin} />
          <Item label="NIK" value={data.nik} />
        </Card>

        <Card title="Info Konsultasi" onEditClick={() => onEdit?.(11)}>
          <Item label="Metode" value={data.metode_konsultasi} />
          <Item label="Tanggal" value={data.tanggal_konsultasi ? format(data.tanggal_konsultasi, "dd MMM yyyy", { locale: idLocale }) : ""} />
          <Item label="Waktu" value={data.waktu_konsultasi} />
          <Item label="Status" value={data.status === "Lainnya" ? data.status_lainnya : data.status} />
          <Item label="Konseling Ke-" value={data.urutan_konseling} />
        </Card>

        <div className="md:col-span-2">
          <Card title="Alamat & Topik" onEditClick={() => onEdit?.(6)}>
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
          <Card title="Situasi Anda" onEditClick={() => onEdit?.(10)}>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-xl">
              {data.ceritakan_permasalahan}
            </p>
          </Card>
        </div>
      </div>
    </StepTransition>
  );
}
