import React, { useState } from 'react';
import { POOJA_KITS } from '../data/mockData';
import { PoojaKit, OrderBooking } from '../types';
import { createOrderBooking, generateWhatsAppUrl } from '../services/orderService';
import { notificationManager } from '../services/notificationService';
import { templeAudio } from '../utils/audio';
import { 
  ShoppingBag, 
  Phone, 
  MapPin, 
  User, 
  Calendar, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  QrCode, 
  Smartphone,
  Lock,
  MessageCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingSectionProps {
  selectedKit: PoojaKit;
  onKitChange: (kit: PoojaKit) => void;
  preferredSlot?: string;
  onOrderSuccess: (order: OrderBooking) => void;
  lang?: 'te' | 'en';
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  selectedKit,
  onKitChange,
  preferredSlot,
  onOrderSuccess,
  lang = 'te'
}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('హైదరాబాద్ / ఆంధ్రప్రదేశ్ (AP & TS)');
  const [pincode, setPincode] = useState('500001');
  const [quantity, setQuantity] = useState(1);
  const [deliverySlot, setDeliverySlot] = useState(preferredSlot || '🌅 వేకువజాము ప్రాతఃకాలం: 5:00 AM - 7:30 AM (Brahma Muhurtham)');
  const [paymentMethod, setPaymentMethod] = useState<OrderBooking['paymentMethod']>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Payment method specific options
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('phonepe');

  const unitPrice = selectedKit.price;
  const totalPrice = unitPrice * quantity;

  const handleQtyChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(20, prev + delta)));
  };

  const handleBook = async (methodOverride?: OrderBooking['paymentMethod']) => {
    setErrorMsg('');
    const finalMethod = methodOverride || paymentMethod;

    if (!name.trim()) {
      setErrorMsg(lang === 'te' ? 'దయచేసి మీ పేరు నమోదు చేయండి.' : 'Please enter your full name.');
      return;
    }

    if (!/^[0-9]{10}$/.test(mobile.trim())) {
      setErrorMsg(lang === 'te' ? 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ ఇవ్వండి.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!address.trim() || address.trim().length < 6) {
      setErrorMsg(lang === 'te' ? 'దయచేసి పూర్తి డెలివరీ చిరునామా రాయండి.' : 'Please enter your complete delivery address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createOrderBooking({
        customerName: name.trim(),
        mobile: mobile.trim(),
        address: address.trim(),
        city,
        pincode,
        kitId: selectedKit.id,
        kitName: selectedKit.nameTe,
        price: unitPrice,
        quantity,
        paymentMethod: finalMethod,
        deliverySlot
      });

      if (res.success && res.order) {
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 65,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}

        // Sound chime & push notification
        templeAudio.playTempleBell();
        notificationManager.notify(
          lang === 'te' ? 'పూజా కిట్ బుకింగ్ విజయవంతమైంది! 🙏' : 'Pooja Kit Booking Confirmed! 🙏',
          lang === 'te' 
            ? `బుకింగ్ ID: ${res.order.id}. మీ కిట్ పవిత్రంగా ప్యాక్ చేయబడుతోంది.` 
            : `Booking ID: ${res.order.id}. Total ₹${res.order.total}. Packing in progress.`,
          { type: 'order', orderId: res.order.id }
        );

        if (finalMethod === 'WhatsApp') {
          const waUrl = generateWhatsAppUrl(res.order);
          window.open(waUrl, '_blank');
        }

        onOrderSuccess(res.order);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(lang === 'te' ? `బుకింగ్ లోపం: ${msg}` : `Booking failed: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking-section" className="my-10 bg-white/95 rounded-3xl border-2 border-[#d9a64e] p-5 md:p-8 shadow-xl relative overflow-hidden">
      {/* Decorative Top Trim */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#5a1b0b] via-[#cf8b2b] to-[#5a1b0b]" />

      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8c331a] bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200 mb-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{lang === 'te' ? 'సులభమైన బుకింగ్ & సురక్షిత చెల్లింపులు' : 'Easy 1-Click Booking & Secure Gateway'}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#6d1b09] font-cinzel">
          {lang === 'te' ? 'కార్తీక పూజా కిట్ బుక్ చేసుకోండి' : 'Book Your Sacred Pooja Kit'}
        </h2>
        <p className="text-xs md:text-sm text-[#734b2f] mt-1">
          {lang === 'te' 
            ? 'మీ ఇంటి వద్దకే గంగాజల శుద్ధితో కూడిన తాజా బిల్వపత్రాలు మరియు మట్టి ప్రమిదలు'
            : 'Doorstep delivery with ritual purity, fresh flowers and handcrafted clay diyas'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Devotee & Delivery Details */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#fffdfa] p-4 md:p-5 rounded-2xl border border-[#ebd8bc] space-y-4">
            <h3 className="text-sm md:text-base font-bold text-[#77240d] flex items-center gap-2 pb-2 border-b border-[#f0dfc6]">
              <User className="w-4 h-4 text-amber-600" />
              <span>{lang === 'te' ? 'భక్తుని వివరాలు (Devotee Information)' : 'Devotee & Contact Information'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#4d2813] mb-1">
                  {lang === 'te' ? 'మీ పూర్తి పేరు *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={lang === 'te' ? 'ఉదా: రామ్మహేష్ బాబు' : 'e.g. Ram Mahesh Babu'}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#d8c5b3] text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4d2813] mb-1">
                  {lang === 'te' ? 'మొబైల్ నంబర్ (WhatsApp) *' : 'Mobile Number (10 Digits) *'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobile}
                    onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="9849012345"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#d8c5b3] text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4d2813] mb-1">
                {lang === 'te' ? 'పూర్తి డెలివరీ చిరునామా (ఇంటి నం, వీధి, ల్యాండ్‌మార్క్) *' : 'Full Delivery Address *'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                <textarea
                  rows={2}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder={lang === 'te' ? 'ఫ్లాట్ నం 204, సాయి బాలాజీ నిలయం, శివాలయం ఎదురుగా...' : 'Flat No, Apartment, Landmark, Area...'}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#d8c5b3] text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#4d2813] mb-1">
                  {lang === 'te' ? 'ప్రాంతం / నగరం' : 'City / Region'}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d8c5b3] text-xs md:text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4d2813] mb-1">
                  {lang === 'te' ? 'పిన్ కోడ్' : 'Pincode'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 rounded-xl border border-[#d8c5b3] text-xs md:text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4d2813] mb-1">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-amber-600" />
                {lang === 'te' ? 'మీకు అనుకూలమైన పూజా డెలివరీ సమయం (Slot)' : 'Preferred Delivery Slot'}
              </label>
              <select
                value={deliverySlot}
                onChange={e => setDeliverySlot(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#d8c5b3] text-xs md:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="🌅 వేకువజాము ప్రాతఃకాలం: 5:00 AM - 7:30 AM (Brahma Muhurtham)">
                  🌅 వేకువజాము ప్రాతఃకాలం: 5:00 AM - 7:30 AM (Brahma Muhurtham)
                </option>
                <option value="🪔 ప్రదోష సంధ్యా సమయం: 4:30 PM - 7:00 PM (Pradosha Kalam)">
                  🪔 ప్రదోష సంధ్యా సమయం: 4:30 PM - 7:00 PM (Pradosha Kalam)
                </option>
                <option value="⚡ ఎక్స్‌ప్రెస్ 35 నిమిషాల డెలివరీ (Instant 35 Mins)">
                  ⚡ ఎక్స్‌ప్రెస్ 35 నిమిషాల డెలివరీ (Instant 35 Mins)
                </option>
                <option value="🌿 కార్తీక సోమవార ఉదయం 6:00 AM (Next Somavaram)">
                  🌿 కార్తీక సోమవార ఉదయం 6:00 AM (Next Somavaram)
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Summary & Payment Methods */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-[#fffbf4] to-[#fff3da] p-5 rounded-2xl border-2 border-[#d9a64e]/80 shadow-md">
            <h3 className="text-base font-bold text-[#77240d] flex items-center justify-between pb-2 border-b border-[#edd6b3]">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-amber-600" />
                {lang === 'te' ? 'ఆర్డర్ సారాంశం (Order Summary)' : 'Order Summary'}
              </span>
              <span className="text-2xl">{selectedKit.icon}</span>
            </h3>

            {/* Selected Kit selector */}
            <div className="my-3">
              <label className="block text-xs font-bold text-[#4d2813] mb-1">
                {lang === 'te' ? 'ఎంచుకున్న కిట్:' : 'Selected Kit:'}
              </label>
              <select
                value={selectedKit.id}
                onChange={e => {
                  const match = POOJA_KITS.find(k => k.id === e.target.value);
                  if (match) onKitChange(match);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-[#d4a86b] text-xs md:text-sm font-semibold bg-white text-[#661f0e]"
              >
                {POOJA_KITS.map(k => (
                  <option key={k.id} value={k.id}>
                    {lang === 'te' ? k.nameTe : k.nameEn} — ₹{k.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between py-2 border-y border-[#edd6b3]/70">
              <span className="text-xs font-bold text-[#4d2813]">
                {lang === 'te' ? 'పరిమాణం (కిట్ల సంఖ్య):' : 'Quantity of Kits:'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQtyChange(-1)}
                  className="w-8 h-8 rounded-lg bg-[#872e12] hover:bg-[#6e220a] text-white font-bold text-lg flex items-center justify-center transition-colors shadow-2xs"
                >
                  −
                </button>
                <span className="w-8 text-center font-black text-base text-[#6d1b09]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQtyChange(1)}
                  className="w-8 h-8 rounded-lg bg-[#872e12] hover:bg-[#6e220a] text-white font-bold text-lg flex items-center justify-center transition-colors shadow-2xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="pt-3 space-y-1.5 text-xs text-[#523019]">
              <div className="flex justify-between">
                <span>{lang === 'te' ? 'ధర (యూనిట్):' : 'Unit Price:'}</span>
                <span>₹{unitPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>{lang === 'te' ? 'పవిత్ర ఎకో ప్యాకింగ్:' : 'Ritual Packaging:'}</span>
                <span className="text-emerald-700 font-semibold">{lang === 'te' ? 'ఉచితం (FREE)' : 'FREE'}</span>
              </div>
              <div className="flex justify-between">
                <span>{lang === 'te' ? 'డెలివరీ ఛార్జీలు:' : 'Temple Delivery:'}</span>
                <span className="text-emerald-700 font-semibold">{lang === 'te' ? 'ఉచితం (₹0)' : 'FREE'}</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#872e12] pt-2 border-t border-[#ebd1a7]">
                <span>{lang === 'te' ? 'మొత్తం చెల్లించవలసినది:' : 'Total Payable Amount:'}</span>
                <span className="text-2xl text-[#9b2816]">₹{totalPrice}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mt-4 pt-3 border-t border-[#edd6b3]">
              <label className="block text-xs font-bold text-[#4d2813] mb-2 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'te' ? 'సురక్షిత చెల్లింపు విధానం (Payment Gateway):' : 'Secure Payment Option:'}</span>
              </label>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* UPI Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'UPI'
                      ? 'bg-amber-100 border-[#912d13] text-[#77240d] font-bold shadow-xs'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-purple-700" />
                  <span>Instant UPI</span>
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'bg-amber-100 border-[#912d13] text-[#77240d] font-bold shadow-xs'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Truck className="w-4 h-4 text-amber-700" />
                  <span>Cash on Delivery</span>
                </button>

                {/* WhatsApp Order */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('WhatsApp')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'WhatsApp'
                      ? 'bg-emerald-100 border-emerald-600 text-emerald-900 font-bold shadow-xs'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Order</span>
                </button>

                {/* Card / NetBanking */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card / NetBanking')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'Card / NetBanking'
                      ? 'bg-amber-100 border-[#912d13] text-[#77240d] font-bold shadow-xs'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-700" />
                  <span>Card / NetBanking</span>
                </button>
              </div>

              {/* UPI Sub-selector if UPI is chosen */}
              {paymentMethod === 'UPI' && (
                <div className="mt-3 bg-white p-2.5 rounded-xl border border-purple-200 text-xs">
                  <span className="text-[11px] text-gray-500 block mb-1.5 font-medium">
                    {lang === 'te' ? 'UPI యాప్ ఎంచుకోండి లేదా స్కానర్ ఉపయోగించండి:' : 'Select UPI App or Scan QR:'}
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 text-center font-semibold">
                    {[
                      { id: 'phonepe', label: 'PhonePe', color: 'text-purple-700' },
                      { id: 'gpay', label: 'GPay', color: 'text-blue-600' },
                      { id: 'paytm', label: 'Paytm', color: 'text-cyan-700' },
                      { id: 'bhim', label: 'BHIM', color: 'text-emerald-700' }
                    ].map(app => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setUpiApp(app.id as typeof upiApp)}
                        className={`py-1 px-1 rounded text-[11px] border ${
                          upiApp === app.id
                            ? 'bg-purple-50 border-purple-500 font-bold'
                            : 'border-gray-200 hover:bg-gray-50'
                        } ${app.color}`}
                      >
                        {app.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-[11px] text-gray-600 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <QrCode className="w-3.5 h-3.5 text-gray-500" />
                      UPI ID: <strong className="text-purple-800">karthika.pooja@upi</strong>
                    </span>
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> 256-bit Secure
                    </span>
                  </div>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-300 text-red-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Primary Order Action Button */}
            <div className="mt-5 space-y-2">
              {paymentMethod === 'WhatsApp' ? (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleBook('WhatsApp')}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#159447] hover:bg-[#117a3a] text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>
                    {isSubmitting 
                      ? (lang === 'te' ? 'నమోదు అవుతోంది...' : 'Connecting...') 
                      : (lang === 'te' ? 'వాట్సాప్ ద్వారా బుక్ చేయండి (₹' + totalPrice + ')' : 'Book via WhatsApp (₹' + totalPrice + ')')}
                  </span>
                </button>
              ) : paymentMethod === 'Cash on Delivery' ? (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleBook('Cash on Delivery')}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#872e12] to-[#b3431e] hover:from-[#6d220a] hover:to-[#913212] text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
                >
                  <Truck className="w-5 h-5 text-amber-200" />
                  <span>
                    {isSubmitting 
                      ? (lang === 'te' ? 'నమోదు అవుతోంది...' : 'Confirming...') 
                      : (lang === 'te' ? 'క్యాష్ ఆన్ డెలివరీ ఆర్డర్ చేయండి (₹' + totalPrice + ')' : 'Confirm Cash on Delivery (₹' + totalPrice + ')')}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleBook(paymentMethod)}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#872e12] via-[#b3431e] to-[#c27a24] hover:from-[#6d220a] hover:to-[#9b3916] text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
                >
                  <ShieldCheck className="w-5 h-5 text-amber-200" />
                  <span>
                    {isSubmitting 
                      ? (lang === 'te' ? 'చెల్లింపు ప్రక్రియ...' : 'Processing...') 
                      : (lang === 'te' ? `చెల్లించి బుక్ చేయండి – ₹${totalPrice}` : `Pay & Confirm Order – ₹${totalPrice}`)}
                  </span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-center text-gray-500 mt-2.5">
              🙏 {lang === 'te' 
                ? 'ఆర్డర్ పూర్తవగానే మీ మొబైల్‌కు రియల్-టైమ్ డెలివరీ ట్రాకింగ్ లింక్ వస్తుంది.' 
                : 'Real-time GPS delivery tracking activated instantly on confirmation.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
