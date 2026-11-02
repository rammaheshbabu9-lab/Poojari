import React, { useState } from 'react';
import { POOJA_KITS } from '../data/mockData';
import { PoojaKit } from '../types';
import { Check, Sparkles, Eye, ShieldCheck, ChevronRight, X } from 'lucide-react';

interface KitSelectionProps {
  selectedKitId: string;
  onSelectKit: (kit: PoojaKit) => void;
  lang?: 'te' | 'en';
}

export const KitSelection: React.FC<KitSelectionProps> = ({ selectedKitId, onSelectKit, lang = 'te' }) => {
  const [modalKit, setModalKit] = useState<PoojaKit | null>(null);

  return (
    <section className="my-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-[#fffaed] border border-[#d9a64e] text-[#872e12] px-4 py-1 rounded-full text-xs md:text-sm font-bold mb-2 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{lang === 'te' ? 'స్వచ్ఛమైన & సహజసిద్ధ పూజా సామాగ్రి' : '100% Shuddha & Authentic Samagri'}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#6d1b09] font-cinzel">
          {lang === 'te' ? 'కార్తీక మాస పవిత్ర పూజా కిట్స్' : 'Select Your Karthika Pooja Kit'}
        </h2>
        <p className="text-xs md:text-sm text-[#734b2f] max-w-xl mx-auto mt-1">
          {lang === 'te' 
            ? 'ప్రతి కిట్ పవిత్రమైన గంగాజల స్పర్శతో, సంప్రదాయబద్ధంగా శుద్ధి చేయబడిన ద్రవ్యాలతో అందించబడుతుంది.'
            : 'Carefully curated and packed with sacred cleanliness for your morning and evening rituals.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {POOJA_KITS.map((kit) => {
          const isSelected = selectedKitId === kit.id;
          return (
            <div
              key={kit.id}
              className={`relative rounded-3xl p-5 md:p-6 transition-all duration-300 flex flex-col justify-between border-2 ${
                isSelected
                  ? 'bg-gradient-to-b from-[#fff8ea] to-[#ffefce] border-[#b0401a] shadow-xl ring-2 ring-[#c9592a]/50 scale-[1.02]'
                  : 'bg-white/90 hover:bg-[#fffcf5] border-[#ebd1a7] shadow-md hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              {/* Top Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{kit.icon}</span>
                <span className={`text-[11px] md:text-xs font-bold px-3 py-1 rounded-full ${
                  isSelected ? 'bg-[#912d13] text-amber-100' : 'bg-amber-100 text-[#853017]'
                }`}>
                  {lang === 'te' ? kit.badgeTe : kit.badgeEn}
                </span>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-bold text-[#661f0e]">
                  {lang === 'te' ? kit.nameTe : kit.nameEn}
                </h3>
                
                <p className="text-xs text-[#775135] mt-1.5 min-h-[36px] line-clamp-2">
                  {lang === 'te' ? kit.descriptionTe : kit.descriptionEn}
                </p>

                {/* Price Display */}
                <div className="my-4 flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-black text-[#962615]">
                    ₹{kit.price}
                  </span>
                  <span className="text-sm md:text-base text-gray-400 line-through">
                    ₹{kit.originalPrice}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {Math.round(((kit.originalPrice - kit.price) / kit.originalPrice) * 100)}% OFF
                  </span>
                </div>

                {/* Samagri quick preview items */}
                <div className="bg-[#fffdf8] border border-[#f0dfc2] rounded-xl p-3 mb-5 space-y-2 text-xs text-[#523019]">
                  <div className="font-semibold text-[#872e12] flex items-center gap-1.5 pb-1 border-b border-[#f3e3ca]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'te' ? kit.highlightTe : kit.highlightEn}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {kit.items.slice(0, 4).map((item) => (
                      <div key={item.id} className="flex items-center gap-1 truncate text-[11px]">
                        <span>{item.icon}</span>
                        <span className="truncate">{lang === 'te' ? item.nameTe.split(' ')[0] : item.nameEn}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] text-amber-800/80 font-medium pt-1">
                    + {kit.items.length - 4} {lang === 'te' ? 'మరిన్ని పవిత్ర ద్రవ్యాలు...' : 'more holy items...'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-auto">
                <button
                  type="button"
                  onClick={() => setModalKit(kit)}
                  className="py-2.5 px-3 rounded-xl border border-[#912d13] text-[#912d13] bg-white hover:bg-amber-50 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{lang === 'te' ? 'సామాగ్రి వివరాలు' : 'View Items'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectKit(kit)}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-transform active:scale-95 shadow-md ${
                    isSelected
                      ? 'bg-[#1b5e20] text-white hover:bg-[#144818]'
                      : 'bg-gradient-to-r from-[#912d13] to-[#b3431e] text-white hover:from-[#77240d] hover:to-[#912d13]'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{lang === 'te' ? 'ఎంపికైంది' : 'Selected'}</span>
                    </>
                  ) : (
                    <>
                      <span>{lang === 'te' ? 'కిట్ ఎంచుకోండి' : 'Select Kit'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Samagri Details Modal */}
      {modalKit && (
        <div 
          className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4 animate-in fade-in"
          onClick={() => setModalKit(null)}
        >
          <div 
            className="bg-[#fffaf0] max-w-lg w-full rounded-3xl border-2 border-[#d9a64e] p-5 md:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setModalKit(null)}
              className="absolute top-4 right-4 text-[#8c331a] hover:text-[#4f1a0b] p-1.5 rounded-full hover:bg-amber-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center pb-4 border-b border-amber-200">
              <span className="text-4xl">{modalKit.icon}</span>
              <h3 className="text-xl md:text-2xl font-bold text-[#77240d] mt-1 font-cinzel">
                {lang === 'te' ? modalKit.nameTe : modalKit.nameEn}
              </h3>
              <p className="text-xs text-[#805031] mt-1">
                {lang === 'te' ? modalKit.descriptionTe : modalKit.descriptionEn}
              </p>
              <div className="mt-2 text-2xl font-black text-[#962615]">
                ₹{modalKit.price} <span className="text-xs text-gray-500 font-normal">({lang === 'te' ? 'పన్నులు & ప్యాకింగ్ సహా' : 'Incl. all taxes & packing'})</span>
              </div>
            </div>

            <div className="my-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
                {lang === 'te' ? `పవిత్ర సామాగ్రి జాబితా (${modalKit.items.length} ద్రవ్యాలు):` : `Sacred Items Breakdown (${modalKit.items.length} Items):`}
              </h4>
              <div className="space-y-2">
                {modalKit.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#edd7b6] text-xs shadow-2xs hover:border-amber-400 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl w-6 text-center">{item.icon}</span>
                      <div>
                        <span className="font-bold text-[#45220f] block">
                          {lang === 'te' ? item.nameTe : item.nameEn}
                        </span>
                        {item.significanceTe && (
                          <span className="text-[10px] text-amber-700/80">
                            {lang === 'te' ? item.significanceTe : item.significanceEn}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-[#8c331a] bg-amber-50 px-2 py-1 rounded border border-amber-200">
                      {item.qty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-amber-200 flex flex-col gap-2">
              <button
                onClick={() => {
                  onSelectKit(modalKit);
                  setModalKit(null);
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#912d13] to-[#c24b20] hover:from-[#7a230c] hover:to-[#a33a14] text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>
                  {lang === 'te' ? `ఈ కిట్ ఎంచుకోండి – ₹${modalKit.price}` : `Select This Kit – ₹${modalKit.price}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
