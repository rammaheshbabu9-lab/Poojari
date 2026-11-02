import { OrderBooking, OrderStatus, TrackingStep } from '../types';

export const SUPABASE_URL = "https://eaowxilhfzyukzetgqxo.supabase.co";
export const SUPABASE_KEY = "sb_publishable_Z3xsADypaOjX8GEQEOLUdg_vbxynHRx";
export const WHATSAPP_NUMBER = "919640467264";

const STORAGE_KEY = 'karthika_pooja_orders_v2';
const ACTIVE_ORDER_ID_KEY = 'karthika_active_order_id_v2';

export const ORDER_STAGES: Array<{ status: OrderStatus; titleTe: string; titleEn: string; descTe: string; descEn: string }> = [
  {
    status: 'placed',
    titleTe: 'బుకింగ్ పూర్తయింది (Order Placed)',
    titleEn: 'Order Placed & Registered',
    descTe: 'మీ పూజా కిట్ బుకింగ్ వివరాలు నమోదయ్యాయి.',
    descEn: 'Your booking has been received and verified by temple seva center.'
  },
  {
    status: 'confirmed',
    titleTe: 'ఆమోదించబడింది (Blessed & Confirmed)',
    titleEn: 'Sanctum Confirmed & Blessed',
    descTe: 'పూజా ద్రవ్యాలు మరియు తాజా పూలు సేకరించబడుతున్నాయి.',
    descEn: 'Sacred samagri and fresh Bilva leaves allocated for your ritual.'
  },
  {
    status: 'packing',
    titleTe: 'పవిత్ర ప్యాకింగ్ (Sacred Eco Packing)',
    titleEn: 'Packing with Fresh Bilva & Flowers',
    descTe: 'ఎకో-ఫ్రెండ్లీ పవిత్ర బాక్సులో తాజా వస్తువులతో భద్రపరచబడింది.',
    descEn: 'Clay diyas and wicks packed with ritual cleanliness and hygiene.'
  },
  {
    status: 'out_for_delivery',
    titleTe: 'డెలివరీలో ఉంది (Out for Delivery)',
    titleEn: 'Out for Delivery by Pooja Sevak',
    descTe: 'మీ స్థానిక సేవా ప్రతినిధి ద్వారా మీ ఇంటికి తీసుకువస్తున్నారు.',
    descEn: 'Dedicated temple delivery sevak is en-route to your doorstep.'
  },
  {
    status: 'delivered',
    titleTe: 'అందజేయబడింది (Delivered with Blessings)',
    titleEn: 'Delivered at Doorstep',
    descTe: 'పూజా సామాగ్రి మీ పూజా మందిరానికి సగౌరవంగా చేరింది. ఓం నమః శివాయ!',
    descEn: 'Kit handed over for your auspicious Karthika Deeparadhana!'
  }
];

export function buildTimeline(currentStatus: OrderStatus, baseTime: Date = new Date()): TrackingStep[] {
  const currentIndex = ORDER_STAGES.findIndex(s => s.status === currentStatus);
  return ORDER_STAGES.map((stage, idx) => {
    const stepTime = new Date(baseTime.getTime() + idx * 8 * 60 * 1000);
    const timeString = stepTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return {
      status: stage.status,
      titleTe: stage.titleTe,
      titleEn: stage.titleEn,
      descriptionTe: stage.descTe,
      descriptionEn: stage.descEn,
      timestamp: timeString,
      completed: idx <= currentIndex,
      current: idx === currentIndex
    };
  });
}

// Get all stored orders
export function getSavedOrders(): OrderBooking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Save orders list
export function saveOrders(orders: OrderBooking[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save orders to localStorage', err);
  }
}

// Get the latest active order ID
export function getActiveOrderId(): string | null {
  return localStorage.getItem(ACTIVE_ORDER_ID_KEY);
}

export function setActiveOrderId(id: string) {
  localStorage.setItem(ACTIVE_ORDER_ID_KEY, id);
}

// Create a new order booking and post to Supabase
export async function createOrderBooking(params: {
  customerName: string;
  mobile: string;
  address: string;
  city?: string;
  pincode?: string;
  kitId: string;
  kitName: string;
  price: number;
  quantity: number;
  paymentMethod: OrderBooking['paymentMethod'];
  deliverySlot?: string;
}): Promise<{ success: boolean; order: OrderBooking; error?: string }> {
  const bookingId = 'KM-' + Math.floor(100000 + Math.random() * 900000);
  const now = new Date();
  const total = params.price * params.quantity;
  const initialStatus: OrderStatus = 'placed';

  const newOrder: OrderBooking = {
    id: bookingId,
    customerName: params.customerName,
    mobile: params.mobile,
    address: params.address,
    city: params.city || 'Hyderabad / Andhra Pradesh',
    pincode: params.pincode || '500001',
    kitId: params.kitId,
    kitName: params.kitName,
    price: params.price,
    quantity: params.quantity,
    total: total,
    paymentMethod: params.paymentMethod,
    paymentStatus: params.paymentMethod === 'Cash on Delivery' ? 'cod_verified' : (params.paymentMethod === 'WhatsApp' ? 'pending' : 'paid'),
    orderStatus: initialStatus,
    createdAt: now.toISOString(),
    estimatedDelivery: '30-45 నిమిషాలు (Express 35m)',
    deliverySlot: params.deliverySlot || 'కార్తీక శుభ ముహూర్తం (Immediate Express)',
    deliveryPartner: {
      name: 'రాజేష్ శర్మ (Rajesh Sharma - Temple Sevak)',
      phone: '+91 98490 23456',
      vehicle: 'TVS Jupiter (Eco Delivery)',
      rating: 4.95,
      currentLocationName: 'Somajiguda Temple Distribution Hub'
    },
    timeline: buildTimeline(initialStatus, now),
    currentStepIndex: 0
  };

  // Sync to Supabase table `pooja_bookings` (exact schema from user's snippet)
  try {
    const supabasePayload = {
      name: params.customerName,
      mobile: params.mobile,
      address: params.address,
      kit: params.kitName,
      price: params.price,
      quantity: params.quantity,
      payment_method: params.paymentMethod
    };

    fetch(SUPABASE_URL + '/rest/v1/pooja_bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(supabasePayload)
    }).catch(err => {
      console.warn('Background Supabase sync warning:', err);
    });
  } catch (err) {
    console.warn('Supabase post failed, local persistence maintained', err);
  }

  // Update local storage
  const existing = getSavedOrders();
  saveOrders([newOrder, ...existing]);
  setActiveOrderId(bookingId);

  return { success: true, order: newOrder };
}

// Progress an order's status (for real-time simulation)
export function advanceOrderStatus(orderId: string): OrderBooking | null {
  const orders = getSavedOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) return null;

  const currentOrder = orders[index];
  const orderSteps: OrderStatus[] = ['placed', 'confirmed', 'packing', 'out_for_delivery', 'delivered'];
  const currentIndex = orderSteps.indexOf(currentOrder.orderStatus);

  if (currentIndex < orderSteps.length - 1) {
    const nextStatus = orderSteps[currentIndex + 1];
    const updated: OrderBooking = {
      ...currentOrder,
      orderStatus: nextStatus,
      currentStepIndex: currentIndex + 1,
      timeline: buildTimeline(nextStatus, new Date(currentOrder.createdAt))
    };
    orders[index] = updated;
    saveOrders(orders);
    return updated;
  }
  return currentOrder;
}

// Format WhatsApp URL
export function generateWhatsAppUrl(order: OrderBooking): string {
  const text = 
    `🪔 *కార్తీక మాస పూజా కిట్ బుకింగ్* 🪔\n` +
    `--------------------------------\n` +
    `🔖 *Booking ID:* ${order.id}\n` +
    `👤 *Name:* ${order.customerName}\n` +
    `📞 *Mobile:* ${order.mobile}\n` +
    `📍 *Delivery Address:* ${order.address}\n` +
    `📦 *Kit Selected:* ${order.kitName}\n` +
    `🔢 *Quantity:* ${order.quantity}\n` +
    `💰 *Total Amount:* ₹${order.total}\n` +
    `💳 *Payment Method:* ${order.paymentMethod}\n` +
    `⏰ *Slot:* ${order.deliverySlot}\n` +
    `--------------------------------\n` +
    `🙏 ఓం నమః శివాయ! దయచేసి ఆర్డర్ నిర్ధారించండి.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
