import React, { useState } from 'react';
import { 
  Users2, 
  Plus, 
  Megaphone, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  X,
  ArrowRight,
  Search
} from 'lucide-react';
import { Community, CommunitySubGroup } from '../types';

interface CommunitiesViewProps {
  communities: Community[];
  onSelectSubGroup: (subGroup: CommunitySubGroup) => void;
  onCreateCommunity: (name: string, desc: string) => void;
}

export const CommunitiesView: React.FC<CommunitiesViewProps> = ({
  communities,
  onSelectSubGroup,
  onCreateCommunity,
}) => {
  const [expandedCommunityIds, setExpandedCommunityIds] = useState<{ [id: string]: boolean }>({
    'comm-lumina': true,
    'comm-family': true,
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCommName, setNewCommName] = useState('');
  const [newCommDesc, setNewCommDesc] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(communities[0] || null);

  const toggleExpand = (id: string) => {
    setExpandedCommunityIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCreate = () => {
    if (!newCommName.trim()) return;
    onCreateCommunity(newCommName.trim(), newCommDesc.trim());
    setNewCommName('');
    setNewCommDesc('');
    setShowCreateModal(false);
  };

  return (
    <div id="communities-main-container" className="flex-1 h-full flex flex-col md:flex-row overflow-hidden bg-[#f4fbf6]">
      {/* Communities Sidebar List */}
      <div 
        id="communities-sidebar-list"
        className="w-full md:w-80 lg:w-96 h-full flex flex-col bg-white/70 backdrop-blur-xl border-l border-white/50 overflow-y-auto custom-scrollbar select-none"
      >
        <div className="p-4 flex items-center justify-between border-b border-black/[0.04]">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-[#111b21]">المجتمعات</h2>
            <span className="px-2 py-0.5 bg-[#e8f5f1] text-[#006b53] text-xs font-bold rounded-full">
              {communities.length}
            </span>
          </div>
          <button
            id="btn-community-create-trigger"
            onClick={() => setShowCreateModal(true)}
            className="p-2 rounded-xl bg-[#006b53] text-white hover:bg-[#00523f] shadow-md shadow-[#006b53]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="مجتمع جديد"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#006b53]/10 to-[#00a884]/5 border border-[#00a884]/20 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#006b53] text-white shrink-0 shadow-xs">
              <Users2 className="w-5 h-5" />
            </div>
            <div className="text-right">
              <h4 className="font-bold text-[#111b21] text-xs mb-0.5">تنظيم المجموعات معاً</h4>
              <p className="text-[11px] text-[#667781] leading-relaxed">
                اجمع المجموعات المرتبطة بناديك أو مدرستك أو شركتك في مكان واحد مع قناة إعلانات عامة.
              </p>
            </div>
          </div>
        </div>

        {/* Communities Accordion List */}
        <div className="p-3 space-y-3">
          {communities.map((comm) => {
            const isExpanded = expandedCommunityIds[comm.id];
            const isSelected = selectedCommunity?.id === comm.id;

            return (
              <div
                key={comm.id}
                id={`community-card-${comm.id}`}
                className="rounded-2xl bg-white/80 border border-black/5 overflow-hidden transition-all shadow-xs"
              >
                {/* Community Header Card */}
                <div
                  onClick={() => {
                    setSelectedCommunity(comm);
                    toggleExpand(comm.id);
                  }}
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-black/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={comm.avatar}
                      alt={comm.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-1 ring-black/5"
                    />
                    <div className="text-right min-w-0">
                      <h4 className="font-bold text-[#111b21] text-sm truncate">
                        {comm.name}
                      </h4>
                      <p className="text-[11px] text-[#667781] truncate">
                        {comm.membersCount} عضواً • {comm.subGroups.length} مجموعات
                      </p>
                    </div>
                  </div>

                  <div className="p-1 rounded-lg hover:bg-black/5 text-[#667781]">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Sub-groups */}
                {isExpanded && (
                  <div className="bg-[#f4fbf6]/50 border-t border-black/5 divide-y divide-black/[0.03]">
                    {comm.subGroups.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => onSelectSubGroup(sub)}
                        className="w-full p-2.5 px-4 flex items-center justify-between hover:bg-[#e8f5f1]/60 text-right transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`p-2 rounded-xl text-white ${sub.isAnnouncement ? 'bg-[#006b53]' : 'bg-[#00a884]'}`}>
                            {sub.isAnnouncement ? <Megaphone className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <span className="block font-semibold text-[#111b21] text-xs truncate group-hover:text-[#006b53]">
                              {sub.name}
                            </span>
                            <span className="block text-[11px] text-[#667781] truncate">
                              {sub.lastMessage}
                            </span>
                          </div>
                        </div>

                        {sub.unreadCount > 0 && (
                          <span className="min-w-5 h-5 px-1.5 bg-[#00a884] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {sub.unreadCount}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Community Details Canvas */}
      <div 
        id="community-details-canvas" 
        className="flex-1 h-full flex flex-col items-center justify-center p-6 md:p-12 bg-mesh-mint overflow-y-auto text-center"
      >
        {selectedCommunity ? (
          <div className="max-w-md w-full bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-xl flex flex-col items-center space-y-6">
            <img
              src={selectedCommunity.avatar}
              alt={selectedCommunity.name}
              className="w-24 h-24 rounded-3xl object-cover shadow-lg ring-4 ring-[#00a884]/20"
            />
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-[#111b21]">
                {selectedCommunity.name}
              </h3>
              <p className="text-xs text-[#667781] leading-relaxed">
                {selectedCommunity.description}
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 py-2 px-6 bg-[#e8f5f1] rounded-2xl border border-[#00a884]/20 text-xs text-[#006b53] font-bold">
              <span>👥 {selectedCommunity.membersCount} عضواً</span>
              <span>💬 {selectedCommunity.subGroups.length} مجموعات فرعية</span>
            </div>

            <div className="w-full space-y-2 text-right">
              <span className="text-xs font-bold text-[#111b21] block px-1">
                المجموعات المتاحة
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                {selectedCommunity.subGroups.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => onSelectSubGroup(sub)}
                    className="w-full p-2.5 rounded-xl bg-white hover:bg-[#e8f5f1] border border-black/5 flex items-center justify-between text-right text-xs font-medium cursor-pointer transition-colors"
                  >
                    <span>{sub.name}</span>
                    <span className="text-[11px] text-[#006b53]">انضمام للدردشة ←</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-[#667781]">
            <Users2 className="w-12 h-12 text-[#006b53]" />
            <p className="text-sm font-semibold">اختر مجتمعاً لعرض تفاصيله ومجموعاته</p>
          </div>
        )}
      </div>

      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 border border-white/40 text-right">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-[#111b21]">إنشاء مجتمع جديد</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-full hover:bg-black/5 text-[#667781]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111b21] mb-1.5">
                اسم المجتمع
              </label>
              <input
                type="text"
                value={newCommName}
                onChange={(e) => setNewCommName(e.target.value)}
                placeholder="مثال: نادي القراءة الرقمي"
                className="w-full p-3 bg-black/5 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00a884]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111b21] mb-1.5">
                وصف المجتمع
              </label>
              <textarea
                value={newCommDesc}
                onChange={(e) => setNewCommDesc(e.target.value)}
                placeholder="صف أهداف المجتمع ومن يُسمح لهم بالانضمام..."
                rows={3}
                className="w-full p-3 bg-black/5 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00a884]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#667781] hover:bg-black/5 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreate}
                disabled={!newCommName.trim()}
                className="px-6 py-2.5 rounded-xl bg-[#006b53] text-white text-xs font-bold shadow-md hover:bg-[#00523f] disabled:opacity-50 cursor-pointer"
              >
                إنشاء المجتمع ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
