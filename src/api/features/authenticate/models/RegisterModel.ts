export interface RegisterRequestModel {
	name?: string;
	phone?: string;
	email?: string;
	birthDate?: string;
	password?: string;
	avatar?: {
		uri?: string;
		type?: string;
		name?: string;
	};
}
