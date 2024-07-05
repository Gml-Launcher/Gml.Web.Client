import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import { isAxiosError } from "axios";

import { TPostSignInRequest, TPostSignUpRequest } from "@/shared/api/contracts";
import { DASHBOARD_PAGES } from "@/shared/routes";
import { authService } from "@/shared/services";
import { useToast } from "@/shared/ui/use-toast";

export const useRegistration = () => {
  const route = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["signup"],
    mutationFn: (data: TPostSignUpRequest) => authService.signUp(data),
    onSuccess: () => {
      toast({
        title: "Успешная регистрация",
        description: "Добро пожаловать в платформу",
      });
      route.push(DASHBOARD_PAGES.PROFILES);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: (error.response && error.response.data.message) || "Ошибка!",
          description:
            (error.response && error.response.data.errors?.[0]) ||
            "Ошибка сервиса авторизации. Обратитесь к администратору платформы",
        });
      }
    },
  });
};

export const useLogin = () => {
  const route = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["signin"],
    mutationFn: (data: TPostSignInRequest) => authService.signIn(data),
    onSuccess: () => {
      toast({
        title: "Успешная авторизация",
        description: "Добро пожаловать в платформу",
      });
      route.push(DASHBOARD_PAGES.PROFILES);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: (error.response && error.response.data.message) || "Ошибка!",
          description:
            (error.response && error.response.data.errors?.[0]) ||
            "Ошибка сервиса авторизации. Обратитесь к администратору платформы",
        });
      }
    },
  });
};
