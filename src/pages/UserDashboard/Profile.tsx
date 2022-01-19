import {
  ExpandMore,
  Logout,
  MessageTwoTone,
  Person,
  SaveTwoTone,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { signOut } from "firebase/auth";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation, useNavigate } from "react-router";
import { auth } from "../../firebase/clientApp";
import useLocalStorage from "../../hooks/hooks";

const windowStyling: React.CSSProperties = {
  width: "100vw",
  padding: 0,
  margin: 0,
  display: "flex",
  flexFlow: "column",
};

interface UserInfo {
  username: string;
  firstname: string;
  lastname: string;
  profile_image?: string;
  uid: string;
}

const Profile = () => {
  const [user, authLoading] = useAuthState(auth);
  const [authUser, setAuthUser] = useLocalStorage(
    "firebase:authUser:AIzaSyA-uMoXeXjTyfeCp9F-gBgCEVVOobeoiaU:[DEFAULT]",
    null
  );
  const { state } = useLocation();
  const userInfo = state as UserInfo;
  const navigate = useNavigate();

  const [expanded, setExpanded] = React.useState<string | false>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLElement | null>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  useEffect(() => {
    if (!user && !authUser) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authUser]);

  return (
    <Container style={windowStyling}>
      <Box width={"100vw"}>
        <AppBar position="static">
          <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h5">Profile</Typography>
            </Box>
            {!authLoading && (
              <Tooltip
                title={
                  <Typography variant="subtitle1">{`${userInfo.username} - Account Options`}</Typography>
                }
              >
                <IconButton onClick={handleClick}>
                  {userInfo["profile_image"] && (
                    <Avatar src={userInfo["profile_image"]} />
                  )}
                  {!userInfo["profile_image"] && (
                    <Avatar>
                      <Person />
                    </Avatar>
                  )}
                </IconButton>
              </Tooltip>
            )}
            {authLoading && (
              <Tooltip
                title={
                  <Typography variant="subtitle1">Loading Account</Typography>
                }
              >
                <CircularProgress color="secondary" />
              </Tooltip>
            )}
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
        <MenuItem
          onClick={() => {
            navigate("/chat");
          }}
        >
          <ListItemIcon>
            <MessageTwoTone />
          </ListItemIcon>
          Your Chats
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            signOut(auth);
            setAuthUser(null);
          }}
        >
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <Container
        style={{
          flex: 1,
          width: "100vw",
          maxWidth: "100vw",
          padding: 0,
          height: "max-content",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card sx={{ maxWidth: 500, width: 500, margin: 2 }} elevation={10}>
          <CardHeader
            title={
              <Typography variant="h6" align="center">
                Profile Management
              </Typography>
            }
          />
          <CardContent>
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography sx={{ width: "33%", flexShrink: 0 }}>
                  User Details
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs style={{ paddingTop: 0 }}>
                    <FormControl>
                      <TextField label="First Name" size="small" />
                    </FormControl>
                  </Grid>
                  <Grid item xs style={{ paddingTop: 0 }}>
                    <FormControl>
                      <TextField label="Last Name" size="small" />
                    </FormControl>
                  </Grid>
                </Grid>
                <FormControl sx={{ mt: 2 }} fullWidth={true}>
                  <TextField label="Phone number" size="small" />
                </FormControl>
                <FormControl sx={{ mt: 2 }} fullWidth={true}>
                  <TextField label="Username" size="small" />
                </FormControl>
              </AccordionDetails>
              <AccordionActions>
                <LoadingButton variant="contained" startIcon={<SaveTwoTone />}>
                  Save
                </LoadingButton>
                <Button variant="text">Reset</Button>
              </AccordionActions>
            </Accordion>
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <Typography sx={{ width: "33%", flexShrink: 0 }}>
                  Theme
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl component="fieldset">
                  <FormLabel>Select a theme (Saves automatically): </FormLabel>
                  <RadioGroup aria-label="theme" defaultValue="light">
                    <FormControlLabel
                      value="light"
                      control={<Radio />}
                      label="Light"
                    />
                    <FormControlLabel
                      value="dark"
                      control={<Radio />}
                      label="Dark"
                    />
                    <FormControlLabel
                      value="system-theme"
                      control={<Radio />}
                      label="System Theme"
                    />
                  </RadioGroup>
                </FormControl>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel3"}
              onChange={handleChange("panel3")}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel3bh-content"
                id="panel3bh-header"
              >
                <Typography sx={{ width: "45%", flexShrink: 0 }}>
                  Conversation Stats
                </Typography>
              </AccordionSummary>
              <AccordionDetails>Details here</AccordionDetails>
            </Accordion>
          </CardContent>
          <Divider variant="middle" />
          <CardActions
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>
              <Typography variant="caption">
                <strong>Name:</strong> {userInfo.firstname} {userInfo.lastname}
              </Typography>
            </div>
            <div>
              <Typography variant="caption">
                <strong>Created Date:</strong>{" "}
                {moment(user?.metadata.creationTime).format(
                  "MMM, DD ddd, YYYY - hh:mm"
                )}
              </Typography>
            </div>
            <div>
              <Typography variant="caption">
                <strong>Last Signed In:</strong>{" "}
                {moment(user?.metadata.lastSignInTime).format(
                  "MMM, DD ddd, YYYY - hh:mm"
                )}
              </Typography>
            </div>
          </CardActions>
        </Card>
      </Container>
    </Container>
  );
};

export default Profile;
