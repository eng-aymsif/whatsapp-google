import React, { useState } from 'react';
import { 
  KeyRound, 
  Lock, 
  MessageSquare, 
  Bell, 
  HardDrive, 
  Globe, 
  HelpCircle, 
  QrCode, 
  ChevronLeft, 
  ShieldCheck, 
  Trash2, 
  Sparkles, 
  Smartphone, 
  Moon, 
  Sun,
  Check,
  RefreshCw
} from 'lucide-react';
import { User } from '../types';

interface SettingsViewProps {
  currentUser: User;
  onOpenProfile: () => void;
  onOpenQR: () => void;
}

type SettingSection = 'account' | 'privacy' | 'chats' | 'notifications' | 'storage' | 'language' | 'help';

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  onOpenProfile,
  onOpenQR,
}) => {
  const [activeSection, setActiveSection] = useState<SettingSection>('storage');
  const [readReceipts, setReadReceipts] = useState(true);
  const [appLock, setAppLock] = useState(false);
  const [notificationsSound, setNotificationsSound] = useState(true);
  const [storageCleaned, setStorageCleaned] = useState(false);

  const handleCleanCache = () => {
    setStorageCleaned(true);
    setTimeout(() => {
      alert('تم تنظيف 180 ميجابايت من الذاكرة المؤقتة بنجاح! 🚀');
    }, 500);
  };

  const sections = [
    { id: 'account' as SettingSection, label: 'الحساب', icon: KeyRound, desc: 'مفاتيح المرور، الأمان، وتغيير الرقم' },
    { id: 'privacy' as SettingSection, label: 'الخصوصية', icon: Lock, desc: 'آخر ظهور، قفل التطبيق، التشفير' },
    { id: 'chats' as SettingSection, label: 'الدردشات', icon: MessageSquare, desc: 'المظهر، خلفية الشاشة، النسخ الاحتياطي' },
    { id: 'notifications' as SettingSection, label: 'الإشعارات', icon: Bell, desc: 'نغمات الرسائل والمجموعات' },
    { id: 'storage' as SettingSection, label: 'التخزين والبيانات', icon: HardDrive, desc: '2.4 GB مستخدمة، إدارة الوسائط' },
    { id: 'language' as SettingSection, label: 'لغة التطبيق', icon: Globe, desc: 'العربية (افتراضي النظام)' },
    { id: 'help' as SettingSection, label: 'المساعدة والأمان', icon: HelpCircle, desc: 'مركز المساعدة وسياسة الخصوصية' },
  ];

  return (
    <div id="settings-main-container" className="flex-1 h-full flex flex-col md:flex-row overflow-hidden bg-[#f4fbf6]">
      {/* Settings Navigation Column */}
      <div 
        id="settings-sidebar-list"
        className="w-full md:w-80 lg:w-96 h-full flex flex-col bg-white/70 backdrop-blur-xl border-l border-white/50 overflow-y-auto custom-scrollbar select-none"
      >
        <div className="p-4 border-b border-black/[0.04]">
          <h2 className="text-2xl font-bold text-[#111b21]">الإعدادات</h2>
        </div>

        {/* Profile Card Trigger */}
        <div className="p-3">
          <div
            onClick={onOpenProfile}
            className="p-3.5 rounded-2xl bg-white/90 hover:bg-white border border-black/5 flex items-center justify-between gap-3 cursor-pointer transition-all hover:shadow-xs group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-13 h-13 rounded-2xl object-cover ring-2 ring-[#00a884]"
              />
              <div className="text-right min-w-0">
                <h4 className="font-bold text-[#111b21] text-base truncate group-hover:text-[#006b53]">
                  {currentUser.name}
                </h4>
                <p className="text-xs text-[#667781] truncate">
                  {currentUser.statusText}
                </p>
                <span className="text-[11px] text-[#006b53] font-medium block">
                  {currentUser.phone}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenQR();
              }}
              className="p-2 rounded-xl bg-[#e8f5f1] hover:bg-[#006b53] hover:text-white text-[#006b53] transition-colors cursor-pointer shrink-0"
              title="رمز QR الخاص بي"
            >
              <QrCode className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Navigation List */}
        <div className="p-3 space-y-1">
          {sections.map((item) => {
            const Icon = item.icon;
            const isSelected = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full p-3 rounded-2xl flex items-center justify-between gap-3 text-right transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#e8f5f1] text-[#006b53] border border-[#00a884]/30 shadow-xs'
                    : 'hover:bg-white/80 text-[#111b21] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-[#006b53] text-white' : 'bg-black/5 text-[#667781]'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-bold text-sm truncate">
                      {item.label}
                    </span>
                    <span className="block text-[11px] text-[#667781] truncate">
                      {item.desc}
                    </span>
                  </div>
                </div>

                <ChevronLeft className="w-4 h-4 text-[#667781] shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Settings Detail Area */}
      <div 
        id="settings-detail-canvas"
        className="flex-1 h-full flex flex-col p-6 md:p-12 overflow-y-auto custom-scrollbar bg-mesh-mint"
      >
        <div className="max-w-2xl w-full mx-auto space-y-6">
          {/* Storage & Data Section */}
          {activeSection === 'storage' && (
            <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/60 shadow-lg space-y-6 text-right">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#111b21]">إدارة التخزين والبيانات</h3>
                  <p className="text-xs text-[#667781] mt-0.5">
                    التحكم في استهلاك الوسائط والملفات المؤقتة المخزنة
                  </p>
                </div>
                <div className="p-3 bg-[#e8f5f1] text-[#006b53] rounded-2xl">
                  <HardDrive className="w-6 h-6" />
                </div>
              </div>

              {/* Visual Storage Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#111b21]">المساحة المستخدمة</span>
                  <span className="text-[#006b53] font-mono text-sm">{storageCleaned ? '2.22 GB' : '2.40 GB'} من 64 GB</span>
                </div>

                {/* Progress bar */}
                <div className="h-4 w-full bg-black/5 rounded-full overflow-hidden flex gap-1 p-0.5">
                  <div style={{ width: '65%' }} className="bg-[#006b53] rounded-full" title="الصور والفيديو (1.8 GB)"></div>
                  <div style={{ width: '20%' }} className="bg-[#00a884] rounded-full" title="المستندات (420 MB)"></div>
                  <div style={{ width: storageCleaned ? '0%' : '15%' }} className="bg-amber-400 rounded-full transition-all duration-500" title="الذاكرة المؤقتة (180 MB)"></div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-[11px] text-[#667781] pt-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#006b53]"></span>
                    الصور والفيديو (1.8 GB)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00a884]"></span>
                    المستندات (420 MB)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    الذاكرة المؤقتة ({storageCleaned ? '0 MB' : '180 MB'})
                  </span>
                </div>
              </div>

              {/* Clean Cache Button */}
              <div className="p-4 rounded-2xl bg-[#e8f5f1]/60 border border-[#00a884]/20 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#111b21] text-sm">تنظيف الذاكرة المؤقتة</h4>
                  <p className="text-xs text-[#667781]">
                    تحرير المساحة دون حذف الصور أو الرسائل الأصلية
                  </p>
                </div>
                <button
                  onClick={handleCleanCache}
                  disabled={storageCleaned}
                  className="px-4 py-2 bg-[#006b53] hover:bg-[#00523f] disabled:bg-gray-300 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{storageCleaned ? 'تم التنظيف بنجاح' : 'تنظيف 180 MB'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Privacy Section */}
          {activeSection === 'privacy' && (
            <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/60 shadow-lg space-y-6 text-right">
              <div className="border-b pb-4">
                <h3 className="text-xl font-bold text-[#111b21]">الخصوصية والأمان</h3>
                <p className="text-xs text-[#667781] mt-0.5">تحكم في من يمكنه رؤية نشاطك ومعلوماتك</p>
              </div>

              <div className="space-y-4 divide-y divide-black/5">
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="font-bold text-[#111b21] text-sm block">مؤشرات قراءة الرسائل</span>
                    <span className="text-xs text-[#667781]">إظهار علامتي الصح الزرقاء/الخضراء عند قراءة الرسالة</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={readReceipts}
                    onChange={(e) => setReadReceipts(e.target.checked)}
                    className="w-5 h-5 accent-[#006b53] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div>
                    <span className="font-bold text-[#111b21] text-sm block">قفل الشاشة ببصمة الإصبع أو الوجه</span>
                    <span className="text-xs text-[#667781]">طلب التحقق البيومتري عند فتح التطبيق</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={appLock}
                    onChange={(e) => setAppLock(e.target.checked)}
                    className="w-5 h-5 accent-[#006b53] cursor-pointer"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#111b21] text-sm block">آخر ظهور ومتصل الآن</span>
                    <span className="text-xs text-[#667781]">جهات اتصالي فقط</span>
                  </div>
                  <span className="text-xs font-bold text-[#006b53] bg-[#e8f5f1] px-3 py-1 rounded-full">
                    جهات اتصالي
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Account Section */}
          {activeSection === 'account' && (
            <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/60 shadow-lg space-y-6 text-right">
              <div className="border-b pb-4">
                <h3 className="text-xl font-bold text-[#111b21]">إعدادات الحساب</h3>
                <p className="text-xs text-[#667781]">إدارة معلومات الأمان والأجهزة الموثوقة</p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-black/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#667781] block">رقم الهاتف المسجل</span>
                    <span className="font-bold text-[#111b21] font-mono text-sm">{currentUser.phone}</span>
                  </div>
                  <button className="text-xs font-bold text-[#006b53] hover:underline">تغيير الرقم</button>
                </div>

                <div className="p-4 rounded-2xl bg-[#e8f5f1] border border-[#00a884]/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#006b53]" />
                    <div>
                      <span className="font-bold text-[#111b21] text-sm block">التحقق بخطوتين (2FA)</span>
                      <span className="text-xs text-[#006b53]">مفعل ومحمي برمز PIN</span>
                    </div>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-[#00a884]"></span>
                </div>
              </div>
            </div>
          )}

          {/* Other sections fallback */}
          {['chats', 'notifications', 'language', 'help'].includes(activeSection) && (
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-lg text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#e8f5f1] text-[#006b53] mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#111b21]">تم ضبط الإعدادات بنجاح</h3>
              <p className="text-xs text-[#667781] max-w-sm mx-auto">
                يتم مزامنة تفضيلاتك تلقائياً عبر جميع أجهزتك المتصلة باستخدام تشفير Lumina السحابي.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
