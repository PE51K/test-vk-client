import {createEffect, createStore} from 'effector';
import axios from '..//axios'
import {Post, PostsFetchingStatus} from "../types";

export const fetchPostsFx = createEffect(async (): Promise<Post[]> => {
  const { data } = await axios.get('/posts');
  return data;
})

export const fetchFriendsPostsFx = createEffect(async (): Promise<Post[]> => {
  const { data } = await axios.get('/friends/posts');
  return data;
})

export const fetchRemovePostFx = createEffect(async (id: string) => {
  await axios.delete(`/posts/${id}`)
  return id;
})

export const fetchUserPostsFx = createEffect(async (userId: string): Promise<Post[]> => {
  const { data } = await axios.get(`/users/${userId}/posts`);
  return data;
})

export const fetchLikePostFx = createEffect(async ({// @ts-ignore
                                                     postId, // @ts-ignore
                                                     userId}) => {
  console.log(postId, userId);
  await axios.post(`/posts/${postId}/like`);
  console.log(postId, userId);
  return [postId,  userId];
});

export const fetchUnlikePostFx = createEffect(async ({// @ts-ignore
                                                        postId, // @ts-ignore
                                                        userId}) => {
  await axios.delete(`/posts/${postId}/like`);
  console.log(postId, userId);
  return [postId,  userId];
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
  .on(fetchLikePostFx.done, (state, { result }) => {
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
  .on(fetchUnlikePostFx.done, (state, { result }) => {
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
  .on(fetchUserPostsFx.done, (state, { result }) => {
    return result;
  })
  .on(fetchPostsFx.done, (state, { result }) => {
    return result;
  })
  .on(fetchFriendsPostsFx.done, (state, { result }) => {
    return result;
  })
  .on(fetchRemovePostFx.done, (state, { result }) => {
    return state.filter(post => post._id !== result);
  });