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
    mutationFn: ({ email, googleID }: UserLoginPayloadType) =>
      loginAPI({ email, googleID }),
    onSuccess: (user) => {
      const { data: safeUser } = user;
      setUser(safeUser, "Token");
    },
  });
}

export function useRegister() {
  const setUser = useAuth((s) => s.login);
  return useAppMutation({
    mutationFn: ({ fullName, email, googleID }: UserRegisterPayloadType) =>
      registerAPI({ fullName, email, googleID }),
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
