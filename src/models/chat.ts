import { fetchAPI } from '@/utils/fetch.ts';

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

  async function openChat(id: number) {
    console.log(id);
  }

  return {
    getChats,
    createChat,
    openChat,
  };
}
