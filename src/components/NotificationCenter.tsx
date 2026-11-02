import React, { useState, useEffect } from 'react';
import { AppNotification } from '../types';
import { notificationManager } from '../services/notificationService';
import { Bell, CheckCheck, Trash2, X, Sparkles, Volume2 } from 'lucide-react';

interface NotificationCenterProps {
  onOpenOrder: (orderId?: string) => void;
  lang?: 'te' | 'en';
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onOpenOrder, lang = 'te' }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    setHasPermission(notificationManager.hasPermission());
    const unsubscribe = notificationManager.subscribe((list) => {
      setNotifications(list);
    });
    return () => unsubscribe();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRequestPermission = async () => {
    const perm = await notificationManager.requestPermission();
    if (perm === 'granted') {
      setHasPermission(true);
      notificationManager.notify(
        lang === 'te' ? 'పుష్ నోటిఫికేషన్లు ప్రారంభించబడ్డాయి! 🔔' : 'Push Notifications Enabled! 🔔',
        lang === 'te' ? 'మీ పూజా కిట్ డెలివరీ అప్‌డేట్స్ మీకు సకాలంలో అందుతాయి.' : 'You will receive timely updates on your pooja kit delivery.'
      );
    }
  };

  const handleToggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState && unreadCount > 0) {
      notificationManager.markAllAsRead();
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon Trigger */}
      <button
        onClick={handleToggleOpen}
        aria-label="Notifications"
        className="relative p-2 rounded-full bg-[#3d140a]/80 hover:bg-[#571c0d] text-amber-200 border border-[#d9a64e]/50 transition-colors shadow-md flex items-center justify-center"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white font-extrabold text-[11px] flex items-center justify-center border-2 border-[#170805]">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Drawer */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 md:w-96 bg-[#fffaf1] border-2 border-[#d9a64e] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#50170a] to-[#8c3116] p-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-xs md:text-sm text-amber-200">
              <Bell className="w-4 h-4" />
              <span>{lang === 'te' ? 'నోటిఫికేషన్లు (Updates)' : 'Notifications & Alerts'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => notificationManager.clearAll()}
                title="Clear all"
                className="text-amber-200/80 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-amber-200/80 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Browser Notification Banner if not granted */}
          {!hasPermission && (
            <div className="bg-amber-100 p-2.5 border-b border-amber-200 flex items-center justify-between text-[11px]">
              <span className="text-[#6d2511] font-semibold">
                {lang === 'te' ? 'డెలివరీ అప్‌డేట్స్ కోసం నోటిఫికేషన్లు ఆన్ చేయండి' : 'Enable alerts for live delivery status'}
              </span>
              <button
                onClick={handleRequestPermission}
                className="px-2 py-1 bg-[#8c3116] text-white rounded font-bold text-[10px] hover:bg-[#68220d]"
              >
                {lang === 'te' ? 'ఆన్ చేయండి' : 'Enable'}
              </button>
            </div>
          )}

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-amber-100">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">
                {lang === 'te' ? 'నోటిఫికేషన్లు ఏవీ లేవు' : 'No new notifications'}
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    if (n.orderId) {
                      onOpenOrder(n.orderId);
                      setIsOpen(false);
                    }
                  }}
                  className={`p-3 text-xs hover:bg-amber-50/80 transition-colors cursor-pointer ${
                    !n.read ? 'bg-amber-50/50 font-semibold' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="font-bold text-[#74230e] text-[11px] md:text-xs">
                      {n.title}
                    </span>
                    <span className="text-[10px] text-gray-400 font-normal">{n.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-[#55331f] leading-snug">{n.body}</p>
                  {n.orderId && (
                    <span className="text-[10px] text-amber-700 underline font-bold mt-1 inline-block">
                      {lang === 'te' ? 'ఆర్డర్ లైవ్ ట్రాకింగ్ చూడండి →' : 'View Live Order Tracking →'}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
