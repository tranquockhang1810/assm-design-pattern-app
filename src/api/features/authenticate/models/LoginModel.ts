export interface LoginRequestModel {
    phone?: string;
    password?: string;
}

export interface UserModel {
    id?: string;
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
    access_token?: string;
}