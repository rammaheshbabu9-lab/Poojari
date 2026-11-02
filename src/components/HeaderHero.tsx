import React from 'react';
import { Sparkles, Navigation, Globe, PhoneCall, ShieldCheck, HeartHandshake } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';
import { WHATSAPP_NUMBER } from '../services/orderService';

interface HeaderHeroProps {
  lang: 'te' | 'en';
  onToggleLang: () => void;
  onOpenTracking: () => void;
  onSelectBooking: () => void;
  activeOrderCount: number;
}

export const HeaderHero: React.FC<HeaderHeroProps> = ({
  lang,
  onToggleLang,
  onOpenTracking,
  onSelectBooking,
  activeOrderCount
}) => {
  return (
    <header className="relative bg-gradient-to-b from-[#140603] via-[#3d1107] to-[#73240e] text-white overflow-hidden shadow-2xl">
      {/* Top Auspicious Bar */}
      <div className="bg-[#120402]/90 border-b border-[#d9a64e]/30 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#ffd76b] font-bold tracking-widest text-sm">॥ ఓం నమః శివాయ ॥ ॐ</span>
          <span className="hidden sm:inline text-amber-200/70">|</span>
          <span className="hidden sm:inline text-amber-100/80 font-medium">
            {lang === 'te' ? 'కార్తీక మాస పవిత్ర పూజా సామాగ్రి డెలివరీ' : 'Sacred Karthika Masam Samagri Delivery'}
          </span>
        </div>

        {/* Right Utility Bar: Tracking, Notifications, Lang Switcher */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Live Order Tracking Button */}
          <button
            onClick={onOpenTracking}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-[#ffd778] font-bold text-xs transition-colors shadow-xs"
          >
            <Navigation className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'te' ? 'ఆర్డర్ ట్రాకింగ్' : 'Track Order'}</span>
            {activeOrderCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>

          {/* Notifications Drawer */}
          <NotificationCenter onOpenOrder={onOpenTracking} lang={lang} />

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'te' ? 'English' : 'తెలుగు'}</span>
          </button>
        </div>
      </div>

      {/* Main Hero Container */}
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-[#ffd76b]/15 border border-[#ffd76b]/40 text-[#ffe59e] px-4 py-1.5 rounded-full text-xs md:text-sm font-bold mb-4 backdrop-blur-xs">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>
            {lang === 'te' ? 'కార్తీక సోమవారం & దీపోత్సవ విశేష సేవ' : 'Karthika Somavaram & Deepotsavam Sanctum Seva'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#ffe7a3] tracking-wide font-cinzel drop-shadow-md">
          {lang === 'te' ? 'కార్తీక మాస పూజా కిట్' : 'Karthika Masam Pooja Kit'}
        </h1>
        <p className="text-sm md:text-lg text-amber-200/90 font-medium mt-1 tracking-widest uppercase">
          KARTHIKA MASAM POOJA KIT
        </p>
        <p className="text-base md:text-xl text-amber-100 font-semibold mt-3 max-w-2xl mx-auto leading-relaxed">
          🙏 {lang === 'te' ? 'భక్తితో పూజించండి... శుభాలు పొందండి' : 'Worship with pure devotion... Receive divine blessings'} 🙏
        </p>

        {/* Visual Showcase: Lord Shiva & Temple Sanctum */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto my-7">
          {/* Shiva Image Card */}
          <div className="group relative rounded-2xl overflow-hidden border-2 border-[#ffd76b]/60 shadow-2xl h-56 md:h-64 transition-transform hover:scale-[1.02]">
            <img
              src="https://images.unsplash.com/photo-1609358905581-e50882d96695?w=800&auto=format&fit=crop&q=80"
              alt="Lord Shiva Sacred Lingam and Karthika Deepam"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4 text-left">
              <span className="text-xs text-amber-300 font-bold">॥ హర హర మహాదేవ ॥</span>
              <h3 className="text-sm md:text-base font-bold text-white">
                {lang === 'te' ? 'పరమశివుని ప్రీతికరమైన కార్తీక మాసం' : 'Sacred Auspicious Month of Lord Shiva'}
              </h3>
            </div>
          </div>

          {/* Temple Sanctum Image Card */}
          <div className="group relative rounded-2xl overflow-hidden border-2 border-[#ffd76b]/60 shadow-2xl h-56 md:h-64 transition-transform hover:scale-[1.02]">
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80"
              alt="Arunachaleswarar Temple Deepotsavam"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4 text-left">
              <span className="text-xs text-amber-300 font-bold">🛕 అరుణాచల దీపం</span>
              <h3 className="text-sm md:text-base font-bold text-white">
                {lang === 'te' ? 'దీపారాధన & శివార్చన మహత్యం' : 'Divine Sanctum & Deeparadhana Significance'}
              </h3>
            </div>
          </div>
        </div>

        {/* Quick Highlights / Trust Pillars */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs md:text-sm text-amber-100">
          <div className="flex items-center gap-1.5 bg-[#250904]/70 px-3 py-1.5 rounded-xl border border-[#d9a64e]/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'te' ? '100% స్వచ్ఛమైన సామాగ్రి' : '100% Pure Samagri'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#250904]/70 px-3 py-1.5 rounded-xl border border-[#d9a64e]/30">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{lang === 'te' ? 'తాజా బిల్వపత్రాలు & పూలు' : 'Fresh Bilva Leaves & Flowers'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#250904]/70 px-3 py-1.5 rounded-xl border border-[#d9a64e]/30">
            <HeartHandshake className="w-4 h-4 text-rose-400" />
            <span>{lang === 'te' ? 'సకాలంలో డోర్ డెలివరీ' : 'Guaranteed Muhurtham Delivery'}</span>
          </div>
        </div>

        {/* Hero CTAs */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onSelectBooking}
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#d4972e] via-[#f1ba4f] to-[#d4972e] text-[#2b0c05] font-black text-sm md:text-base shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            {lang === 'te' ? 'పూజా కిట్ బుక్ చేయండి (₹49 నుండి)' : 'Book Pooja Kit (From ₹49)'}
          </button>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('నమస్తే, కార్తీక మాస పూజా కిట్ వివరాలు కావాలి.')}`}
            target="_blank"
            rel="noreferrer"
            className="py-3 px-5 rounded-xl bg-[#159447] hover:bg-[#117a3a] text-white font-bold text-sm md:text-base shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{lang === 'te' ? 'WhatsApp ఆర్డర్' : 'WhatsApp Order'}</span>
          </a>
        </div>
      </div>
    </header>
  );
};
