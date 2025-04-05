import {
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/src/context/auth/useAuth";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Form, Input } from "@ant-design/react-native";
import MessViewModel from "../viewModel/MessageModel";
import useColor from "@/src/hooks/useColor";
import { defaultMessagesRepo } from "@/src/api/features/messages/MessagesRepo";
import { useSocket } from "@/src/context/socket/useSocket";
import * as ImagePicker from "expo-image-picker";
import { sendMessageModel } from "@/src/api/features/messages/models/Messages";

const Chat = () => {
  const { backgroundColor, brandPrimary, lightGray } = useColor();
  const { user } = useAuth();
  const { sendMessage, newMessageTrigger } = useSocket();
  const router = useRouter();
  const {
    userId: rawUserId,
    name: rawName,
    avatar: rawAvatar,
  } = useLocalSearchParams();
  const userId = typeof rawUserId === "string" ? rawUserId : "";
  const name = typeof rawName === "string" ? rawName : "";
  const avatar = typeof rawAvatar === "string" ? rawAvatar : "";
  const { mess, loadMoreMess, loading, fetchMess, setMess, uploadImage, chat} =
    MessViewModel(defaultMessagesRepo);

  const [newMessage, setNewMessage] = useState("");
  const [selectedImageFiles, setSelectedImageFiles] = useState<
    ImagePicker.ImagePickerAsset[]
  >([]);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (user && mess) {
      fetchMess(1, userId);
    }
  }, [user, newMessageTrigger]);
  
  
  
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Bạn cần cấp quyền truy cập thư viện ảnh!");
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result?.canceled && result?.assets) {
        setSelectedImageFiles((prev) => [...prev, ...result.assets]);
      }
    } catch (error) {
      console.error("Error picking image: ", error);
    }
  };

  const removeImage = (index: number) => {
    const updatedFiles = [...selectedImageFiles];
    updatedFiles.splice(index, 1);
    setSelectedImageFiles(updatedFiles);
  };

  const handleSendMessages = async () => {
    if (newMessage.trim() === "" && selectedImageFiles.length === 0) {
      alert("Vui lòng nhập tin nhắn hoặc chọn hình ảnh/video!");
      return;
    }
  
    setSending(true);
    const limitedImageFiles = selectedImageFiles.slice(0, 5);
    let uploadedImageUrls: string[] = [];
  
    try {
      if (limitedImageFiles.length > 0) {
        const imagesToUpload = limitedImageFiles.map((file) => ({
          uri: file.uri,
          type: file.type || "image",
          name: file.fileName || "unknown",
        }));
  
        const uploadedImages = (await uploadImage(imagesToUpload)) || [];
        uploadedImageUrls = uploadedImages.map((image) => image.uri).filter((uri): uri is string => uri !== undefined) || [];
      }
  
      if (limitedImageFiles.length > 0 && uploadedImageUrls.length === 0) {
        alert("Upload ảnh thất bại, vui lòng thử lại!");
        setSending(false);
        return;
      }
  
      const message: sendMessageModel = {
        chatId: chat?._id,
        sender: user?._id,
        receiver: userId,
        content: newMessage.trim() !== "" ? newMessage : undefined,
        images: uploadedImageUrls,
      };
  
      setMess((prevMess) => [message, ...prevMess]);
      setNewMessage("");
      setSelectedImageFiles([]);
      sendMessage(message);
      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    } catch (err) {
      console.error("Gửi tin nhắn lỗi:", err);
    } finally {
      setSending(false);
    }
  };
  

  const renderFooter = () =>
    loading ? (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color={brandPrimary} />
      </View>
    ) : null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f9f9f9", width: "100%" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1 }}>
        {/* Header */}
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
          <TouchableOpacity onPress={() => {router.back()}}>
            <Ionicons name="chevron-back" size={24} color={brandPrimary} />
          </TouchableOpacity>
          <Image
            source={{ uri: avatar }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 25,
              borderColor: "gray",
              borderWidth: 1,
              marginHorizontal: 8,
            }}
          />
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{name}</Text>
        </View>

        {/* Messages */}
        <View style={{ flex: 1, padding: 10 }}>
          <FlatList
            ref={flatListRef}
            data={mess}
            inverted
            keyExtractor={(item, index) =>
              item._id ? item._id.toString() : index.toString()
            }
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent:
                    item.sender === user?._id ? "flex-end" : "flex-start",
                  marginBottom: 5,
                }}
              >
                {item.type === "image" && Array.isArray(item.images) ? (
                 <View
                 style={{
                   flexDirection: "row",
                   flexWrap: "wrap",
                   justifyContent: "center",
                 }}
               >
                 {item.images.map((imgUrl: string, index: number) => (
                   <Image
                     key={index}
                     source={{ uri: imgUrl }}
                     style={{
                       width: 100,
                       height: 100,
                       margin: 5,
                       borderRadius: 10,
                       backgroundColor: "#f0f0f0",
                     }}
                   />
                 ))}
               </View>
               
                ) : (
                  <View
                    style={{
                      padding: 10,
                      backgroundColor: backgroundColor,
                      borderColor: "#ccc",
                      borderWidth: 1,
                      borderRadius: 10,
                      maxWidth: "80%",
                    }}
                  >
                    <Text>{item.content}</Text>
                  </View>
                )}
              </View>
            )}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            onEndReached={() => loadMoreMess(userId)}
            showsVerticalScrollIndicator={false}
          />

          {/* Media Preview */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginVertical: 10,
            }}
          >
            {selectedImageFiles.map((file, index) => (
              <View
                key={index}
                style={{
                  position: "relative",
                  marginRight: 10,
                  marginBottom: 10,
                }}
              >
                <Image
                  source={{ uri: file?.uri }}
                  style={{
                    width: 75,
                    height: 75,
                    borderRadius: 10,
                    backgroundColor: "#f0f0f0",
                  }}
                />
                <TouchableOpacity
                  onPress={() => removeImage(index)}
                  style={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    backgroundColor: "white",
                    borderRadius: 12,
                    padding: 2,
                  }}
                >
                  <Ionicons name="close" size={18} color={brandPrimary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Input */}
          <Form style={{ backgroundColor: "#fff" }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: lightGray,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                disabled={sending}
              >
                <Ionicons name="image-outline" size={30} color={brandPrimary} />
              </TouchableOpacity>

              <Input
                placeholder="Nhập tin nhắn"
                style={{
                  flex: 1,
                  borderColor: "#ccc",
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                  backgroundColor: "#fff",
                }}
                value={newMessage}
                onChangeText={setNewMessage}
              />

              <TouchableOpacity
                onPress={handleSendMessages}
                disabled={sending}
                style={{
                  backgroundColor: "white",
                  borderRadius: 50,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  elevation: 5,
                }}
              >
                {sending ? (
                  <ActivityIndicator size="small" color={brandPrimary} />
                ) : (
                  <FontAwesome name="send-o" size={30} color={brandPrimary} />
                )}
              </TouchableOpacity>
            </View>
          </Form>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chat;
