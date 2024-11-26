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
    const data = await fetchAPI.get('/chats');

    if (data.status === 200) {
      return JSON.parse(data.response) as Chat[];
    }

    return null;
  }

  async function createChat(title: string) {
    return fetchAPI.post('/chats', { data: { title } });
  }

  async function deleteChat(chatId: number) {
    return fetchAPI.delete('/chats', { data: { chatId } });
  }

  async function openChat(chatId: number, userId: number): Promise<WebSocket | null> {
    const tokenResponse = await fetchAPI.post(`/chats/token/${chatId}`);

    if (tokenResponse.status !== 200) {
      return null;
    }

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
    const data = await fetchAPI.get(`/chats/${id}/users`);

    if (data.status === 200) {
      return JSON.parse(data.response) as ChatParticipant[];
    }

    return null;
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
