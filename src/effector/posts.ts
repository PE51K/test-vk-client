import {createEffect, createStore} from 'effector';
import axios from '..//axios'
import {Post, PostsFetchingStatus} from "../types";

export const fetchPostsFx = createEffect(async (): Promise<Post[] | null> => {
  try {
    const { data } = await axios.get('/posts');
    return data;
  } catch (error: any) {
    console.log('Error fetching posts:', error.message);
    return null;
  }
});

export const fetchFriendsPostsFx = createEffect(async (): Promise<Post[] | null> => {
  try {
    const { data } = await axios.get('/friends/posts');
    return data;
  } catch (error: any) {
    console.log('Error fetching friends posts:', error.message);
    return null;
  }
});

export const fetchRemovePostFx = createEffect(async (id: string): Promise<string | null> => {
  try {
    await axios.delete(`/posts/${id}`);
    return id;
  } catch (error: any) {
    console.log('Error removing post:', error.message);
    return null;
  }
});

export const fetchUserPostsFx = createEffect(async (userId: string | undefined): Promise<Post[] | null> => {
  try {
    const { data } = await axios.get(`/users/${userId}/posts`);
    return data;
  } catch (error: any) {
    console.log('Error fetching user posts:', error.message);
    return null;
  }
});

export const fetchLikePostFx = createEffect(async ({ postId, userId }: { postId: string; userId: string }): Promise<[string, string] | null> => {
  try {
    await axios.post(`/posts/${postId}/like`);
    return [postId, userId];
  } catch (error: any) {
    console.log('Error liking post:', error.message);
    return null;
  }
});

export const fetchUnlikePostFx = createEffect(async ({ postId, userId }: { postId: string; userId: string }): Promise<[string, string] | null> => {
  try {
    await axios.delete(`/posts/${postId}/like`);
    return [postId, userId];
  } catch (error: any) {
    console.log('Error unliking post:', error.message);
    return null;
  }
});

const initialPostsFetchingStatus: PostsFetchingStatus = {
  fetchPosts: "idle",
}

export const $postsFetchingStatus = createStore(initialPostsFetchingStatus);

export const $posts = createStore<Post[]>([]);

$postsFetchingStatus
  .on(fetchLikePostFx.done, (state) => {
    return {
      ...state,
      fetchPosts: "loaded",
    };
  })
  .on(fetchUnlikePostFx.done, (state) => {
    return {
      ...state,
      fetchPosts: "loaded",
    };
  })
  .on(fetchFriendsPostsFx.pending, (state) => {
    return state.fetchPosts === 'loaded' ?{
      ...state,
      fetchPosts: "loaded",
    } : {
      ...state,
      fetchPosts: "loading",
    };
  })
  .on(fetchFriendsPostsFx.done, (state) => {
    return {
      ...state,
      fetchPosts: "loaded",
    };
  })
  .on(fetchFriendsPostsFx.fail, (state) => {
    return {
      ...state,
      fetchPosts: "error",
    };
  })
  .on(fetchUserPostsFx.done, (state) => {
    return {
      ...state,
      fetchPosts: "loaded",
    };
  })
  .on(fetchPostsFx.pending, (state) => {
    return state.fetchPosts === 'loaded' ?{
      ...state,
      fetchPosts: "loaded",
    } : {
      ...state,
      fetchPosts: "loading",
    };
  })
  .on(fetchPostsFx.done, (state) => {
    return {
      ...state,
      fetchPosts: "loaded",
    };
  })
  .on(fetchPostsFx.fail, (state) => {
    return {
      ...state,
      fetchPosts: "error",
    };
  })
  .on(fetchRemovePostFx.done, (state) => {
    return {
      ...state,
      fetchPosts: "loaded",
    };
  });

$posts
  .on(fetchLikePostFx.done, (state, { result }): Post[] => {
    if (result === null) {
      return state;
    }
    const postId = result[0];
    const userId = result[1];
    return state.map((post) => {
      if (post._id === postId) {
        return {
          ...post,
          likes: [...post.likes, userId],
        };
      }
      return post;
    });
  })
  .on(fetchUnlikePostFx.done, (state, { result }): Post[] => {
    if (result === null) {
      return state;
    }
    const postId = result[0];
    const userId = result[1];
    return state.map((post) => {
      if (post._id === postId) {
        return {
          ...post,
          likes: post.likes.filter((like) => like !== userId),
        };
      }
      return post;
    });
  })
  .on(fetchUserPostsFx.done, (state, { result }): Post[] => {
    if (result === null) {
      return state;
    }
    return result;
  })
  .on(fetchPostsFx.done, (state, { result }): Post[] => {
    if (result === null) {
      return state;
    }
    return result;
  })
  .on(fetchFriendsPostsFx.done, (state, { result }): Post[] => {
    if (result === null) {
      return state;
    }
    return result;
  })
  .on(fetchRemovePostFx.done, (state, { result }): Post[] => {
    if (result === null) {
      return state;
    }
    return state.filter((post) => post._id !== result);
  });
