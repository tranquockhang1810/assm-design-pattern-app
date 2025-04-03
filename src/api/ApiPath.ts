export const ApiPath = {
  // Auth
  LOGIN: getApiPath("auth/login"),

  //Conversation
  GET_CONVERSATION: getApiPath("conversations/"),
  CREATE_CONVERSATION: getApiPath("conversations/"),
  DELETE_CONVERSATION: getApiPath("conversations/"),
  GET_CONVERSATION_BY_ID: getApiPath("conversations/"),

  //Message
  //   GET_WS_PATH_MESSAGE: getWSPath("messages/ws/"),
  GET_MESSAGES_BY_CONVERSATION_ID: getApiPath("messages/get_by_conversation_id/"),
  CREATE_MESSAGE: getApiPath("messages/"),
  GET_MESSAGE_BY_ID: getApiPath("messages/message/"),
  DELETE_MESSAGE: getApiPath("messages/message/"),


  //Conversation_Detail
  GET_CONVERSATION_DETAIL: getApiPath("conversation_details/get_by_id/"),
  CREATE_CONVERSATION_DETAIL: getApiPath("conversation_details/"),
  DELETE_CONVERSATION_DETAIL: getApiPath("conversation_details/"),
}

function getApiPath(path: string) {
  return `${process.env.EXPO_PUBLIC_SERVER_ENDPOINT!}/api/v1/${path}`;
}