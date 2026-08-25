import React from 'react';
import { 
  MessageSquare, 
  CircleDot, 
  Users2, 
  Radio, 
  Settings, 
  ShieldCheck, 
  Sparkles,
  User as UserIcon,
  Moon,
  Sun
} from 'lucide-react';
import { TabType, User } from '../types';

interface NavigationSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  currentUser: User;
  onOpenProfile: () => void;
  unreadChatsCount: number;
  hasUnreadStatus: boolean;
  onOpenQR: () => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  onOpenProfile,
  unreadChatsCount,
  hasUnreadStatus,
  onOpenQR
}) => {
  const navItems = [
    {
      id: 'chats' as TabType,
      label: 'الدردشات',
      icon: MessageSquare,
      badge: unreadChatsCount > 0 ? unreadChatsCount : undefined,
    },
    {
      id: 'status' as TabType,
      label: 'الحالة',
      icon: CircleDot,
      hasDot: hasUnreadStatus,
    },
    {
      id: 'communities' as TabType,
      label: 'المجتمعات',
      icon: Users2,
    },
    {
      id: 'channels' as TabType,
      label: 'القنوات',
      icon: Radio,
    },
    {
      id: 'settings' as TabType,
      label: 'الإعدادات',
      icon: Settings,
    },
  ];

  return (
    <aside 
      id="main-navigation-sidebar" 
      aria-label="القائمة الجانبية للتنقل"
      className="w-16 md:w-20 bg-white/80 backdrop-blur-xl border-l border-white/60 flex flex-col items-center justify-between py-5 z-30 select-none shadow-[0_4px_24px_rgba(0,107,83,0.06)] shrink-0"
    >
      {/* Top Logo */}
      <div className="flex flex-col items-center gap-6">
        <button
          id="btn-nav-logo"
          onClick={() => onTabChange('chats')}
          className="relative group p-2.5 rounded-2xl bg-gradient-to-tr from-[#006b53] to-[#00a884] text-white shadow-lg shadow-[#00a884]/25 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          title="Lumina Chat"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#00a884] rounded-full ring-2 ring-white"></span>
        </button>

        {/* Navigation Items */}
        <nav className="flex flex-col items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onTabChange(item.id)}
                className={`relative group p-3.5 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-center ${
                  isActive
                    ? 'bg-[#e8f5f1] text-[#006b53] font-bold shadow-sm shadow-[#006b53]/10'
                    : 'text-[#667781] hover:bg-black/5 hover:text-[#111b21]'
                }`}
                title={item.label}
              >
                <Icon className={`w-6 h-6 transition-transform group-hover:scale-110 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />

                {/* Unread number badge */}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-5 h-5 bg-[#00a884] text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                    {item.badge}
                  </span>
                )}

                {/* Status Dot */}
                {item.hasDot && !item.badge && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#00a884] rounded-full ring-2 ring-white"></span>
                )}

                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute -right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#006b53] rounded-l-full"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Actions */}
      <div className="flex flex-col items-center gap-4">
        {/* User Profile Avatar with Online Status */}
        <button
          id="btn-user-profile-trigger"
          onClick={onOpenProfile}
          className="relative group p-1 rounded-full transition-transform hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-[#00a884]/40 hover:ring-[#006b53]"
          title={`${currentUser.name} - الملف الشخصي`}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover shadow-sm"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00a884] border-2 border-white rounded-full"></span>
        </button>
      </div>
    </aside>
  );
};
