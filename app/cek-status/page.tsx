"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";

export default function CekStatusPage() {
  const router = useRouter();
  const [requestNumber, setRequestNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestNumber.trim()) return;

    setLoading(true);
    // Remove whitespace and convert to uppercase for consistency
    const cleanRequestNumber = requestNumber.trim().toUpperCase();
    
    // Redirect to the success page which acts as the status display
    router.push(`/booking/success?request_number=${cleanRequestNumber}`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neutral-50 dark:bg-background pt-28 md:pt-36 lg:pt-40 pb-20">
      <div className="max-w-xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 dark:text-foreground mb-4 animate-fade-enter">
            Cek Status Permohonan
          </h1>
          <p className="text-lg text-neutral-600 dark:text-muted-foreground animate-fade-enter" style={{ animationDelay: '100ms' }}>
            Masukkan nomor permohonan Anda untuk melihat status atau melanjutkan pembayaran.
          </p>
        </div>

        <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-neutral-200 dark:border-border p-6 md:p-10 animate-fade-enter" style={{ animationDelay: '200ms' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="requestNumber" className="block text-sm font-semibold text-neutral-700 dark:text-foreground mb-2">
                Nomor Permohonan
              </label>
              <Input
                id="requestNumber"
                type="text"
                placeholder="Contoh: ATM-20260626-XYZ1"
                value={requestNumber}
                onChange={(e) => setRequestNumber(e.target.value)}
                className="w-full text-lg py-6"
                required
              />
              <p className="text-xs text-neutral-500 dark:text-muted-foreground mt-2">
                Nomor permohonan diberikan saat Anda berhasil mengisi formulir pendaftaran.
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-6 text-base font-semibold shadow-blue"
              disabled={loading || !requestNumber.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Mencari...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Cek Status
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}
