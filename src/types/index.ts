export interface PoojaItem {
  id: string;
  nameTe: string;
  nameEn: string;
  qty: string;
  icon: string;
  significanceTe?: string;
  significanceEn?: string;
}

export interface PoojaKit {
  id: string;
  nameTe: string;
  nameEn: string;
  price: number;
  originalPrice: number;
  badgeTe: string;
  badgeEn: string;
  descriptionTe: string;
  descriptionEn: string;
  icon: string;
  highlightTe: string;
  highlightEn: string;
  items: PoojaItem[];
}

export type OrderStatus = 'placed' | 'confirmed' | 'packing' | 'out_for_delivery' | 'delivered';

export interface TrackingStep {
  status: OrderStatus;
  titleTe: string;
  titleEn: string;
  descriptionTe: string;
  descriptionEn: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface DeliveryPartner {
  name: string;
  phone: string;
  vehicle: string;
  rating: number;
  photoUrl?: string;
  currentLocationName: string;
}

export interface OrderBooking {
  id: string;
  customerName: string;
  mobile: string;
  address: string;
  city: string;
  pincode: string;
  kitId: string;
  kitName: string;
  price: number;
  quantity: number;
  total: number;
  paymentMethod: 'WhatsApp' | 'Cash on Delivery' | 'UPI' | 'Card / NetBanking';
  paymentStatus: 'pending' | 'paid' | 'cod_verified';
  orderStatus: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  deliverySlot: string;
  deliveryPartner?: DeliveryPartner;
  timeline: TrackingStep[];
  currentStepIndex: number;
}

export interface DevoteeReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  verified: boolean;
  commentTe: string;
  commentEn: string;
  kitBought: string;
  helpfulCount: number;
  tags: string[];
}

export interface KarthikaDay {
  day: number;
  dateStr: string;
  dayOfWeek: string;
  isMonday: boolean;
  isPournami: boolean;
  isEkadashi: boolean;
  isDwadasi: boolean;
  titleTe: string;
  titleEn: string;
  ritualsTe: string;
  ritualsEn: string;
  muhurtham: string;
  tithi: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'ritual' | 'offer';
  orderId?: string;
}
