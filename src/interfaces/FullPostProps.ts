import {User} from "../types";

export interface FullPostProps {
  _id: string;
  title: string;
  imageUrl: string;
  user: User;
  createdAt: string;
  viewsCount: number;
  likes: string[];
  tags: string[];
  text: string;
}