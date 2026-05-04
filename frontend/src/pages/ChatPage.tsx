import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useConversations, useMessages, useSendMessage } from '../hooks/useChat';
import { useUsers } from '../hooks/useApiHooks';
import api from '../api/client';
import { 
  Send, Search, User as UserIcon, MessageSquare, 
  MoreVertical, Phone, Video, Info, Paperclip, 
  Smile, Check, CheckCheck, Loader2, ArrowLeft,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ChatPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { lang } = useLang();
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isMobileListOpen, setIsMobileListOpen] = useState(true);
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiMessages, setAiMessages] = useState<any[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  const { data: conversations, isLoading: convsLoading } = useConversations();
  const { data: messages, isLoading: msgsLoading } = useMessages(selectedConversation?.id);
  const sendMessageMutation = useSendMessage();
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, aiMessages, isAiTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    if (isAiMode) {
      const userMsg = { id: Date.now(), content: messageInput, sender_id: currentUser?.id, created_at: new Date().toISOString() };
      setAiMessages(prev => [...prev, userMsg]);
      const currentInput = messageInput;
      setMessageInput('');
      setIsAiTyping(true);
      
      try {
        const res = await api.post('/ai/chat', { message: currentInput });
        const aiMsg = { 
           id: Date.now() + 1, 
           content: res.data.data?.reply || res.data.data?.message || 'Sorry, I could not generate a response.', 
           sender_id: 'ai', 
           created_at: new Date().toISOString() 
        };
        setAiMessages(prev => [...prev, aiMsg]);
      } catch (err: any) {
        const status = err?.response?.status;
        let errorMsg = lang === 'ar'
          ? 'عذراً، حدث خطأ غير متوقع. حاول مرة أخرى.'
          : 'Sorry, an unexpected error occurred. Please try again.';

        if (status === 429) {
          errorMsg = lang === 'ar'
            ? '⏳ لقد تجاوزت الحد اليومي للمحادثات مع الذكاء الاصطناعي. يرجى المحاولة لاحقاً.'
            : '⏳ You have reached the AI daily limit. Please try again later.';
        } else if (status === 401 || status === 403) {
          errorMsg = lang === 'ar'
            ? '🔒 يجب تسجيل الدخول أولاً لاستخدام المعلم الذكي.'
            : '🔒 Please log in to use the AI Tutor.';
        } else if (status === 500) {
          errorMsg = lang === 'ar'
            ? '⚠️ المعلم الذكي غير متاح حالياً، يرجى المحاولة بعد قليل.'
            : '⚠️ AI Tutor is temporarily unavailable. Please try again shortly.';
        }

        setAiMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          content: errorMsg, 
          sender_id: 'ai', 
          created_at: new Date().toISOString() 
        }]);
      } finally {
        setIsAiTyping(false);
      }
      return;
    }


    if (!selectedConversation) return;
    const otherUser = getOtherUser(selectedConversation);

    try {
      await sendMessageMutation.mutateAsync({
        receiverId: otherUser.id,
        content: messageInput
      });
      setMessageInput('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const getOtherUser = (conv: any) => {
    if (!conv) return null;
    const other = conv.user_one_id === currentUser?.id 
      ? (conv.user_two || conv.userTwo) 
      : (conv.user_one || conv.userOne);
    return other || { name: 'Unknown', profile_image: null };
  };

  if (convsLoading) return <LoadingSpinner />;

  return (
    <div className="h-[calc(100vh-140px)] flex bg-card border border-border rounded-3xl overflow-hidden shadow-2xl shadow-primary/5">
      {/* Sidebar - Conversation List */}
      <div className={`w-full lg:w-[400px] flex flex-col border-r border-border bg-muted/10 ${!isMobileListOpen && 'hidden lg:flex'}`}>
        <div className="p-6 border-b border-border space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              {lang === 'ar' ? 'المحادثات' : 'Messages'}
            </h1>
            <div className="bg-primary/10 text-primary p-2 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder={lang === 'ar' ? 'البحث عن محادثة...' : 'Search messages...'}
              className="input-field pl-12 bg-muted/50 border-transparent focus:bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {/* AI Tutor Entry */}
          <button
            onClick={() => {
              setIsAiMode(true);
              setSelectedConversation(null);
              setIsMobileListOpen(false);
            }}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
              isAiMode ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20' : 'hover:bg-muted bg-primary/5 border border-primary/10'
            }`}
          >
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white font-black overflow-hidden shadow-lg shadow-primary/20">
                 <GraduationCap className="w-7 h-7" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-card rounded-full" />
            </div>
            <div className="flex-1 text-left">
              <div className="flex justify-between items-center mb-1">
                <p className="font-black truncate">AI Tutor (Gemini)</p>
                <span className="text-[10px] font-black uppercase bg-primary/20 text-primary px-1.5 py-0.5 rounded">Smart</span>
              </div>
              <p className="text-xs truncate opacity-70">
                {lang === 'ar' ? 'اسأل أي شيء حول دروسك' : 'Ask anything about your courses'}
              </p>
            </div>
          </button>

          <div className="h-px bg-border my-4 mx-2 opacity-50" />

          {conversations?.map((conv: any) => {
            const otherUser = getOtherUser(conv);
            const isSelected = selectedConversation?.id === conv.id && !isAiMode;
            
            return (
              <button
                key={conv.id}
                onClick={() => {
                  setSelectedConversation(conv);
                  setIsMobileListOpen(false);
                  setIsAiMode(false);
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  isSelected ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'hover:bg-muted'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-primary font-black overflow-hidden shadow-sm">
                    {otherUser?.profile_image ? (
                      <img src={otherUser.profile_image} alt={otherUser?.name} className="w-full h-full object-cover" />
                    ) : (
                      otherUser?.name?.[0] || '?'
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-card rounded-full" />
                </div>
                
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className={`font-black truncate ${isSelected ? 'text-white' : 'text-foreground'}`}>
                      {otherUser.name}
                    </p>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {conv.last_message || (lang === 'ar' ? 'انقر لبدء المحادثة' : 'Tap to chat')}
                  </p>
                </div>
                
                {conv.unread_count > 0 && (
                  <div className="w-5 h-5 bg-accent text-accent-foreground rounded-full text-[10px] font-black flex items-center justify-center shadow-lg">
                    {conv.unread_count}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-card relative ${isMobileListOpen && 'hidden lg:flex'}`}>
        {(selectedConversation || isAiMode) ? (
          <>
            {/* Header */}
            <div className="p-4 lg:p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsMobileListOpen(true)}
                  className="lg:hidden p-2 hover:bg-muted rounded-xl text-muted-foreground"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                {isAiMode ? (
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black shadow-lg shadow-primary/20">
                     <GraduationCap className="w-7 h-7" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black">
                    {getOtherUser(selectedConversation)?.name?.[0] || '?'}
                  </div>
                )}
                <div>
                  <h2 className="font-black text-foreground tracking-tight">
                    {isAiMode ? 'AI Tutor (Gemini)' : getOtherUser(selectedConversation).name}
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                      {isAiMode ? (lang === 'ar' ? 'ذكي ومستعد' : 'Smart & Ready') : (lang === 'ar' ? 'متصل الآن' : 'Online Now')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-3 text-muted-foreground hover:bg-muted rounded-xl transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-3 text-muted-foreground hover:bg-muted rounded-xl transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-3 text-muted-foreground hover:bg-muted rounded-xl transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-muted/5"
            >
              <AnimatePresence>
                {(isAiMode ? aiMessages : messages)?.map((msg: any) => {
                  const isMine = msg.sender_id === currentUser?.id;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] space-y-1 ${isMine ? 'items-end' : 'items-start'}`}>
                        <div className={`px-5 py-3 rounded-2xl text-sm font-medium shadow-sm ${
                          isMine 
                            ? 'bg-primary text-primary-foreground rounded-tr-none' 
                            : 'bg-muted border border-border text-foreground rounded-tl-none'
                        }`}>
                          {msg.content}
                        </div>
                        <div className="flex items-center gap-2 px-1">
                          <span className="text-[10px] font-bold text-muted-foreground">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMine && !isAiMode && (
                            <CheckCheck className={`w-3 h-3 ${msg.read_at ? 'text-primary' : 'text-muted-foreground/30'}`} />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {isAiTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                   <div className="bg-muted px-4 py-2 rounded-2xl rounded-tl-none flex gap-1 items-center">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                   </div>
                </motion.div>
              )}

              {msgsLoading && !isAiMode && (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-border">
              <form 
                onSubmit={handleSendMessage}
                className="flex items-center gap-4 bg-muted/50 p-2 rounded-[2rem] border border-border focus-within:border-primary/50 focus-within:bg-card transition-all"
              >
                <button type="button" className="p-3 text-muted-foreground hover:bg-muted rounded-full transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input 
                  type="text" 
                  placeholder={lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message...'}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <button type="button" className="p-3 text-muted-foreground hover:bg-muted rounded-full transition-colors hidden sm:flex">
                  <Smile className="w-5 h-5" />
                </button>
                <button 
                  type="submit"
                  disabled={!messageInput.trim() || sendMessageMutation.isPending}
                  className="bg-primary text-primary-foreground p-4 rounded-full shadow-lg shadow-primary/30 hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
              <MessageSquare className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-foreground tracking-tight mb-2">
              {lang === 'ar' ? 'أهلاً بك في نظام المحادثات' : 'Welcome to Messages'}
            </h3>
            <p className="text-muted-foreground font-medium max-w-sm">
              {lang === 'ar' 
                ? 'اختر محادثة من القائمة الجانبية لبدء التواصل مع المدربين أو الطلاب.' 
                : 'Select a conversation from the sidebar to start communicating with instructors or students.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
