export interface User { //TODO
  id: number;
  nick: string;
  email: string;
  profile_img?: string;
  bio_text?: string;
  linked_accounts?: string[]
}