import { ApiPath } from "../../ApiPath";
import { BaseApiResponseModel } from "../../baseApiResponseModel/baseApiResponseModel";
import client from "../../client";
import { ChatModel, GetChatList } from "./models/Chat";
import { GetMessagesModel, GetMessagesModelResponse, MessageModel } from "./models/Messages";


interface IMessagesRepo {
    getMessages: (data: GetMessagesModel) => Promise<BaseApiResponseModel<GetMessagesModelResponse>>;
    getChatList: (data: GetChatList) => Promise<BaseApiResponseModel<ChatModel[]>>;
      
}

export class MessagesRepo implements IMessagesRepo {
    async getMessages(data: GetMessagesModel): Promise<BaseApiResponseModel<GetMessagesModelResponse>> {
        return client.get(ApiPath.GET_CHAT_MESSAGES + data?.userId, data );
    }

    async getChatList(data: GetChatList): Promise<BaseApiResponseModel<ChatModel[]>> {
        return client.get(ApiPath.GET_CHAT_LIST, data );
        
    }

   
}                           

export const defaultMessagesRepo = new MessagesRepo();