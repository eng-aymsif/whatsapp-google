export type TabType = 'chats' | 'status' | 'communities' | 'channels' | 'settings';

export interface User {
  id: string;
  name: string;
  avatar: string;
  statusText: string;
  phone: string;
  online: boolean;
  lastSeen?: string;
  isVerified?: boolean;
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface Attachment {
  type: 'image' | 'video' | 'file' | 'audio' | 'voice' | 'location';
  url: string;
  name?: string;
  size?: string;
  duration?: string;
  thumbnail?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isOutgoing: boolean;
  replyToId?: string;
  replyToText?: string;
  replyToSender?: string;
  attachment?: Attachment;
  reactions?: { [emoji: string]: number };
  isStarred?: boolean;
  isPinned?: boolean;
}

export interface Chat {
  id: string;
  type: 'direct' | 'group' | 'channel';
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isOnline?: boolean;
  lastSeen?: string;
  isTyping?: boolean;
  groupMembersCount?: number;
  messages: Message[];
  about?: string;
  phone?: string;
  sharedMediaCount?: number;
  sharedDocsCount?: number;
  sharedLinksCount?: number;
}

export interface Story {
  id: string;
  mediaUrl: string;
  mediaType: 'image' | 'text';
  text?: string;
  backgroundColor?: string;
  timestamp: string;
  viewed: boolean;
}

export interface UserStatus {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  lastUpdated: string;
  allViewed: boolean;
  stories: Story[];
}

export interface CommunitySubGroup {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isAnnouncement?: boolean;
}

export interface Community {
  id: string;
  name: string;
  avatar: string;
  description: string;
  membersCount: number;
  subGroups: CommunitySubGroup[];
}

export interface ChannelPost {
  id: string;
  channelId: string;
  content: string;
  mediaUrl?: string;
  timestamp: string;
  views: number;
  forwards: number;
  reactions: { [emoji: string]: number };
}

export interface Channel {
  id: string;
  name: string;
  avatar: string;
  description: string;
  subscribersCount: string;
  isVerified: boolean;
  isFollowing: boolean;
  category: string;
  posts: ChannelPost[];
}

export interface CallSession {
  isActive: boolean;
  type: 'voice' | 'video';
  contact: {
    name: string;
    avatar: string;
    status: string;
  };
  duration: number;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeaker: boolean;
}
