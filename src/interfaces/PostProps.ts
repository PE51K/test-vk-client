import React from "react";

import {User} from "../types";

export interface PostProps {
  id: string | undefined;
  title: string | undefined;
  createdAt: string | undefined;
  imageUrl: string | undefined;
  viewsCount: number | undefined;
  likes: string[] | undefined;
  children: React.ReactNode | undefined;
  isFullPost: boolean | undefined;
  isLoading: boolean | undefined;
  isEditable: boolean | undefined;
  user: User | undefined;
  isAuth: boolean | undefined;
  currentUserId: string | undefined;
}