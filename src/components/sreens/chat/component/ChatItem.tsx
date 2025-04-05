import { ChatModel } from "@/src/api/features/messages/models/Chat";
import { useAuth } from "@/src/context/auth/useAuth";
import { router } from "expo-router";
import { Image } from "expo-image";
import { TouchableOpacity, View, Text } from "react-native";
import { getTimeDiff } from "@/src/utils/helper/DateTransfer";
import { useSocket } from "@/src/context/socket/useSocket";

const ChatItem = ({ chat }: { chat: ChatModel }) => {
  const { user } = useAuth();
  const { participants, lastMessage, lastMessageAt, lastMessageStatus } = chat;
  const { seenMessage } = useSocket();
  
  const otherParticipant = participants?.find(
    (participant) => participant._id !== user?._id
  );

  if (!otherParticipant) {
    console.log("No other participant found");
    return null;
  }

  const { _id, name, avatar } = otherParticipant;

  // Kiểm tra trạng thái đã xem của user
  const isMessageSeen = user?._id ? lastMessageStatus?.[user._id] ?? true : true;


  return (
    <TouchableOpacity
      key={_id}
      onPress={() => {
        seenMessage({ chatId: chat?._id, userId: user?._id });
        router.push(`/chat?userId=${_id}&name=${name}&avatar=${avatar}`);
      }}
      style={{
        backgroundColor: "#f0f0f0",
        padding: 10,
        marginBottom: 2,
        borderRadius: 8,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Avatar */}
        <Image
          source={{ uri: avatar }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            borderColor: "gray",
            borderWidth: 1,
          }}
        />
        
        <View
          style={{
            flexDirection: "row",
            marginLeft: 10,
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
          }}
        >
          <View>
            {/* Tên người dùng */}
            <Text style={{ fontWeight: "bold" }}>{name}</Text>
            
            {/* Tin nhắn cuối, thay đổi màu nếu chưa đọc */}
            <Text style={{ color: isMessageSeen ? "gray" : "black", fontWeight: isMessageSeen ? "normal" : "bold" }}>
              {lastMessage}
            </Text>
          </View>
          
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Thời gian tin nhắn */}
            <Text style={{ color: "gray", marginRight: 5 }}>
              {getTimeDiff(lastMessageAt)}
            </Text>
            
            {/* Chấm đỏ nếu chưa đọc */}
            {!isMessageSeen && (
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "red",
                }}
              />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatItem;
