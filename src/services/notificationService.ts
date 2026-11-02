import { AppNotification } from '../types';
import { templeAudio } from '../utils/audio';

const NOTIFICATIONS_STORAGE_KEY = 'karthika_app_notifications_v1';

export class NotificationManager {
  private listeners: Array<(notifications: AppNotification[]) => void> = [];

  constructor() {
    this.ensureDefaultWelcome();
  }

  private ensureDefaultWelcome() {
    const list = this.getNotifications();
    if (list.length === 0) {
      const welcome: AppNotification = {
        id: 'notif-welcome',
        title: 'కార్తీక మాస శుభాకాంక్షలు! 🙏',
        body: 'కార్తీక సోమవారాల పూజా కిట్లు మరియు దీపోత్సవ సామాగ్రి బుకింగ్స్ ప్రారంభమయ్యాయి.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        type: 'ritual'
      };
      this.saveNotifications([welcome]);
    }
  }

  public getNotifications(): AppNotification[] {
    try {
      const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveNotifications(list: AppNotification[]) {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
      this.listeners.forEach(fn => fn(list));
    } catch (err) {
      console.error('Failed to save notifications', err);
    }
  }

  public subscribe(fn: (notifications: AppNotification[]) => void): () => void {
    this.listeners.push(fn);
    fn(this.getNotifications());
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }
    if (Notification.permission === 'granted') {
      return 'granted';
    }
    try {
      const perm = await Notification.requestPermission();
      return perm;
    } catch {
      return 'denied';
    }
  }

  public hasPermission(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  }

  public notify(title: string, body: string, options?: { type?: 'order' | 'ritual' | 'offer'; orderId?: string }) {
    // 1. Play auditory chime
    templeAudio.playNotificationChime();

    // 2. Fire browser native push notification if permitted
    if (this.hasPermission()) {
      try {
        new Notification(title, {
          body,
          icon: 'https://images.unsplash.com/photo-1609358905581-e50882d96695?w=128&auto=format&fit=crop&q=80',
          badge: 'https://images.unsplash.com/photo-1609358905581-e50882d96695?w=64&auto=format&fit=crop&q=80',
          vibrate: [200, 100, 200]
        } as NotificationOptions);
      } catch (err) {
        console.warn('Native push notification error', err);
      }
    }

    // 3. Store in internal notification center
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title,
      body,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: options?.type || 'order',
      orderId: options?.orderId
    };

    const current = this.getNotifications();
    this.saveNotifications([newNotif, ...current]);
  }

  public markAllAsRead() {
    const current = this.getNotifications().map(n => ({ ...n, read: true }));
    this.saveNotifications(current);
  }

  public clearAll() {
    this.saveNotifications([]);
  }
}

export const notificationManager = new NotificationManager();
