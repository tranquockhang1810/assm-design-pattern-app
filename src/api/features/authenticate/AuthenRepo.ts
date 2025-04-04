import { TransferToFormData } from "@/src/utils/helper/TransferToFormData";
import { ApiPath } from "../../ApiPath";
import { BaseApiResponseModel } from "../../baseApiResponseModel/baseApiResponseModel";
import client from "../../client";
import { LoginRequestModel, LoginResponseModel, UserModel } from "./models/LoginModel";

interface IAuthenRepo {
    login(data: LoginRequestModel): Promise<BaseApiResponseModel<LoginResponseModel>>;
    register(data: LoginRequestModel): Promise<BaseApiResponseModel<UserModel>>;
}

export class AuthenRepo implements IAuthenRepo {
    async login(data: LoginRequestModel): Promise<BaseApiResponseModel<LoginResponseModel>> {
        return client.post(ApiPath.LOGIN, data )
    }

    async register(data: LoginRequestModel): Promise<BaseApiResponseModel<UserModel>> {
        const formData = TransferToFormData(data);
        console.log("formData", formData);
        
        return client.post(ApiPath.REGISTER, formData, { headers: { "Content-Type": "multipart/form-data" } }
        )
    }

}

export const defaultAuthenRepo = new AuthenRepo();