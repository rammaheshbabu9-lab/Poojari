import React, { useState, useEffect } from 'react';
import { DevoteeReview } from '../types';
import { INITIAL_REVIEWS } from '../data/mockData';
import { 
  Star, 
  ThumbsUp, 
  CheckCircle2, 
  MessageSquarePlus, 
  Sparkles, 
  X, 
  ShieldCheck, 
  Award,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';

const REVIEWS_STORAGE_KEY = 'karthika_devotee_reviews_v1';

interface ReviewsSectionProps {
  lang?: 'te' | 'en';
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ lang = 'te' }) => {
  const [reviews, setReviews] = useState<DevoteeReview[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Form states
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [commentTe, setCommentTe] = useState('');
  const [kitBought, setKitBought] = useState('Regular Pooja Kit - ₹99');
  const [formTag, setFormTag] = useState('Fresh Flowers');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (stored) {
        setReviews(JSON.parse(stored));
      } else {
        setReviews(INITIAL_REVIEWS);
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
      }
    } catch {
      setReviews(INITIAL_REVIEWS);
    }
  }, []);

  const handleHelpful = (id: string) => {
    const updated = reviews.map(r => {
      if (r.id === id) {
        return { ...r, helpfulCount: r.helpfulCount + 1 };
      }
      return r;
    });
    setReviews(updated);
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !commentTe.trim()) return;

    const newRev: DevoteeReview = {
      id: 'rev-' + Date.now(),
      author: author.trim(),
      location: location.trim() || 'Andhra Pradesh / Telangana',
      rating,
      date: lang === 'te' ? 'కార్తీక మాసం' : 'Karthika Masam',
      verified: true,
      commentTe: commentTe.trim(),
      commentEn: commentTe.trim(),
      kitBought,
      helpfulCount: 1,
      tags: [formTag]
    };

    const nextList = [newRev, ...reviews];
    setReviews(nextList);
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(nextList));
    } catch {}

    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {}

    setIsWriteModalOpen(false);
    setAuthor('');
    setLocation('');
    setCommentTe('');
  };

  const filteredReviews = activeFilter === 'all'
    ? reviews
    : reviews.filter(r => r.tags.some(t => t.toLowerCase().includes(activeFilter.toLowerCase())));

  return (
    <section className="my-10 bg-white/90 rounded-3xl border-2 border-[#ebd1a7] p-5 md:p-8 shadow-xl">
      {/* Section Header with Trust Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#f0dfc6]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#872e12] bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span>{lang === 'te' ? 'భక్తుల విశ్వసనీయత & అనుభవాలు' : 'Customer Trust & Devotee Reviews'}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#6d1b09] font-cinzel">
            {lang === 'te' ? 'భక్తుల దివ్య అనుభవాలు & రేటింగ్స్' : 'Devotee Reviews & Praise'}
          </h2>
          <p className="text-xs md:text-sm text-[#734b2f] mt-1">
            {lang === 'te' 
              ? 'ఆంధ్రప్రదేశ్ మరియు తెలంగాణ వ్యాప్తంగా 50,000+ కుటుంబాల నమ్మకం.' 
              : 'Trusted by over 50,000+ households across AP & Telangana for holy Karthika Deeparadhana.'}
          </p>
        </div>

        {/* Rating Score Card */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-amber-50 to-[#fff8ea] p-3.5 rounded-2xl border border-amber-200 shadow-2xs">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-[#872e12]">4.9</div>
            <div className="flex text-amber-500 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[10px] text-gray-500 font-medium">1,480+ Reviews</span>
          </div>

          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#872e12] to-[#b3431e] hover:from-[#6d220a] hover:to-[#913212] text-white font-bold text-xs md:text-sm flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{lang === 'te' ? 'మీ అనుభవాన్ని రాయండి' : 'Write Review'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="my-5 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-gray-500 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" />
          {lang === 'te' ? 'ఫిల్టర్:' : 'Filter:'}
        </span>
        {[
          { id: 'all', labelTe: 'అన్నీ (All)', labelEn: 'All' },
          { id: 'early morning', labelTe: 'ప్రాతఃకాల డెలివరీ', labelEn: 'Early Morning' },
          { id: 'fresh flowers', labelTe: 'తాజా పుష్పాలు', labelEn: 'Fresh Flowers' },
          { id: 'bilva leaves', labelTe: 'బిల్వపత్రాలు', labelEn: 'Bilva Leaves' },
          { id: '3d sanctum', labelTe: '3D దర్శనం', labelEn: '3D Sanctum' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`py-1.5 px-3 rounded-xl font-medium transition-colors ${
              activeFilter === filter.id
                ? 'bg-[#872e12] text-white font-bold shadow-xs'
                : 'bg-amber-50/80 text-[#683f25] hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            {lang === 'te' ? filter.labelTe : filter.labelEn}
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-4 md:p-5 rounded-2xl bg-[#fffdfa] border border-[#ebd8bc] shadow-xs flex flex-col justify-between hover:border-amber-400 transition-colors"
          >
            <div>
              {/* Reviewer Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-[#631e0c] flex items-center gap-1.5">
                    <span>{rev.author}</span>
                    {rev.verified && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {lang === 'te' ? 'ధృవీకరించబడింది' : 'Verified'}
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-gray-500">{rev.location} • {rev.date}</p>
                </div>

                {/* Stars */}
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Kit Badge */}
              <div className="text-[11px] font-semibold text-[#872e12] bg-amber-50/80 px-2 py-0.5 rounded inline-block mb-2 border border-amber-200/60">
                📦 {rev.kitBought}
              </div>

              {/* Comment */}
              <p className="text-xs md:text-sm text-[#4d2c18] leading-relaxed">
                "{lang === 'te' ? rev.commentTe : rev.commentEn}"
              </p>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {rev.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Helpful Counter Button */}
            <div className="mt-4 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="text-[11px]">
                {lang === 'te' ? 'ఈ సమీక్ష మీకు ఉపయోగపడిందా?' : 'Was this review helpful?'}
              </span>
              <button
                type="button"
                onClick={() => handleHelpful(rev.id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#872e12] hover:text-[#571b09] px-2 py-1 rounded-lg hover:bg-amber-50 transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{rev.helpfulCount}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Modal */}
      {isWriteModalOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsWriteModalOpen(false)}
        >
          <div 
            className="bg-[#fff9ef] max-w-lg w-full rounded-2xl border-2 border-[#d9a64e] p-6 shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute top-4 right-4 text-[#8c331a] hover:text-[#521a0c] p-1 rounded-full hover:bg-amber-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center pb-3 border-b border-amber-200">
              <span className="text-3xl">🙏</span>
              <h3 className="text-lg md:text-xl font-bold text-[#7a2a14] mt-1 font-cinzel">
                {lang === 'te' ? 'మీ దివ్య అనుభవాన్ని నమోదు చేయండి' : 'Share Your Devotee Experience'}
              </h3>
              <p className="text-xs text-amber-800">
                {lang === 'te' ? 'ఇతర భక్తులకు మీ సూచనలు మార్గదర్శకంగా నిలుస్తాయి' : 'Your review guides thousands of fellow devotees'}
              </p>
            </div>

            <form onSubmit={handleAddReview} className="mt-4 space-y-3 text-xs md:text-sm">
              <div>
                <label className="block text-xs font-bold text-[#4d2813] mb-1">
                  {lang === 'te' ? 'మీ పేరు *' : 'Your Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  placeholder="e.g. రాఘవేంద్ర రావు / Raghavendra Rao"
                  className="w-full px-3 py-2 rounded-xl border border-[#d8c5b3] bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4d2813] mb-1">
                  {lang === 'te' ? 'మీ ఊరు / ప్రాంతం' : 'City / Location'}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Hyderabad, Madhapur"
                  className="w-full px-3 py-2 rounded-xl border border-[#d8c5b3] bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4d2813] mb-1">
                  {lang === 'te' ? 'రేటింగ్ ఎంచుకోండి:' : 'Select Star Rating:'}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(starNum => (
                    <button
                      key={starNum}
                      type="button"
                      onClick={() => setRating(starNum)}
                      className="p-1.5 rounded hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          starNum <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4d2813] mb-1">
                  {lang === 'te' ? 'మీ సమీక్ష / అనుభవం *' : 'Your Review & Feedback *'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={commentTe}
                  onChange={e => setCommentTe(e.target.value)}
                  placeholder={lang === 'te' ? 'సామాగ్రి నాణ్యత, డెలివరీ సమయం, ప్రమిదలు మొదలైన వాటి గురించి రాయండి...' : 'Tell us about the samagri purity, delivery timing, clay diyas...'}
                  className="w-full px-3 py-2 rounded-xl border border-[#d8c5b3] bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 font-bold text-gray-600 hover:bg-gray-100"
                >
                  {lang === 'te' ? 'రద్దు చేయండి' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#872e12] hover:bg-[#6c230c] text-white font-bold shadow-md"
                >
                  {lang === 'te' ? 'సమీక్ష సమర్పించండి' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
