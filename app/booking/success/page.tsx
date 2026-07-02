"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CheckCircle2, ArrowRight, Calendar, Clock, Video, MapPin, Copy, CreditCard, Loader2, RefreshCcw, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getPaymentAndBookingDetails } from "@/app/actions/payment";
import { cn } from "@/lib/utils";

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
        const res = await getPaymentAndBookingDetails(requestNumber);
        if (res.success && res.data) {
          setSuccessData(res.data);
        } else {
          toast({ variant: "destructive", title: "Error", description: res.error });
        }
        setLoading(false);
      } else {
        let sessionData = null;
        try {
          sessionData = sessionStorage.getItem("booking-success");
        } catch (e) {}
        
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
        title: "Copied!",
        description: "Booking ID has been copied to clipboard.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Memuat detail jadwal Anda...</p>
        </div>
      </div>
    );
  }

  if (!successData) return null;

  const isPaid = successData.paymentStatus === "PAID";
  const isPending = successData.paymentStatus === "PENDING";
  const amount = successData.amount || 20000;

  return (
    <div className="min-h-screen bg-slate-50 pt-20 md:pt-32 pb-12 px-4 flex items-start justify-center">
      <div className="max-w-2xl w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="text-center mb-8">
          <div className={cn(
            "mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm",
            isPending ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
          )}>
            {isPending ? <Wallet className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-3 tracking-tight">
            {isPending ? "Selesaikan Pembayaran Anda" : "Jadwal Terkonfirmasi!"}
          </h1>
          <p className="text-slate-500 text-lg">
            {isPending 
              ? "Sesi Anda telah direservasi. Silakan selesaikan pembayaran untuk mengonfirmasi jadwal Anda." 
              : "Terima kasih telah mempercayakan YukCeritaIN. Sampai jumpa segera."}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="p-6 md:p-8 space-y-8">
            <div className="text-center pb-8 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">Total Tagihan</p>
              <div className="text-4xl font-bold text-slate-900">
                Rp {amount.toLocaleString('id-ID')}
              </div>
            </div>

            {/* Booking Summary */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Ringkasan Jadwal</h3>
                <span className={cn(
                  "px-3 py-1 text-xs font-semibold rounded-full",
                  isPaid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                )}>
                  {isPaid ? "Lunas" : "Menunggu Pembayaran"}
                </span>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Booking ID</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-slate-900">{successData.requestNumber}</span>
                    <button onClick={handleCopyRequestNumber} className="text-slate-400 hover:text-blue-600 transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                  <span className="text-slate-500 text-sm flex items-center gap-2"><Calendar className="w-4 h-4" /> Tanggal</span>
                  <span className="font-medium text-slate-900">{format(new Date(successData.date), "dd MMM yyyy", { locale: id })}</span>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                  <span className="text-slate-500 text-sm flex items-center gap-2"><Clock className="w-4 h-4" /> Waktu</span>
                  <span className="font-medium text-slate-900">{successData.time} WIB</span>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                  <span className="text-slate-500 text-sm flex items-center gap-2">
                    {successData.method === "Online" ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />} 
                    Metode
                  </span>
                  <span className="font-medium text-slate-900">{successData.method}</span>
                </div>

                {isPaid && successData.paymentMethod && (
                  <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                    <span className="text-slate-500 text-sm flex items-center gap-2"><CreditCard className="w-4 h-4" /> Metode Pembayaran</span>
                    <span className="font-medium text-slate-900">{successData.paymentMethod}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-slate-50 p-6 md:p-8 border-t border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
            {isPending && successData.invoiceUrl && (
              <a 
                href={successData.invoiceUrl}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 h-14 text-lg font-semibold shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02]"
              >
                Lanjut ke Pembayaran
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            )}
            
            <div className="flex w-full sm:w-auto gap-3">
              {isPending && (
                <Button 
                  onClick={fetchStatus} 
                  disabled={isRefreshing} 
                  variant="outline" 
                  className="flex-1 sm:flex-none rounded-2xl h-14 px-6 text-slate-700 font-semibold"
                >
                  {isRefreshing ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <RefreshCcw className="w-5 h-5 mr-2" />}
                  Cek Status
                </Button>
              )}
              <Button 
                onClick={() => router.push("/")} 
                variant={isPending ? "ghost" : "default"} 
                className={cn(
                  "flex-1 sm:flex-none rounded-2xl h-14 px-6 font-semibold",
                  !isPending && "bg-slate-900 hover:bg-slate-800 text-white"
                )}
              >
                Kembali ke Beranda
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
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Memuat...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
