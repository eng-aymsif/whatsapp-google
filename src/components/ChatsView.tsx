import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Pin, 
  Check, 
  CheckCheck, 
  VolumeX, 
  Filter, 
  Users, 
  Sparkles,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Chat } from '../types';

interface ChatsViewProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onOpenNewChat: () => void;
}

type FilterType = 'all' | 'unread' | 'groups' | 'pinned';

export const ChatsView: React.FC<ChatsViewProps> = ({
  chats,
  selectedChatId,
  onSelectChat,
  onOpenNewChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredChats = chats.filter((chat) => {
    // Search query filter
    const matchesSearch = 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Filter categories
    if (activeFilter === 'unread') return chat.unreadCount > 0;
    if (activeFilter === 'groups') return chat.type === 'group';
    if (activeFilter === 'pinned') return !!chat.isPinned;

    return true;
  });

  const totalUnread = chats.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div 
      id="chats-list-sidebar" 
      className="w-full md:w-80 lg:w-96 h-full flex flex-col bg-white/70 backdrop-blur-xl border-l border-white/50 relative select-none"
    >
      {/* Header */}
      <div className="p-4 pb-3 flex items-center justify-between border-b border-black/[0.04]">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-[#111b21]">الدردشات</h2>
          {totalUnread > 0 && (
            <span className="px-2 py-0.5 bg-[#e8f5f1] text-[#006b53] text-xs font-bold rounded-full border border-[#00a884]/30">
              {totalUnread} غير مقروءة
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            id="btn-chats-new-conversation"
            onClick={onOpenNewChat}
            className="p-2.5 rounded-xl bg-[#006b53] text-white hover:bg-[#00523f] shadow-md shadow-[#006b53]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="محادثة جديدة"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-2.5">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute right-3.5 text-[#667781] pointer-events-none" />
          <input
            id="input-chats-search"
            type="text"
            placeholder="البحث أو بدء محادثة جديدة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-10 py-2 bg-white/80 border border-black/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00a884]/40 focus:bg-white text-[#111b21] placeholder-[#667781] transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 p-0.5 rounded-full hover:bg-black/5 text-[#667781]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 custom-scrollbar">
          <button
            id="filter-chip-all"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#006b53] text-white shadow-sm'
                : 'bg-white/80 text-[#667781] hover:bg-white hover:text-[#111b21] border border-black/5'
            }`}
          >
            الكل
          </button>
          <button
            id="filter-chip-unread"
            onClick={() => setActiveFilter('unread')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'unread'
                ? 'bg-[#006b53] text-white shadow-sm'
                : 'bg-white/80 text-[#667781] hover:bg-white hover:text-[#111b21] border border-black/5'
            }`}
          >
            غير مقروءة
          </button>
          <button
            id="filter-chip-groups"
            onClick={() => setActiveFilter('groups')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'groups'
                ? 'bg-[#006b53] text-white shadow-sm'
                : 'bg-white/80 text-[#667781] hover:bg-white hover:text-[#111b21] border border-black/5'
            }`}
          >
            المجموعات
          </button>
          <button
            id="filter-chip-pinned"
            onClick={() => setActiveFilter('pinned')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'pinned'
                ? 'bg-[#006b53] text-white shadow-sm'
                : 'bg-white/80 text-[#667781] hover:bg-white hover:text-[#111b21] border border-black/5'
            }`}
          >
            المثبتة
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div 
        id="chats-scroll-list"
        className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-black/[0.03] p-2 space-y-1"
      >
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-4">
            <Search className="w-8 h-8 text-[#667781]/50 mb-2" />
            <p className="text-sm font-semibold text-[#111b21]">لم يتم العثور على محادثات</p>
            <p className="text-xs text-[#667781] mt-0.5">جرّب تغيير كلمات البحث أو الفلاتر</p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const isSelected = selectedChatId === chat.id;
            return (
              <button
                key={chat.id}
                id={`chat-item-${chat.id}`}
                onClick={() => onSelectChat(chat.id)}
                className={`w-full p-3 rounded-2xl flex items-center gap-3 text-right transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-[#e8f5f1] border border-[#00a884]/30 shadow-sm'
                    : 'hover:bg-white/80 border border-transparent'
                }`}
              >
                {/* Avatar with Online/Group indicator */}
                <div className="relative shrink-0">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-13 h-13 rounded-2xl object-cover ring-2 ring-white shadow-sm"
                  />
                  {chat.isOnline && (
                    <span 
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#00a884] border-2 border-white rounded-full"
                      title="متصل الآن"
                    ></span>
                  )}
                  {chat.type === 'group' && (
                    <span 
                      className="absolute -bottom-0.5 -left-0.5 p-0.5 bg-[#006b53] text-white rounded-full border border-white"
                      title="مجموعة"
                    >
                      <Users className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-[#111b21] text-[15px] truncate">
                      {chat.name}
                    </span>
                    <span className={`text-[11px] shrink-0 ${chat.unreadCount > 0 ? 'text-[#006b53] font-bold' : 'text-[#667781]'}`}>
                      {chat.lastMessageTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-xs truncate flex items-center gap-1 ${chat.unreadCount > 0 ? 'text-[#111b21] font-semibold' : 'text-[#667781]'}`}>
                      {chat.messages.length > 0 && chat.messages[chat.messages.length - 1].isOutgoing && (
                        <CheckCheck className="w-3.5 h-3.5 text-[#00a884] inline shrink-0" />
                      )}
                      <span className="truncate">{chat.lastMessage}</span>
                    </p>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {chat.isPinned && (
                        <Pin className="w-3.5 h-3.5 text-[#667781] fill-[#667781]/20 -rotate-45" />
                      )}
                      {chat.unreadCount > 0 && (
                        <span className="min-w-5 h-5 px-1.5 bg-[#00a884] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
