export interface ChatModel {
    id?: string;
    participants?: {
        _id?: string;
        name?: string;
        avatar?: string;
    }[];
    lastMessage?: string;
    lastMessageAt?: string;
}

export interface GetChatList {
    limit?: number;
    page?: number;
}