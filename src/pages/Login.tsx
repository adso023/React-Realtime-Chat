import {
  LoginOutlined,
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
  Container,
  FormControl,
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
import React, { useEffect, useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { auth } from "../firebase/clientApp";
import useLocalStorage from "../hooks/hooks";

interface ILoginForm {
  username: string;
  password: string;
}

interface ILoginFormError {
  usernameError: string;
  passwordError: string;
}

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

  const [loading, setLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const open = Boolean(anchorEl);
  const handleClick = (e: React.MouseEvent<HTMLElement | null>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Container style={{ width: "100vw", padding: 0, margin: 0 }}>
      <Box width={"100vw"}>
        <AppBar position="static">
          <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h5">Login</Typography>
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
          <Link href="/signup">Sign Up</Link>
        </MenuItem>
      </Menu>
      <Container
        style={{
          width: "100vw",
          padding: 0,
          margin: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
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
              loading={loading}
              startIcon={<LoginOutlined />}
              variant="contained"
              onClick={async () => {
                setLoading(true);
                const validate = ((): boolean => {
                  const errors: ILoginFormError = {
                    usernameError: "",
                    passwordError: "",
                  };

                  // Step 1 Check empty values
                  if (form.username === "")
                    errors.usernameError = "Field cannot be empty";
                  if (form.password === "")
                    errors.passwordError = "Field cannot be empty";

                  if (
                    errors.usernameError !== "" ||
                    errors.passwordError !== ""
                  ) {
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
                  await signIn(`${form.username}@rtchat.com`, form.password);
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
                setLoading(false);
                setAlert(false);
                setFormData({ username: "", password: "" });
                setFormErrors({ usernameError: "", passwordError: "" });
              }}
            >
              Clear
            </Button>
          </CardActions>
        </Card>
      </Container>
    </Container>
  );
};

export default Login;
