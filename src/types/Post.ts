import {User} from "./User";

export type Post = {
  _id: string,
  title: string
  imageUrl: string,
  user: User,
  createdAt: string,
  viewsCount: number,
  likes: string[],
};

