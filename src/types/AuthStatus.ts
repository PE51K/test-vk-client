export type AuthStatus = {
  fetchAuth: "idle" | "loading" | "loaded" | "error";
  fetchRegister: "idle" | "loading" | "loaded" | "error";
  fetchAuthMe: "idle" | "loading" | "loaded" | "error";
};