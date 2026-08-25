import React, { useState, useRef, useEffect } from 'react';
import { 
  Phone, 
  Video, 
  Search, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Mic, 
  Send, 
  Check, 
  CheckCheck, 
  ChevronLeft, 
  FileText, 
  Download, 
  Play, 
  Pause, 
  Image as ImageIcon, 
  FileCode, 
  MapPin, 
  UserCheck, 
  X, 
  CornerDownRight, 
  Trash2, 
  Copy, 
  Volume2, 
  Sparkles,
  Info,
  Radio
} from 'lucide-react';
import { Chat, Message, Attachment } from '../types';

interface ActiveChatViewProps {
  chat: Chat;
  onBack?: () => void;
  onSendMessage: (chatId: string, text: string, attachment?: Attachment, replyTo?: Message) => void;
  onStartCall: (chat: Chat, type: 'voice' | 'video') => void;
  onToggleContactInfo: () => void;
  onReactToMessage: (chatId: string, messageId: string, emoji: string) => void;
}

export const ActiveChatView: React.FC<ActiveChatViewProps> = ({
  chat,
  onBack,
  onSendMessage,
  onStartCall,
  onToggleContactInfo,
  onReactToMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const [replyingMessage, setReplyingMessage] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState<{ [id: string]: boolean }>({});
  const [voiceSpeed, setVoiceSpeed] = useState<{ [id: string]: number }>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const [searchInChat, setSearchInChat] = useState(false);
  const [searchWord, setSearchWord] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordIntervalRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages.length]);

  // Voice recording timer simulation
  useEffect(() => {
    if (isRecording) {
      setRecordTimer(0);
      recordIntervalRef.current = setInterval(() => {
        setRecordTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
      setRecordTimer(0);
    }
    return () => {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    };
  }, [isRecording]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(chat.id, inputText.trim(), undefined, replyingMessage || undefined);
    setInputText('');
    setReplyingMessage(null);
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const togglePlayVoice = (msgId: string) => {
    setIsPlayingVoice((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  const toggleSpeed = (msgId: string) => {
    setVoiceSpeed((prev) => {
      const current = prev[msgId] || 1;
      const next = current === 1 ? 1.5 : current === 1.5 ? 2 : 1;
      return { ...prev, [msgId]: next };
    });
  };

  const handleSendVoiceNote = () => {
    setIsRecording(false);
    const fakeDuration = `0:${recordTimer < 10 ? '0' : ''}${recordTimer || 3}`;
    onSendMessage(chat.id, '', {
      type: 'voice',
      url: '#',
      duration: fakeDuration,
      size: '420 KB',
    });
  };

  const handleSendPhotoSample = (url: string, name: string) => {
    setShowAttachmentMenu(false);
    onSendMessage(chat.id, 'مشاركة صورة من المعرض 📸', {
      type: 'image',
      url,
      name,
      size: '2.1 MB',
    });
  };

  const handleSendDocSample = (name: string, size: string) => {
    setShowAttachmentMenu(false);
    onSendMessage(chat.id, 'مستند العمل المشترك 📄', {
      type: 'file',
      url: '#',
      name,
      size,
    });
  };

  const popularEmojis = ['❤️', '👍', '😂', '🔥', '✨', '👏', '🙏', '😍'];

  return (
    <div 
      id="active-chat-window" 
      className="flex-1 h-full flex flex-col bg-[#f4fbf6] relative overflow-hidden"
    >
      {/* Top Chat Header */}
      <div 
        id="chat-header-bar" 
        className="h-16 px-4 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] flex items-center justify-between z-20 shadow-xs"
      >
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              id="btn-chat-back"
              onClick={onBack}
              className="md:hidden p-2 rounded-xl hover:bg-black/5 text-[#111b21] cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 rotate-180" />
            </button>
          )}

          <button
            id="btn-chat-profile-info"
            onClick={onToggleContactInfo}
            className="flex items-center gap-3 text-right hover:opacity-90 transition-opacity cursor-pointer min-w-0"
          >
            <div className="relative shrink-0">
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-black/10"
              />
              {chat.isOnline && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00a884] border-2 border-white rounded-full"></span>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-[#111b21] text-[15px] truncate">
                {chat.name}
              </h3>
              <p className="text-[12px] text-[#006b53] font-medium flex items-center gap-1.5 truncate">
                {chat.isTyping ? (
                  <span className="flex items-center gap-1 text-[#00a884] animate-pulse">
                    <span>يكتب الآن</span>
                    <span className="flex gap-0.5">
                      <span className="w-1 h-1 bg-[#00a884] rounded-full animate-bounce"></span>
                      <span className="w-1 h-1 bg-[#00a884] rounded-full animate-bounce delay-100"></span>
                      <span className="w-1 h-1 bg-[#00a884] rounded-full animate-bounce delay-200"></span>
                    </span>
                  </span>
                ) : chat.isOnline ? (
                  'متصل الآن'
                ) : (
                  <span className="text-[#667781]">{chat.lastSeen || 'غير متصل'}</span>
                )}
              </p>
            </div>
          </button>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-1">
          {searchInChat ? (
            <div className="flex items-center bg-black/5 rounded-xl px-2 py-1">
              <input
                type="text"
                placeholder="بحث في الرسائل..."
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                className="text-xs bg-transparent border-none focus:outline-none w-28 md:w-44 text-[#111b21]"
                autoFocus
              />
              <button onClick={() => setSearchInChat(false)} className="text-[#667781] hover:text-[#111b21]">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="btn-chat-search-toggle"
              onClick={() => setSearchInChat(true)}
              className="p-2.5 rounded-xl text-[#667781] hover:bg-black/5 hover:text-[#111b21] transition-all cursor-pointer"
              title="بحث في المحادثة"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          <button
            id="btn-chat-voice-call"
            onClick={() => onStartCall(chat, 'voice')}
            className="p-2.5 rounded-xl text-[#006b53] hover:bg-[#e8f5f1] transition-all cursor-pointer"
            title="مكالمة صوتية"
          >
            <Phone className="w-5 h-5" />
          </button>

          <button
            id="btn-chat-video-call"
            onClick={() => onStartCall(chat, 'video')}
            className="p-2.5 rounded-xl text-[#006b53] hover:bg-[#e8f5f1] transition-all cursor-pointer"
            title="مكالمة فيديو"
          >
            <Video className="w-5 h-5" />
          </button>

          <button
            id="btn-chat-info-toggle"
            onClick={onToggleContactInfo}
            className="p-2.5 rounded-xl text-[#667781] hover:bg-black/5 hover:text-[#111b21] transition-all cursor-pointer"
            title="معلومات جهة الاتصال"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div 
        id="chat-messages-container"
        className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-4 bg-mesh-mint"
      >
        {/* Security & Date Banner */}
        <div className="flex flex-col items-center gap-2 my-2 select-none">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-[#00a884]/20 text-[11px] font-semibold text-[#006b53] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#00a884]" />
            <span>المحادثة محمية بتشفير تام بين الطرفين</span>
          </div>
          <span className="px-3 py-1 rounded-md bg-black/5 text-[#667781] text-[11px] font-medium">
            اليوم
          </span>
        </div>

        {/* Messages */}
        {chat.messages.map((message) => {
          const isOut = message.isOutgoing;
          const isPlaying = isPlayingVoice[message.id];
          const speed = voiceSpeed[message.id] || 1;

          return (
            <div
              key={message.id}
              id={`message-bubble-${message.id}`}
              className={`flex flex-col ${isOut ? 'items-start' : 'items-end'} group relative`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] md:max-w-[60%] rounded-2xl p-3 shadow-xs transition-all relative ${
                  isOut
                    ? 'bg-gradient-to-br from-[#006b53] to-[#00523f] text-white rounded-br-sm'
                    : 'bg-white/90 backdrop-blur-md text-[#111b21] rounded-bl-sm border border-black/5'
                }`}
              >
                {/* Reply To Reference */}
                {message.replyToText && (
                  <div
                    className={`mb-2 p-2 rounded-lg text-xs border-r-2 ${
                      isOut
                        ? 'bg-white/10 border-white text-white/90'
                        : 'bg-[#e8f5f1] border-[#006b53] text-[#006b53]'
                    }`}
                  >
                    <span className="font-bold block text-[11px]">
                      {message.replyToSender || 'رد على رسالة'}
                    </span>
                    <p className="truncate text-[11px]">{message.replyToText}</p>
                  </div>
                )}

                {/* Photo Attachment */}
                {message.attachment?.type === 'image' && (
                  <div className="mb-2 overflow-hidden rounded-xl">
                    <img
                      src={message.attachment.url}
                      alt={message.attachment.name || 'Image'}
                      onClick={() => setPreviewImage(message.attachment?.url || '')}
                      className="w-full max-h-72 object-cover rounded-xl cursor-pointer hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}

                {/* Voice Note Attachment */}
                {message.attachment?.type === 'voice' && (
                  <div className="flex items-center gap-3 py-1 min-w-[200px] sm:min-w-[240px]">
                    <button
                      onClick={() => togglePlayVoice(message.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 shrink-0 ${
                        isOut ? 'bg-white text-[#006b53]' : 'bg-[#006b53] text-white'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current mr-0.5" />}
                    </button>

                    {/* Waveform graphic */}
                    <div className="flex-1 flex items-center gap-0.5 h-6">
                      {[35, 60, 20, 80, 45, 90, 70, 40, 60, 85, 30, 75, 50, 65, 40, 95, 30, 60].map((h, i) => (
                        <span
                          key={i}
                          style={{ height: `${h}%` }}
                          className={`w-1 rounded-full transition-all ${
                            isOut
                              ? isPlaying && i < 10
                                ? 'bg-white'
                                : 'bg-white/40'
                              : isPlaying && i < 10
                              ? 'bg-[#006b53]'
                              : 'bg-[#006b53]/30'
                          }`}
                        ></span>
                      ))}
                    </div>

                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                      <span className={`text-[11px] font-mono ${isOut ? 'text-white/80' : 'text-[#667781]'}`}>
                        {message.attachment.duration || '0:45'}
                      </span>
                      <button
                        onClick={() => toggleSpeed(message.id)}
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded cursor-pointer ${
                          isOut ? 'bg-white/20 text-white' : 'bg-black/5 text-[#006b53]'
                        }`}
                      >
                        {speed}x
                      </button>
                    </div>
                  </div>
                )}

                {/* PDF / File Attachment */}
                {message.attachment?.type === 'file' && (
                  <div
                    className={`flex items-center gap-3 p-2.5 rounded-xl mb-2 ${
                      isOut ? 'bg-white/10' : 'bg-[#e8f5f1]'
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg ${isOut ? 'bg-white/20 text-white' : 'bg-[#006b53] text-white'}`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0 text-right">
                      <p className="font-bold text-xs truncate">
                        {message.attachment.name || 'مستند توثيقي.pdf'}
                      </p>
                      <span className={`text-[11px] ${isOut ? 'text-white/75' : 'text-[#667781]'}`}>
                        {message.attachment.size || '1.5 MB'}
                      </span>
                    </div>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`تم تحميل الملف: ${message.attachment?.name}`);
                      }}
                      className={`p-2 rounded-lg cursor-pointer ${
                        isOut ? 'hover:bg-white/20 text-white' : 'hover:bg-black/5 text-[#006b53]'
                      }`}
                      title="تحميل الملف"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                )}

                {/* Message Text */}
                {message.text && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap select-text">
                    {message.text}
                  </p>
                )}

                {/* Bottom Meta (Time & Checkmarks) */}
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <span className={`text-[10px] ${isOut ? 'text-white/75' : 'text-[#667781]'}`}>
                    {message.timestamp}
                  </span>
                  {isOut && (
                    <CheckCheck className="w-3.5 h-3.5 text-[#00ffc4]" />
                  )}
                </div>

                {/* Reactions Badge if any */}
                {message.reactions && Object.keys(message.reactions).length > 0 && (
                  <div className="absolute -bottom-2.5 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-black/5 shadow-xs text-xs">
                    {Object.entries(message.reactions).map(([emoji, count]) => {
                      const countNum = Number(count);
                      return (
                        <span key={emoji} className="flex items-center gap-0.5">
                          <span>{emoji}</span>
                          {countNum > 1 && <span className="text-[10px] text-[#667781] font-bold">{countNum}</span>}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Hover Quick Action Buttons */}
              <div 
                className={`hidden group-hover:flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full shadow-md border border-black/5 my-1 z-10`}
              >
                {popularEmojis.slice(0, 4).map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => onReactToMessage(chat.id, message.id, emoji)}
                    className="hover:scale-125 transition-transform p-0.5 text-sm cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
                <button
                  onClick={() => setReplyingMessage(message)}
                  className="p-1 rounded-full hover:bg-black/5 text-[#667781] cursor-pointer"
                  title="رد"
                >
                  <CornerDownRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Banner */}
      {replyingMessage && (
        <div className="px-4 py-2 bg-white/90 border-t border-[#00a884]/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <CornerDownRight className="w-4 h-4 text-[#006b53]" />
            <div>
              <span className="font-bold text-[#006b53]">
                الرد على {replyingMessage.isOutgoing ? 'رسالتك' : chat.name}
              </span>
              <p className="text-[#667781] truncate max-w-md">
                {replyingMessage.text || 'مرفق وسائط'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setReplyingMessage(null)}
            className="p-1 rounded-full hover:bg-black/5 text-[#667781]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 right-4 p-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-black/10 z-30 grid grid-cols-6 gap-2 text-xl max-w-xs">
          {['😀', '😃', '😄', '😁', '😆', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😋', '😜', '🤪', '🤩', '🥳', '😎', '🤓', '🧐', '👍', '👎', '👏', '🙌', '🙏', '🔥', '✨', '💚', '❤️', '💡', '🚀', '🎉', '☕'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                setInputText((prev) => prev + emoji);
              }}
              className="p-1 hover:bg-black/5 rounded-lg text-center cursor-pointer transition-transform hover:scale-125"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Attachment Menu Popover */}
      {showAttachmentMenu && (
        <div className="absolute bottom-20 right-14 p-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-black/10 z-30 flex flex-col gap-1 w-52 select-none">
          <button
            onClick={() =>
              handleSendPhotoSample(
                'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
                'art_preview.jpg'
              )
            }
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#e8f5f1] text-[#111b21] text-xs font-semibold text-right cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#006b53] text-white flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <span>صورة أو فيديو</span>
          </button>

          <button
            onClick={() => handleSendDocSample('خطة_مشروع_Lumina.pdf', '2.8 MB')}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#e8f5f1] text-[#111b21] text-xs font-semibold text-right cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#00a884] text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <span>مستند PDF</span>
          </button>

          <button
            onClick={() => {
              setShowAttachmentMenu(false);
              onSendMessage(chat.id, '📍 مشاركة الموقع المباشر: مركز الرياض الرقمي');
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#e8f5f1] text-[#111b21] text-xs font-semibold text-right cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0284c7] text-white flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <span>الموقع الجغرافي</span>
          </button>

          <button
            onClick={() => {
              setShowAttachmentMenu(false);
              onSendMessage(chat.id, '👤 مشاركة جهة اتصال: م. أحمد الشمري (+966 56 789 0123)');
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#e8f5f1] text-[#111b21] text-xs font-semibold text-right cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#8b5cf6] text-white flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <span>جهة اتصال</span>
          </button>
        </div>
      )}

      {/* Chat Footer Input Area */}
      <div 
        id="chat-input-bar" 
        className="p-3 md:p-4 bg-white/80 backdrop-blur-xl border-t border-black/[0.06] z-20"
      >
        {isRecording ? (
          /* Live Voice Recording UI */
          <div className="flex items-center justify-between gap-4 bg-[#e8f5f1] px-4 py-2 rounded-2xl border border-[#00a884]/30 animate-pulse">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
              <span className="text-sm font-mono font-bold text-[#006b53]">
                0:{recordTimer < 10 ? '0' : ''}{recordTimer}
              </span>
              <span className="text-xs text-[#006b53]">جاري تسجيل الرسالة الصوتية...</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRecording(false)}
                className="p-2 rounded-xl hover:bg-black/5 text-red-500 cursor-pointer"
                title="إلغاء"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleSendVoiceNote}
                className="p-2.5 rounded-xl bg-[#006b53] text-white shadow-md cursor-pointer hover:bg-[#00523f]"
                title="إرسال الصوت"
              >
                <Send className="w-5 h-5 rotate-180" />
              </button>
            </div>
          </div>
        ) : (
          /* Normal Input Controls */
          <div className="flex items-center gap-2">
            <button
              id="btn-chat-emoji"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2.5 rounded-xl text-[#667781] hover:bg-black/5 hover:text-[#111b21] transition-all cursor-pointer"
              title="الرموز التعبيرية"
            >
              <Smile className="w-6 h-6" />
            </button>

            <button
              id="btn-chat-attachment"
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="p-2.5 rounded-xl text-[#667781] hover:bg-black/5 hover:text-[#111b21] transition-all cursor-pointer"
              title="إرفاق ملف"
            >
              <Paperclip className="w-6 h-6" />
            </button>

            <div className="flex-1 relative">
              <input
                id="input-chat-message"
                type="text"
                placeholder="اكتب رسالتك هنا..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full py-2.5 px-4 bg-white/90 border border-black/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00a884]/40 text-[#111b21] placeholder-[#667781] transition-all shadow-inner"
              />
            </div>

            {inputText.trim() ? (
              <button
                id="btn-chat-send"
                onClick={handleSend}
                className="p-2.5 rounded-2xl bg-[#006b53] text-white hover:bg-[#00523f] shadow-md shadow-[#006b53]/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="إرسال"
              >
                <Send className="w-5 h-5 rotate-180" />
              </button>
            ) : (
              <button
                id="btn-chat-record-mic"
                onClick={() => setIsRecording(true)}
                className="p-2.5 rounded-2xl bg-[#e8f5f1] text-[#006b53] hover:bg-[#006b53] hover:text-white transition-all cursor-pointer shadow-xs"
                title="تسجيل صوتي"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 left-0 text-white p-2 rounded-full hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
