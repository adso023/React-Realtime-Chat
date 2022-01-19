import { Login, Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/clientApp";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import useLocalStorage from "../../hooks/hooks";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "../../styles/Login.scss";
import { NavMenu } from "./components/NavMenu";
import { ProfilePicker } from "./components/ImagePicker";
import {
  ISignUpForm,
  ISignupFormError,
  UserInfoState,
} from "../../models/auth";
import { signUpValidation } from "../../helpers/validators";
import { TopBar } from "./components/TopBar";

const SignupPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [createUser, user, signInLoading, signInError] =
    useCreateUserWithEmailAndPassword(auth);

  const navigate = useNavigate();

  const [authUser] = useLocalStorage(
    "firebase:authUser:AIzaSyA-uMoXeXjTyfeCp9F-gBgCEVVOobeoiaU:[DEFAULT]",
    null
  );

  const [userInfoUpdate, setUserInfoUpdate] = useState<UserInfoState>(
    UserInfoState.initial
  );

  useEffect(() => {
    if (user || authUser) {
      const userRef = user
        ? doc(db, "users", user.user.uid)
        : doc(db, "users", authUser["uid"]);

      setUserInfoUpdate(UserInfoState.loading);

      getDoc(userRef).then((doc) => {
        if (doc.data() === undefined) {
          setDoc(userRef, {
            username: form.username,
            firstname: form.firstname,
            lastname: form.lastname,
            profile_image: downloadUrl,
          }).then((_) => {
            setUserInfoUpdate(UserInfoState.completed);
          });
        } else {
          setUserInfoUpdate(UserInfoState.completed);
        }
      });

      if (userInfoUpdate === UserInfoState.completed) {
        navigate("/chat");
      }
    } else {
      setUserInfoUpdate(UserInfoState.none);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authUser, userInfoUpdate]);

  const [errors, setFormErrors] = useState<ISignupFormError>({
    usernameError: "",
    passwordError: "",
    confirmPasswordError: "",
    firstname: "",
    lastname: "",
  });

  const [alert, setAlert] = useState<boolean>(false);

  useEffect(() => {
    if (signInError) {
      if (signInError.code === "auth/email-already-in-use") {
        setFormErrors({
          ...errors,
          usernameError: "Username is already taken",
        });
      } else if (signInError.code === "auth/weak-password") {
        setFormErrors({
          ...errors,
          passwordError: "Password must be 6 characters long",
          confirmPasswordError: "Password must be 6 characters long",
        });
      }

      setAlert(true);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signInError]);

  const [form, setFormData] = useState<ISignUpForm>({
    username: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
  });

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [visible, setVisible] = useState<boolean>(false);

  const [confVisible, setConfVisible] = useState<boolean>(false);

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <TopBar
        title="Create Account"
        altTitle="Login Here"
        onClick={handleClick}
      />
      <NavMenu
        anchorPoint={anchorEl}
        route="/login"
        title="Login"
        onCloseClick={handleClose}
      />
      <div className="centered-container">
        {/* Below are sign up states */}
        {userInfoUpdate === UserInfoState.loading && <CircularProgress />}
        {(userInfoUpdate === UserInfoState.none ||
          userInfoUpdate === UserInfoState.initial) && (
          <Card sx={{ maxWidth: 500, width: 500, margin: 2 }} elevation={10}>
            <CardHeader
              title={
                <Typography variant="h5" align="center">
                  New User Form
                </Typography>
              }
            />
            <CardContent>
              {alert ? (
                <Alert
                  style={{ marginBottom: 10 }}
                  variant="filled"
                  severity="error"
                >
                  Errors are present
                </Alert>
              ) : (
                <></>
              )}
              <ProfilePicker
                onClick={(url: string | null) => {
                  setDownloadUrl(url);
                }}
              />
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  required
                  error={!!errors.usernameError}
                  id="input-username"
                  variant="outlined"
                  label="Username"
                  value={form.username}
                  aria-describedby="Username"
                  helperText={errors.usernameError ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newData = {
                      ...form,
                      username: e.currentTarget.value,
                    };
                    setFormData(newData);
                  }}
                />
              </FormControl>
              <Grid container spacing={2}>
                <Grid item xs>
                  <FormControl sx={{ mt: 2 }}>
                    <TextField
                      required
                      id="input-firstname"
                      label="First Name"
                      error={!!errors.firstname}
                      value={form.firstname}
                      aria-describedby="First Name"
                      variant="outlined"
                      helperText={errors.firstname ?? ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newData = {
                          ...form,
                          firstname: e.currentTarget.value,
                        };
                        setFormData(newData);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs>
                  <FormControl sx={{ mt: 2 }}>
                    <TextField
                      required
                      id="input-lastname"
                      label="Last Name"
                      error={!!errors.lastname}
                      value={form.lastname}
                      aria-describedby="Last Name"
                      variant="outlined"
                      helperText={errors.lastname ?? ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newData = {
                          ...form,
                          lastname: e.currentTarget.value,
                        };
                        setFormData(newData);
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs>
                  <FormControl sx={{ mt: 2 }}>
                    <TextField
                      required
                      id="input-password"
                      label="Password"
                      error={!!errors.passwordError}
                      type={visible ? "text" : "password"}
                      value={form.password}
                      aria-describedby="Password"
                      variant="outlined"
                      helperText={errors.passwordError ?? ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newData = {
                          ...form,
                          password: e.currentTarget.value,
                        };
                        setFormData(newData);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setVisible(!visible)}>
                              {visible ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs>
                  <FormControl sx={{ mt: 2 }}>
                    <TextField
                      required
                      id="input-password"
                      label="Password"
                      error={!!errors.confirmPasswordError}
                      type={confVisible ? "text" : "password"}
                      value={form.confirmPassword}
                      aria-describedby="Password"
                      variant="outlined"
                      helperText={errors.confirmPasswordError ?? ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newData = {
                          ...form,
                          confirmPassword: e.currentTarget.value,
                        };
                        setFormData(newData);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setConfVisible(!confVisible)}
                            >
                              {confVisible ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <LoadingButton
                loading={signInLoading}
                startIcon={<Login />}
                variant="contained"
                onClick={async () => {
                  const validate = signUpValidation(form);

                  if (validate.completed) {
                    // Sign in errors taken care of in useEffect above
                    await createUser(
                      `${form.username}@rtchat.com`,
                      form.password
                    );
                  } else {
                    setAlert(validate.alert);
                    setFormErrors(validate.errors as ISignupFormError);
                  }
                }}
              >
                Submit
              </LoadingButton>
              <Button
                variant="text"
                color="secondary"
                onClick={() => {
                  setFormData({
                    username: "",
                    password: "",
                    confirmPassword: "",
                    firstname: "",
                    lastname: "",
                  });
                  setFormErrors({
                    usernameError: "",
                    passwordError: "",
                    confirmPasswordError: "",
                    firstname: "",
                    lastname: "",
                  });
                  setAlert(false);
                }}
              >
                Clear
              </Button>
            </CardActions>
          </Card>
        )}
      </div>
    </>
  );
};

export default SignupPage;
