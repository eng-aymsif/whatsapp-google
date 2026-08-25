import React from 'react';
import { 
  Sparkles, 
  Lock, 
  MessageSquarePlus, 
  Users, 
  QrCode, 
  ShieldCheck,
  CheckCircle2,
  Laptop,
  Smartphone,
  Zap
} from 'lucide-react';

interface WelcomeScreenProps {
  onStartNewChat: () => void;
  onCreateCommunity: () => void;
  onOpenQR: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartNewChat,
  onCreateCommunity,
  onOpenQR,
}) => {
  return (
    <div 
      id="welcome-screen-container"
      className="flex-1 h-full flex flex-col items-center justify-center p-6 md:p-12 text-center bg-mesh-mint overflow-y-auto select-none"
    >
      <div className="max-w-xl w-full flex flex-col items-center gap-8 my-auto py-8">
        {/* Glow Logo Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-[#00a884]/20 rounded-full blur-2xl transform scale-150 animate-pulse"></div>
          <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#006b53] via-[#008f6b] to-[#00a884] flex items-center justify-center text-white shadow-2xl shadow-[#006b53]/30 border border-white/40">
            <Sparkles className="w-14 h-14" />
          </div>
          <div className="absolute -bottom-2 -left-2 bg-white px-3 py-1 rounded-full text-[12px] font-bold text-[#006b53] shadow-md border border-[#00a884]/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00a884] animate-ping"></span>
            Lumina v2.6
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#111b21] tracking-tight">
            مرحباً بك في <span className="text-[#006b53]">Lumina Chat</span>
          </h1>
          <p className="text-base md:text-lg text-[#667781] leading-relaxed max-w-md mx-auto">
            تواصل بسلاسة وفورية عبر جميع أجهزتك. أرسل واستقبل الرسائل والملفات دون الحاجة لإبقاء هاتفك متصلاً بالإنترنت.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full">
          <button
            id="btn-welcome-new-chat"
            onClick={onStartNewChat}
            className="glass-card hover:bg-white/90 p-4 rounded-2xl flex flex-col items-center gap-3 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#006b53]/10 border border-white/60 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#e8f5f1] text-[#006b53] flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquarePlus className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-bold text-[#111b21] text-sm">محادثة جديدة</span>
              <span className="text-[12px] text-[#667781]">ابدأ دردشة مع أصدقائك</span>
            </div>
          </button>

          <button
            id="btn-welcome-new-community"
            onClick={onCreateCommunity}
            className="glass-card hover:bg-white/90 p-4 rounded-2xl flex flex-col items-center gap-3 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#006b53]/10 border border-white/60 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#e8f5f1] text-[#006b53] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-bold text-[#111b21] text-sm">إنشاء مجتمع</span>
              <span className="text-[12px] text-[#667781]">اجمع مجموعاتك معاً</span>
            </div>
          </button>

          <button
            id="btn-welcome-qr-scan"
            onClick={onOpenQR}
            className="glass-card hover:bg-white/90 p-4 rounded-2xl flex flex-col items-center gap-3 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#006b53]/10 border border-white/60 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#e8f5f1] text-[#006b53] flex items-center justify-center group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-bold text-[#111b21] text-sm">رمز الاستجابة QR</span>
              <span className="text-[12px] text-[#667781]">ربط جهاز أو مشاركة الحساب</span>
            </div>
          </button>
        </div>

        {/* End-to-End Security Note */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-[#00a884]/20 text-[#006b53] text-xs font-semibold shadow-sm">
          <Lock className="w-4 h-4 text-[#00a884]" />
          <span>رسائلك ومكالماتك مشفرة تماماً بين الطرفين (End-to-End Encryption)</span>
        </div>
      </div>
    </div>
  );
};
