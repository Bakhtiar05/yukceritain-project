import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { MessageCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import StatusActionCell from "@/components/admin/StatusActionCell";
import RequestDetailSheet from "@/components/admin/RequestDetailSheet";

export const revalidate = 0; // Ensure data is fresh on load

export default async function AdminKonselingDashboard() {
  const supabase = await createClient();

  const { data: requests, error } = await supabase
    .from("consultation_requests")
    .select("*, payments(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching consultation requests:", error);
    return (
      <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg">
        Gagal mengambil data permohonan konseling.
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Menunggu Verifikasi":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Menunggu</Badge>;
      case "Disetujui":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Disetujui</Badge>;
      case "Ditolak":
      case "Dibatalkan":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{status}</Badge>;
      case "Selesai":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Selesai</Badge>;
      default:
        return <Badge variant="outline" className="bg-neutral-50 text-neutral-700 border-neutral-200">{status || "Menunggu Verifikasi"}</Badge>;
    }
  };

  const formatWhatsAppNumber = (phone: string) => {
    if (!phone) return "";
    let cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith("8")) {
      cleanPhone = "62" + cleanPhone;
    }
    return cleanPhone;
  };

  const getWhatsAppLink = (req: any) => {
    const waNumber = formatWhatsAppNumber(req.nomor_hp);
    const dateFormatted = req.tanggal_konsultasi ? format(new Date(req.tanggal_konsultasi), "dd MMMM yyyy", { locale: id }) : "-";
    const text = `Halo ${req.nama_panggilan || req.nama_lengkap}, kami dari tim admin YukceritaIN.
Berikut adalah detail permohonan konseling Anda:
Nomor Permohonan: ${req.request_number}
Tanggal: ${dateFormatted}
Waktu: ${req.waktu_konsultasi} WIB
Metode: ${req.metode_konsultasi}`;
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
  };

  const getPaymentBadge = (payment: any) => {
    if (!payment) return <Badge variant="outline" className="bg-neutral-50 text-neutral-500">-</Badge>;
    switch (payment.payment_status) {
      case "PAID":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Lunas</Badge>;
      case "PENDING":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Belum Bayar</Badge>;
      case "EXPIRED":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Kedaluwarsa</Badge>;
      default:
        return <Badge variant="outline" className="bg-neutral-50 text-neutral-700 border-neutral-200">{payment.payment_status}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard Konseling</h1>
          <p className="text-sm text-neutral-500 mt-1">Kelola permohonan konseling masuk.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-neutral-50/50">
              <TableRow>
                <TableHead className="w-[140px] font-semibold text-neutral-600">Nomor</TableHead>
                <TableHead className="font-semibold text-neutral-600">Nama</TableHead>
                <TableHead className="font-semibold text-neutral-600">Jadwal</TableHead>
                <TableHead className="font-semibold text-neutral-600">Metode</TableHead>
                <TableHead className="font-semibold text-neutral-600">Status</TableHead>
                <TableHead className="font-semibold text-neutral-600">Pembayaran</TableHead>
                <TableHead className="font-semibold text-neutral-600 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-neutral-500">
                    Belum ada permohonan konseling.
                  </TableCell>
                </TableRow>
              ) : (
                requests?.map((req) => (
                  <TableRow key={req.id} className="hover:bg-blue-50/30 transition-colors">
                    <TableCell className="font-mono text-xs font-medium text-blue-600">
                      {req.request_number}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-neutral-900">{req.nama_lengkap}</div>
                      <div className="text-xs text-neutral-500">{req.nomor_hp}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-neutral-900">
                        {req.tanggal_konsultasi ? format(new Date(req.tanggal_konsultasi), "dd MMM yyyy", { locale: id }) : "-"}
                      </div>
                      <div className="text-xs text-neutral-500">{req.waktu_konsultasi || "-"} WIB</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-neutral-700">{req.metode_konsultasi}</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(req.db_status)}
                    </TableCell>
                    <TableCell>
                      {getPaymentBadge(req.payments?.[0])}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <StatusActionCell id={req.id} currentStatus={req.db_status || "Menunggu Verifikasi"} />
                        <RequestDetailSheet req={req} />
                        <a 
                          href={getWhatsAppLink(req)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors border border-green-200 flex-shrink-0"
                          title="Hubungi WA"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
