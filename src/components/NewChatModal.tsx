import React, { useState } from 'react';
import { Search, X, Users, UserPlus, Sparkles, Check } from 'lucide-react';
import { User, Chat } from '../types';

interface NewChatModalProps {
  contacts: User[];
  onClose: () => void;
  onSelectContact: (contact: User) => void;
  onCreateGroup: (name: string, members: User[]) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  contacts,
  onClose,
  onSelectContact,
  onCreateGroup,
}) => {
  const [search, setSearch] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.statusText.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelectUser = (id: string) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter((uid) => uid !== id));
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
    }
  };

  const handleFinishGroup = () => {
    if (!groupName.trim() || selectedUserIds.length === 0) return;
    const selectedMembers = contacts.filter((c) => selectedUserIds.includes(c.id));
    onCreateGroup(groupName.trim(), selectedMembers);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 border border-white/40 text-right animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-bold text-[#111b21]">
            {isCreatingGroup ? 'إنشاء مجموعة جديدة' : 'محادثة جديدة'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#667781] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create Group Toggle if in normal mode */}
        {!isCreatingGroup ? (
          <button
            onClick={() => setIsCreatingGroup(true)}
            className="w-full p-3 rounded-2xl bg-[#e8f5f1] hover:bg-[#006b53] hover:text-white text-[#006b53] font-bold text-xs flex items-center gap-3 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#006b53] text-white flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span>إنشاء مجموعة جديدة مع جهات الاتصال</span>
          </button>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="اسم المجموعة (مثال: فريق التصميم 🎨)"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-3 bg-black/5 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00a884]"
            />
            <span className="text-[11px] text-[#667781] block">
              تم تحديد ({selectedUserIds.length}) من جهات الاتصال
            </span>
          </div>
        )}

        {/* Search */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute right-3.5 text-[#667781]" />
          <input
            type="text"
            placeholder="البحث بالاسم أو رقم الهاتف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-10 py-2 bg-black/5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00a884]"
          />
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-black/5 space-y-1 pr-1">
          {filteredContacts.map((contact) => {
            const isSelected = selectedUserIds.includes(contact.id);

            return (
              <div
                key={contact.id}
                onClick={() => {
                  if (isCreatingGroup) {
                    toggleSelectUser(contact.id);
                  } else {
                    onSelectContact(contact);
                    onClose();
                  }
                }}
                className="w-full p-2.5 rounded-xl hover:bg-black/5 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    {contact.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#00a884] border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="min-w-0 text-right">
                    <h5 className="font-bold text-[#111b21] text-xs truncate">
                      {contact.name}
                    </h5>
                    <span className="text-[11px] text-[#667781] block truncate">
                      {contact.statusText}
                    </span>
                  </div>
                </div>

                {isCreatingGroup && (
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#006b53] border-[#006b53] text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        {isCreatingGroup && (
          <div className="flex items-center justify-between pt-3 border-t">
            <button
              onClick={() => setIsCreatingGroup(false)}
              className="text-xs font-bold text-[#667781] hover:underline"
            >
              الرجوع
            </button>
            <button
              onClick={handleFinishGroup}
              disabled={!groupName.trim() || selectedUserIds.length === 0}
              className="px-6 py-2 bg-[#006b53] hover:bg-[#00523f] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              إنشاء المجموعة ({selectedUserIds.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
