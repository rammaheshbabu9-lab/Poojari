import React, { useEffect, useState } from 'react';
import { OrderBooking, OrderStatus } from '../types';
import { advanceOrderStatus, getSavedOrders, saveOrders } from '../services/orderService';
import { notificationManager } from '../services/notificationService';
import { 
  X, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  PackageCheck, 
  Bike, 
  Sparkles, 
  ChevronRight,
  ShieldAlert,
  Search,
  RefreshCw,
  Bell
} from 'lucide-react';

interface OrderTrackingModalProps {
  initialOrder: OrderBooking | null;
  onClose: () => void;
  lang?: 'te' | 'en';
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  initialOrder,
  onClose,
  lang = 'te'
}) => {
  const [currentOrder, setCurrentOrder] = useState<OrderBooking | null>(initialOrder);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  // If no initial order, grab latest from storage
  useEffect(() => {
    if (!currentOrder) {
      const orders = getSavedOrders();
      if (orders.length > 0) {
        setCurrentOrder(orders[0]);
      }
    }
  }, [currentOrder]);

  const handleSearch = () => {
    setSearchError('');
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const orders = getSavedOrders();
    const found = orders.find(o => 
      o.id.toLowerCase() === query || 
      o.mobile.includes(query) ||
      o.customerName.toLowerCase().includes(query)
    );

    if (found) {
      setCurrentOrder(found);
      setSearchQuery('');
    } else {
      setSearchError(lang === 'te' 
        ? 'ఆర్డర్ లభించలేదు. దయచేసి సరైన బుకింగ్ ID లేదా మొబైల్ నంబర్ ఇవ్వండి.' 
        : 'Order not found. Please check Booking ID or mobile number.');
    }
  };

  const handleNextStage = () => {
    if (!currentOrder) return;
    setIsSimulating(true);

    const updated = advanceOrderStatus(currentOrder.id);
    if (updated) {
      setCurrentOrder(updated);

      const statusMap: Record<OrderStatus, { titleTe: string; titleEn: string; bodyTe: string; bodyEn: string }> = {
        placed: {
          titleTe: 'బుకింగ్ నమోదయింది! 🙏',
          titleEn: 'Order Placed! 🙏',
          bodyTe: 'మీ కార్తీక పూజా కిట్ బుకింగ్ విజయవంతమైంది.',
          bodyEn: 'Your booking has been received at the sanctum.'
        },
        confirmed: {
          titleTe: 'ఆశీస్సులతో ధృవీకరించబడింది! 🌿',
          titleEn: 'Blessed & Confirmed! 🌿',
          bodyTe: 'పూజా ద్రవ్యాలు మరియు బిల్వపత్రాలు పూజారి గారి పర్యవేక్షణలో సిద్ధమవుతున్నాయి.',
          bodyEn: 'Pooja samagri & fresh Bilva leaves allocated for your ritual.'
        },
        packing: {
          titleTe: 'పవిత్ర ప్యాకింగ్ పూర్తయింది! 📦',
          titleEn: 'Sacred Packing Done! 📦',
          bodyTe: 'ఎకో బాక్సులో మట్టి ప్రమిదలు, అగరబత్తీలు మరియు పూలు భద్రపరచబడ్డాయి.',
          bodyEn: 'Clay lamps, wicks and flowers packed in clean eco box.'
        },
        out_for_delivery: {
          titleTe: 'పూజా సేవక్ బయలుదేరారు! 🛵',
          titleEn: 'Out for Delivery! 🛵',
          bodyTe: 'సేవక్ రాజేష్ శర్మ మీ ఇంటికి కిట్ తీసుకొస్తున్నారు. ETA 15 నిమిషాలు.',
          bodyEn: 'Delivery Sevak Rajesh Sharma is en route to your doorstep.'
        },
        delivered: {
          titleTe: 'పూజా సామాగ్రి చేరింది! 🪔',
          titleEn: 'Delivered at Doorstep! 🪔',
          bodyTe: 'మీ కార్తీక పూజా కిట్ సగౌరవంగా అందజేయబడింది. శుభం భూయాత్!',
          bodyEn: 'Pooja kit delivered for your auspicious Karthika Deeparadhana!'
        }
      };

      const s = statusMap[updated.orderStatus];
      notificationManager.notify(
        lang === 'te' ? s.titleTe : s.titleEn,
        lang === 'te' ? s.bodyTe : s.bodyEn,
        { type: 'order', orderId: updated.id }
      );
    }

    setTimeout(() => setIsSimulating(false), 400);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-5 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[#fffbf2] max-w-2xl w-full rounded-3xl border-2 border-[#d9a64e] p-5 md:p-7 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8c331a] hover:text-[#521a0c] p-1.5 rounded-full hover:bg-amber-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4 border-b border-amber-200">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 border border-emerald-300 text-emerald-900 px-3 py-0.5 rounded-full text-xs font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>{lang === 'te' ? 'రియల్-టైమ్ డెలివరీ ట్రాకింగ్' : 'Real-Time Live Delivery Tracking'}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#72210c] font-cinzel">
            {currentOrder 
              ? (lang === 'te' ? `ఆర్డర్ #${currentOrder.id} ట్రాకింగ్` : `Order #${currentOrder.id} Live Status`)
              : (lang === 'te' ? 'ఆర్డర్ ట్రాక్ చేయండి' : 'Track Your Order')}
          </h2>
          {currentOrder && (
            <p className="text-xs text-[#754e32] mt-0.5">
              {lang === 'te' ? 'ఎంచుకున్న కిట్:' : 'Kit:'} <strong>{currentOrder.kitName}</strong> • {lang === 'te' ? 'మొత్తం:' : 'Total:'} <strong>₹{currentOrder.total}</strong>
            </p>
          )}
        </div>

        {/* Order Search Bar */}
        <div className="my-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={lang === 'te' ? 'బుకింగ్ ID (ఉదా: KM-...) లేదా మొబైల్ నంబర్...' : 'Search by Booking ID or Mobile...'}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#d8c5b3] text-xs md:text-sm bg-white"
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 rounded-xl bg-[#872e12] hover:bg-[#6c230c] text-white font-bold text-xs md:text-sm transition-colors"
            >
              {lang === 'te' ? 'శోధించండి' : 'Search'}
            </button>
          </div>
          {searchError && (
            <p className="text-xs text-red-600 mt-1">{searchError}</p>
          )}
        </div>

        {currentOrder ? (
          <div className="space-y-5">
            {/* Live Interactive Map Simulation */}
            <div className="relative w-full h-44 md:h-52 rounded-2xl overflow-hidden border-2 border-[#d9a64e]/60 bg-[#e5efe5] shadow-inner">
              {/* Stylized Vector Map Background */}
              <div className="absolute inset-0 opacity-40">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#b2cbb2" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  {/* Curving River / Road */}
                  <path d="M 0,140 Q 150,60 300,120 T 600,80" fill="none" stroke="#c0d7c0" strokeWidth="24" />
                  <path d="M 50,180 Q 250,150 450,20 T 650,40" fill="none" stroke="#ffffff" strokeWidth="6" />
                </svg>
              </div>

              {/* Origin: Temple Distribution Hub */}
              <div className="absolute left-6 top-8 bg-[#872e12] text-amber-200 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md flex items-center gap-1 border border-amber-300/40">
                <span>🛕</span>
                <span>{lang === 'te' ? 'దేవస్థాన కేంద్రం' : 'Sanctum Hub'}</span>
              </div>

              {/* Destination: Devotee Home */}
              <div className="absolute right-6 bottom-8 bg-[#1e4620] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md flex items-center gap-1 border border-emerald-300/40">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{currentOrder.customerName || (lang === 'te' ? 'భక్తుని గృహం' : 'Your Home')}</span>
              </div>

              {/* Delivery Partner Pin (Position adjusts based on order state) */}
              <div 
                className={`absolute transition-all duration-700 ease-out flex flex-col items-center z-10 ${
                  currentOrder.orderStatus === 'placed' ? 'left-[15%] top-[30%]' :
                  currentOrder.orderStatus === 'confirmed' ? 'left-[30%] top-[40%]' :
                  currentOrder.orderStatus === 'packing' ? 'left-[45%] top-[50%]' :
                  currentOrder.orderStatus === 'out_for_delivery' ? 'left-[70%] top-[60%]' :
                  'right-8 bottom-12'
                }`}
              >
                <div className="bg-[#b3431e] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-white flex items-center gap-1 mb-1 whitespace-nowrap animate-bounce">
                  <Bike className="w-3.5 h-3.5 text-amber-200" />
                  <span>
                    {currentOrder.orderStatus === 'delivered'
                      ? (lang === 'te' ? 'చేరింది (Arrived)' : 'Arrived')
                      : (lang === 'te' ? 'సేవక్ మార్గంలో ఉన్నారు' : 'Sevak En Route')}
                  </span>
                </div>
                <div className="w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-white shadow-md"></div>
              </div>

              {/* Live Distance & ETA badge */}
              <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-gray-300 shadow-sm text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {currentOrder.orderStatus === 'delivered' 
                    ? (lang === 'te' ? 'డెలివరీ పూర్తయింది' : 'Delivered') 
                    : (lang === 'te' ? 'అంచనా: 18-25 నిమిషాలు' : 'ETA: 18-25 Mins')}
                </span>
              </div>
            </div>

            {/* Delivery Sevak Card */}
            {currentOrder.deliveryPartner && (
              <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#ebd7be] shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#872e12] to-[#c27a24] text-white flex items-center justify-center font-bold text-base shadow-sm">
                    🪔
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-[#5c1c0a]">
                      {currentOrder.deliveryPartner.name}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      {currentOrder.deliveryPartner.vehicle} • ★ {currentOrder.deliveryPartner.rating} ({lang === 'te' ? 'ధృవీకరించబడిన సేవక్' : 'Verified'})
                    </p>
                  </div>
                </div>

                <a
                  href={`tel:${currentOrder.deliveryPartner.phone}`}
                  className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-300 flex items-center gap-1.5 text-xs font-bold transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">{lang === 'te' ? 'కాల్ చేయండి' : 'Call Sevak'}</span>
                </a>
              </div>
            )}

            {/* Stepper Timeline */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                {lang === 'te' ? 'డెలివరీ పురోగతి (Live Timeline):' : 'Delivery Milestones:'}
              </h4>
              <div className="space-y-2.5">
                {currentOrder.timeline.map((step, idx) => {
                  return (
                    <div
                      key={step.status}
                      className={`flex items-start gap-3 p-2.5 rounded-xl border text-xs transition-all ${
                        step.current
                          ? 'bg-amber-100/90 border-[#912d13] font-semibold shadow-xs'
                          : step.completed
                          ? 'bg-white border-emerald-200 text-gray-800'
                          : 'bg-gray-50 border-gray-200 text-gray-400 opacity-70'
                      }`}
                    >
                      <div className="mt-0.5">
                        {step.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${step.current ? 'text-[#872e12]' : 'text-gray-800'}`}>
                            {lang === 'te' ? step.titleTe : step.titleEn}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium">{step.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                          {lang === 'te' ? step.descriptionTe : step.descriptionEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons: Next Stage Demo Simulator & Close */}
            <div className="pt-3 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                disabled={isSimulating || currentOrder.orderStatus === 'delivered'}
                onClick={handleNextStage}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-[#872e12] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                <span>
                  {currentOrder.orderStatus === 'delivered'
                    ? (lang === 'te' ? 'ఆర్డర్ పూర్తయింది' : 'Delivery Complete')
                    : (lang === 'te' ? 'తదుపరి దశను చూడండి (Simulate Next Stage)' : 'Advance Delivery Stage')}
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-[#872e12] hover:bg-[#6e220a] text-white font-bold text-xs shadow-md transition-colors"
              >
                {lang === 'te' ? 'మూసివేయండి' : 'Done'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <PackageCheck className="w-12 h-12 mx-auto text-amber-300 mb-2" />
            <p className="text-sm">
              {lang === 'te' 
                ? 'ప్రస్తుతం యాక్టివ్ ఆర్డర్ ఏదీ లేదు. దయచేసి పైన కిట్ బుక్ చేయండి.' 
                : 'No active orders found. Please book a pooja kit above.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
