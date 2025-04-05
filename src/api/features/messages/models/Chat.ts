export interface ChatModel {
    _id?: string;
    participants?: {
        _id?: string;
        name?: string;
        avatar?: string;
    }[];
    lastMessage?: string;
    lastMessageAt?: string;
    lastMessageStatus?: {
        [key: string]: boolean;
    };
}

export interface GetChatList {
    limit?: number;
    page?: number;
}