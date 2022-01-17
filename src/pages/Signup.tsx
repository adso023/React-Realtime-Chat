import {
  DeleteForever,
  Login,
  Person,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
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
  Link,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { auth, db, storage } from "../firebase/clientApp";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import useLocalStorage from "../hooks/hooks";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useCallback } from "react";
import "../styles/Login.scss";

interface ISignUpForm {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  confirmPassword: string;
}

interface ISignupFormError {
  usernameError: string;
  passwordError: string;
  firstname: string;
  lastname: string;
  confirmPasswordError: string;
}

enum UserInfoState {
  loading,
  completed,
  initial,
  none,
}

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

  const templateCallback = useCallback(async () => {
    if (!localStorage.getItem("template_url")) {
      const templateRef = ref(storage, "template/profile_placeholder.png");
      const url = await getDownloadURL(templateRef);
      setDownloadUrl(url);
    } else {
      setDownloadUrl(localStorage.getItem("template_url"));
    }
  }, []);
  useEffect(() => {
    templateCallback();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const open = Boolean(anchorEl);

  const [visible, setVisible] = useState<boolean>(false);
  const [confVisible, setConfVisible] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box>
        <AppBar position="static">
          <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h5">Create Account</Typography>
            </Box>
            <Tooltip title="Sign Up Here">
              <IconButton onClick={handleClick}>
                <Avatar>
                  <Person />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Link href="/login">Login</Link>
        </MenuItem>
      </Menu>
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {downloadUrl && file && (
                  <Tooltip title="Delete profile image">
                    <IconButton
                      style={{
                        position: "absolute",
                        top: 0,
                        left: "55%",
                        zIndex: 1000,
                      }}
                      onClick={async () => {
                        const deleteRef = ref(storage, `profile/${file?.name}`);
                        await deleteObject(deleteRef);
                        setFile(null);
                        await templateCallback();
                      }}
                    >
                      <DeleteForever />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip
                  title={
                    !file
                      ? "Click to add a profile image"
                      : "Click to replace profile"
                  }
                >
                  <IconButton
                    onClick={() => {
                      fileRef.current?.click();
                    }}
                  >
                    {!downloadUrl && (
                      <Avatar
                        sx={{
                          width: 100,
                          height: 100,
                          fontSize: 20,
                        }}
                      >
                        Profile Image
                      </Avatar>
                    )}
                    {downloadUrl && (
                      <Avatar
                        src={downloadUrl}
                        sx={{ width: 100, height: 100, fontSize: 30 }}
                      />
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      id="profileInput"
                      style={{ display: "none" }}
                      accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                      onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files?.length !== 0) {
                          setFile(e.target.files![0]);
                          console.log(e.target.files!);
                          try {
                            const uploadRef = ref(
                              storage,
                              `profile/${e.target.files![0].name}`
                            );
                            const uploadTask = await uploadBytes(
                              uploadRef,
                              e.target.files![0],
                              {
                                contentType: e.target.files![0].type,
                              }
                            );
                            const url = await getDownloadURL(uploadTask.ref);
                            console.log(url);
                            setDownloadUrl(url);
                          } catch (e) {
                            console.log(e);
                          }
                        } else {
                          console.log("No files selected");
                        }
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
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
                loading={loading}
                startIcon={<Login />}
                variant="contained"
                onClick={async () => {
                  setLoading(true);
                  const validate = ((): boolean => {
                    const errors: ISignupFormError = {
                      usernameError: "",
                      passwordError: "",
                      confirmPasswordError: "",
                      firstname: "",
                      lastname: "",
                    };

                    // Step 1 Check empty values
                    if (form.username === "")
                      errors.usernameError = "Field cannot be empty";
                    if (form.password === "")
                      errors.passwordError = "Field cannot be empty";
                    if (form.confirmPassword === "")
                      errors.confirmPasswordError = "Field cannot be empty";
                    if (form.firstname === "")
                      errors.firstname = "Field cannot be empty";
                    if (form.lastname === "")
                      errors.lastname = "Field cannot be empty";

                    if (
                      errors.usernameError !== "" ||
                      errors.passwordError !== "" ||
                      errors.confirmPasswordError !== "" ||
                      errors.firstname !== "" ||
                      errors.lastname !== ""
                    ) {
                      setFormErrors(errors);
                      setAlert(true);
                      return false;
                    }

                    // Step 2 Check same values
                    if (form.password !== form.confirmPassword) {
                      errors.confirmPasswordError =
                        "Must be same as the password field";
                    }

                    if (errors.confirmPasswordError !== "") {
                      setFormErrors(errors);
                      setAlert(true);
                      return false;
                    }

                    setFormErrors(errors);
                    setAlert(false);
                    return true;
                  })();

                  if (validate) {
                    // Sign in errors taken care of in useEffect above
                    await createUser(
                      `${form.username}@rtchat.com`,
                      form.password
                    );
                  }

                  setLoading(false);
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
                  setLoading(false);
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
