import { TransferToFormData } from "@/src/utils/helper/TransferToFormData";
import { ApiPath } from "../../ApiPath";
import { BaseApiResponseModel } from "../../baseApiResponseModel/baseApiResponseModel";
import client from "../../client";
import { ChatModel, GetChatList } from "./models/Chat";
import { GetMessagesModel, GetMessagesModelResponse, Image, MessageModel } from "./models/Messages";


interface IMessagesRepo {
    getMessages: (data: GetMessagesModel) => Promise<BaseApiResponseModel<GetMessagesModelResponse>>;
    getChatList: (data: GetChatList) => Promise<BaseApiResponseModel<ChatModel[]>>;
    uploadImage: (data: Image[]) => Promise<BaseApiResponseModel<Image[]>>;
      
}

export class MessagesRepo implements IMessagesRepo {
    async getMessages(data: GetMessagesModel): Promise<BaseApiResponseModel<GetMessagesModelResponse>> {
        return client.get(ApiPath.GET_CHAT_MESSAGES + data?.userId, data );
    }

    async getChatList(data: GetChatList): Promise<BaseApiResponseModel<ChatModel[]>> {
        return client.get(ApiPath.GET_CHAT_LIST, data );
        
    }

    async uploadImage(data: Image[]): Promise<BaseApiResponseModel<Image[]>> {
         const formData = TransferToFormData(data);
         console.log("formData: ", formData);
         
         return client.post(ApiPath.UPLOAD_IMAGES, formData, { headers: { "Content-Type": "multipart/form-data" } })
    }

   
}                           

export const defaultMessagesRepo = new MessagesRepo();