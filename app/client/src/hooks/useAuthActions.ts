import type {
  UserLoginPayloadType,
  UserRegisterPayloadType,
  UserResponseType,
} from "@shared/types/entities/user.entity.js";

import { loginAPI, logoutAPI, registerAPI } from "@client/lib/api/auth.api.js";
import { useAuth } from "@client/stores/auth.store.js";

import { useAppMutation } from "./useAppQuery.js";

export function useLogin() {
  const setUser = useAuth((s) => s.login);
  return useAppMutation<UserResponseType, UserLoginPayloadType>({
    mutationFn: ({ email, password }: UserLoginPayloadType) =>
      loginAPI({ email, password }),
    onSuccess: (user) => {
      const { data: safeUser } = user;
      setUser(safeUser, "Token");
    },
  });
}

export function useRegister() {
  const setUser = useAuth((s) => s.login);
  return useAppMutation({
    mutationFn: ({
      full_name,
      email,
      password,
      confirm_password,
    }: UserRegisterPayloadType) =>
      registerAPI({ full_name, email, password, confirm_password }),
    onSuccess: (user) => {
      const { data: safeUser } = user;
      setUser(safeUser, "Token");
    },
  });
}

export function useLogout() {
  const setUser = useAuth((s) => s.logout);
  return useAppMutation({
    mutationFn: logoutAPI,
    onSuccess: () => {
      setUser();
    },
  });
}
