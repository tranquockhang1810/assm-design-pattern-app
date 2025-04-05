import {
  View,
  Text,
  Platform,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Button,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import { useAuth } from "@/src/context/auth/useAuth";

import { ActivityIndicator, ListView, Modal } from "@ant-design/react-native";
import useColor from "@/src/hooks/useColor";
import { router, useFocusEffect } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { defaultMessagesRepo } from "@/src/api/features/messages/MessagesRepo";
import ChatItem from "../component/ChatItem";
import ChatViewModel from "../viewModel/ChatModel";
import { useSocket } from "@/src/context/socket/useSocket";

const ChatFeature = () => {
  const { onLogout, user } = useAuth();
  const { backgroundColor, brandPrimary } = useColor();
  const { loadingChatList, loadMoreChat, fetchChatList, chatList, page } =
    ChatViewModel(defaultMessagesRepo);
  const {newMessageTrigger} = useSocket();

  const renderFooter = useCallback(() => {
    return (
      <>
        {loadingChatList ? (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size="large" color={brandPrimary} />
          </View>
        ) : (
          <></>
        )}
      </>
    );
  }, [loadingChatList]);

  useEffect(() => {
      fetchChatList(1); 
    }
  , [newMessageTrigger]);
  
  useFocusEffect(
    useCallback(() => {
      // Tự động fetch khi quay lại màn hình chat
      fetchChatList(1);
    }, [])
  );
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f9f9f9", width: "100%" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: backgroundColor,
            paddingTop: Platform.OS === "ios" ? 40 : 0,
          }}
        >
          <View
            style={{
              height: 70,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 10,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ marginRight: 10 }}>
                <Image
                  source={require("@/assets/images/icon.png")}
                  style={{
                    width: 50,
                    height: "100%",
                    objectFit: "contain",
                    // marginLeft: 10,
                  }}
                />
              </View>

              <TouchableOpacity
              onPress={() => router.push("/search")}
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "60%",
                  borderBlockColor: "gray",
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 5,
                }}
              >
                <Text
                  style={{
                    color: "gray",
                  }}
                >
                  Search
                </Text>
                <Ionicons
                  name="search-outline"
                  size={20}
                  color={brandPrimary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => onLogout()}
              style={{
                backgroundColor: brandPrimary,
                padding: 5,
                borderRadius: 50,
                marginLeft: 10,
              }}
            >
            <Image
              source={{ uri: user?.avatar }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                borderColor: "gray",
                borderWidth: 1,
              }}
            />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ borderBottomWidth: 1, borderColor: "#000" }} />
        <FlatList
          data={chatList}
          renderItem={({ item }) => <ChatItem chat={item} />}
          keyExtractor={(item, index) =>
            item?._id?.toString() || index.toString()
          }
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          onEndReached={() => loadMoreChat()}
          showsVerticalScrollIndicator={false}
        />

        <Toast />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatFeature;
