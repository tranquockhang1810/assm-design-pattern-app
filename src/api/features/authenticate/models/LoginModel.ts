export interface LoginRequestModel {
    phone?: string;
    password?: string;
}

export interface UserModel {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    birthDate?: string;
    createdAt?: string;
    updatedAt?: string;
}


export interface LoginResponseModel {
    user?: UserModel;
    accesstoken?: string;
}