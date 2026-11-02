import React from 'react';
import { Phone, MapPin, Mail, MessageCircle, Heart } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../services/orderService';

interface FooterProps {
  lang?: 'te' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ lang = 'te' }) => {
  return (
    <footer className="bg-[#240c06] text-[#ffd996] pt-12 pb-8 border-t-4 border-[#d9a64e]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#4d1f11] text-xs md:text-sm">
          {/* Column 1: Divine Blessing & About */}
          <div>
            <div className="text-xl font-black text-[#ffeaad] font-cinzel mb-2 flex items-center gap-2">
              <span>🪔</span>
              <span>{lang === 'te' ? 'కార్తీక మాస పూజా కిట్' : 'Karthika Masam Kit'}</span>
            </div>
            <p className="text-amber-200/80 leading-relaxed">
              {lang === 'te'
                ? 'కార్తీక సోమవారాలు మరియు పౌర్ణమి దీపోత్సవాలలో భక్తులందరికీ స్వచ్ఛమైన, పరిశుద్ధమైన పూజా ద్రవ్యాలను సకాలంలో వారి ఇంటి వద్దకే చేరవేస్తున్నాం.'
                : 'Dedicated to delivering fresh bilva patra, clay lamps, pure ghee and authentic samagri right to your doorstep for blessed worship.'}
            </p>
            <div className="mt-3 text-amber-300 font-bold text-sm tracking-wide">
              ॥ సర్వే జనాః సుఖినో భవంతు ॥
            </div>
          </div>

          {/* Column 2: Delivery Hubs in AP & TS */}
          <div>
            <h4 className="text-sm font-bold text-[#ffeaad] uppercase tracking-wider mb-2.5">
              {lang === 'te' ? 'డెలివరీ ప్రాంతాలు (Service Hubs)' : 'Delivery Coverage'}
            </h4>
            <ul className="space-y-1.5 text-amber-200/80">
              <li>• Hyderabad & Secunderabad (Express 35m)</li>
              <li>• Vijayawada, Guntur & Tenali</li>
              <li>• Visakhapatnam & Vizianagaram</li>
              <li>• Rajahmundry & Kakinada</li>
              <li>• Tirupati, Nellore & Kurnool</li>
              <li>• Warangal, Karimnagar & Nizamabad</li>
            </ul>
          </div>

          {/* Column 3: Contact & Temple Seva Support */}
          <div>
            <h4 className="text-sm font-bold text-[#ffeaad] uppercase tracking-wider mb-2.5">
              {lang === 'te' ? 'సేవ & సంప్రదింపులు (Seva Helpdesk)' : 'Help & Devotee Support'}
            </h4>
            <div className="space-y-2 text-amber-200/80">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>+91 9640467264 (24/7 Karthika Seva)</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline text-emerald-300"
                >
                  WhatsApp: +91 9640467264
                </a>
              </div>
              <div className="flex items-start gap-2 mt-1">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span>Sri Shiva Sanctum Seva Complex, Somajiguda / MG Road, AP & TS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-300/70 gap-2">
          <p>© 2026 Karthika Masam Pooja Kit Delivery. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>{lang === 'te' ? 'శివ భక్తితో సమర్పితం' : 'Crafted with devotion for Shiva Bhaktas'}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
