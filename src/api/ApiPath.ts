export const ApiPath = {
  // Auth
  LOGIN: getApiPath("auth/login"),
  REGISTER : getApiPath("auth/register"),

  // Upload
  UPLOAD_IMAGES: getApiPath("upload/images"),
  // User
  SEARCH_USER: getApiPath("user/search"),

  //Chat
  GET_CHAT_MESSAGES: getApiPath("chat/"),
  GET_CHAT_LIST: getApiPath("chat"),
}

function getApiPath(path: string) {
  return `${process.env.EXPO_PUBLIC_SERVER_ENDPOINT!}/api/v1/${path}`;
}