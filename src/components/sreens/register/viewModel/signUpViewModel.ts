import { AuthenRepo } from "@/src/api/features/authenticate/AuthenRepo";
import { useState } from "react";
import Toast from "react-native-toast-message";
import dayjs from 'dayjs';
import { router } from "expo-router";
import { RegisterRequestModel } from "@/src/api/features/authenticate/models/RegisterModel";
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat)

// Handle sign up
const SignUpViewModel = (repo: AuthenRepo) => {
  const [loading, setLoading] = useState(false); 

  const handleSignUp = async (data: RegisterRequestModel) => {
    console.log("SignUp Data:", data);
    
    try {
      setLoading(true);
      const response = await repo.register(data);
      console.log("SignUp Response:", response);
      
      if (response && !response?.error) {
        Toast.show({
          type: "success",
          text1: "Registration Successful",
          text2: "You can now log in to your account.",
        });
        router.push(`/login?email=${data?.phone}&password=${data?.password}`);
      } else {
        Toast.show({
          type: "error",
          text1: "Registration Failed",
          text2: response?.error?.message,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };



  return {
    loading,
    handleSignUp,
  };
};

export default SignUpViewModel;
