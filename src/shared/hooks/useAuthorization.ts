import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import {
  SignInFormSchemaType,
  SignUpFormSchemaType,
} from "@/widgets/auth-credentials-form/lib/static";
import { authService } from "@/shared/services";
import { DASHBOARD_PAGES } from "@/shared/routes";

export const useRegistration = () => {
  const route = useRouter();
  const toast = useToast();

  return useMutation({
    mutationKey: ["signup"],
    mutationFn: (data: SignUpFormSchemaType) => authService.signUp(data),
    onSuccess: () => {
      toast.toast({
        title: "Успешная регистрация",
        description: "Добро пожаловать в платформу",
      });
      route.push(DASHBOARD_PAGES.HOME);
    },
  });
};

export const useLogin = () => {
  const route = useRouter();
  const toast = useToast();

  return useMutation({
    mutationKey: ["signin"],
    mutationFn: (data: SignInFormSchemaType) => authService.signIn(data),
    onSuccess: () => {
      toast.toast({
        title: "Успешная авторизация",
        description: "Добро пожаловать в платформу",
      });
      route.push(DASHBOARD_PAGES.HOME);
    },
    onError: () => {
      toast.toast({
        title: "Упс!",
        description: "Проверьте правильность введенных данных",
      });
    },
  });
};
