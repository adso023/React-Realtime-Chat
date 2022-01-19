import { LoginOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { auth } from "../../firebase/clientApp";
import { loginValidation } from "../../helpers/validators";
import useLocalStorage from "../../hooks/hooks";
import { ILoginForm, ILoginFormError } from "../../models/auth";
import "../../styles/Login.scss";
import { NavMenu } from "./components/NavMenu";
import { TopBar } from "./components/TopBar";

const Login = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [signIn, user, signInLoading, signInError] =
    useSignInWithEmailAndPassword(auth);

  const [authUser] = useLocalStorage(
    "firebase:authUser:AIzaSyA-uMoXeXjTyfeCp9F-gBgCEVVOobeoiaU:[DEFAULT]",
    null
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (user || authUser) {
      navigate("/chat");
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authUser]);

  const [errors, setFormErrors] = useState<ILoginFormError>({
    usernameError: "",
    passwordError: "",
  });

  const [alert, setAlert] = useState<boolean>(false);

  useEffect(() => {
    if (signInError) {
      if (signInError.code === "auth/wrong-password") {
        setAlert(true);
        setFormErrors({
          ...errors,
          passwordError: "Incorrect password",
        });
      } else if (signInError.code === "auth/user-not-found") {
        setAlert(true);
        setFormErrors({
          usernameError: "Incorrect/missing username",
          passwordError: "Incorrect/missing password",
        });
      }
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signInError]);

  const [form, setFormData] = useState<ILoginForm>({
    username: "",
    password: "",
  });

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [visible, setVisible] = useState<boolean>(false);

  const handleClick = (e: React.MouseEvent<HTMLElement | null>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <TopBar title="Login" altTitle="Sign Up Here" onClick={handleClick} />
      <NavMenu
        anchorPoint={anchorEl}
        onCloseClick={handleClose}
        route="/signup"
        title="Sign Up"
      />
      <div className="centered-container">
        <Card sx={{ maxWidth: 500, width: 500, margin: 2 }} elevation={10}>
          <CardHeader
            title={
              <Typography variant="h5" align="center">
                Login Form
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
            <FormControl sx={{ width: "100%", mt: 2 }}>
              <TextField
                required
                error={!!errors.passwordError}
                id="input-password"
                variant="outlined"
                label="Password"
                value={form.password}
                type={visible ? "text" : "password"}
                aria-describedby="Password"
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
          </CardContent>
          <CardActions>
            <LoadingButton
              loading={signInLoading}
              startIcon={<LoginOutlined />}
              variant="contained"
              onClick={async () => {
                const validate = loginValidation(form);

                if (validate.completed) {
                  // Sign in errors taken care of in useEffect above
                  await signIn(`${form.username}@rtchat.com`, form.password);
                } else {
                  setAlert(validate.alert);
                  setFormErrors(validate.errors as ILoginFormError);
                }
              }}
            >
              Submit
            </LoadingButton>
            <Button
              variant="text"
              color="secondary"
              onClick={() => {
                setAlert(false);
                setFormData({ username: "", password: "" });
                setFormErrors({ usernameError: "", passwordError: "" });
              }}
            >
              Clear
            </Button>
          </CardActions>
        </Card>
      </div>
    </>
  );
};

export default Login;
