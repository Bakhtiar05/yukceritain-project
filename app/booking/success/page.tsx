"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { 
  CheckCircle2, 
  Wallet, 
  AlertTriangle,
  Info,
  Video,
  MapPin,
  Loader2,
  Lock,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getPaymentAndBookingDetails, generatePaymentLink } from "@/app/actions/payment";
import { validateDiscountCode } from "@/app/actions/discount";
import { cn } from "@/lib/utils";

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [successData, setSuccessData] = useState<any>(null);

  const [discountInput, setDiscountInput] = useState("");
  const [discountStatus, setDiscountStatus] = useState<{ type: "success" | "error" | null, message: string }>({ type: null, message: "" });
  const [isCheckingDiscount, setIsCheckingDiscount] = useState(false);
  const [discountCode, setDiscountCode] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayAmount, setDisplayAmount] = useState<number | null>(null);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  // Default to ~24h countdown for aesthetic presentation
  const [timeLeft, setTimeLeft] = useState(86292); 

  const fetchStatus = async () => {
    const requestNumber = searchParams.get("request_number");
    if (requestNumber) {
      const res = await getPaymentAndBookingDetails(requestNumber);
      if (res.success && res.data) {
        setSuccessData(res.data);
      }
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

  useEffect(() => {
    if (successData?.paymentStatus === "PENDING") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [successData?.paymentStatus]);

  const handleApplyDiscount = async () => {
    if (!discountInput.trim()) {
      setDiscountStatus({ type: "error", message: "Masukkan kode diskon" });
      setDiscountCode("");
      setDisplayAmount(null);
      return;
    }
    
    setIsCheckingDiscount(true);
    setDiscountStatus({ type: null, message: "" });
    
    try {
      const result = await validateDiscountCode(discountInput);
      if (result.success) {
        setDiscountStatus({ type: "success", message: `Kode berhasil diterapkan! Diskon ${result.discount_percentage}%` });
        setDiscountCode(result.code!);
        
        const baseAmount = successData.amount || 20000;
        const discountVal = Math.floor((baseAmount * result.discount_percentage!) / 100);
        setDisplayAmount(Math.max(0, baseAmount - discountVal));
      } else {
        setDiscountStatus({ type: "error", message: result.error || "Kode diskon tidak valid" });
        setDiscountCode("");
        setDisplayAmount(null);
      }
    } catch (err) {
      setDiscountStatus({ type: "error", message: "Gagal memeriksa kode diskon" });
      setDiscountCode("");
      setDisplayAmount(null);
    } finally {
      setIsCheckingDiscount(false);
    }
  };

  const handleProceedPayment = async () => {
    if (!successData?.requestNumber) return;
    
    setIsGenerating(true);
    try {
      const res = await generatePaymentLink(successData.requestNumber, discountCode);
      if (res.success) {
        if (res.amount === 0) {
          window.location.reload();
        } else if (res.invoiceUrl) {
          setPaymentUrl(res.invoiceUrl);
          setShowPaymentModal(true);
        }
      } else {
        toast({ variant: "destructive", title: "Gagal", description: res.error });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal", description: "Terjadi kesalahan sistem." });
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Memuat halaman pembayaran...</p>
      </div>
    );
  }

  if (!successData) return null;

  const isPaid = successData.paymentStatus === "PAID";
  const baseAmount = successData.amount || 20000;
  const currentAmount = displayAmount !== null ? displayAmount : baseAmount;
  
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  if (isPaid) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-[24px] shadow-sm border border-slate-100 p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mx-auto w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Pembayaran Berhasil</h1>
          <p className="text-slate-500 mb-8">Terima kasih, jadwal konseling Anda telah terkonfirmasi.</p>
          <div className="bg-slate-50 rounded-2xl p-4 mb-8 text-left space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Booking ID</span>
              <span className="font-semibold text-slate-900">{successData.requestNumber}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Tanggal</span>
              <span className="font-semibold text-slate-900">{format(new Date(successData.date), "dd MMM yyyy", { locale: localeId })}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Waktu</span>
              <span className="font-semibold text-slate-900">{successData.time} WIB</span>
            </div>
          </div>
          <Button 
            onClick={() => router.push("/")}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-[16px] h-14 font-semibold"
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-8 md:pt-16 pb-32 px-4 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-lg mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
        
        {/* 1. Header */}
        <div className="text-center pt-4 pb-2">
          <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Pembayaran Reservasi</h1>
          <p className="text-slate-500 text-sm">Selesaikan pembayaran untuk mengamankan jadwal konseling Anda.</p>
        </div>

        {/* 2. Countdown Card */}
        <div className="bg-red-50/50 border border-red-100 rounded-[20px] p-5 flex items-center justify-between shadow-sm">
          <div className="flex gap-3 text-red-600 font-bold text-xl items-end">
            <div className="flex flex-col items-center">
              <span>{hours.toString().padStart(2, '0')}</span>
              <span className="text-[10px] uppercase tracking-wider font-medium text-red-400 mt-1">Jam</span>
            </div>
            <span className="pb-4">:</span>
            <div className="flex flex-col items-center">
              <span>{minutes.toString().padStart(2, '0')}</span>
              <span className="text-[10px] uppercase tracking-wider font-medium text-red-400 mt-1">Menit</span>
            </div>
            <span className="pb-4">:</span>
            <div className="flex flex-col items-center">
              <span>{seconds.toString().padStart(2, '0')}</span>
              <span className="text-[10px] uppercase tracking-wider font-medium text-red-400 mt-1">Detik</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-red-50 max-w-[170px]">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-[10px] text-slate-600 leading-snug font-medium">Reservasi akan dibatalkan otomatis jika waktu habis.</p>
          </div>
        </div>

        {/* 3. Total Payment Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-between transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-500">Total Pembayaran</p>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              Rp{currentAmount.toLocaleString('id-ID')}
            </div>
            {displayAmount !== null && (
              <div className="text-sm text-slate-500 line-through">
                Rp{baseAmount.toLocaleString('id-ID')}
              </div>
            )}
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-sm text-slate-600 font-medium">1 Sesi Konseling</span>
              <div className="inline-flex items-center gap-1.5 w-fit px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                {successData.method === "Online" ? (
                  <><Video className="w-3.5 h-3.5" /> Google Meet</>
                ) : (
                  <><MapPin className="w-3.5 h-3.5" /> Tatap Muka</>
                )}
              </div>
            </div>
          </div>
          <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center border border-blue-100/50 shadow-inner shrink-0">
             <Wallet className="w-10 h-10 text-blue-500" strokeWidth={1.5} />
          </div>
        </div>

        {/* 4. Reservation Summary Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 space-y-4">
          <h3 className="font-semibold text-slate-900 mb-2">Ringkasan Jadwal</h3>
          
          <div className="flex justify-between items-center text-sm py-2">
            <span className="text-slate-500">Booking ID</span>
            <span className="font-semibold text-slate-900">{successData.requestNumber}</span>
          </div>
          <div className="h-px bg-slate-100 w-full" />
          
          <div className="flex justify-between items-center text-sm py-2">
            <span className="text-slate-500">Tanggal</span>
            <span className="font-medium text-slate-900">{format(new Date(successData.date), "dd MMM yyyy", { locale: localeId })}</span>
          </div>
          <div className="h-px bg-slate-100 w-full" />
          
          <div className="flex justify-between items-center text-sm py-2">
            <span className="text-slate-500">Waktu</span>
            <span className="font-medium text-slate-900">{successData.time} WIB</span>
          </div>
          <div className="h-px bg-slate-100 w-full" />

          <div className="flex justify-between items-center text-sm py-2">
            <span className="text-slate-500">Durasi</span>
            <span className="font-medium text-slate-900">1 Jam</span>
          </div>
          <div className="h-px bg-slate-100 w-full" />
          
          <div className="flex justify-between items-center text-sm py-2">
            <span className="text-slate-500">Metode Konseling</span>
            <span className="font-medium text-slate-900">{successData.method}</span>
          </div>
          
          {successData.method !== "Online" && (
            <>
              <div className="h-px bg-slate-100 w-full" />
              <div className="flex justify-between items-center text-sm py-2">
                <span className="text-slate-500">Lokasi</span>
                <span className="font-medium text-slate-900">Klinik YukCeritaIN</span>
              </div>
            </>
          )}

          <div className="h-px bg-slate-100 w-full" />
          <div className="flex justify-between items-center text-sm pt-2">
            <span className="text-slate-500">Status Pembayaran</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full border border-yellow-200/50">
              Menunggu Pembayaran
            </span>
          </div>
        </div>

        {/* Discount Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 space-y-4">
          <h3 className="font-semibold text-slate-900 mb-2">Kode Diskon</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Masukkan kode diskon"
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
                disabled={isCheckingDiscount}
                className="w-full px-4 py-2.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase transition-all"
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
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap h-[46px]"
            >
              {isCheckingDiscount ? "Memeriksa..." : "Terapkan"}
            </button>
          </div>
        </div>

        {/* 5. Customer Information Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 space-y-4">
          <h3 className="font-semibold text-slate-900 mb-2">Informasi Pemesan</h3>
          
          <div className="flex flex-col gap-1 py-1">
            <span className="text-xs text-slate-500">Nama Lengkap</span>
            <span className="text-sm font-medium text-slate-900">{successData.fullName || "-"}</span>
          </div>
          <div className="h-px bg-slate-100 w-full" />
          
          <div className="flex flex-col gap-1 py-1">
            <span className="text-xs text-slate-500">Email</span>
            <span className="text-sm font-medium text-slate-900">{successData.email || "-"}</span>
          </div>
          <div className="h-px bg-slate-100 w-full" />
          
          <div className="flex flex-col gap-1 py-1">
            <span className="text-xs text-slate-500">Nomor WhatsApp</span>
            <span className="text-sm font-medium text-slate-900">{successData.whatsappNumber || "-"}</span>
          </div>
        </div>

        {/* 6. Payment Information Card */}
        <div className="bg-blue-50/80 rounded-[20px] p-5 flex items-start gap-3 border border-blue-100 transition-all hover:bg-blue-50">
          <div className="bg-blue-100 p-1.5 rounded-full mt-0.5 shrink-0">
            <Info className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-sm text-blue-900 leading-relaxed font-medium">
            Setelah menekan tombol <span className="font-bold">"Lanjutkan Pembayaran"</span>, pop-up pembayaran Xendit akan muncul di layar ini untuk menyelesaikan transaksi.
          </p>
        </div>

        {/* 7. Security Card */}
        <div className="bg-emerald-50/80 rounded-[20px] p-5 flex items-start gap-3 border border-emerald-100 transition-all hover:bg-emerald-50">
          <div className="bg-emerald-100 p-1.5 rounded-full mt-0.5 shrink-0">
            <Lock className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-900 mb-1">Pembayaran Aman & Terpercaya</h4>
            <p className="text-sm text-emerald-800/80 leading-relaxed font-medium">
              Pembayaran diproses secara aman oleh Xendit. Kami tidak menyimpan data pembayaran Anda.
            </p>
          </div>
        </div>

      </div>

      {/* 8. Sticky Button & 9. Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 shadow-[0_-8px_20px_-10px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-lg mx-auto space-y-3">
          <button 
            onClick={handleProceedPayment}
            disabled={isGenerating}
            className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-blue-400 disabled:to-blue-400 text-white rounded-[20px] h-[60px] text-[17px] font-semibold shadow-[0_8px_20px_-8px_rgba(37,99,235,0.5)] transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isGenerating ? "Memproses..." : "Lanjutkan Pembayaran"}
          </button>
          <p className="text-center text-[11px] text-slate-400 font-medium">
            Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan yang berlaku.
          </p>
        </div>
      </div>

      {/* Payment Pop-up Modal */}
      {showPaymentModal && paymentUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 md:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-[480px] h-[85vh] max-h-[800px] flex flex-col overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
            
            {/* Header/Close Button */}
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2 text-blue-600">
                <Lock className="w-4 h-4" />
                <h3 className="font-semibold text-slate-800 text-sm">Pembayaran Aman via Xendit</h3>
              </div>
              <button 
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentUrl(null);
                }}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Iframe */}
            <div className="flex-1 w-full bg-slate-50 relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                 <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                 <p className="text-sm text-slate-500 font-medium">Memuat halaman pembayaran...</p>
              </div>
              <iframe 
                src={paymentUrl} 
                className="w-full h-full relative z-10 border-0"
                allow="payment"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Memuat halaman pembayaran...</p>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
