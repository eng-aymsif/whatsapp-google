import React, { useState } from 'react';
import { 
  TabType, 
  Chat, 
  UserStatus, 
  Community, 
  Channel, 
  User, 
  Message, 
  Attachment, 
  Story, 
  CallSession, 
  CommunitySubGroup 
} from './types';
import { 
  currentUser as initialUser, 
  mockChats as initialChats, 
  mockStatuses as initialStatuses, 
  mockCommunities as initialCommunities, 
  mockChannels as initialChannels, 
  allContacts 
} from './data/mockData';

import { NavigationSidebar } from './components/NavigationSidebar';
import { ChatsView } from './components/ChatsView';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ActiveChatView } from './components/ActiveChatView';
import { StatusView } from './components/StatusView';
import { CommunitiesView } from './components/CommunitiesView';
import { ChannelsView } from './components/ChannelsView';
import { SettingsView } from './components/SettingsView';
import { ProfileModal } from './components/ProfileModal';
import { CallModal } from './components/CallModal';
import { NewChatModal } from './components/NewChatModal';
import { QRCodeModal } from './components/QRCodeModal';
import { ContactInfoDrawer } from './components/ContactInfoDrawer';

export default function App() {
  // Navigation & View states
  const [activeTab, setActiveTab] = useState<TabType>('chats');
  const [selectedChatId, setSelectedChatId] = useState<string | null>('chat-alice');
  const [showContactInfo, setShowContactInfo] = useState(false);

  // App Data States
  const [user, setUser] = useState<User>(initialUser);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [statuses, setStatuses] = useState<UserStatus[]>(initialStatuses);
  const [communities, setCommunities] = useState<Community[]>(initialCommunities);
  const [channels, setChannels] = useState<Channel[]>(initialChannels);

  // Modals & Overlays
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [callSession, setCallSession] = useState<CallSession | null>(null);

  const selectedChat = chats.find((c) => c.id === selectedChatId) || null;

  // Handler: Send Message
  const handleSendMessage = (
    chatId: string,
    text: string,
    attachment?: Attachment,
    replyTo?: Message
  ) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      text: text || undefined,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      isOutgoing: true,
      attachment,
      replyToId: replyTo?.id,
      replyToText: replyTo?.text,
      replyToSender: replyTo?.isOutgoing ? 'أنت' : selectedChat?.name,
    };

    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          const updatedMessages = [...c.messages, newMessage];
          return {
            ...c,
            lastMessage: text || (attachment?.type === 'voice' ? 'تسجيل صوتي 🎤' : 'مرفق وسائط 📎'),
            lastMessageTime: newMessage.timestamp,
            messages: updatedMessages,
          };
        }
        return c;
      })
    );

    // Simulate friend automated response
    setTimeout(() => {
      setChats((prev) =>
        prev.map((c) => {
          if (c.id === chatId) {
            const replies = [
              'تم استلام رسالتك! يعطيك ألف عافية 🌿',
              'ممتاز جداً، سأقوم بمتابعة الأمر في أقرب وقت ✨',
              'شكراً لكِ على التوضيح والاهتمام 👍',
              'رائع للغاية! دعنا نواصل العمل عليها 🚀',
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            const autoMsg: Message = {
              id: `msg-${Date.now() + 1}`,
              senderId: c.id,
              text: randomReply,
              timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
              status: 'read',
              isOutgoing: false,
            };

            return {
              ...c,
              lastMessage: randomReply,
              lastMessageTime: autoMsg.timestamp,
              messages: [...c.messages, autoMsg],
            };
          }
          return c;
        })
      );
    }, 2000);
  };

  // Handler: Emoji reaction to message
  const handleReactToMessage = (chatId: string, messageId: string, emoji: string) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== chatId) return chat;
        const updatedMsgs = chat.messages.map((m) => {
          if (m.id !== messageId) return m;
          const currentReactions = { ...(m.reactions || {}) };
          currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;
          return { ...m, reactions: currentReactions };
        });
        return { ...chat, messages: updatedMsgs };
      })
    );
  };

  // Handler: Start Call
  const handleStartCall = (chat: Chat, type: 'voice' | 'video') => {
    setCallSession({
      isActive: true,
      type,
      contact: {
        name: chat.name,
        avatar: chat.avatar,
        status: 'جاري الاتصال...',
      },
      duration: 0,
      isMuted: false,
      isVideoOff: false,
      isSpeaker: false,
    });
  };

  // Handler: Add New Story
  const handleAddNewStory = (newStoryData: Partial<Story>) => {
    const newStory: Story = {
      id: `story-${Date.now()}`,
      mediaUrl: newStoryData.mediaUrl || '',
      mediaType: newStoryData.mediaType || 'text',
      text: newStoryData.text,
      backgroundColor: newStoryData.backgroundColor,
      timestamp: 'الآن',
      viewed: false,
    };

    setStatuses((prev) =>
      prev.map((s) => {
        if (s.userId === 'current_user') {
          return {
            ...s,
            lastUpdated: 'الآن',
            stories: [newStory, ...s.stories],
          };
        }
        return s;
      })
    );
  };

  // Handler: Select contact to start chat
  const handleSelectContactForChat = (contact: User) => {
    const existing = chats.find((c) => c.name === contact.name);
    if (existing) {
      setSelectedChatId(existing.id);
      setActiveTab('chats');
      return;
    }

    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      type: 'direct',
      name: contact.name,
      avatar: contact.avatar,
      lastMessage: 'بدء محادثة جديدة',
      lastMessageTime: 'الآن',
      unreadCount: 0,
      phone: contact.phone,
      about: contact.statusText,
      messages: [],
    };

    setChats([newChat, ...chats]);
    setSelectedChatId(newChat.id);
    setActiveTab('chats');
  };

  // Handler: Create Group
  const handleCreateGroup = (groupName: string, members: User[]) => {
    const newGroupChat: Chat = {
      id: `group-${Date.now()}`,
      type: 'group',
      name: groupName,
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      lastMessage: `أنشأت ليلى المجموعة مع ${members.length} أعضاء`,
      lastMessageTime: 'الآن',
      unreadCount: 0,
      groupMembersCount: members.length + 1,
      about: `مجموعة ${groupName}`,
      messages: [
        {
          id: `msg-init-${Date.now()}`,
          senderId: user.id,
          text: `👋 مرحباً بالجميع في مجموعة ${groupName}!`,
          timestamp: 'الآن',
          status: 'read',
          isOutgoing: true,
        },
      ],
    };

    setChats([newGroupChat, ...chats]);
    setSelectedChatId(newGroupChat.id);
    setActiveTab('chats');
  };

  // Handler: Create Community
  const handleCreateCommunity = (name: string, desc: string) => {
    const newCommunity: Community = {
      id: `comm-${Date.now()}`,
      name,
      avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80',
      description: desc,
      membersCount: 1,
      subGroups: [
        {
          id: `sub-ann-${Date.now()}`,
          name: '📢 الإعلانات الرسمية',
          avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80',
          lastMessage: `مرحباً بك في مجتمع ${name}`,
          lastMessageTime: 'الآن',
          unreadCount: 0,
          isAnnouncement: true,
        },
      ],
    };

    setCommunities([newCommunity, ...communities]);
    setActiveTab('communities');
  };

  // Handler: Select SubGroup in Community
  const handleSelectSubGroup = (subGroup: CommunitySubGroup) => {
    const existing = chats.find((c) => c.name === subGroup.name);
    if (existing) {
      setSelectedChatId(existing.id);
      setActiveTab('chats');
    } else {
      const newSubChat: Chat = {
        id: `chat-sub-${subGroup.id}`,
        type: 'group',
        name: subGroup.name,
        avatar: subGroup.avatar,
        lastMessage: subGroup.lastMessage,
        lastMessageTime: subGroup.lastMessageTime,
        unreadCount: 0,
        messages: [
          {
            id: `msg-${Date.now()}`,
            senderId: 'system',
            text: `انضممت إلى مجموعة ${subGroup.name}`,
            timestamp: 'الآن',
            status: 'read',
            isOutgoing: false,
          },
        ],
      };
      setChats([newSubChat, ...chats]);
      setSelectedChatId(newSubChat.id);
      setActiveTab('chats');
    }
  };

  // Handler: Toggle Channel Follow
  const handleToggleChannelFollow = (channelId: string) => {
    setChannels((prev) =>
      prev.map((ch) => {
        if (ch.id === channelId) {
          return { ...ch, isFollowing: !ch.isFollowing };
        }
        return ch;
      })
    );
  };

  // Handler: React to Channel Post
  const handleReactChannelPost = (channelId: string, postId: string, emoji: string) => {
    setChannels((prev) =>
      prev.map((ch) => {
        if (ch.id !== channelId) return ch;
        const updatedPosts = ch.posts.map((p) => {
          if (p.id !== postId) return p;
          const current = { ...p.reactions };
          current[emoji] = (current[emoji] || 0) + 1;
          return { ...p, reactions: current };
        });
        return { ...ch, posts: updatedPosts };
      })
    );
  };

  const unreadChatsCount = chats.reduce((acc, c) => acc + c.unreadCount, 0);
  const hasUnreadStatus = statuses.some((s) => s.userId !== 'current_user' && !s.allViewed);

  return (
    <div 
      id="lumina-app-root" 
      className="w-screen h-screen overflow-hidden flex bg-mesh-mint font-['Tajawal',sans-serif]"
    >
      {/* 1. Global Navigation Sidebar */}
      <NavigationSidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'chats') {
            setShowContactInfo(false);
          }
        }}
        currentUser={user}
        onOpenProfile={() => setShowProfileModal(true)}
        unreadChatsCount={unreadChatsCount}
        hasUnreadStatus={hasUnreadStatus}
        onOpenQR={() => setShowQRModal(true)}
      />

      {/* 2. Main Tab View Area */}
      <main id="lumina-main-viewport" className="flex-1 h-full flex overflow-hidden relative">
        {/* Chats View */}
        {activeTab === 'chats' && (
          <div className="flex-1 h-full flex overflow-hidden">
            {/* Chats List Sidebar */}
            <ChatsView
              chats={chats}
              selectedChatId={selectedChatId}
              onSelectChat={(id) => {
                setSelectedChatId(id);
                // Mark unread as 0
                setChats((prev) =>
                  prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
                );
              }}
              onOpenNewChat={() => setShowNewChatModal(true)}
            />

            {/* Active Chat or Welcome Screen */}
            {selectedChat ? (
              <div className="flex-1 h-full flex overflow-hidden">
                <ActiveChatView
                  chat={selectedChat}
                  onBack={() => setSelectedChatId(null)}
                  onSendMessage={handleSendMessage}
                  onStartCall={handleStartCall}
                  onToggleContactInfo={() => setShowContactInfo(!showContactInfo)}
                  onReactToMessage={handleReactToMessage}
                />

                {/* Contact Info Drawer */}
                {showContactInfo && (
                  <ContactInfoDrawer
                    chat={selectedChat}
                    onClose={() => setShowContactInfo(false)}
                    onStartCall={handleStartCall}
                  />
                )}
              </div>
            ) : (
              <WelcomeScreen
                onStartNewChat={() => setShowNewChatModal(true)}
                onCreateCommunity={() => {
                  setActiveTab('communities');
                }}
                onOpenQR={() => setShowQRModal(true)}
              />
            )}
          </div>
        )}

        {/* Status View */}
        {activeTab === 'status' && (
          <StatusView
            statuses={statuses}
            currentUser={user}
            onAddNewStory={handleAddNewStory}
          />
        )}

        {/* Communities View */}
        {activeTab === 'communities' && (
          <CommunitiesView
            communities={communities}
            onSelectSubGroup={handleSelectSubGroup}
            onCreateCommunity={handleCreateCommunity}
          />
        )}

        {/* Channels View */}
        {activeTab === 'channels' && (
          <ChannelsView
            channels={channels}
            onToggleFollow={handleToggleChannelFollow}
            onReactPost={handleReactChannelPost}
          />
        )}

        {/* Settings View */}
        {activeTab === 'settings' && (
          <SettingsView
            currentUser={user}
            onOpenProfile={() => setShowProfileModal(true)}
            onOpenQR={() => setShowQRModal(true)}
          />
        )}
      </main>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          currentUser={user}
          onClose={() => setShowProfileModal(false)}
          onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
        />
      )}

      {/* New Chat & Group Modal */}
      {showNewChatModal && (
        <NewChatModal
          contacts={allContacts}
          onClose={() => setShowNewChatModal(false)}
          onSelectContact={handleSelectContactForChat}
          onCreateGroup={handleCreateGroup}
        />
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <QRCodeModal
          currentUser={user}
          onClose={() => setShowQRModal(false)}
        />
      )}

      {/* Call Session Modal */}
      {callSession && (
        <CallModal
          session={callSession}
          onEndCall={() => setCallSession(null)}
          onToggleMute={() =>
            setCallSession((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null))
          }
          onToggleVideo={() =>
            setCallSession((prev) => (prev ? { ...prev, isVideoOff: !prev.isVideoOff } : null))
          }
          onToggleSpeaker={() =>
            setCallSession((prev) => (prev ? { ...prev, isSpeaker: !prev.isSpeaker } : null))
          }
        />
      )}
    </div>
  );
}
