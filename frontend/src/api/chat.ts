import api from './client';

export const chatApi = {
  getConversations: () => api.get('/chat/conversations').then(r => r.data),
  getMessages: (conversationId: number) => api.get(`/chat/conversations/${conversationId}`).then(r => r.data),
  sendMessage: (receiverId: number, content: string) => 
    api.post('/chat/messages', { receiver_id: receiverId, content }).then(r => r.data),
};
