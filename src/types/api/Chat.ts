export type Chat = {
  avatar: string;
  created_by: number;
  id: number;
  last_message: { content: string } | null;
  title: string;
  unread_count: number;
};

export type ChatParticipant = {
  avatar: string;
  display_name: string;
  first_name: string;
  id: number;
  login: string;
  role: string;
  second_name: string;
};
