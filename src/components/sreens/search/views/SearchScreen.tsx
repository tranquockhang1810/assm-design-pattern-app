import {
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useState } from "react";
import useColor from "@/src/hooks/useColor";
import MyInput from "@/src/components/foundation/MyInput";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import SearchViewModel from "../viewModel/SearchViewModel";
import { ActivityIndicator } from "@ant-design/react-native";
import { defaultSearchRepo } from "@/src/api/features/search/SearchRepository";
import { useAuth } from "@/src/context/auth/useAuth";
import Toast from "react-native-toast-message";
import MessViewModel from "../../mess/viewModel/MessageModel";
import { defaultMessagesRepo } from "@/src/api/features/messages/MessagesRepo";

const SearchScreen = React.memo(() => {
  const { brandPrimary, backgroundColor } = useColor();
  const [keyword, setKeyword] = useState<string>("");
  const { searchUsers, loading, users, loadMoreUsers } =
    SearchViewModel(defaultSearchRepo);
  const {mess, fetchMess} = MessViewModel(defaultMessagesRepo);

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
    const timer = setTimeout(() => {
      searchUsers(keyword); 
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={{ backgroundColor: backgroundColor, paddingTop: Platform.OS === 'ios' ? 40 : 0 }}>
        <StatusBar barStyle="dark-content" />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            height: 60,
            paddingBottom: 10,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              paddingHorizontal: 10,
              alignItems: "center",
              backgroundColor: backgroundColor,
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={brandPrimary} />
            </TouchableOpacity>
            <MyInput
              placeholder={"Searching..."}
              value={keyword}
              onChangeText={setKeyword}
              variant="outlined"
              allowClear={{
                clearIcon: (
                  <Ionicons name="close-outline" size={16} color={"white"} />
                ),
              }}
              moreStyle={{
                width: "93%",
                paddingLeft: 10,
              }}
              autoFocus
              prefix={
                <Ionicons
                  name="search-outline"
                  size={20}
                  color={brandPrimary}
                  style={{ marginRight: 10 }}
                />
              }
            />
          </View>
        </View>
      </View>

      {/* Content */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, height: "auto", backgroundColor }}>
          <View style={{ marginTop: 10, paddingBottom: 60 }}>
            {keyword && (
              <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  {"Mọi người"}
                </Text>
              </View>
            )}
            {users?.length > 0 ? (
              <FlatList
                data={users}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    key={item?._id}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onPress={async() => {
                      if (item?._id) {
                        await fetchMess(1, item._id);
                        router.push(
                          `/chat?userId=${item._id}&name=${item.name}&avatar=${item.avatar}`
                        );
                      }
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "60%",
                      }}
                    >
                      <Image
                        source={{ uri: item?.avatar }}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 50,
                        }}
                      />
                      <Text
                        style={{
                          marginLeft: 10,
                          fontWeight: "bold",
                          fontSize: 16,
                        }}
                      >
                        {item?.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item?._id as string}
                onEndReached={() => loadMoreUsers(keyword)}
                ListFooterComponent={renderFooter}
                onEndReachedThreshold={0.5}
                removeClippedSubviews={true}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <>
                <Image
                  source={{
                    uri: "https://res.cloudinary.com/dkf51e57t/image/upload/v1729847545/Search-rafiki_uuq8tx.png",
                  }}
                  style={{
                    width: "100%",
                    height: 280,
                    resizeMode: "contain",
                  }}
                />
                <Text
                  style={{
                    paddingHorizontal: 20,
                    color: "gray",
                    textAlign: "center",
                    fontSize: 16,
                  }}
                >
                  {keyword
                    ? "No user found"
                    :  "Try searching some keyword"}
                </Text>
              </>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
      <Toast />
    </View>
  );
});

export default SearchScreen;