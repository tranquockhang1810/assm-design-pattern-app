import { FlatList, View, Text, Image, TouchableOpacity, Platform, KeyboardAvoidingView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/src/context/auth/useAuth";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Form, Input } from "@ant-design/react-native";
import MessViewModel from "../viewModel/MessageModel";
import useColor from "@/src/hooks/useColor";
import { defaultMessagesRepo} from "@/src/api/features/messages/MessagesRepo"; 

const Chat = () => {
  const { backgroundColor, brandPrimary } = useColor();
  const { user } = useAuth();
  const router = useRouter();
  const { userId: rawUserId, name: rawName, avatar: rawAvatar } = useLocalSearchParams();
  const userId = typeof rawUserId === "string" ? rawUserId : "";
  const name = typeof rawName === "string" ? rawName : "";
  const avatar = typeof rawAvatar === "string" ? rawAvatar : "";

  const { mess, loadMoreMess, loading, fetchMess, setMess } = MessViewModel(defaultMessagesRepo);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (user) {
      fetchMess(1, userId);
    }
  }, [user]);

  const handleSendMessages = async () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      // Thêm logic gửi tin nhắn ở đây, ví dụ gọi API
      setNewMessage(""); // Reset input sau khi gửi
    }
  };

  const renderFooter = () => (
    loading ? (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color={brandPrimary} />
      </View>
    ) : null
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f9f9f9", width: "100%" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            marginTop: Platform.OS === "ios" ? 30 : 0,
            height: 60,
            paddingHorizontal: 16,
            paddingTop: 16,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderBottomColor: "black",
            borderBottomWidth: 1,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={brandPrimary} />
            </TouchableOpacity>
          <Image
            source={{ uri: avatar }}
            style={{ width: 40, height: 40, borderRadius: 25, borderColor: "gray", borderWidth: 1 }}
          />
          <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold", paddingLeft:5}}>{name}</Text>
        </View>

        <View style={{ flex: 1, padding: 10 }}>
          <FlatList
            ref={flatListRef}
            data={mess} 
            inverted
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: item.sender === user?._id ? "flex-end" : "flex-start",
                  marginBottom: 5,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    padding: 10,
                    backgroundColor: backgroundColor,
                    borderColor: "#ccc",
                    borderWidth: 1,
                    borderRadius: 10,
                    maxWidth: "80%",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                  }}
                >
                  <Text>{item.content}</Text>
                </View>
              </View>
            )}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            onEndReached={() => loadMoreMess(userId)} // Truyền userId vào loadMoreMess
            showsVerticalScrollIndicator={false}
          />

          <Form style={{ backgroundColor: "#fff" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                paddingBottom: Platform.OS === "ios" ? 10 : 40,
              }}
            >
              <Input
                placeholder="Nhập tin nhắn"
                style={{
                  flex: 1,
                  borderColor: "#ccc",
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                  backgroundColor: "#fff",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
                value={newMessage}
                onChangeText={(text) => setNewMessage(text)}
              />
              <TouchableOpacity
                onPress={handleSendMessages}
                style={{
                  backgroundColor: "white",
                  borderRadius: 50,
                  marginLeft: 10,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1.5,
                  elevation: 5,
                }}
              >
                <FontAwesome name="send-o" size={30} color={brandPrimary} />
              </TouchableOpacity>
            </View>
          </Form>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chat;