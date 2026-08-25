import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Video, 
  Search, 
  Bell, 
  BellOff, 
  Lock, 
  ShieldCheck, 
  Image as ImageIcon, 
  FileText, 
  Link as LinkIcon, 
  ChevronLeft, 
  Ban, 
  ThumbsDown,
  Sparkles
} from 'lucide-react';
import { Chat } from '../types';

interface ContactInfoDrawerProps {
  chat: Chat;
  onClose: () => void;
  onStartCall: (chat: Chat, type: 'voice' | 'video') => void;
}

export const ContactInfoDrawer: React.FC<ContactInfoDrawerProps> = ({
  chat,
  onClose,
  onStartCall,
}) => {
  const [isMuted, setIsMuted] = useState(chat.isMuted || false);

  const sampleMedia = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80',
  ];

  return (
    <div 
      id="contact-info-drawer"
      className="w-full md:w-80 lg:w-88 h-full bg-white/90 backdrop-blur-xl border-r border-white/60 flex flex-col z-30 overflow-y-auto custom-scrollbar select-none shadow-2xl animate-in slide-in-from-left duration-200"
    >
      {/* Header */}
      <div className="p-4 border-b border-black/[0.06] flex items-center justify-between">
        <h3 className="font-bold text-[#111b21] text-base">معلومات جهة الاتصال</h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-black/5 text-[#667781] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 space-y-6 text-right">
        {/* Profile Card */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-[#00a884]/20 shadow-lg"
            />
            {chat.isOnline && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00a884] border-2 border-white rounded-full"></span>
            )}
          </div>

          <div>
            <h4 className="font-extrabold text-[#111b21] text-lg">{chat.name}</h4>
            <span className="text-xs text-[#667781] font-mono">{chat.phone || '+1 (555) 234-5678'}</span>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-center gap-4 w-full pt-1">
            <button
              onClick={() => onStartCall(chat, 'voice')}
              className="flex-1 py-2.5 rounded-2xl bg-[#e8f5f1] hover:bg-[#006b53] hover:text-white text-[#006b53] text-xs font-bold transition-colors flex flex-col items-center gap-1 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>صوت</span>
            </button>

            <button
              onClick={() => onStartCall(chat, 'video')}
              className="flex-1 py-2.5 rounded-2xl bg-[#e8f5f1] hover:bg-[#006b53] hover:text-white text-[#006b53] text-xs font-bold transition-colors flex flex-col items-center gap-1 cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>فيديو</span>
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="p-3.5 bg-black/[0.02] rounded-2xl border border-black/5 space-y-1">
          <span className="text-[11px] text-[#667781] font-bold block">الأخبار / الحالة</span>
          <p className="text-xs text-[#111b21] leading-relaxed">
            {chat.about || 'متاح للتواصل عبر Lumina Chat ✨'}
          </p>
        </div>

        {/* Shared Media Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#111b21]">الوسائط والروابط والمستندات</span>
            <span className="text-[#006b53] font-bold">{chat.sharedMediaCount || 48} ملف</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 rounded-2xl overflow-hidden">
            {sampleMedia.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="Shared media"
                className="w-full h-16 object-cover rounded-xl hover:scale-105 transition-transform cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Privacy & Notification Settings */}
        <div className="space-y-2 divide-y divide-black/5 pt-2">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2.5">
              {isMuted ? <BellOff className="w-4 h-4 text-[#667781]" /> : <Bell className="w-4 h-4 text-[#006b53]" />}
              <span className="text-xs font-bold text-[#111b21]">كتم الإشعارات</span>
            </div>
            <input
              type="checkbox"
              checked={isMuted}
              onChange={(e) => setIsMuted(e.target.checked)}
              className="w-4 h-4 accent-[#006b53] cursor-pointer"
            />
          </div>

          <div 
            onClick={() => alert('رمز الأمان المتبادل: 4892 1092 8472 9012 3341 8729 (تم التحقق ✓)')}
            className="flex items-center justify-between py-3 cursor-pointer hover:opacity-80"
          >
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-[#00a884]" />
              <div>
                <span className="text-xs font-bold text-[#111b21] block">التشفير التام</span>
                <span className="text-[11px] text-[#667781]">انقر للتحقق من رمز الأمان</span>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-[#667781]" />
          </div>
        </div>

        {/* Destructive Actions */}
        <div className="space-y-1.5 pt-2">
          <button
            onClick={() => alert(`تم حظر ${chat.name} بنجاح`)}
            className="w-full p-2.5 rounded-xl hover:bg-red-50 text-red-600 text-xs font-bold flex items-center gap-2.5 cursor-pointer transition-colors"
          >
            <Ban className="w-4 h-4" />
            <span>حظر {chat.name}</span>
          </button>

          <button
            onClick={() => alert(`تم إرسال بلاغ عن ${chat.name}`)}
            className="w-full p-2.5 rounded-xl hover:bg-red-50 text-red-600 text-xs font-bold flex items-center gap-2.5 cursor-pointer transition-colors"
          >
            <ThumbsDown className="w-4 h-4" />
            <span>الإبلاغ عن جهة الاتصال</span>
          </button>
        </div>
      </div>
    </div>
  );
};
