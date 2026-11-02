import React, { useState } from 'react';
import { KARTHIKA_DAYS_2026 } from '../data/mockData';
import { KarthikaDay } from '../types';
import { Calendar, ChevronRight, Sparkles, X, CheckCircle2 } from 'lucide-react';

interface KarthikaCalendarProps {
  onSelectDateForKit: (dayText: string) => void;
  lang?: 'te' | 'en';
}

export const KarthikaCalendar: React.FC<KarthikaCalendarProps> = ({ onSelectDateForKit, lang = 'te' }) => {
  const [selectedDay, setSelectedDay] = useState<KarthikaDay | null>(null);

  const year = 2026;
  const month = 10; // November (0-indexed: 10 = November)
  const daysInMonth = 30;
  // November 1, 2026 is Sunday (day 0). In Monday-first index: (0 + 6) % 7 = 6
  const startDay = 6; 

  const dayNamesTe = ['సోమ', 'మంగళ', 'బుధ', 'గురు', 'శుక్ర', 'శని', 'ఆది'];
  const dayNamesEn = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const getDayInfo = (d: number): KarthikaDay | undefined => {
    return KARTHIKA_DAYS_2026.find(item => item.day === d);
  };

  const handleDayClick = (dayNumber: number) => {
    const special = getDayInfo(dayNumber);
    const dayOfWeekIndex = (startDay + dayNumber - 1) % 7;
    const isMonday = dayOfWeekIndex === 0;

    const info: KarthikaDay = special || {
      day: dayNumber,
      dateStr: `2026-11-${String(dayNumber).padStart(2, '0')}`,
      dayOfWeek: dayNamesEn[dayOfWeekIndex],
      isMonday: isMonday,
      isPournami: dayNumber === 24,
      isEkadashi: dayNumber === 20,
      isDwadasi: dayNumber === 21,
      titleTe: isMonday ? `కార్తీక సోమవారం (తేదీ ${dayNumber})` : `కార్తీక శుద్ధ/బహుళ పక్షం (తేదీ ${dayNumber})`,
      titleEn: isMonday ? `Karthika Somavaram (Nov ${dayNumber})` : `Karthika Masam (Nov ${dayNumber})`,
      ritualsTe: isMonday 
        ? 'ఉపవాసం, సంధ్యావందనం, శివునికి బిల్వార్చన మరియు దీపారాధన.' 
        : 'నిత్య దీపారాధన, శివ నామస్మరణ మరియు ప్రదోష పూజ.',
      ritualsEn: isMonday 
        ? 'Somavaram fasting, evening Shiva bilva archana, and temple ghee diya lighting.' 
        : 'Daily evening ghee lamp lighting, chanting Om Namah Shivaya.',
      muhurtham: 'ప్రదోష సంధ్య: 05:25 PM - 07:40 PM',
      tithi: isMonday ? 'సోమవారం వ్రతం' : 'నిత్య పుణ్యకాలం'
    };

    setSelectedDay(info);
  };

  return (
    <div className="bg-gradient-to-br from-[#fffaf0] via-[#fff5e3] to-[#ffecc7] border-2 border-[#d9a64e] rounded-3xl p-4 md:p-6 shadow-xl relative overflow-hidden">
      {/* Calendar Header */}
      <div className="text-center bg-gradient-to-r from-[#441307] via-[#872e12] to-[#c27a24] text-white rounded-2xl p-4 md:p-5 mb-5 shadow-lg relative">
        <div className="text-2xl md:text-3xl font-bold tracking-wide text-amber-200">
          ॥ ఓం నమః శివాయ ॥
        </div>
        <h2 className="text-xl md:text-2xl font-bold mt-1 text-[#ffeaad] font-cinzel">
          {lang === 'te' ? 'కార్తీక మాస క్యాలెండర్ – నవంబర్ 2026' : 'Karthika Masam Sacred Calendar – November 2026'}
        </h2>
        <p className="text-xs md:text-sm text-amber-100/90 mt-1">
          {lang === 'te' 
            ? '🪔 సోమవారాలు మరియు పర్వదినాల్లో శివార్చన & దీపారాధన విశేష ఫలితాన్నిస్తుంది'
            : '🪔 Sacred Mondays & Deepotsavam festival days for holy rituals & lighting diyas'}
        </p>
      </div>

      {/* Grid of Days */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1.5 md:border-spacing-2 table-fixed min-w-[320px]">
          <thead>
            <tr>
              {(lang === 'te' ? dayNamesTe : dayNamesEn).map((dayName, idx) => (
                <th
                  key={idx}
                  className={`py-2 px-1 text-xs md:text-sm font-bold rounded-lg text-white ${
                    idx === 0 ? 'bg-[#1b5e20]' : 'bg-[#70240e]'
                  }`}
                >
                  {dayName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, rowIndex) => {
              return (
                <tr key={rowIndex}>
                  {Array.from({ length: 7 }).map((_, colIndex) => {
                    const cellIndex = rowIndex * 7 + colIndex;
                    const dateNum = cellIndex - startDay + 1;

                    if (dateNum < 1 || dateNum > daysInMonth) {
                      return <td key={colIndex} className="bg-transparent p-1 md:p-2" />;
                    }

                    const isMonday = colIndex === 0;
                    const isPournami = dateNum === 24;
                    const isEkadashi = dateNum === 20;

                    let bgClass = "bg-white border-[#ebd4b2] text-[#4a2612] hover:bg-[#fff0d0]";
                    if (isMonday) {
                      bgClass = "bg-[#d8f3dc] border-2 border-[#52b788] text-[#1b4332] font-black shadow-sm";
                    } else if (isPournami) {
                      bgClass = "bg-[#fff3b0] border-2 border-[#e09f3e] text-[#935200] font-black shadow-sm";
                    } else if (isEkadashi) {
                      bgClass = "bg-[#ffe5d9] border-2 border-[#f4a261] text-[#9d0208] font-bold";
                    }

                    return (
                      <td
                        key={colIndex}
                        onClick={() => handleDayClick(dateNum)}
                        className={`h-14 md:h-18 rounded-xl border text-center align-middle cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${bgClass}`}
                      >
                        <div className="flex flex-col items-center justify-center p-1">
                          <span className="text-sm md:text-base font-bold leading-tight">{dateNum}</span>
                          {isMonday && (
                            <span className="text-xs md:text-sm mt-0.5" title="కార్తీక సోమవారం">🪔</span>
                          )}
                          {isPournami && (
                            <span className="text-[10px] md:text-xs text-amber-800 font-extrabold leading-none mt-0.5">
                              {lang === 'te' ? 'పౌర్ణమి' : 'Full Moon'}
                            </span>
                          )}
                          {isEkadashi && (
                            <span className="text-[9px] md:text-[10px] text-red-700 font-bold leading-none mt-0.5">
                              {lang === 'te' ? 'ఏకాదశి' : 'Ekadashi'}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm text-[#5a331c] bg-white/70 py-2.5 px-4 rounded-xl border border-[#edd7b6]">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-4 h-4 rounded bg-[#d8f3dc] border border-[#52b788] inline-block"></span>
          <span>{lang === 'te' ? 'కార్తీక సోమవారాలు (5 సోమవారాలు 🪔)' : 'Karthika Somavarams (5 Mondays)'}</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-4 h-4 rounded bg-[#fff3b0] border border-[#e09f3e] inline-block"></span>
          <span>{lang === 'te' ? 'కార్తీక పౌర్ణమి (365 వత్తుల దీపోత్సవం 🌕)' : 'Karthika Pournami (365 Wicks)'}</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-4 h-4 rounded bg-[#ffe5d9] border border-[#f4a261] inline-block"></span>
          <span>{lang === 'te' ? 'ఏకాదశి / ద్వాదశి' : 'Ekadashi / Dwadasi'}</span>
        </div>
      </div>

      {/* Day Details Modal */}
      {selectedDay && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedDay(null)}
        >
          <div 
            className="bg-[#fff9ef] max-w-md w-full rounded-2xl border-2 border-[#d9a64e] p-6 shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedDay(null)}
              className="absolute top-4 right-4 text-[#8c331a] hover:text-[#521a0c] p-1 rounded-full hover:bg-amber-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center pb-3 border-b border-amber-200">
              <span className="text-3xl">🪔</span>
              <h3 className="text-lg md:text-xl font-bold text-[#7a2a14] mt-1">
                {lang === 'te' ? selectedDay.titleTe : selectedDay.titleEn}
              </h3>
              <p className="text-xs text-amber-800 font-semibold mt-0.5">
                {selectedDay.dateStr} • {selectedDay.dayOfWeek}
              </p>
            </div>

            <div className="mt-4 space-y-3 text-xs md:text-sm text-[#4d2813]">
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200/80">
                <span className="font-bold text-[#8c331a] block mb-1">
                  {lang === 'te' ? '🕉️ విశేష పూజా నియమాలు (Ritual Guidelines):' : '🕉️ Auspicious Rituals:'}
                </span>
                <p className="leading-relaxed">
                  {lang === 'te' ? selectedDay.ritualsTe : selectedDay.ritualsEn}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-amber-100">
                <span className="font-bold text-gray-700">{lang === 'te' ? 'పూజా ముహూర్తం:' : 'Holy Muhurtham:'}</span>
                <span className="font-semibold text-[#8c331a]">{selectedDay.muhurtham}</span>
              </div>

              <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-amber-100">
                <span className="font-bold text-gray-700">{lang === 'te' ? 'తిథి విశేషం:' : 'Tithi Significance:'}</span>
                <span className="font-semibold text-emerald-800">{selectedDay.tithi}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-amber-200 flex flex-col gap-2">
              <button
                onClick={() => {
                  const dayTitle = lang === 'te' ? selectedDay.titleTe : selectedDay.titleEn;
                  onSelectDateForKit(dayTitle);
                  setSelectedDay(null);
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#8c331a] to-[#c4531d] hover:from-[#732711] hover:to-[#a84414] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>{lang === 'te' ? 'ఈ రోజు కోసం పూజా కిట్ బుక్ చేసుకోండి' : 'Book Kit for this Day'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
