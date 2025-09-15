import type {
  UserLoginPayloadType,
  UserRegisterPayloadType,
  UserResponseType,
} from "@hiredtobe/shared/entities";

import { loginAPI, logoutAPI, registerAPI } from "@/client/lib/api/auth.api";
import { useAuth } from "@/client/stores/auth.store";

import { useAppMutation } from "./useAppQuery";

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
