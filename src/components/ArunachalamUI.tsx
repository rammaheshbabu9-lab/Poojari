import React, { useState } from 'react';
import { POOJA_KITS } from '../data/mockData';
import { PoojaKit, OrderBooking } from '../types';
import { createOrderBooking, generateWhatsAppUrl } from '../services/orderService';
import { notificationManager } from '../services/notificationService';
import { templeAudio } from '../utils/audio';
import { Shiva3DCard } from './Shiva3DCard';
import { 
  User, 
  Phone, 
  Home, 
  Package, 
  Eye, 
  Truck,
  X,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ArunachalamUI: React.FC = () => {
  // Selected Kit: default to Mini Pooja Kit (₹49)
  const [selectedKitId, setSelectedKitId] = useState<string>('mini');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [modalKit, setModalKit] = useState<PoojaKit | null>(null);
  const [successOrder, setSuccessOrder] = useState<OrderBooking | null>(null);

  const currentKit = POOJA_KITS.find(k => k.id === selectedKitId) || POOJA_KITS[0];
  const totalPrice = currentKit.price * quantity;

  const handleBooking = async (paymentMethod: OrderBooking['paymentMethod']) => {
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('దయచేసి మీ పేరు నమోదు చేయండి (Please enter your name).');
      return;
    }

    if (!/^[0-9]{10}$/.test(mobile.trim())) {
      setErrorMsg('దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ ఇవ్వండి (Enter valid 10-digit mobile number).');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setErrorMsg('దయచేసి పూర్తి డెలివరీ చిరునామా రాయండి (Please enter your full address).');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createOrderBooking({
        customerName: name.trim(),
        mobile: mobile.trim(),
        address: address.trim(),
        kitId: currentKit.id,
        kitName: currentKit.nameEn,
        price: currentKit.price,
        quantity: quantity,
        paymentMethod: paymentMethod,
        deliverySlot: 'కార్తీక ప్రదోష వేళ / ప్రాతఃకాలం (Auspicious Slot)'
      });

      if (res.success && res.order) {
        try {
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.6 }
          });
        } catch {}

        templeAudio.playTempleBell();
        notificationManager.notify(
          'పూజా కిట్ బుకింగ్ నమోదయింది! 🙏',
          `బుకింగ్ ID: ${res.order.id}. మీ పూజా కిట్ త్వరలోనే మీ ఇంటికి చేరుకుంటుంది.`
        );

        if (paymentMethod === 'WhatsApp') {
          const waUrl = generateWhatsAppUrl(res.order);
          window.open(waUrl, '_blank');
        }

        // Show direct success modal: "Booking Successful! Your order will be on its way."
        setSuccessOrder(res.order);

        // Reset fields
        setName('');
        setMobile('');
        setAddress('');
        setQuantity(1);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(`బుకింగ్ లోపం: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#110502] text-[#fff6e0] font-sans pb-12 selection:bg-[#d9a64e] selection:text-black">
      {/* Background Ambience: Subtle Warm Golden Glow Vignette */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-top bg-no-repeat opacity-35 pointer-events-none filter brightness-95"
        style={{
          backgroundImage: `url('/assets/aistudio/file_00000000f71882108e129bbd7aaa9218_2f5798d9.png')`,
        }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#130704]/90 via-[#1c0804]/85 to-[#110502]/95 pointer-events-none" />

      {/* Main Container - Pristine HD Alignment without first line clutter */}
      <div className="relative z-10 max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto px-3 sm:px-4 pt-6 sm:pt-8">
        
        {/* ===================== HERO HEADER WITH 3D SHIVA ===================== */}
        <div className="text-center relative pb-2">
          {/* Sacred Mantra & Om */}
          <div className="flex items-center justify-center gap-2 text-[#ffd868] text-2xl sm:text-3xl font-extrabold tracking-widest drop-shadow-[0_2px_8px_rgba(255,215,104,0.4)]">
            <span>||</span>
            <span className="text-3xl sm:text-4xl text-[#ffdf85]">ॐ</span>
            <span>||</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-200 font-semibold tracking-wider font-marcellus -mt-1">
            Om Namah Shivaya
          </p>

          {/* 3D GOD SHIVA SWAMI PICTURE DISPLAY */}
          <Shiva3DCard />

          {/* Crimson Ribbon: Karthika Masam Pooja Kit */}
          <div className="inline-block mt-2 relative">
            <div className="ribbon-crimson px-6 sm:px-9 py-2 rounded-xl text-center shadow-2xl relative">
              <div className="text-amber-300 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2">
                <span>❖</span>
                <span className="text-sm sm:text-base md:text-lg text-[#fff3cb] font-bold font-marcellus tracking-wider">
                  కార్తీక మాస పూజా కిట్ (Karthika Masam Pooja Kit)
                </span>
                <span>❖</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== POOJA KIT CARDS (₹49 & ₹99) ===================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-6">
          
          {/* Card 1: ₹49 Mini Pooja Kit */}
          <div 
            onClick={() => setSelectedKitId('mini')}
            className={`cursor-pointer relative rounded-3xl p-4 sm:p-5 transition-all duration-300 flex flex-col justify-between ${
              selectedKitId === 'mini'
                ? 'bg-gradient-to-b from-[#fffdf8] to-[#faedd0] ring-3 ring-[#e5ad42] shadow-[0_10px_30px_rgba(217,166,78,0.35)] scale-[1.02]'
                : 'bg-gradient-to-b from-[#fffefc] to-[#f7eedc] opacity-95 hover:opacity-100 shadow-xl border border-[#d9a64e]/50 hover:scale-[1.01]'
            }`}
          >
            {/* Top Crimson Badge: ₹49 */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 ribbon-crimson px-6 py-1 rounded-full shadow-lg border border-[#ffd276]">
              <span className="text-xl sm:text-2xl font-black text-[#fff4cd] tracking-wide font-marcellus">
                ₹49
              </span>
            </div>

            <div className="pt-4 text-center">
              <h2 className="text-lg sm:text-xl font-bold text-[#5c1c0a] font-marcellus tracking-wide">
                Mini Pooja Kit
              </h2>

              {/* Radio Selection Pill */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedKitId === 'mini' ? 'border-[#8c2a12] bg-[#8c2a12]' : 'border-gray-400 bg-white'
                }`}>
                  {selectedKitId === 'mini' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-xs font-bold text-[#5c1c0a]">
                  Select Kit
                </span>
              </div>

              {/* Exact High-Definition ₹49 Pooja Thali Image */}
              <div className="relative my-3 rounded-2xl overflow-hidden shadow-inner bg-[#fcf5e5] p-2 border border-[#ecd5af]">
                <img
                  src="/assets/pooja_kit_49.png"
                  alt="Mini Pooja Kit Thali - 11 Items"
                  className="w-full h-32 sm:h-36 object-contain rounded-xl filter contrast-105"
                  loading="eager"
                />
                <div className="absolute bottom-2 left-2 right-2 text-center">
                  <span className="text-[10px] font-bold bg-[#8c2a12]/90 text-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300/40">
                    11 పవిత్ర పూజా ద్రవ్యాలు
                  </span>
                </div>
              </div>
            </div>

            {/* View Items Button */}
            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalKit(POOJA_KITS[0]);
                }}
                className="w-full py-2 px-4 rounded-full bg-[#fdfbf6] hover:bg-[#fff6e3] border-1.5 border-[#b88528] text-[#6b230d] font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-[#8c2a12]" />
                <span>View Items &gt;</span>
              </button>
            </div>
          </div>

          {/* Card 2: ₹99 Regular Pooja Kit */}
          <div 
            onClick={() => setSelectedKitId('regular')}
            className={`cursor-pointer relative rounded-3xl p-4 sm:p-5 transition-all duration-300 flex flex-col justify-between ${
              selectedKitId === 'regular'
                ? 'bg-gradient-to-b from-[#fffdf8] to-[#faedd0] ring-3 ring-[#e5ad42] shadow-[0_10px_30px_rgba(217,166,78,0.35)] scale-[1.02]'
                : 'bg-gradient-to-b from-[#fffefc] to-[#f7eedc] opacity-95 hover:opacity-100 shadow-xl border border-[#d9a64e]/50 hover:scale-[1.01]'
            }`}
          >
            {/* Top Crimson Badge: ₹99 */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 ribbon-crimson px-6 py-1 rounded-full shadow-lg border border-[#ffd276]">
              <span className="text-xl sm:text-2xl font-black text-[#fff4cd] tracking-wide font-marcellus">
                ₹99
              </span>
            </div>

            <div className="pt-4 text-center">
              <h2 className="text-lg sm:text-xl font-bold text-[#5c1c0a] font-marcellus tracking-wide">
                Regular Pooja Kit
              </h2>

              {/* Radio Selection Pill */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedKitId === 'regular' ? 'border-[#8c2a12] bg-[#8c2a12]' : 'border-gray-400 bg-white'
                }`}>
                  {selectedKitId === 'regular' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-xs font-bold text-[#5c1c0a]">
                  Select Kit
                </span>
              </div>

              {/* Exact High-Definition ₹99 Pooja Thali Image */}
              <div className="relative my-3 rounded-2xl overflow-hidden shadow-inner bg-[#fcf5e5] p-2 border border-[#ecd5af]">
                <img
                  src="/assets/pooja_kit_99.png"
                  alt="Regular Pooja Kit Thali - 12 Items"
                  className="w-full h-32 sm:h-36 object-contain rounded-xl filter contrast-105"
                  loading="eager"
                />
                <div className="absolute bottom-2 left-2 right-2 text-center">
                  <span className="text-[10px] font-bold bg-[#8c2a12]/90 text-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300/40">
                    12 విశేష పూజా ద్రవ్యాలు • వస్త్రం సహా
                  </span>
                </div>
              </div>
            </div>

            {/* View Items Button */}
            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalKit(POOJA_KITS[1]);
                }}
                className="w-full py-2 px-4 rounded-full bg-[#fdfbf6] hover:bg-[#fff6e3] border-1.5 border-[#b88528] text-[#6b230d] font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-[#8c2a12]" />
                <span>View Items &gt;</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===================== BOOKING DETAILS SECTION ===================== */}
        <div className="relative my-7">
          {/* Header Ribbon: ❖ Booking Details ❖ */}
          <div className="text-center relative z-10 -mb-4">
            <div className="inline-block ribbon-crimson px-7 sm:px-10 py-2 rounded-2xl shadow-xl border-2 border-[#fcd276]">
              <div className="flex items-center justify-center gap-2 text-amber-300 text-xs font-bold tracking-widest uppercase">
                <span>❖</span>
                <span className="text-sm sm:text-base font-bold text-[#fff5d4] font-marcellus">
                  Booking Details
                </span>
                <span>❖</span>
              </div>
            </div>
          </div>

          {/* Form Container (Lustrous Golden Bevel Border) */}
          <div className="relative rounded-3xl p-5 sm:p-7 pt-8 bg-gradient-to-b from-[#fffaf0] via-[#fdf5e2] to-[#faedd0] gold-bevel-border shadow-2xl">
            {/* Corner Decorative Brackets */}
            <div className="absolute top-2 left-2 text-[#d4992e] text-xs font-bold pointer-events-none">╔</div>
            <div className="absolute top-2 right-2 text-[#d4992e] text-xs font-bold pointer-events-none">╗</div>
            <div className="absolute bottom-2 left-2 text-[#d4992e] text-xs font-bold pointer-events-none">╚</div>
            <div className="absolute bottom-2 right-2 text-[#d4992e] text-xs font-bold pointer-events-none">╝</div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-3.5">
              
              {/* Row 1: Name */}
              <div>
                <div className="relative flex items-center bg-[#fffefb] rounded-2xl border border-[#d6a54d] shadow-inner focus-within:ring-2 focus-within:ring-[#8c2a12]">
                  <div className="pl-3.5 pr-2 text-[#8c2a12]">
                    <User className="w-5 h-5 text-[#8c2a12]" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="w-full py-3 pr-4 rounded-2xl bg-transparent text-xs sm:text-sm font-semibold text-[#42170b] placeholder-gray-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Mobile Number */}
              <div>
                <div className="relative flex items-center bg-[#fffefb] rounded-2xl border border-[#d6a54d] shadow-inner focus-within:ring-2 focus-within:ring-[#8c2a12]">
                  <div className="pl-3.5 pr-2 text-[#8c2a12]">
                    <Phone className="w-5 h-5 text-[#8c2a12]" />
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="Mobile Number (10 Digits)"
                    className="w-full py-3 pr-4 rounded-2xl bg-transparent text-xs sm:text-sm font-semibold text-[#42170b] placeholder-gray-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Address */}
              <div>
                <div className="relative flex items-start bg-[#fffefb] rounded-2xl border border-[#d6a54d] shadow-inner focus-within:ring-2 focus-within:ring-[#8c2a12]">
                  <div className="pl-3.5 pr-2 pt-3 text-[#8c2a12]">
                    <Home className="w-5 h-5 text-[#8c2a12]" />
                  </div>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address (House No, Street, Area, City)"
                    className="w-full py-3 pr-4 rounded-2xl bg-transparent text-xs sm:text-sm font-semibold text-[#42170b] placeholder-gray-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Row 4: Quantity Dropdown */}
              <div>
                <div className="relative flex items-center bg-[#fffefb] rounded-2xl border border-[#d6a54d] shadow-inner focus-within:ring-2 focus-within:ring-[#8c2a12]">
                  <div className="pl-3.5 pr-2 text-[#8c2a12]">
                    <Package className="w-5 h-5 text-[#8c2a12]" />
                  </div>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full py-3 pr-4 rounded-2xl bg-transparent text-xs sm:text-sm font-bold text-[#42170b] focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <option key={n} value={n}>
                        Quantity: {n} {n === 1 ? 'Kit' : 'Kits'} — (₹{currentKit.price * n})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Price Summary Bar */}
              <div className="bg-[#fff9ea] rounded-xl px-4 py-2 border border-[#edd5a8] flex items-center justify-between text-xs sm:text-sm">
                <span className="font-bold text-[#5c1c0a]">
                  Selected: <strong className="text-[#8c2a12]">{currentKit.nameEn}</strong> (x{quantity})
                </span>
                <span className="font-black text-base sm:text-lg text-[#941d08]">
                  Total: ₹{totalPrice}
                </span>
              </div>

              {/* Error Message if any */}
              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs font-bold text-center">
                  {errorMsg}
                </div>
              )}

              {/* Action Buttons: Book on WhatsApp & Cash on Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                
                {/* Button 1: Book on WhatsApp */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleBooking('WhatsApp')}
                  className="whatsapp-pill-button py-3.5 px-4 rounded-full text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:brightness-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  <span className="text-xl">💬</span>
                  <span className="tracking-wide">Book on WhatsApp</span>
                </button>

                {/* Button 2: Cash on Delivery */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleBooking('Cash on Delivery')}
                  className="gold-pill-button py-3.5 px-4 rounded-full text-[#381106] font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:brightness-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Truck className="w-5 h-5 text-[#381106]" />
                  <span className="tracking-wide">Cash on Delivery</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Clean, Auspicious Minimal Footer */}
        <div className="mt-8 mb-4 text-center">
          <p className="text-xs sm:text-sm text-amber-200/80 font-medium">
            🙏 భక్తితో పూజించండి... శుభాలు పొందండి 🙏
          </p>
        </div>
      </div>

      {/* ===================== DIRECT SUCCESSFUL MODAL ===================== */}
      {successOrder && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSuccessOrder(null)}
        >
          <div 
            className="bg-gradient-to-b from-[#fffefc] via-[#fff9ef] to-[#fbf0dc] max-w-md w-full rounded-3xl border-3 border-[#d9a64e] p-6 shadow-2xl relative text-center text-[#3c170c]"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSuccessOrder(null)}
              className="absolute top-4 right-4 text-[#8c2a12] hover:text-[#521708] p-1.5 rounded-full hover:bg-amber-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Success Icon with Glow */}
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#6d1b09] font-marcellus">
              Booking Successful!
            </h3>
            <p className="text-sm font-bold text-emerald-800 mt-1">
              Your order will be on its way!
            </p>
            <p className="text-xs text-[#6e4324] mt-1">
              ఆర్డర్ విజయవంతంగా నమోదైంది. మీ పూజా కిట్ త్వరలోనే మీ ఇంటికి చేరుకుంటుంది.
            </p>

            {/* Order Details Receipt Box */}
            <div className="my-4 p-3.5 rounded-2xl bg-white border border-[#ebd8bc] text-xs text-left space-y-1.5 shadow-2xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Booking ID:</span>
                <span className="font-bold text-[#8c2a12]">{successOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Customer Name:</span>
                <span className="font-bold text-gray-800">{successOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Pooja Kit:</span>
                <span className="font-bold text-gray-800">{successOrder.kitName} (x{successOrder.quantity})</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-1.5 font-bold">
                <span className="text-gray-700">Total Amount:</span>
                <span className="text-base text-[#941d08] font-black">₹{successOrder.total}</span>
              </div>
              <div className="flex justify-between text-[11px] text-gray-600 pt-0.5">
                <span>Payment Mode:</span>
                <span className="font-semibold text-emerald-700">{successOrder.paymentMethod}</span>
              </div>
            </div>

            <button
              onClick={() => setSuccessOrder(null)}
              className="w-full py-3 rounded-full ribbon-crimson text-white font-bold text-sm shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              OK (ధన్యవాదాలు)
            </button>
          </div>
        </div>
      )}

      {/* ===================== VIEW ITEMS MODAL ===================== */}
      {modalKit && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
          onClick={() => setModalKit(null)}
        >
          <div 
            className="bg-[#fffdf9] max-w-md w-full rounded-3xl border-2 border-[#d9a64e] p-5 sm:p-6 shadow-2xl relative max-h-[88vh] overflow-y-auto text-[#3c170c]"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setModalKit(null)}
              className="absolute top-4 right-4 text-[#8c2a12] hover:text-[#521708] p-1.5 rounded-full hover:bg-amber-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center pb-3 border-b border-amber-200">
              <span className="text-3xl">🪔</span>
              <h3 className="text-xl font-bold text-[#6d1b09] font-marcellus mt-1">
                {modalKit.nameEn} – ₹{modalKit.price}
              </h3>
              <p className="text-xs text-[#734b2f] mt-0.5">
                {modalKit.items.length} పవిత్ర సామాగ్రి ద్రవ్యాలు (100% Shuddha & Authentic)
              </p>
            </div>

            <div className="my-4 space-y-2">
              {modalKit.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#ebd8bc] text-xs shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg w-6 text-center">{item.icon}</span>
                    <span className="font-bold text-[#451e11]">
                      {item.nameTe}
                    </span>
                  </div>
                  <span className="font-black text-[#8c2a12] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {item.qty}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setSelectedKitId(modalKit.id);
                setModalKit(null);
              }}
              className="w-full py-3 rounded-full ribbon-crimson text-white font-bold text-sm shadow-md"
            >
              Select This Kit – ₹{modalKit.price}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
