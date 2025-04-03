import {
  View,
  Text,
  Platform,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import { useAuth } from "@/src/context/auth/useAuth";

import { ActivityIndicator, ListView, Modal } from "@ant-design/react-native";
import MessagerItem from "../component/MessagesItem";
import useColor from "@/src/hooks/useColor";
import { router } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { defaultMessagesRepo } from "@/src/api/features/messages/MessagesRepo";
import { ConversationDetailResponseModel } from "@/src/api/features/messages/models/ConversationDetail";
import useConversationDetailViewModel from "../viewModel/ConversationDetailsViewModel";
import useConversationViewModel from "../viewModel/ConversationViewModel";
import { create } from "react-test-renderer";

const MessagesFeature = () => {
  const { user } = useAuth();
  const { backgroundColor, brandPrimary } = useColor();
  const [showGroupModel, setShowGroupModel] = React.useState(false);
  const { conversationId, createConversation } =
    useConversationViewModel(defaultMessagesRepo);
    console.log("conversationId", conversationId);
    
  const {
    conversationsDetail,
    fetchConversationsDetail,
    pageDetail,
    loadMoreConversationsDetail,
    loading,
    total,
  } = useConversationDetailViewModel(defaultMessagesRepo);

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
  useEffect(() => {
    if (user) {
      fetchConversationsDetail(pageDetail, user.id, undefined);
    }
  }, [user]);

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
            paddingTop: Platform.OS === "ios" ? 30 : 0,
          }}
        >
          <StatusBar barStyle="dark-content" />
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              height: 60,
              paddingBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 10,
                alignItems: "center",
                flex: 1,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
              >
                <Ionicons
                  name="arrow-back-outline"
                  size={24}
                  color={brandPrimary}
                />
              </TouchableOpacity>

              <Text
                style={{ fontWeight: "bold", fontSize: 20, marginLeft: 10 }}
              >
                Tin nhắn
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowGroupModel(true);
                }}
              >
                <AntDesign
                  name="addusergroup"
                  size={24}
                  color={brandPrimary}
                  style={{ marginLeft: "auto" }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ borderBottomWidth: 1, borderColor: "#000" }} />
        <FlatList
          data={conversationsDetail}
          renderItem={({ item }) => (
            <MessagerItem conversationDetail={item} total={total} />
          )}
          keyExtractor={(item, index) =>
            item.conversation.id?.toString() || index.toString()
          }
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          onEndReached={() => loadMoreConversationsDetail(user?.id, undefined)}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
        />

        <Toast />
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessagesFeature;
