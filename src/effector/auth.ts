import { createStore, createEffect } from 'effector';
import axios from '..//axios'
import {AuthResponse} from "../interfaces";
import {AuthData, AuthStatus} from "../types";

export const fetchAuthFx = createEffect(async (params: any): Promise<AuthResponse | null> => {
  try {
    const { data } = await axios.post("/auth/login", params);
    return data;
  } catch (error: any) {
    if (error.response && error.response.status === 403) {
      console.log('Insufficient permissions. Skipping request.');
    } else {
      console.log('Error:', error.message);
    }

    return null;
  }
});

export const fetchRegisterFx = createEffect(async (params: any): Promise<AuthResponse | null> => {
  try {
    const { data } = await axios.post("/auth/register", params);
    return data;
  } catch (error: any) {
    if (error.response && error.response.status === 403) {
      console.log('Insufficient permissions. Skipping request.');
    } else {
      console.log('Error:', error.message);
    }

    return null;
  }
});

export const fetchAuthMeFx = createEffect(async (): Promise<AuthResponse | null> => {
  try {
    const { data } = await axios.get("/auth/me");
    return data;
  } catch (error : any) {
    if (error.response && error.response.status === 403) {
      console.log('Insufficient permissions. Skipping request.');
    } else {
      console.log('Error:', error.message);
    }

    return null;
  }
});

export const logoutFx = createEffect(() => {});

export const $authData = createStore<AuthData | null>(null)
  .on(logoutFx, () => null)
  .on(fetchAuthFx.doneData, (state, payload) => payload !== null ? { ...state, ...payload } : state)
  .on(fetchAuthMeFx.doneData, (state, payload) => payload !== null ? { ...state, ...payload } : state)
  .on(fetchRegisterFx.doneData, (state, payload) => payload !== null ? { ...state, ...payload } : state)
  .reset(fetchAuthFx.fail, fetchAuthMeFx.fail, fetchRegisterFx.fail);

const initialAuthStatus: AuthStatus = {
  fetchAuth: "idle",
  fetchRegister: "idle",
  fetchAuthMe: "idle",
};

export const $authStatus = createStore(initialAuthStatus);
$authStatus
  .on(logoutFx, () => initialAuthStatus)
  .on(fetchAuthFx.pending, (state) => ({
    ...state,
    fetchAuth: "loading",
  }))
  .on(fetchAuthFx.done, (state) => ({
    ...state,
    fetchAuth: "loaded",
  }))
  .on(fetchAuthFx.fail, (state) => ({
    ...state,
    fetchAuth: "error",
  }))
  .on(fetchRegisterFx.pending, (state) => ({
    ...state,
    fetchRegister: "loading",
  }))
  .on(fetchRegisterFx.done, (state) => ({
    ...state,
    fetchRegister: "loaded",
  }))
  .on(fetchRegisterFx.fail, (state) => ({
    ...state,
    fetchRegister: "error",
  }))
  .on(fetchAuthMeFx.pending, (state) => ({
    ...state,
    fetchAuthMe: "loading",
  }))
  .on(fetchAuthMeFx.done, (state) => ({
    ...state,
    fetchAuthMe: "loaded",
  }))
  .on(fetchAuthMeFx.fail, (state) => ({
    ...state,
    fetchAuthMe: "error",
  }));

export const $isAuth = $authData.map((data) => Boolean(data));
