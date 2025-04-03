export interface CreateConversationModel {
    name ?: string
    image ?: {
        uri ?: string
        name ?: string
        type ?: string
    }
    user_ids ?: string[]
}

export interface GetConversationModel {
    limit : number
    page : number
}

export interface ConversationResponseModel {
    id?: string;
    name?: string;
    image?: string;
}