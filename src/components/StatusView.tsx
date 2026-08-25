import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Eye, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Send, 
  Heart, 
  Flame, 
  Smile, 
  Sparkles, 
  Image as ImageIcon,
  Type,
  Camera
} from 'lucide-react';
import { UserStatus, Story, User } from '../types';

interface StatusViewProps {
  statuses: UserStatus[];
  currentUser: User;
  onAddNewStory: (story: Partial<Story>) => void;
}

export const StatusView: React.FC<StatusViewProps> = ({
  statuses,
  currentUser,
  onAddNewStory,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStatusText, setNewStatusText] = useState('');
  const [newStatusBg, setNewStatusBg] = useState('#006b53');
  const [replyText, setReplyText] = useState('');

  const myStatus = statuses.find((s) => s.userId === 'current_user');
  const recentStatuses = statuses.filter((s) => s.userId !== 'current_user' && !s.allViewed);
  const viewedStatuses = statuses.filter((s) => s.userId !== 'current_user' && s.allViewed);

  // Story progression timer
  useEffect(() => {
    if (!selectedStatus || isPaused) return;

    const timer = setTimeout(() => {
      if (currentStoryIndex < selectedStatus.stories.length - 1) {
        setCurrentStoryIndex((prev) => prev + 1);
      } else {
        // Move to next status if available, or close
        const currentIndex = statuses.findIndex((s) => s.id === selectedStatus.id);
        if (currentIndex < statuses.length - 1) {
          setSelectedStatus(statuses[currentIndex + 1]);
          setCurrentStoryIndex(0);
        } else {
          setSelectedStatus(null);
          setCurrentStoryIndex(0);
        }
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [selectedStatus, currentStoryIndex, isPaused, statuses]);

  const handleOpenStatus = (status: UserStatus) => {
    setSelectedStatus(status);
    setCurrentStoryIndex(0);
  };

  const handleNextStory = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedStatus) return;
    if (currentStoryIndex < selectedStatus.stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
    } else {
      setSelectedStatus(null);
    }
  };

  const handlePrevStory = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedStatus) return;
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
    }
  };

  const handleCreateTextStory = () => {
    if (!newStatusText.trim()) return;
    onAddNewStory({
      mediaType: 'text',
      text: newStatusText.trim(),
      backgroundColor: newStatusBg,
      timestamp: 'الآن',
      viewed: false,
    });
    setNewStatusText('');
    setShowAddModal(false);
  };

  const colors = ['#006b53', '#00a884', '#0284c7', '#7c3aed', '#db2777', '#d97706', '#1e293b'];

  return (
    <div id="status-main-container" className="flex-1 h-full flex flex-col md:flex-row overflow-hidden bg-[#f4fbf6]">
      {/* Status List Column */}
      <div 
        id="status-sidebar-list"
        className="w-full md:w-80 lg:w-96 h-full flex flex-col bg-white/70 backdrop-blur-xl border-l border-white/50 overflow-y-auto custom-scrollbar select-none"
      >
        <div className="p-4 flex items-center justify-between border-b border-black/[0.04]">
          <h2 className="text-2xl font-bold text-[#111b21]">الحالة</h2>
          <button
            id="btn-status-add-trigger"
            onClick={() => setShowAddModal(true)}
            className="p-2 rounded-xl bg-[#006b53] text-white hover:bg-[#00523f] shadow-md shadow-[#006b53]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="إضافة حالة جديدة"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 space-y-4">
          {/* My Status Card */}
          <div
            onClick={() => (myStatus?.stories.length ? handleOpenStatus(myStatus) : setShowAddModal(true))}
            className="p-3 rounded-2xl bg-white/80 hover:bg-white border border-black/5 flex items-center gap-3 cursor-pointer transition-all hover:shadow-xs group"
          >
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-13 h-13 rounded-2xl object-cover ring-2 ring-[#00a884]"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddModal(true);
                }}
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#00a884] text-white rounded-full flex items-center justify-center border-2 border-white shadow-xs group-hover:scale-110 transition-transform"
                title="إضافة حالة"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
            <div className="flex-1 min-w-0 text-right">
              <h4 className="font-bold text-[#111b21] text-[15px]">حالتي</h4>
              <p className="text-xs text-[#667781] truncate">
                {myStatus?.stories.length
                  ? `آخر تحديث ${myStatus.lastUpdated}`
                  : 'انقر لإضافة تحديث حالة'}
              </p>
            </div>
          </div>

          {/* Recent Updates */}
          <div>
            <span className="text-xs font-bold text-[#006b53] uppercase tracking-wider px-2 block mb-2">
              التحديثات الأخيرة ({recentStatuses.length})
            </span>
            <div className="space-y-1">
              {recentStatuses.map((status) => (
                <button
                  key={status.id}
                  onClick={() => handleOpenStatus(status)}
                  className="w-full p-2.5 rounded-2xl hover:bg-white/80 flex items-center gap-3 text-right transition-all cursor-pointer group"
                >
                  <div className="relative shrink-0 p-0.5 rounded-2xl ring-2 ring-[#00a884] ring-offset-2">
                    <img
                      src={status.userAvatar}
                      alt={status.userName}
                      className="w-11 h-11 rounded-xl object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-[#111b21] text-sm truncate">
                      {status.userName}
                    </h5>
                    <span className="text-[11px] text-[#667781]">
                      {status.lastUpdated}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Viewed Updates */}
          {viewedStatuses.length > 0 && (
            <div>
              <span className="text-xs font-bold text-[#667781] uppercase tracking-wider px-2 block mb-2">
                التحديثات التي تمت مشاهدتها ({viewedStatuses.length})
              </span>
              <div className="space-y-1">
                {viewedStatuses.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => handleOpenStatus(status)}
                    className="w-full p-2.5 rounded-2xl hover:bg-white/80 flex items-center gap-3 text-right transition-all cursor-pointer opacity-75 hover:opacity-100"
                  >
                    <div className="relative shrink-0 p-0.5 rounded-2xl ring-2 ring-gray-300 ring-offset-1">
                      <img
                        src={status.userAvatar}
                        alt={status.userName}
                        className="w-11 h-11 rounded-xl object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-[#111b21] text-sm truncate">
                        {status.userName}
                      </h5>
                      <span className="text-[11px] text-[#667781]">
                        {status.lastUpdated}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Status Viewer Area */}
      <div 
        id="status-viewer-canvas"
        className="flex-1 h-full flex flex-col items-center justify-center p-4 md:p-8 bg-black/90 relative overflow-hidden"
      >
        {selectedStatus ? (
          /* Active Story View */
          <div 
            className="relative w-full max-w-md h-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-4"
            style={{
              backgroundColor:
                selectedStatus.stories[currentStoryIndex]?.backgroundColor || '#111b21',
            }}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Background Photo if image story */}
            {selectedStatus.stories[currentStoryIndex]?.mediaType === 'image' && (
              <img
                src={selectedStatus.stories[currentStoryIndex].mediaUrl}
                alt="Story"
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
            )}

            {/* Subtle dark overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-1 pointer-events-none"></div>

            {/* Top Section: Progress bars & User info */}
            <div className="relative z-10 space-y-3">
              {/* Progress bars */}
              <div className="flex items-center gap-1.5 w-full">
                {selectedStatus.stories.map((st, idx) => (
                  <div
                    key={st.id}
                    className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                  >
                    <div
                      className={`h-full bg-white transition-all duration-300 ${
                        idx < currentStoryIndex
                          ? 'w-full'
                          : idx === currentStoryIndex
                          ? isPaused
                            ? 'w-1/2'
                            : 'w-full transition-[width] duration-5000 ease-linear'
                          : 'w-0'
                      }`}
                    ></div>
                  </div>
                ))}
              </div>

              {/* User header */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  <img
                    src={selectedStatus.userAvatar}
                    alt={selectedStatus.userName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                  />
                  <div>
                    <h4 className="font-bold text-sm leading-none">
                      {selectedStatus.userName}
                    </h4>
                    <span className="text-[11px] text-white/70">
                      {selectedStatus.stories[currentStoryIndex]?.timestamp || selectedStatus.lastUpdated}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStatus(null)}
                  className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-md cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Middle Section: Story Content & Tap Zones */}
            <div className="relative z-10 flex-1 flex items-center justify-center p-6 text-center">
              {/* Tap Left / Right */}
              <div
                className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-pointer"
                onClick={handlePrevStory}
                title="السابق"
              ></div>
              <div
                className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer"
                onClick={handleNextStory}
                title="التالي"
              ></div>

              {/* Text content */}
              {selectedStatus.stories[currentStoryIndex]?.text && (
                <div className="bg-black/40 backdrop-blur-md px-5 py-3 rounded-2xl max-w-sm text-white font-medium text-lg leading-relaxed shadow-lg border border-white/10">
                  {selectedStatus.stories[currentStoryIndex].text}
                </div>
              )}
            </div>

            {/* Bottom Section: Reply Input */}
            <div className="relative z-20 flex items-center gap-2 pt-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="رد على الحالة..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full py-2.5 px-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white placeholder-white/70 text-xs focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <button
                onClick={() => {
                  if (replyText.trim()) {
                    alert(`تم إرسال ردك إلى ${selectedStatus.userName}: "${replyText}"`);
                    setReplyText('');
                  }
                }}
                className="p-2.5 rounded-full bg-white text-[#006b53] hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>
              <button
                onClick={() => {
                  alert(`أرسلت إعجاباً بحالة ${selectedStatus.userName} ❤️`);
                }}
                className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-red-400 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={() => {
                  alert(`أرسلت تفاعلاً نارياً 🔥 بحالة ${selectedStatus.userName}`);
                }}
                className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-amber-400 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>
        ) : (
          /* Empty placeholder */
          <div className="flex flex-col items-center gap-4 text-center max-w-sm text-white/80">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-[#00a884] ring-4 ring-[#00a884]/20 animate-pulse">
              <Sparkles className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">انقر على حالة لعرضها</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              تختفي الحالات تلقائياً بعد 24 ساعة من نشرها. يمكنك متابعة يوميات أصدقائك أو مشاركة حالتك الجديدة الآن.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#00a884] text-white font-bold text-xs hover:bg-[#008f6b] transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة حالة جديدة</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Story Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 border border-white/40 text-right">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-[#111b21]">إضافة حالة جديدة</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full hover:bg-black/5 text-[#667781]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Box */}
            <div
              className="w-full h-48 rounded-2xl p-4 flex items-center justify-center text-center text-white font-bold text-lg shadow-inner transition-colors"
              style={{ backgroundColor: newStatusBg }}
            >
              <p className="max-w-xs">{newStatusText || 'اكتب نص حالتك هنا...'}</p>
            </div>

            {/* Text Input */}
            <div>
              <label className="block text-xs font-bold text-[#111b21] mb-1.5">
                نص الحالة
              </label>
              <textarea
                value={newStatusText}
                onChange={(e) => setNewStatusText(e.target.value)}
                placeholder="ما الذي يدور في ذهنك اليوم؟"
                rows={3}
                className="w-full p-3 bg-black/5 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00a884]"
              />
            </div>

            {/* Color Palette */}
            <div>
              <label className="block text-xs font-bold text-[#111b21] mb-2">
                اختر لون الخلفية
              </label>
              <div className="flex items-center gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewStatusBg(c)}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 rounded-full cursor-pointer transition-transform ${
                      newStatusBg === c ? 'scale-125 ring-2 ring-offset-2 ring-black' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#667781] hover:bg-black/5 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateTextStory}
                disabled={!newStatusText.trim()}
                className="px-6 py-2.5 rounded-xl bg-[#006b53] text-white text-xs font-bold shadow-md hover:bg-[#00523f] disabled:opacity-50 cursor-pointer"
              >
                نشر الحالة 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
