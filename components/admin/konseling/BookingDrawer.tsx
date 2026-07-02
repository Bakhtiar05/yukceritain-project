import React from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { X, Calendar, User, Phone, MapPin, CreditCard, Clock, MessageCircle, AlertCircle } from 'lucide-react'

interface BookingDrawerProps {
  booking: any | null
  isOpen: boolean
  onClose: () => void
  onUpdateStatus: (id: string, status: string) => void
}

export default function BookingDrawer({ booking, isOpen, onClose, onUpdateStatus }: BookingDrawerProps) {
  if (!booking) return null

  const payment = booking.payment

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

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{booking.request_number}</h2>
            <p className="text-sm text-slate-500">
              {format(new Date(booking.created_at), 'dd MMM yyyy, HH:mm', { locale: id })}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Patient Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
              <User className="w-4 h-4 mr-2 text-slate-400" />
              Patient Information
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-3 text-sm">
              <div className="grid grid-cols-3">
                <span className="text-slate-500">Full Name</span>
                <span className="col-span-2 font-medium text-slate-900">{booking.nama_lengkap}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-500">Gender</span>
                <span className="col-span-2 font-medium text-slate-900">{booking.jenis_kelamin}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-500">Phone</span>
                <span className="col-span-2 font-medium text-slate-900">{booking.nomor_hp}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-500">Email</span>
                <span className="col-span-2 font-medium text-slate-900">{booking.email}</span>
              </div>
            </div>
          </div>

          {/* Schedule Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-slate-400" />
              Schedule Information
            </h3>
            <div className="bg-blue-50 rounded-xl p-4 space-y-3 text-sm border border-blue-100">
              <div className="grid grid-cols-3">
                <span className="text-blue-600">Date</span>
                <span className="col-span-2 font-semibold text-blue-900">
                  {booking.tanggal_konsultasi ? format(new Date(booking.tanggal_konsultasi), 'EEEE, dd MMM yyyy', { locale: id }) : '-'}
                </span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-blue-600">Time</span>
                <span className="col-span-2 font-semibold text-blue-900">{booking.waktu_konsultasi} WIB</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-blue-600">Method</span>
                <span className="col-span-2 font-semibold text-blue-900">{booking.metode_konsultasi}</span>
              </div>
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-slate-400" />
              Issue Context
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Topics</p>
                <div className="flex flex-wrap gap-2">
                  {booking.topik_permasalahan?.map((t: string) => (
                    <span key={t} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Description</p>
                <p className="text-sm text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-lg p-3">
                  {booking.ceritakan_permasalahan}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
              <CreditCard className="w-4 h-4 mr-2 text-slate-400" />
              Payment Details
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-3 text-sm">
              {payment ? (
                <>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500">Status</span>
                    <span className="col-span-2 font-medium text-slate-900">{payment.payment_status}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500">Amount</span>
                    <span className="col-span-2 font-medium text-slate-900">
                      Rp {payment.amount?.toLocaleString('id-ID')}
                    </span>
                  </div>
                  {payment.invoice_url && (
                    <div className="grid grid-cols-3">
                      <span className="text-slate-500">Invoice</span>
                      <span className="col-span-2">
                        <a href={payment.invoice_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          View Invoice
                        </a>
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-slate-500 italic">No payment record found.</p>
              )}
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 grid grid-cols-2 gap-3">
          <a 
            href={getWhatsAppLink(booking)}
            target="_blank"
            rel="noreferrer"
            className="col-span-2 flex items-center justify-center space-x-2 w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat via WhatsApp</span>
          </a>
          
          <button 
            onClick={() => {
              onUpdateStatus(booking.id, 'Disetujui')
              onClose()
            }}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
          >
            Approve
          </button>
          
          <button 
            onClick={() => {
              onUpdateStatus(booking.id, 'Ditolak')
              onClose()
            }}
            className="w-full py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            Reject
          </button>
        </div>
      </div>
    </>
  )
}
