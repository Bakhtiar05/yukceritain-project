"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CheckCircle2, ArrowRight, Calendar, Clock, Video, MapPin, Copy, CreditCard, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getPaymentAndBookingDetails } from "@/app/actions/payment";

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [successData, setSuccessData] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStatus = async () => {
    const requestNumber = searchParams.get("request_number");
    if (requestNumber) {
      setIsRefreshing(true);
      const res = await getPaymentAndBookingDetails(requestNumber);
      if (res.success && res.data) {
        setSuccessData(res.data);
      }
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const requestNumber = searchParams.get("request_number");
      
      if (requestNumber) {
        // Fetch from server
        const res = await getPaymentAndBookingDetails(requestNumber);
        if (res.success && res.data) {
          setSuccessData(res.data);
        } else {
          toast({ variant: "destructive", title: "Error", description: res.error });
        }
        setLoading(false);
      } else {
        // Try fallback to sessionStorage for edge cases where URL doesn't have it
        const sessionData = sessionStorage.getItem("booking-success");
        if (sessionData) {
          setSuccessData(JSON.parse(sessionData));
        } else {
          router.push("/konsultasi");
        }
        setLoading(false);
      }
    }

    fetchData();
  }, [searchParams, router, toast]);

  useEffect(() => {
    const requestNumber = searchParams.get("request_number");
    if (successData?.paymentStatus === "PENDING" && requestNumber) {
      const interval = setInterval(() => {
        fetchStatus();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [successData?.paymentStatus, searchParams]);

  const handleCopyRequestNumber = () => {
    if (successData?.requestNumber) {
      navigator.clipboard.writeText(successData.requestNumber);
      toast({
        title: "Tersalin!",
        description: "Nomor permohonan disalin ke clipboard.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-24 pb-20 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
          <p className="text-neutral-500 font-medium">Memuat data permohonan...</p>
        </div>
      </div>
    );
  }

  if (!successData) return null;

  const isPaid = successData.paymentStatus === "PAID";
  const isPending = successData.paymentStatus === "PENDING";

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-20 flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-100 animate-fade-enter">
          {/* Header */}
          <div className={`py-8 px-6 text-center border-b ${isPending ? 'bg-amber-50 border-amber-100' : 'bg-success/10 border-success/20'}`}>
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm ${isPending ? 'bg-amber-500' : 'bg-success'}`}>
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-3xl font-display font-bold mb-2 ${isPending ? 'text-amber-600' : 'text-success'}`}>
              {isPending ? 'Menunggu Pembayaran' : 'Pembayaran Berhasil'}
            </h1>
            <p className={`font-medium ${isPending ? 'text-amber-700/80' : 'text-success/80'}`}>
              Terima kasih telah mempercayakan YukceritaIN.
            </p>
          </div>

          {/* Body */}
          <div className="p-8">
            <p className="text-center text-neutral-600 mb-8 leading-relaxed">
              {isPending ? (
                "Silakan selesaikan pembayaran Anda agar permohonan dapat diproses."
              ) : (
                <>Tim admin kami akan segera meninjau permohonan Anda dan menghubungi via <strong>WhatsApp</strong> dalam waktu <span className="font-semibold text-neutral-900">1×24 jam</span> untuk konfirmasi sesi konsultasi Anda.</>
              )}
            </p>

            {/* Summary Card */}
            <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 mb-8 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs font-semibold tracking-wider text-neutral-500 uppercase rounded-full border border-neutral-200">
                Detail Permohonan
              </div>
              
              <div className="space-y-4 mt-2">
                <div>
                  <p className="text-xs text-neutral-500 uppercase font-semibold mb-1">Nomor Permohonan</p>
                  <div className="flex items-center justify-between bg-white border border-neutral-200 rounded-lg px-4 py-2">
                    <span className="font-mono font-bold text-lg text-blue-600">{successData.requestNumber}</span>
                    <Button variant="ghost" size="icon" onClick={handleCopyRequestNumber} className="h-8 w-8 text-neutral-400 hover:text-blue-600">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1">*Simpan nomor ini untuk keperluan pelacakan status di halaman Cek Status.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
                  <div>
                    <p className="text-xs text-neutral-500 uppercase font-semibold mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Tanggal
                    </p>
                    <p className="font-medium text-neutral-900">
                      {format(new Date(successData.date), "dd MMM yyyy", { locale: id })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase font-semibold mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Waktu (WIB)
                    </p>
                    <p className="font-medium text-neutral-900">
                      {successData.time}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-neutral-500 uppercase font-semibold mb-1 flex items-center gap-1">
                      {successData.method === "Online" ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />} 
                      Metode
                    </p>
                    <p className="font-medium text-neutral-900">
                      {successData.method} {successData.method === "Online" ? "(Google Meet)" : "(Kota Serang)"}
                    </p>
                  </div>
                  
                  {isPaid && (
                    <div className="col-span-2 pt-2 border-t border-neutral-100 mt-2">
                      <p className="text-xs text-neutral-500 uppercase font-semibold mb-1 flex items-center gap-1">
                        <CreditCard className="w-3 h-3" /> Metode Pembayaran
                      </p>
                      <p className="font-medium text-neutral-900">
                        {successData.paymentMethod || "Telah Dibayar"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full justify-center items-center mt-4">
              {isPending && (
                <Button onClick={fetchStatus} disabled={isRefreshing} variant="outline" className="rounded-full px-6 py-5 h-auto text-sm sm:text-base font-semibold shadow-sm w-full sm:w-auto">
                  {isRefreshing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCcw className="w-4 h-4 mr-2" />}
                  Cek Status
                </Button>
              )}
              {isPending && successData.invoiceUrl && (
                <Button onClick={() => window.location.href = successData.invoiceUrl} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-5 h-auto text-sm sm:text-base font-semibold shadow-blue w-full sm:w-auto">
                  Lanjutkan Pembayaran
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
              <Button onClick={() => router.push("/")} variant={isPending ? "outline" : "default"} className={`${!isPending && "bg-blue-600 hover:bg-blue-700 text-white"} rounded-full px-6 py-5 h-auto text-sm sm:text-base font-semibold shadow-sm w-full sm:w-auto`}>
                Kembali
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 pt-24 pb-20 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
          <p className="text-neutral-500 font-medium">Memuat...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
