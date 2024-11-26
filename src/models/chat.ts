import { fetchAPI } from '@/utils/fetch.ts';

const chat: {
  socket: null | WebSocket;
  pingInterval: ReturnType<typeof setInterval> | null;
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
      return JSON.parse(data.response);
    }

    return null;
  }

  async function createChat(title: string) {
    return fetchAPI.post('/chats', { data: { title } });
  }

  async function deleteChat(chatId: string) {
    return fetchAPI.delete('/chats', { data: { chatId } });
  }

  async function openChat(chatId: number, userId: number): Promise<WebSocket> {
    const tokenResponse = await fetchAPI.post(`/chats/token/${chatId}`);

    if (tokenResponse.status !== 200) {
      return;
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

    chat.socket.addEventListener('error', (event) => {
      console.log('Ошибка', event.message);
    });

    return chat.socket;
  }

  function closeChat() {
    if (!chat.socket) {
      return;
    }

    chat.socket.close();
    clearInterval(chat.pingInterval);
    chat.socket = null;
    chat.pingInterval = null;
  }

  async function getChatParticipants(id: number) {
    const data = await fetchAPI.get(`/chats/${id}/users`);

    if (data.status === 200) {
      return JSON.parse(data.response);
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
