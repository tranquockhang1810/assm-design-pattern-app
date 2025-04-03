import { UserModel } from "@/src/api/features/authenticate/models/LoginModel";


export interface AuthContextType {
  onLogin: (user: any) => void;
  onUpdateProfile: (user: UserModel) => void;
  onLogout: () => void;
  user: UserModel | null;
  isAuthenticated: boolean;
  isLoginUser: (userId: string) => boolean;
}