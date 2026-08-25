import React, { useState, useEffect } from 'react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  VolumeX, 
  ShieldCheck,
  Maximize2,
  Sparkles
} from 'lucide-react';
import { CallSession } from '../types';

interface CallModalProps {
  session: CallSession;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleSpeaker: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  session,
  onEndCall,
  onToggleMute,
  onToggleVideo,
  onToggleSpeaker,
}) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 select-none animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg h-[80vh] max-h-[650px] bg-gradient-to-b from-[#111b21] to-[#0a1014] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between p-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between text-white/80 z-10">
          <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-[#00a884]" />
            <span>مكالمة مشفرة تماماً</span>
          </div>

          <span className="font-mono text-sm text-[#00a884] font-bold">
            {formatTimer(timer)}
          </span>
        </div>

        {/* Center Content */}
        <div className="flex flex-col items-center justify-center gap-6 my-auto z-10 text-center">
          {session.type === 'video' && !session.isVideoOff ? (
            /* Video Simulation */
            <div className="relative w-full h-72 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black">
              <img
                src={session.contact.avatar}
                alt={session.contact.name}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute bottom-3 right-3 w-24 h-32 rounded-xl overflow-hidden ring-2 ring-white shadow-lg bg-gray-900">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="My feed"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            /* Voice Avatar Animation */
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#00a884]/20 animate-ping scale-150"></div>
              <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#00a884] shadow-2xl">
                <img
                  src={session.contact.avatar}
                  alt={session.contact.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white tracking-wide">
              {session.contact.name}
            </h3>
            <p className="text-sm text-white/60">
              {session.type === 'video' ? 'مكالمة فيديو Lumina HD' : 'مكالمة صوتية عالية النقاء'}
            </p>
          </div>

          {/* Audio Waveform Bars */}
          <div className="flex items-center gap-1 h-6">
            {[40, 70, 25, 90, 60, 30, 80, 50, 95, 40, 75, 30, 60].map((h, i) => (
              <span
                key={i}
                style={{ height: `${h}%` }}
                className="w-1 bg-[#00a884] rounded-full animate-pulse"
              ></span>
            ))}
          </div>
        </div>

        {/* Bottom Call Controls */}
        <div className="flex items-center justify-center gap-4 z-10 pt-4">
          <button
            onClick={onToggleMute}
            className={`p-4 rounded-full transition-all cursor-pointer ${
              session.isMuted
                ? 'bg-red-500 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={session.isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
          >
            {session.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {session.type === 'video' && (
            <button
              onClick={onToggleVideo}
              className={`p-4 rounded-full transition-all cursor-pointer ${
                session.isVideoOff
                  ? 'bg-red-500 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={session.isVideoOff ? 'تشغيل الكاميرا' : 'إيقاف الكاميرا'}
            >
              {session.isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>
          )}

          <button
            onClick={onToggleSpeaker}
            className={`p-4 rounded-full transition-all cursor-pointer ${
              session.isSpeaker
                ? 'bg-[#00a884] text-white'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="مكبر الصوت"
          >
            {session.isSpeaker ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={onEndCall}
            className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg shadow-red-600/40 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
            title="إنهاء المكالمة"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
