import {
  ISignUpForm,
  ISignupFormError,
  IFormValidation,
  ILoginForm,
  ILoginFormError,
} from "../models/auth";

export const signUpValidation = (form: ISignUpForm): IFormValidation => {
  const errors: ISignupFormError = {
    usernameError: "",
    passwordError: "",
    confirmPasswordError: "",
    firstname: "",
    lastname: "",
  };

  // Step 1 Check empty values
  if (form.username === "") errors.usernameError = "Field cannot be empty";
  if (form.password === "") errors.passwordError = "Field cannot be empty";
  if (form.confirmPassword === "")
    errors.confirmPasswordError = "Field cannot be empty";
  if (form.firstname === "") errors.firstname = "Field cannot be empty";
  if (form.lastname === "") errors.lastname = "Field cannot be empty";

  if (
    errors.usernameError !== "" ||
    errors.passwordError !== "" ||
    errors.confirmPasswordError !== "" ||
    errors.firstname !== "" ||
    errors.lastname !== ""
  ) {
    return { completed: false, errors, alert: true };
  }

  // Step 2 Check same values
  if (form.password !== form.confirmPassword) {
    errors.confirmPasswordError = "Must be same as the password field";
  }

  if (errors.confirmPasswordError !== "") {
    return { completed: false, errors, alert: true };
  }

  return { completed: true, errors, alert: false };
};

export const loginValidation = (form: ILoginForm): IFormValidation => {
  const errors: ILoginFormError = {
    usernameError: "",
    passwordError: "",
  };

  // Step 1 Check empty values
  if (form.username === "") errors.usernameError = "Field cannot be empty";
  if (form.password === "") errors.passwordError = "Field cannot be empty";

  if (errors.usernameError !== "" || errors.passwordError !== "") {
    return { completed: false, errors, alert: true };
  }

  return { completed: true, errors, alert: false };
};
