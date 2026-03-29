export interface IRegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

export interface ISignInPatientPayload {
  email: string;
  password: string;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}