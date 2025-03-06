import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { App } from "antd"; 
import { CustomMutationHookProps } from "@/lib/types/CustomMutationHookProps";

type Props<TData, TError, TVariables, TContext> = {
  options?: CustomMutationHookProps<TData, TError, TVariables, TContext>;
  messageType?: "notification" | "message";
  messages?: {
    loading?: string;
    error?: string | ((error: TError) => string);
    success?: string;
  };
  mutationKey: string[];
} & UseMutationOptions<TData, TError, TVariables, TContext>;

export default function useCustomMutation<TData, TError, TVariables, TContext>(
  props: Props<TData, TError, TVariables, TContext>
) {
  const { message, notification } = App.useApp();
  
  if (!message || !notification) {
    console.error("useCustomMutation must be used inside an <App> provider.");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMutation(props);
  }

  const { options, mutationKey, messages, messageType = "message", ...mutationOptions } = props;
  const showMessages = options?.showMessages ?? true;
  const messageKey = mutationKey.join("_");

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMutation({
    ...mutationOptions, 
    onMutate: async (req) => {
      if (showMessages && message) {
        message.destroy(messageKey ?? "loading");
        message.loading({ content: messages?.loading ?? "In progress...", key: messageKey });
      }
      return props?.onMutate?.(req);
    },
    onSettled: (res, error, variables, context) => {
      if (showMessages && message) message.destroy(messageKey);
      return props?.onSettled?.(res, error, variables, context);
    },
    onError: async (error, variables, context) => {
      console.error(error);
      if (showMessages) {
        const customError = typeof messages?.error === "function" ? messages.error(error) : messages?.error;
        if (messageType === "notification") {
          notification.error({ message: customError ?? "Thất bại" });
        } else {
          message.error({ content: customError ?? "Thất bại" });
        }
      }
      return props?.onError?.(error, variables, context);
    },
    onSuccess: async (data, variables, context) => {
      if (showMessages) {
        if (messageType === "notification") {
          notification.success({ message: messages?.success ?? "Thành công" });
        } else {
          message.success({ content: messages?.success ?? "Thành công" });
        }
      }
      return props?.onSuccess?.(data, variables, context);
    },
  });
}
