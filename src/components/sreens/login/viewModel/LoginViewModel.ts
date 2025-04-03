import { AuthenRepo } from "@/src/api/features/authenticate/AuthenRepo";
import { LoginRequestModel } from "@/src/api/features/authenticate/models/LoginModel";
import Toast from "react-native-toast-message";
import { useState } from "react";

const LoginViewModel = (repo: AuthenRepo, onLogin: (user: any) => void) => {
    const [loading, setLoading] = useState(false);

    const login = async (data: LoginRequestModel) => {
        try {
            setLoading(true);
            
            const response = await repo.login(data);
            if (response?.data) {
                console.log("response", response);
                onLogin(response?.data);
            } else {
                Toast.show({
                    type: "error",
                    text1: response?.error?.message,
                })
            }
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: error?.message,
            })
        } finally {
            setLoading(false);
        }
    }

    return { login, loading }
}

export default LoginViewModel;
