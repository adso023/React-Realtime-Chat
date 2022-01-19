export interface ISignUpForm {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  confirmPassword: string;
}

export interface ISignupFormError {
  usernameError: string;
  passwordError: string;
  firstname: string;
  lastname: string;
  confirmPasswordError: string;
}

export interface IFormValidation {
  completed: boolean;
  errors: ISignupFormError | ILoginFormError;
  alert: boolean;
}

export interface ILoginForm {
  username: string;
  password: string;
}

export interface ILoginFormError {
  usernameError: string;
  passwordError: string;
}

export enum UserInfoState {
  loading,
  completed,
  initial,
  none,
}
