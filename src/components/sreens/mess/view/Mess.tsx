import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useColor from "@/src/hooks/useColor";
import { useAuth } from "@/src/context/auth/useAuth";
import { Entypo, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Form,
  Input,
  Modal,
} from "@ant-design/react-native";
import { defaultMessagesRepo } from "@/src/api/features/messages/MessagesRepo";
import { useActionSheet } from "@expo/react-native-action-sheet";
import Toast from "react-native-toast-message";
import MessViewModel from "../viewModel/MessageModel";
// // import { useWebSocket } from "@/src/context/socket/useSocket";
// import UserProfileViewModel from "../../profile/viewModel/UserProfileViewModel";

const Chat = () => {
  const { backgroundColor, brandPrimary } = useColor();
  const { user,} = useAuth();
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();
  const [showMember, setShowMember] = React.useState(false);
  const [messagerForm] = Form.useForm();
  const {userId: rawUserId, name: rawName, avatar: rawAvatar} = useLocalSearchParams();
  const userId = typeof rawUserId === "string" ? rawUserId : "";
  console.log("userId", userId);
  const name = typeof rawName === "string" ? rawName : "";
  const avatar = typeof rawAvatar === "string" ? rawAvatar : "";
  
  // const [selectedMessage, setSelectedMessage] = useState<{
  //   id: string;
  //   content: string;
  //   user: { _id: string; family_name: string; name: string };
  // } | null>(null);

  console.log("avatar", avatar);
  

  

  const {mess, loadMoreMess, loading, fetchMess, page, setMess} = MessViewModel(defaultMessagesRepo);
  
  const [newMessage, setNewMessage] = useState('');
  
  console.log("mess", mess);
  
  
  const handleSendMessages = async () => {
    console.log("send message");
    
    
    }

  const flatListRef = useRef<FlatList>(null);

useEffect(() => {
    if (user) {
      fetchMess(1, userId)
    }
  }
  , [user]);



  const renderFooter = useCallback(() => {
    return (
      <>
        {loading ? (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size="large" color={brandPrimary} />
          </View>
        ) : (
          <></>
        )}
      </>
    );
  }, [loading]);
  // useFocusEffect(
  //   useCallback(() => {
  //     return () => {
  //       setSocketMessages([]); // Xóa tin nhắn khi rời trang
  //     };
  //   }, [])
  // );
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f9f9f9", width: "100%" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            marginTop: Platform.OS === "ios" ? 30 : 0,
            height: 50,
            paddingHorizontal: 16,
            paddingTop: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#fff",
            zIndex: 10,
            borderBottomColor: "black",
            borderBottomWidth: 1,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
             <Image
                        source={{ uri:avatar }}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          borderColor: "gray",
                          borderWidth: 1,
                        }}
                      />
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
              flex: 1,
            }}
          >
          {name}
          </Text>
        
        </View>

        <View style={{ flex: 1, padding: 10 }}>

          <FlatList
            ref={flatListRef}
            data={mess}
            inverted
            extraData={mess}
            keyExtractor={(item, index) =>
              item._id ? item._id.toString() : index.toString()
            }
            renderItem={({ item }) =>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent:
                      item.sender === user?._id ? "flex-end" : "flex-start",
                    marginBottom: 5,
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 12, color: "#999" }}>
                      {item.user.family_name} {item.user.name}
                    </Text>
                    <View
                      style={{
                        flexDirection:
                          item.sender === user?._id ? "row-reverse" : "row",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={{
                          uri: item.user.avatar_url,
                        }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 25,
                          backgroundColor: "#e0e0e0",
                          marginLeft: item.sender === user?._id ? 10 : 0,
                          marginRight: item.sender === user?._id ? 0 : 10,
                        }}
                      />
                      <View
                        style={{
                          padding: 10,
                          backgroundColor: backgroundColor,
                          borderColor: "#ccc",
                          borderWidth: 1,
                          borderRadius: 10,
                          alignSelf: "flex-end",
                          marginBottom: 5,
                          maxWidth: "80%",
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          alignItems:
                            item.sender === user?._id
                              ? "flex-end"
                              : "flex-start",
                        }}
                      >
                      </View>
                    </View>
                  </View>
                </View>
            }
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            // onEndReached={() => loadMoreMess()}
            removeClippedSubviews={true}
            showsVerticalScrollIndicator={false}
          />

          <Form
            style={{
              backgroundColor: "#fff",
            }}
            form={messagerForm}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                paddingBottom: Platform.OS === "ios" ? 10 : 40,
              }}
            >
              <Form.Item noStyle name="message">
                <Input
                  placeholder={"Nhập tin nhắn"}
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
              </Form.Item>

              <View
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
                <TouchableOpacity
                  onPress={() => {
                    handleSendMessages();
                  }}
                >
                  <FontAwesome name="send-o" size={30} color={brandPrimary} />
                </TouchableOpacity>
              </View>
            </View>
          </Form>
        </View>
      </View>
      {/* <Modal
        popup
        visible={showMember}
        animationType="slide-up"
        maskClosable
        onClose={() => {
          setShowMember(false);
        }}
        title={localStrings.Messages.Member}
      >
        <FlatList
          data={conversationsDetail}
          renderItem={({ item }) => <MemberMessage conversationDetail={item} />}
          // keyExtractor={(item, index) => item.user.id?.toString() || index.toString()}
        />
      </Modal> */}
      <Toast />
    </KeyboardAvoidingView>
  );
};

export default Chat;
