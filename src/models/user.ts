import { fetchAPI } from '@/utils/fetch.ts';
import { User } from '@/types/api/User.ts';

const user: { data: User | null } = { data: null };

export function useUser() {
  async function getUser(): Promise<User | null> {
    const data = await fetchAPI.get('/auth/user');

    if (data.status === 200 && data.response) {
      user.data = JSON.parse(data.response) as User;
    } else {
      user.data = null;
    }
    return user.data;
  }

  return {
    user,
    getUser,
  };
}
