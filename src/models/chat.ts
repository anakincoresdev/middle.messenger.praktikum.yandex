import { fetchAPI } from '@/utils/fetch.ts';
import { Chat, ChatParticipant } from '@/types/api/Chat.ts';

const chat: {
  socket: null | WebSocket;
  pingInterval: number | null;
  users: null,
} = {
  socket: null,
  pingInterval: null,
  users: null,
};

export function useChat() {
  async function getChats() {
    try {
      const data = await fetchAPI.get('/chats');

      return JSON.parse(data.response) as Chat[];
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async function createChat(title: string) {
    return fetchAPI.post('/chatss', { data: { title } });
  }

  async function deleteChat(chatId: number) {
    return fetchAPI.delete('/chats', { data: { chatId } });
  }

  async function openChat(chatId: number, userId: number): Promise<WebSocket | null> {
    try {
      const tokenResponse = await fetchAPI.post(`/chats/token/${chatId}`);
      const { token } = JSON.parse(tokenResponse.response);
      const socketUrl = `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`;

      chat.socket = new WebSocket(socketUrl);

      chat.socket.addEventListener('open', () => {
        chat.socket?.send(
          JSON.stringify({
            content: '0',
            type: 'get old',
          }),
        );
      });

      chat.pingInterval = window.setInterval(() => {
        chat.socket?.send(JSON.stringify({ type: 'ping' }));
      }, 5000);

      chat.socket.addEventListener('close', (event) => {
        if (event.wasClean) {
          console.log('Соединение закрыто чисто');
        } else {
          console.log('Обрыв соединения');
        }

        console.log(`Код: ${event.code} | Причина: ${event.reason}`);
      });
    } catch (e) {
      console.error(e);
    }

    return chat.socket;
  }

  function closeChat() {
    if (!chat.socket) {
      return;
    }

    chat.socket.close();
    if (chat.pingInterval) {
      window.clearInterval(chat.pingInterval);
    }
    chat.socket = null;
    chat.pingInterval = null;
  }

  async function getChatParticipants(id: number) {
    try {
      const data = await fetchAPI.get(`/chats/${id}/users`);
      return JSON.parse(data.response) as ChatParticipant[];
    } catch (e) {
      return null;
    }
  }

  return {
    chat,
    closeChat,
    getChats,
    createChat,
    deleteChat,
    openChat,
    getChatParticipants,
  };
}
