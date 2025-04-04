import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  Button,
  WingBlank,
  WhiteSpace,
  Form,
  Checkbox,
} from "@ant-design/react-native";
import MyInput from "@/src/components/foundation/MyInput";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useColor from "@/src/hooks/useColor";
import dayjs from "dayjs";
import Toast from "react-native-toast-message";
import { defaultAuthenRepo } from "@/src/api/features/authenticate/AuthenRepo";
import SignUpViewModel from "../viewModel/signUpViewModel";
import { useAuth } from "@/src/context/auth/useAuth";
import * as ImagePicker from 'expo-image-picker';
import MyDateTimePicker from "@/src/components/foundation/MyDateTimePicker";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat)

const SignUpFeature = () => {
  const router = useRouter();
  const [seePassword, setSeePassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  const { backgroundColor, brandPrimaryTap } = useColor();
  const [signUpForm] = Form.useForm();
  const [showPicker, setShowPicker] = useState(false);
  const { brandPrimary } = useColor();
  const { handleSignUp, loading } = SignUpViewModel(defaultAuthenRepo);
  const {lightGray} = useColor();
  const [newAvatar, setNewAvatar] = useState({ uri: "", name: "", type: "" });
  const pickAvatarImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 1,
      });

      if (!result?.canceled && result?.assets) {
        setNewAvatar(
          {
            uri: result.assets[0].uri,
            name: result.assets[0].fileName as string,
            type: result.assets[0].mimeType as string
          }
        );
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: "Pick images failed!",
      })
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: backgroundColor, width: "100%" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 30,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 24,
                color: brandPrimaryTap,
              }}
            >
              {"Sign Up".toUpperCase()}
            </Text>
            <WhiteSpace size="xl" />
            <Form
              layout="vertical"
              style={{ width: "100%", backgroundColor: "none" }}
              form={signUpForm}
            >
            <View style={{ alignItems: 'center', marginTop: -60 }}>
              <View style={{ position: 'relative' }}>
                <Image
                  source={{ uri: newAvatar?.uri }}
                  style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: lightGray }}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 10,
                    backgroundColor: backgroundColor,
                    borderRadius: 20,
                    padding: 5,
                  }}
                  onPress={pickAvatarImage}
                >
                  <MaterialIcons name="camera-alt" size={20} color={brandPrimary} />
                </TouchableOpacity>
                {newAvatar?.uri && (
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 10,
                      backgroundColor: backgroundColor,
                      borderRadius: 20,
                      padding: 5,
                    }}
                    onPress={() => setNewAvatar({ uri: "", name: "", type: "" })}
                  >
                    <Ionicons name="close" size={20} color={brandPrimary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
              {/* Name */}
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  display: "flex",
                  justifyContent: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                <View style={{ width: "50%" }}>
                  <Form.Item
                    name="name"
                    rules={[{ required: true, message: "Please enter name!"}]}
                  >
                    <MyInput
                      placeholder={"Name"}
                      variant="outlined"
                      type="text"
                      moreStyle={{ width: "100%" }}
                    />
                  </Form.Item>
                </View>
              </View>
              {/* Phone */}
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: "Please enter phone number!" },
                  { pattern: /^[0-9]{10}$/, message: "Phone number must be a 10-digit string!" },
                ]}
              >
                <MyInput
                  placeholder={"Phone Number"}
                  variant="outlined"
                  type="number"
                  maxLength={10}
                />
              </Form.Item>
              {/* birthdate */}
              <TouchableOpacity
                style={{ width: "100%" }}
                onPress={() => {
                  Platform.OS === 'android' && setShowPicker(true)
                }}
              >
                <Form.Item
                  name="birthDate"
                  rules={[
                    { required: true, message: "Please select a birth date!" },
                  ]}
                >
                  <MyInput
                    placeholder={"Birth Date"}
                    variant="outlined"
                    moreStyle={{
                      width: '100%',
                      height: 54,
                    }}
                    value={signUpForm.getFieldValue('birthDate')}
                    onPress={() => {
                      Platform.OS === 'ios' && setShowPicker(true)
                    }}
                    readOnly
                  />
                </Form.Item>
              </TouchableOpacity>
              {/* Email and OTP */}
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                {/* Email input */}
                <View style={{ width: "70%" }}>
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message:  "Please enter email!" },
                      { type: "email", message: "Invalid email!" },
                    ]}
                  >
                    <MyInput
                      placeholder={"Email"}
                      variant="outlined"
                      type="email-address"
                    />
                  </Form.Item>
                </View>
                </View>
              {/* password */}
              <Form.Item
                name="password"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject("Please enter password!");
                      }
                      if (value.length < 8) {
                        return Promise.reject( "Password must be over 8 characters!");
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <MyInput
                  placeholder={"Password"}
                  type={seePassword ? "text" : "password"}
                  variant="outlined"
                  suffix={
                    <TouchableOpacity
                      onPress={() => setSeePassword(!seePassword)}
                    >
                      <Feather
                        name={seePassword ? "eye" : "eye-off"}
                        size={20}
                        color={seePassword ? brandPrimary : "gray"}
                      />
                    </TouchableOpacity>
                  }
                />
              </Form.Item>
              {/* confirmPassword */}
              <Form.Item
                name="confirmPassword"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject("Please confirm your password!");
                      }
                      if (value.length < 8) {
                        return Promise.reject("Password must be over 8 characters!");
                      }
                      if (value === signUpForm.getFieldValue("password")) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Confirm password is invalid!");
                    }
                  }
                ]}
              >
                <MyInput
                  placeholder={"Confirm Password"}
                  type={seeConfirmPassword ? "text" : "password"}
                  variant="outlined"
                  suffix={
                    <TouchableOpacity
                      onPress={() => setSeeConfirmPassword(!seeConfirmPassword)}
                    >
                      <Feather
                        name={seeConfirmPassword ? "eye" : "eye-off"}
                        size={20}
                        color={seeConfirmPassword ? brandPrimary : "gray"}
                      />
                    </TouchableOpacity>
                  }
                />
              </Form.Item>
              {/* Checkbox
              <Form.Item
                name={"agree"}
                rules={[
                  {
                    validator: (_, value) => {
                      if (value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Please agree to the terms!");
                    }
                  }
                ]}
                valuePropName="checked"
              >
                <Checkbox>
                  <Text>{localStrings.SignUp.AgreePolicies}</Text>
                </Checkbox>
              </Form.Item>
              <WhiteSpace size="lg" /> */}
              {/* Register button */}
              <WingBlank size="lg">
                <Button type="primary" loading={loading} onPress={() => {
                  signUpForm.validateFields()
                    .then(() => {
                      handleSignUp({
                        ...signUpForm.getFieldsValue(),
                        avatar: newAvatar,
                      });
                      // signUpForm.resetFields();
                      // setNewAvatar({ uri: "", name: "", type: "" });
                    })
                    .catch((error) => {
                      Toast.show({
                        type: "error",
                        text1: error?.errorFields[0]?.errors[0],
                      })
                    })
                }}>
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {"Sign Up"}
                  </Text>
                </Button>
              </WingBlank>
              <WhiteSpace size="lg" />
            </Form>
            {/* Sign in */}
            <TouchableOpacity
              onPress={() => router.push('/login')}
              style={{ alignItems: 'center', justifyContent: 'center' }}
            >
              <Text>
                {"Already have an account?"}
                <Text style={{ fontWeight: 'bold' }}>{"Log in now!"}</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
      {/* Date Picker Modal */}
      <MyDateTimePicker
        value={dayjs(signUpForm.getFieldValue("birthDate")).toDate()}
        onSubmit={(date) => {
          signUpForm.setFieldValue(
            "birthDate",
            dayjs(date).format("DD-MM-YYYY")
          );
          signUpForm.validateFields(["birthDate"]);
        }}
        show={showPicker}
        onCancel={() => setShowPicker(false)}
        maxDate={new Date()}
        minDate={new Date(1900, 0, 1)}
      />
      <Toast />
    </KeyboardAvoidingView>
  );
};

export default SignUpFeature;
