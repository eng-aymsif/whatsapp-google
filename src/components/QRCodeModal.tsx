import React, { useState } from 'react';
import { X, QrCode, Share2, Download, Copy, Check, Sparkles } from 'lucide-react';
import { User } from '../types';

interface QRCodeModalProps {
  currentUser: User;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  currentUser,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'myCode' | 'scan'>('myCode');
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-5 border border-white/40 text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 text-right">
          <h3 className="text-lg font-bold text-[#111b21]">رمز الاستجابة السريعة (QR)</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#667781] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex items-center p-1 bg-black/5 rounded-2xl">
          <button
            onClick={() => setActiveTab('myCode')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'myCode' ? 'bg-white text-[#006b53] shadow-xs' : 'text-[#667781]'
            }`}
          >
            رمزي الشخصي
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'scan' ? 'bg-white text-[#006b53] shadow-xs' : 'text-[#667781]'
            }`}
          >
            مسح الرمز
          </button>
        </div>

        {activeTab === 'myCode' ? (
          <div className="flex flex-col items-center space-y-4">
            {/* QR Card */}
            <div className="relative p-6 bg-gradient-to-tr from-[#006b53] to-[#00a884] rounded-3xl shadow-xl border-4 border-white">
              {/* QR Pattern visual simulation */}
              <div className="w-48 h-48 bg-white rounded-2xl p-3 flex flex-col items-center justify-center relative shadow-inner">
                {/* SVG QR Code Illustration */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#006b53]">
                  {/* Corner Positioners */}
                  <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="5" rx="3" />
                  <rect x="11" y="11" width="13" height="13" fill="currentColor" rx="1.5" />

                  <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="5" rx="3" />
                  <rect x="76" y="11" width="13" height="13" fill="currentColor" rx="1.5" />

                  <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="5" rx="3" />
                  <rect x="11" y="76" width="13" height="13" fill="currentColor" rx="1.5" />

                  {/* QR Data Dots */}
                  <rect x="36" y="10" width="8" height="8" fill="currentColor" />
                  <rect x="48" y="10" width="8" height="8" fill="currentColor" />
                  <rect x="40" y="24" width="6" height="6" fill="currentColor" />
                  <rect x="54" y="20" width="10" height="6" fill="currentColor" />
                  <rect x="10" y="40" width="8" height="8" fill="currentColor" />
                  <rect x="24" y="45" width="6" height="12" fill="currentColor" />
                  <rect x="36" y="38" width="12" height="12" fill="currentColor" />
                  <rect x="52" y="40" width="8" height="8" fill="currentColor" />
                  <rect x="68" y="40" width="10" height="6" fill="currentColor" />
                  <rect x="84" y="42" width="6" height="14" fill="currentColor" />
                  <rect x="38" y="60" width="8" height="8" fill="currentColor" />
                  <rect x="50" y="58" width="14" height="6" fill="currentColor" />
                  <rect x="70" y="68" width="8" height="8" fill="currentColor" />
                  <rect x="82" y="72" width="10" height="6" fill="currentColor" />
                  <rect x="40" y="78" width="12" height="8" fill="currentColor" />
                  <rect x="58" y="80" width="8" height="10" fill="currentColor" />
                  <rect x="76" y="84" width="8" height="8" fill="currentColor" />
                </svg>

                {/* Center User Avatar */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-md">
                    <img
                      src={currentUser.avatar}
                      alt="User"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-[#111b21] text-base">{currentUser.name}</h4>
              <p className="text-xs text-[#667781]">
                امسح الرمز لبدء محادثة مشفرة فورية على Lumina Chat
              </p>
            </div>

            {/* Share / Copy Buttons */}
            <div className="flex items-center gap-2 w-full pt-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2.5 bg-[#e8f5f1] hover:bg-[#006b53] hover:text-white text-[#006b53] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {copied ? <Check className="w-4 h-4 text-[#00a884]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
              </button>

              <button
                onClick={() => alert('تم تنزيل رمز QR كصورة عالية الدقة!')}
                className="p-2.5 bg-black/5 hover:bg-black/10 text-[#111b21] rounded-xl transition-colors cursor-pointer"
                title="تنزيل كصورة"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Scanner Simulation */
          <div className="py-8 flex flex-col items-center space-y-4">
            <div className="w-48 h-48 rounded-2xl border-2 border-dashed border-[#00a884] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-black/5">
              <div className="w-full h-1 bg-[#00a884] absolute top-0 animate-bounce"></div>
              <QrCode className="w-12 h-12 text-[#006b53] opacity-50 mb-2" />
              <span className="text-[11px] text-[#667781]">
                وجّه الكاميرا نحو رمز QR للمسح
              </span>
            </div>
            <p className="text-xs text-[#667781]">
              يمكنك مسح الرمز من شاشة الهاتف أو جهاز الكمبيوتر لربط الحساب.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
