import { ChatModel } from "@/src/api/features/messages/models/Chat";
import { useAuth } from "@/src/context/auth/useAuth";
import { router } from "expo-router";
import { Image } from "expo-image";
import { TouchableOpacity, View, Text } from "react-native";
import { getTimeDiff } from "@/src/utils/helper/DateTransfer";

const ChatItem = ({ chat }: { chat: ChatModel }) => {
  const { user } = useAuth();
  const { participants, lastMessage, lastMessageAt } = chat;
  const localString = {
    Public: { MinuteAgo: "minute ago", HourAgo: "hour ago", DayAgo: "day ago" },
  }; 

  const otherParticipant = participants?.find(
    (participant) => participant._id !== user?._id
  );

  if (!otherParticipant) {
    console.log("No other participant found");
    return null; 
  }

  const { _id, name, avatar } = otherParticipant;

  return (
    <TouchableOpacity
      key={_id}
      onPress={() => {
        router.push(`/chat?userId=${_id}&name=${name}&avatar=${avatar}`);
      }}
      style={{ backgroundColor: "#f0f0f0", padding: 10, marginBottom: 10 }} 
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 2,
        }}
      >
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
            <Text style={{ fontWeight: "bold" }}>{name}</Text>
            <Text style={{ color: "gray" }}>{lastMessage}</Text>
          </View>
          <Text>
            {getTimeDiff(lastMessageAt, localString)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatItem;
