import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi.js";
import { useAuthStore } from "../store/authStore.js";

export const useCheckEmailMutation = () => {
  const { setTempEmail } = useAuthStore();

  return useMutation({
    mutationFn: async (email) => {
      setTempEmail(email);
      return await authApi.checkEmail(email);
    },
  });
};

export const useSendOtpMutation = () => {
  const { setTempEmail } = useAuthStore();

  return useMutation({
    mutationFn: async (email) => {
      setTempEmail(email);
      return await authApi.sendOtp(email);
    },
  });
};

export const useVerifyOtpMutation = () => {
  const { setAuth, clearTempEmail } = useAuthStore();

  return useMutation({
    mutationFn: async ({ email, code }) => {
      return await authApi.verifyOtp(email, code);
    },
    onSuccess: (data) => {
      if (data.data?.accessToken && data.data?.user) {
        setAuth(data.data.user, data.data.accessToken);
        clearTempEmail();
      }
    },
  });
};

export const useRegisterMutation = () => {
  const { setTempEmail } = useAuthStore();

  return useMutation({
    mutationFn: async (payload) => {
      setTempEmail(payload.email);
      return await authApi.register(payload);
    },
  });
};

export const useLoginMutation = () => {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (payload) => {
      return await authApi.login(payload);
    },
    onSuccess: (data) => {
      if (data.data?.accessToken && data.data?.user) {
        setAuth(data.data.user, data.data.accessToken);
      }
    },
  });
};

export const useVerify2FAMutation = () => {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async ({ tempToken, token }) => {
      return await authApi.verify2FA({ tempToken, token });
    },
    onSuccess: (data) => {
      if (data.data?.accessToken && data.data?.user) {
        setAuth(data.data.user, data.data.accessToken);
      }
    },
  });
};

export const useGoogleAuthMutation = () => {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (idToken) => {
      return await authApi.googleAuth(idToken);
    },
    onSuccess: (data) => {
      if (data.data?.accessToken && data.data?.user) {
        setAuth(data.data.user, data.data.accessToken);
      }
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: async (email) => {
      return await authApi.forgotPassword(email);
    },
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: async (payload) => {
      return await authApi.resetPassword(payload);
    },
  });
};
