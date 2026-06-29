"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Eye, User, Calendar, Info, FileText, CreditCard } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { provinces } from "@/lib/data-provinces";

interface RequestDetailSheetProps {
  req: any;
}

export default function RequestDetailSheet({ req }: RequestDetailSheetProps) {
  const getProvinceLabel = (val?: string) => {
    return provinces.find((p) => p.value === val)?.label || val;
  };

  const payment = req.payments?.[0];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors border border-blue-200 flex-shrink-0"
          title="Detail Permohonan"
        >
          <Eye className="w-4 h-4" />
        </button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-neutral-50/50 p-0">
        <div className="p-6 bg-white border-b border-neutral-200 sticky top-0 z-10">
          <SheetHeader>
            <SheetTitle className="text-xl text-neutral-900">
              Detail Permohonan
            </SheetTitle>
            <p className="text-sm text-neutral-500 font-mono mt-1">
              {req.request_number}
            </p>
          </SheetHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Data Diri */}
          <div className="bg-white rounded-lg p-5 border border-neutral-100 shadow-sm">
            <h4 className="font-semibold text-neutral-800 flex items-center gap-2 mb-4 pb-2 border-b border-neutral-100">
              <User className="w-4 h-4 text-blue-500" />
              Data Diri
            </h4>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-neutral-500 mb-1 text-xs uppercase tracking-wider">Nama Lengkap</dt>
                <dd className="font-medium text-neutral-900">{req.nama_lengkap || "-"}</dd>
              </div>
              <div>
                <dt className="text-neutral-500 mb-1 text-xs uppercase tracking-wider">Nama Panggilan</dt>
                <dd className="font-medium text-neutral-900">{req.nama_panggilan || "-"}</dd>
              </div>
              <div>
                <dt className="text-neutral-500 mb-1 text-xs uppercase tracking-wider">Email</dt>
                <dd className="font-medium text-neutral-900">{req.email || "-"}</dd>
              </div>
              <div>
                <dt className="text-neutral-500 mb-1 text-xs uppercase tracking-wider">Nomor HP</dt>
                <dd className="font-medium text-neutral-900">{req.nomor_hp || "-"}</dd>
              </div>
              <div>
                <dt className="text-neutral-500 mb-1 text-xs uppercase tracking-wider">Jenis Kelamin</dt>
                <dd className="font-medium text-neutral-900">{req.jenis_kelamin || "-"}</dd>
              </div>
              <div>
                <dt className="text-neutral-500 mb-1 text-xs uppercase tracking-wider">Tanggal Lahir</dt>
                <dd className="font-medium text-neutral-900">
                  {req.tanggal_lahir ? format(new Date(req.tanggal_lahir), "dd MMMM yyyy", { locale: id }) : "-"}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-neutral-500 mb-1 text-xs uppercase tracking-wider">NIK</dt>
                <dd className="font-medium text-neutral-900">{req.nik || "-"}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-neutral-500 mb-1 text-xs uppercase tracking-wider">Alamat</dt>
                <dd className="font-medium text-neutral-900">{req.alamat_lengkap || "-"}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-neutral-500 mb-1 text-xs uppercase tracking-wider">Provinsi</dt>
                <dd className="font-medium text-neutral-900">{getProvinceLabel(req.provinsi)}</dd>
              </div>
            </dl>
          </div>

          {/* Jadwal & Metode */}
          <div className="bg-white rounded-lg p-5 border border-neutral-100 shadow-sm">
            <h4 className="font-semibold text-neutral-800 flex items-center gap-2 mb-4 pb-2 border-b border-neutral-100">
              <Calendar className="w-4 h-4 text-blue-500" />
              Jadwal & Metode
            </h4>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-neutral-500 mb-1 text-xs uppercase tracking-wider">Tanggal</dt>
                <dd className="font-medium text-neutral-900">
                  {req.tanggal_konsultasi ? format(new Date(req.tanggal_konsultasi), "EEEE, dd MMMM yyyy", { locale: id }) : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500 mb-1 text-xs uppercase tracking-wider">Waktu (WIB)</dt>
                <dd className="font-medium text-neutral-900">{req.waktu_konsultasi || "-"}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-neutral-500 mb-1 text-xs uppercase tracking-wider">Metode</dt>
                <dd className="font-medium text-neutral-900">{req.metode_konsultasi || "-"}</dd>
              </div>
            </dl>
          </div>

          {/* Detail Permasalahan */}
          <div className="bg-white rounded-lg p-5 border border-neutral-100 shadow-sm">
            <h4 className="font-semibold text-neutral-800 flex items-center gap-2 mb-4 pb-2 border-b border-neutral-100">
              <FileText className="w-4 h-4 text-blue-500" />
              Detail Permasalahan
            </h4>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-neutral-500 mb-1 text-xs uppercase tracking-wider">Status Pernikahan/Hubungan</dt>
                <dd className="font-medium text-neutral-900">
                  {req.status === "Lainnya" ? req.status_lainnya : req.status || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500 mb-1 text-xs uppercase tracking-wider">Alasan Mengikuti Konseling</dt>
                <dd className="font-medium text-neutral-900">
                  {req.alasan === "Lainnya" ? req.alasan_lainnya : req.alasan || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500 mb-2 text-xs uppercase tracking-wider">Topik Permasalahan</dt>
                <dd className="font-medium text-neutral-900">
                  {req.topik_permasalahan?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {req.topik_permasalahan.map((t: string) => (
                        <span key={t} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {t === "Lainnya" ? req.topik_lainnya : t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "-"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500 mb-2 text-xs uppercase tracking-wider">Gambaran Permasalahan</dt>
                <dd className="text-neutral-800 bg-neutral-50 p-4 rounded-lg border border-neutral-200 whitespace-pre-wrap leading-relaxed text-[13px]">
                  {req.ceritakan_permasalahan || "-"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Informasi Tambahan */}
          <div className="bg-white rounded-lg p-5 border border-neutral-100 shadow-sm">
            <h4 className="font-semibold text-neutral-800 flex items-center gap-2 mb-4 pb-2 border-b border-neutral-100">
              <Info className="w-4 h-4 text-blue-500" />
              Informasi Tambahan
            </h4>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-neutral-500 mb-1 text-xs uppercase tracking-wider">Sesi Ke-</dt>
                <dd className="font-medium text-neutral-900">{req.urutan_konseling || "-"}</dd>
              </div>
              <div>
                <dt className="text-neutral-500 mb-1 text-xs uppercase tracking-wider">Mengetahui Dari</dt>
                <dd className="font-medium text-neutral-900">
                  {req.sumber_informasi === "Lainnya" ? req.sumber_informasi_lainnya : req.sumber_informasi || "-"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Payment Info */}
          {payment && (
            <div className="bg-white rounded-lg p-5 border border-neutral-100 shadow-sm">
              <h4 className="font-semibold text-neutral-800 flex items-center gap-2 mb-4 pb-2 border-b border-neutral-100">
                <CreditCard className="w-4 h-4 text-blue-500" />
                Informasi Pembayaran
              </h4>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-neutral-500 mb-1 text-xs uppercase tracking-wider">Status</dt>
                  <dd className="font-medium text-neutral-900">{payment.payment_status}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500 mb-1 text-xs uppercase tracking-wider">Nominal</dt>
                  <dd className="font-medium text-neutral-900">
                    Rp {parseInt(payment.amount).toLocaleString("id-ID")}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-neutral-500 mb-1 text-xs uppercase tracking-wider">Metode Pembayaran</dt>
                  <dd className="font-medium text-neutral-900">{payment.payment_method || "-"}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-neutral-500 mb-1 text-xs uppercase tracking-wider">Invoice ID / External ID</dt>
                  <dd className="font-medium text-neutral-900 font-mono text-xs">
                    {payment.xendit_invoice_id} / {payment.external_id}
                  </dd>
                </div>
                {payment.paid_at && (
                  <div className="col-span-2">
                    <dt className="text-neutral-500 mb-1 text-xs uppercase tracking-wider">Tanggal Bayar</dt>
                    <dd className="font-medium text-neutral-900">
                      {format(new Date(payment.paid_at), "dd MMMM yyyy HH:mm:ss", { locale: id })}
                    </dd>
                  </div>
                )}
                {payment.invoice_url && (
                  <div className="col-span-2 mt-2">
                    <a href={payment.invoice_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
                      Buka Link Invoice &rarr;
                    </a>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
