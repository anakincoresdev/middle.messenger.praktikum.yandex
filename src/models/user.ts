import { fetchAPI } from '@/utils/fetch.ts';
import { User } from '@/types/api/User.ts';

const user: { data: User | null } = { data: null };

export function useUser() {
  async function getUser(): Promise<User | null> {
    try {
      const data = await fetchAPI.get('/auth/user');

      user.data = JSON.parse(data.response) as User;

      return user.data;
    } catch (e) {
      user.data = null;
      console.error(e);
      return null;
    }
  }

  return {
    user,
    getUser,
  };
}
