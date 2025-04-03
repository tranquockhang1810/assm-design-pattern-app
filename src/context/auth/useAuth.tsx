import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthContextType } from './authContextType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { UserModel } from '@/src/api/features/authenticate/models/LoginModel';


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const onLogin = async (user: any) => {
    await AsyncStorage.setItem('user', JSON.stringify(user.user));
    await AsyncStorage.setItem('accesstoken', user.accessToken);
    setIsAuthenticated(true);
    setUser(user.user); 
    router.replace('/(tabs)/home');
  }

  const onUpdateProfile = async (user: UserModel) => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.setItem('user', JSON.stringify(user));
    // AsyncStorage.setItem('refreshtoken', user.refreshtoken);
    setIsAuthenticated(true);
    setUser(user); 
  }

  const onLogout = async () => {
    //Xóa dữ liệu trong storage và trong biến
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('accesstoken');
    // await AsyncStorage.removeItem('refreshtoken');
    setIsAuthenticated(false);
    setUser(null);
    router.replace('/login');
  }

  const isLoginUser = (userId: string) => {
    return user?.id === userId;
  }

  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const storedAccessToken = await AsyncStorage.getItem('accesstoken');
      
      if (storedUser && storedAccessToken) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
  
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{
      onLogin,
      onLogout,
      isAuthenticated,
      user,
      onUpdateProfile,
      isLoginUser
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
