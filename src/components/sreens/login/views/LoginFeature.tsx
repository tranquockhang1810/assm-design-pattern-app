import { useAuth } from "@/src/context/auth/useAuth";
import useColor from "@/src/hooks/useColor";
import { Form, WhiteSpace, WingBlank, Button, ActivityIndicator } from "@ant-design/react-native";
import { router, useGlobalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import LoginViewModel from "../viewModel/LoginViewModel";
import { defaultAuthenRepo } from "@/src/api/features/authenticate/AuthenRepo";
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View, Text } from "react-native";
import { Image } from 'expo-image';
import MyInput from "@/src/components/foundation/MyInput";
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { LoginRequestModel } from "@/src/api/features/authenticate/models/LoginModel";

const LoginFeature = () => {
  const roter = useRouter();
  const [seePassword, setSeePassword] = useState(false);
  const { backgroundColor, brandPrimary } = useColor();
  const [signInForm] = Form.useForm();
  const { onLogin } = useAuth();
  const { loading, login } = LoginViewModel(defaultAuthenRepo, onLogin);

  const { phone, password } = useGlobalSearchParams();

  useEffect(() => {
    if (phone && password) {
      signInForm.setFieldsValue({
        phone,
        password
      })
    }
  }, [phone, password])
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: backgroundColor, width: '100%' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <ScrollView
            style={{ width: '100%' }}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={{ width: '100%' }}>
              <Image
                source={require('@/assets/images/adaptive-icon.png')}
                style={{
                  width: '100%',
                  height: 80
                }}
                contentFit='contain'
              />
            </View>
            <WhiteSpace size="xl" />
            <WhiteSpace size="md" />
            <Form
              layout='vertical'
              style={{
                width: '100%',
                backgroundColor: "none",
              }}
              form={signInForm}
            >
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  { pattern: /^[0-9]{10}$/, message: "Số điện thoại phải là chuỗi 10 số!" },
                ]}
              >
                <MyInput
                  placeholder={"Số điện thoại"}
                  variant="outlined"
                  type='email-address'
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
              >
                <MyInput
                  placeholder={"Mật khẩu"}
                  type={seePassword ? "text" : "password"}
                  variant="outlined"
                  suffix={
                    <TouchableOpacity onPress={() => { setSeePassword(!seePassword) }}>
                      <Feather name={seePassword ? "eye" : "eye-off"} size={20} color={seePassword ? brandPrimary : "gray"} />
                    </TouchableOpacity>
                  }
                />
              </Form.Item>
              <WhiteSpace size="md" />
              <WingBlank>
                <TouchableOpacity
                //   onPress={() => router.push('/forgotPassword')}
                >
                  <Text
                    style={{
                      color: 'gray',
                    }}
                  >
                    {"Quên mật khẩu?"}
                  </Text>
                </TouchableOpacity>
              </WingBlank>
              <WhiteSpace size="md" />
              <Form.Item>
                <Button type="primary" loading={loading} onPress={() => {
                  signInForm
                    .validateFields()
                    .then(() => {
                      const { phone, password } = signInForm.getFieldsValue();
                      const data: LoginRequestModel = {
                        phone: phone,
                        password: password,
                      }
                      login(data);
                    })
                    .catch(() => {
                      console.log('error');
                    });
                }}>
                  Đăng nhập
                </Button>
              </Form.Item>
              <WhiteSpace size="xl" />
            </Form>
            <TouchableOpacity
              onPress={() => router.push('/signup')}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text>
                {"Chưa có tài khoản?"}
                <Text style={{ fontWeight: 'bold' }}>{" Đăng ký ngay"}</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
      <Toast />
    </KeyboardAvoidingView>
  );
};

export default LoginFeature;