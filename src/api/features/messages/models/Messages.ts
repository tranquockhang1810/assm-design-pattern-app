export interface CreateMessageModel {
  content?: string;
  conversation_id: string;
  parent_id?: string;
  user: {
    id?: string;
    avatar_url?: string;
    family_name?: string;
    name?: string;
  };
}

// export interface DeleteMessageModel {
//     id ?: string
// }

// export interface GetMessageByIdModel {
//     id ?: string
// }

export interface GetMessagesByConversationIdModel {
  conversation_id: string;
  created_at?: string;
  sort_by?: keyof MessageResponseModel;
  is_descending?: boolean;
  limit: number;
  page: number;
}

export interface MessageResponseModel {
  id?: string;
  conversation: {
    id?: string;
    name?: string;
    image?: string;
  };
  parentId?: string;
  parent_content?: string;
  content?: string;
  created_at?: string;
  user: {
    id?: string;
    avatar_url?: string;
    family_name?: string;
    name?: string;
  };
}

export interface MessageWebSocketResponseModel {
  content?: string;
  user_id?: string;
  conversation_id: string;
  parent_id?: string;
  parent_content?: string;
  user: {
    id?: string;
    avatar_url?: string;
    family_name?: string;
    name?: string;
  };
  created_at?: string;
}
