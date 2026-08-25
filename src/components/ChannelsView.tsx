import React, { useState } from 'react';
import { 
  Radio, 
  Search, 
  CheckCircle2, 
  Share2, 
  Eye, 
  Heart, 
  Flame, 
  Sparkles, 
  Plus, 
  Check, 
  Compass, 
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import { Channel, ChannelPost } from '../types';

interface ChannelsViewProps {
  channels: Channel[];
  onToggleFollow: (channelId: string) => void;
  onReactPost: (channelId: string, postId: string, emoji: string) => void;
}

export const ChannelsView: React.FC<ChannelsViewProps> = ({
  channels,
  onToggleFollow,
  onReactPost,
}) => {
  const [selectedChannelId, setSelectedChannelId] = useState<string>(channels[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  const selectedChannel = channels.find((c) => c.id === selectedChannelId) || channels[0];
  const followedChannels = channels.filter((c) => c.isFollowing);
  const discoverChannels = channels.filter((c) => !c.isFollowing);

  const categories = ['الكل', 'تكنولوجيا', 'تصميم وفنون', 'أعمال واستثمار', 'علوم وطبيعة'];

  return (
    <div id="channels-main-container" className="flex-1 h-full flex flex-col md:flex-row overflow-hidden bg-[#f4fbf6]">
      {/* Channels Sidebar Column */}
      <div 
        id="channels-sidebar-list"
        className="w-full md:w-80 lg:w-96 h-full flex flex-col bg-white/70 backdrop-blur-xl border-l border-white/50 overflow-y-auto custom-scrollbar select-none"
      >
        <div className="p-4 flex items-center justify-between border-b border-black/[0.04]">
          <h2 className="text-2xl font-bold text-[#111b21]">القنوات</h2>
          <span className="px-2 py-0.5 bg-[#e8f5f1] text-[#006b53] text-xs font-bold rounded-full">
            متابعة ومستجدات
          </span>
        </div>

        {/* Search */}
        <div className="px-4 py-2.5">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute right-3.5 text-[#667781] pointer-events-none" />
            <input
              type="text"
              placeholder="البحث في القنوات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-white/80 border border-black/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00a884]/40 text-[#111b21] shadow-inner"
            />
          </div>
        </div>

        <div className="p-3 space-y-4">
          {/* Followed Channels */}
          <div>
            <span className="text-xs font-bold text-[#006b53] uppercase tracking-wider px-2 block mb-2">
              القنوات التي تتابعها ({followedChannels.length})
            </span>
            <div className="space-y-1">
              {followedChannels.map((channel) => {
                const isSelected = selectedChannel?.id === channel.id;
                return (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannelId(channel.id)}
                    className={`w-full p-3 rounded-2xl flex items-center gap-3 text-right transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#e8f5f1] border border-[#00a884]/30 shadow-xs'
                        : 'hover:bg-white/80 border border-transparent'
                    }`}
                  >
                    <img
                      src={channel.avatar}
                      alt={channel.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-1 ring-black/5 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-[#111b21] text-sm truncate">
                          {channel.name}
                        </h4>
                        {channel.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00a884] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#667781] truncate mt-0.5">
                        {channel.posts[0]?.content || channel.subscribersCount}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Discover Channels */}
          <div>
            <span className="text-xs font-bold text-[#667781] uppercase tracking-wider px-2 block mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#006b53]" />
              <span>اكتشف قنوات جديدة</span>
            </span>
            <div className="space-y-2">
              {discoverChannels.map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => setSelectedChannelId(channel.id)}
                  className="p-3 rounded-2xl bg-white/60 hover:bg-white border border-black/5 flex items-center justify-between gap-3 cursor-pointer transition-all hover:shadow-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={channel.avatar}
                      alt={channel.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 text-right">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-[#111b21] text-xs truncate">
                          {channel.name}
                        </span>
                        {channel.isVerified && (
                          <CheckCircle2 className="w-3 h-3 text-[#00a884] shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-[#667781] block truncate">
                        {channel.subscribersCount}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFollow(channel.id);
                    }}
                    className="px-3 py-1 bg-[#e8f5f1] hover:bg-[#006b53] hover:text-white text-[#006b53] text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    متابعة +
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Channel Feed Canvas */}
      <div 
        id="channel-feed-canvas" 
        className="flex-1 h-full flex flex-col bg-[#f4fbf6] overflow-hidden"
      >
        {selectedChannel ? (
          <>
            {/* Channel Top Header */}
            <div className="p-4 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] flex items-center justify-between z-10 shadow-xs">
              <div className="flex items-center gap-3">
                <img
                  src={selectedChannel.avatar}
                  alt={selectedChannel.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-xs"
                />
                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-[#111b21] text-base">
                      {selectedChannel.name}
                    </h3>
                    {selectedChannel.isVerified && (
                      <CheckCircle2 className="w-4 h-4 text-[#00a884]" />
                    )}
                  </div>
                  <p className="text-xs text-[#667781]">
                    {selectedChannel.subscribersCount} • {selectedChannel.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleFollow(selectedChannel.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedChannel.isFollowing
                      ? 'bg-black/5 text-[#111b21] hover:bg-black/10'
                      : 'bg-[#006b53] text-white hover:bg-[#00523f] shadow-md shadow-[#006b53]/20'
                  }`}
                >
                  {selectedChannel.isFollowing ? '✓ تتابع القناة' : 'متابعة القناة +'}
                </button>
                <button
                  onClick={() => alert(`تم نسخ رابط قناة: ${selectedChannel.name}`)}
                  className="p-2.5 rounded-xl hover:bg-black/5 text-[#667781] cursor-pointer"
                  title="مشاركة القناة"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Posts Stream */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-6 bg-mesh-mint">
              {selectedChannel.posts.map((post) => (
                <div
                  key={post.id}
                  className="max-w-2xl mx-auto bg-white/90 backdrop-blur-xl rounded-3xl p-5 border border-white/60 shadow-sm space-y-4 text-right"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between text-xs text-[#667781]">
                    <div className="flex items-center gap-2">
                      <img
                        src={selectedChannel.avatar}
                        alt={selectedChannel.name}
                        className="w-7 h-7 rounded-lg object-cover"
                      />
                      <span className="font-bold text-[#111b21]">{selectedChannel.name}</span>
                    </div>
                    <span>{post.timestamp}</span>
                  </div>

                  {/* Post Image */}
                  {post.mediaUrl && (
                    <div className="rounded-2xl overflow-hidden shadow-inner">
                      <img
                        src={post.mediaUrl}
                        alt="Post media"
                        className="w-full max-h-96 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Post Content */}
                  <p className="text-sm md:text-[15px] text-[#111b21] leading-relaxed select-text whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {/* Post Footer & Reactions */}
                  <div className="flex items-center justify-between pt-3 border-t border-black/5 text-xs text-[#667781]">
                    {/* Reactions */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {Object.entries(post.reactions).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          onClick={() => onReactPost(selectedChannel.id, post.id, emoji)}
                          className="px-2.5 py-1 rounded-full bg-[#f4fbf6] hover:bg-[#e8f5f1] border border-black/5 flex items-center gap-1 font-semibold text-[#006b53] cursor-pointer transition-transform hover:scale-105"
                        >
                          <span>{emoji}</span>
                          <span className="text-[11px]">{count}</span>
                        </button>
                      ))}
                    </div>

                    {/* Views & Forward */}
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{post.views.toLocaleString('ar-SA')}</span>
                      </span>
                      <button
                        onClick={() => alert('تمت إعادة توجيه المنشور بنجاح!')}
                        className="p-1 rounded-lg hover:bg-black/5 text-[#667781] hover:text-[#006b53]"
                        title="إعادة توجيه"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#667781]">
            <Radio className="w-12 h-12 text-[#006b53] mb-2" />
            <p className="text-sm font-semibold">اختر قناة لعرض منشوراتها</p>
          </div>
        )}
      </div>
    </div>
  );
};
