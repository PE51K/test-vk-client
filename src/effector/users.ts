import { createStore, createEffect } from 'effector';
import axios from '..//axios'
import {User, UsersFetchingStatus} from "../types";

export const fetchUsersFx = createEffect(async (): Promise<User[]> => {
  const { data } = await axios.get('/users');
  return data;
})

const initialUsersFetchingStatus: UsersFetchingStatus = {
  fetchUsers: "idle",
}

export const $usersFetchingStatus = createStore(initialUsersFetchingStatus);

export const $users = createStore<User[]>([]);

$usersFetchingStatus
  .on(fetchUsersFx.pending, (state) => {
    return state.fetchUsers === 'loaded' ?{
      ...state,
      fetchUsers: "loaded",
    } : {
      ...state,
      fetchUsers: "loading",
    };
  })
  .on(fetchUsersFx.done, (state) => {
    return {
      ...state,
      fetchUsers: "loaded",
    };
  })
  .on(fetchUsersFx.fail, (state) => {
    return {
      ...state,
      fetchUsers: "error",
    };
  });

$users.on(fetchUsersFx.done, (state, { result }) => {
  return result;
});
