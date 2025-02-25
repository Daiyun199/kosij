import { CustomMutationHookProps } from "@/lib/types/CustomMutationHookProps";
import LoginCredentials, {
  type Request,
  type Response,
} from "@/features/common/api/login-credentials.api";
import useCustomMutation from "@/lib/hooks/useCustomMutation";

type Props = CustomMutationHookProps<Response, unknown, Request, unknown>;

export default function useLoginMutation(props?: Props) {
    return useCustomMutation({
        options: props?? null,
        mutationFn: LoginCredentials,
        mutationKey: ["common", "login"],
        messages: {
            success: "Sign in successfull!",
            error: "Sign in failed"
        } 
    })
}
