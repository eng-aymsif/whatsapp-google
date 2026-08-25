import React, { useState } from 'react';
import { X, Camera, Check, User as UserIcon, Smile, Phone, Sparkles } from 'lucide-react';
import { User } from '../types';

interface ProfileModalProps {
  currentUser: User;
  onClose: () => void;
  onUpdateUser: (updated: Partial<User>) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  currentUser,
  onClose,
  onUpdateUser,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [statusText, setStatusText] = useState(currentUser.statusText);
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar);

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  ];

  const handleSave = () => {
    onUpdateUser({
      name,
      statusText,
      avatar: selectedAvatar,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 border border-white/40 text-right animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-bold text-[#111b21]">الملف الشخصي</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#667781] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="relative group">
            <img
              src={selectedAvatar}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-[#00a884]/30 shadow-lg"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Quick Avatar Chooser */}
          <div className="flex items-center gap-2 pt-1">
            {avatarOptions.map((av, i) => (
              <button
                key={i}
                onClick={() => setSelectedAvatar(av)}
                className={`w-8 h-8 rounded-full overflow-hidden border-2 cursor-pointer transition-transform ${
                  selectedAvatar === av ? 'border-[#006b53] scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={av} alt="option" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Name Field */}
        <div>
          <label className="block text-xs font-bold text-[#111b21] mb-1.5">
            الاسم الظاهر
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 pl-10 bg-black/5 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00a884] font-medium"
            />
            <UserIcon className="w-4 h-4 text-[#667781] absolute left-3.5 top-3.5" />
          </div>
          <span className="text-[11px] text-[#667781] mt-1 block">
            هذا الاسم يظهر لجهات اتصالك في المحادثات والمجموعات.
          </span>
        </div>

        {/* Status Text Field */}
        <div>
          <label className="block text-xs font-bold text-[#111b21] mb-1.5">
            الأخبار / الحالة
          </label>
          <div className="relative">
            <input
              type="text"
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              className="w-full p-3 pl-10 bg-black/5 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00a884]"
            />
            <Smile className="w-4 h-4 text-[#667781] absolute left-3.5 top-3.5" />
          </div>
        </div>

        {/* Phone info */}
        <div className="p-3 bg-[#e8f5f1] rounded-xl flex items-center justify-between text-xs text-[#006b53]">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span className="font-bold font-mono">{currentUser.phone}</span>
          </div>
          <span className="text-[11px] bg-white px-2 py-0.5 rounded-full font-bold">موثّق ✓</span>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#667781] hover:bg-black/5 cursor-pointer"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#006b53] text-white text-xs font-bold shadow-md hover:bg-[#00523f] cursor-pointer"
          >
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
};
