"use client";

import React, { useState } from "react";
import { checkInParticipant, getRegistrationByCode } from "@/app/actions/events";
import { Search, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function CheckInScanner() {
  const [code, setCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsSearching(true);
    setError(null);
    setResult(null);
    setSuccessMsg(null);

    // If they scanned the QR string (e.g. "QR-YCI-EVT-1234-ABCD"), extract the code
    const rawCode = code.replace(/^QR-/, "").trim();

    try {
      const data = await getRegistrationByCode(rawCode);
      if (!data) {
        setError("Registration not found.");
      } else {
        setResult(data);
        if (data.checked_in_at) {
          setError("Participant is already checked in.");
        } else if (data.payment_status === "PENDING") {
          setError("Payment is still pending.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to find registration.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleCheckIn = async () => {
    if (!result) return;
    setIsCheckingIn(true);
    setError(null);

    try {
      const res = await checkInParticipant(result.registration_code);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccessMsg(`Successfully checked in ${result.full_name}!`);
        setResult({ ...result, checked_in_at: res.data?.checked_in_at || new Date().toISOString() });
        setCode("");
      }
    } catch (err: any) {
      setError(err.message || "Check-in failed.");
    } finally {
      setIsCheckingIn(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Scan QR or Enter Code</h2>
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. YCI-EVT-..."
              className="w-full pl-10 pr-4 py-3 text-lg border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
              autoFocus
            />
          </div>
          <button 
            type="submit" 
            disabled={isSearching || !code}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify"}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-800">Check-in Error</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-6 h-6 flex-shrink-0" />
          <p className="font-semibold">{successMsg}</p>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{result.full_name}</h3>
                <p className="text-slate-500">{result.email} • {result.phone}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                result.checked_in_at ? 'bg-slate-100 text-slate-600' : 
                result.payment_status === 'PAID' || result.payment_status === 'FREE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {result.checked_in_at ? 'Already In' : result.payment_status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mt-6">
              <div>
                <p className="text-slate-400 mb-1">Event</p>
                <p className="font-medium text-slate-900">{result.events?.title}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Registration Code</p>
                <p className="font-medium font-mono text-slate-900">{result.registration_code}</p>
              </div>
              {result.institution && (
                <div>
                  <p className="text-slate-400 mb-1">Institution</p>
                  <p className="font-medium text-slate-900">{result.institution}</p>
                </div>
              )}
              {result.checked_in_at && (
                <div>
                  <p className="text-slate-400 mb-1">Check In Time</p>
                  <p className="font-medium text-slate-900">{format(new Date(result.checked_in_at), "dd MMM yyyy, HH:mm:ss")}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 flex justify-end">
            <button
              onClick={handleCheckIn}
              disabled={isCheckingIn || !!result.checked_in_at || result.payment_status === 'PENDING'}
              className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isCheckingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
              Confirm Check-in
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
