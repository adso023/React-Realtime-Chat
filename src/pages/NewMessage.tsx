import {
  Person,
  AccountBox,
  Logout,
  MessageTwoTone,
  CreateTwoTone,
  ExpandMore,
  FilterAlt,
  Close,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  AppBar,
  Avatar,
  Box,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  TextField,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Chip,
} from "@mui/material";
import { signOut } from "firebase/auth";
import {
  collection,
  doc,
  DocumentData,
  getDocs,
  query,
  QueryDocumentSnapshot,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation, useNavigate } from "react-router";
import { auth, db } from "../firebase/clientApp";
import useLocalStorage from "../hooks/hooks";

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

const NewMessage = () => {
  const [user, authLoading] = useAuthState(auth);
  const [authUser, setAuthUser] = useLocalStorage(
    "firebase:authUser:AIzaSyA-uMoXeXjTyfeCp9F-gBgCEVVOobeoiaU:[DEFAULT]",
    null
  );
  const { state } = useLocation();
  const userInfo = state as UserInfo;
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [filterEl, setFilterEl] = useState<HTMLElement | null>(null);
  const [filterSelected, setFilterSelected] = useState<string>("uid");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [convoTitle, setConvoTitle] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedUsers, setSelectedUsers] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const open = Boolean(anchorEl);
  const openFilter = Boolean(filterEl);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleClick = (e: React.MouseEvent<HTMLElement | null>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterClick = (e: React.MouseEvent<HTMLElement | null>) => {
    setFilterEl(e.currentTarget);
  };
  const handleFilterClose = () => {
    setFilterEl(null);
  };

  useEffect(() => {
    if (!user && !authUser) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authUser]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (filterSelected === "uid" && searchTerm !== "") {
        const usersCollection = collection(db, "users");
        const usersFilterQuery = query(
          usersCollection,
          where("__name__", "==", searchTerm)
        );
        // Check for duplicate chats
        // const chatsCollection = collection(db, "chats");
        // const chatsDuplicateQuery = query(
        //   chatsCollection,
        //   where("users", "array-contains", searchTerm)
        // );

        const docs = await getDocs(usersFilterQuery);
        docs.forEach((doc) => {
          const checkExisting = selectedUsers.filter(
            (user) => user.id === searchTerm
          );
          if (checkExisting.length === 0) {
            setSelectedUsers([...selectedUsers, doc]);
            setSearchTerm("");
          }
        });
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterSelected]);

  return (
    <Container style={windowStyling}>
      <Box width={"100vw"}>
        <AppBar position="static">
          <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h5">New Message</Typography>
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
            navigate("/profile", { state: { ...userInfo, uid: user?.uid } });
          }}
        >
          <ListItemIcon>
            <AccountBox />
          </ListItemIcon>
          Profile
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
      <Menu
        anchorEl={filterEl}
        id="account-menu"
        open={openFilter}
        onClose={handleFilterClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            padding: 2,
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
        <FormControl component="fieldset">
          <FormLabel>Select a filter: </FormLabel>
          <RadioGroup
            aria-label="filter"
            value={filterSelected}
            onChange={(_, value: string) => {
              setFilterSelected(value);
            }}
          >
            <FormControlLabel
              value="username"
              disabled
              control={<Radio />}
              label="Username"
            />
            <FormControlLabel value="uid" control={<Radio />} label="UID" />
          </RadioGroup>
        </FormControl>
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
              <Typography variant="h6" align="center">
                New Conversation Form
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
                style={{
                  width: "100%",
                  height: 24,
                }}
              >
                <Typography sx={{ width: "33%", flexShrink: 0 }}>
                  Members
                  {selectedUsers.length > 0 && (
                    <span> - {selectedUsers.length}</span>
                  )}
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "77%",
                  }}
                >
                  Add multiple people for a group
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth={true}>
                  <TextField
                    label="Filter query"
                    size="small"
                    value={searchTerm}
                    InputProps={{
                      startAdornment: (
                        <IconButton onClick={handleFilterClick}>
                          <FilterAlt />
                        </IconButton>
                      ),
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setSearchTerm(e.currentTarget.value)
                    }
                  />
                </FormControl>
                {selectedUsers.length > 0 && (
                  <Box style={{ width: "100%" }}>
                    <Typography
                      sx={{ mt: 1 }}
                      variant="subtitle2"
                      component={"div"}
                    >
                      Selected Users:
                    </Typography>
                    {selectedUsers.map((user, index) => (
                      <Chip
                        color={index % 2 ? "primary" : "success"}
                        sx={{ m: 1 }}
                        label={
                          user.data()["firstname"] +
                          " " +
                          user.data()["lastname"]
                        }
                        avatar={
                          <Avatar
                            alt="Avatar image"
                            src={user.data()["profile_image"]}
                          />
                        }
                        deleteIcon={<Close />}
                        onDelete={() => {
                          console.log("Close clicked for ", user.id);
                          setSelectedUsers([
                            ...selectedUsers.filter((u) => u.id !== user.id),
                          ]);
                        }}
                      />
                    ))}
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={true}>
              <AccordionSummary
                aria-controls="panel2bh-content"
                id="panel2bh-header"
                style={{
                  width: "100%",
                  height: 24,
                }}
              >
                <Typography sx={{ width: "50%", flexShrink: 0 }}>
                  Conversation Metadata
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth={true}>
                  <TextField
                    label="Title"
                    size="small"
                    value={convoTitle}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setConvoTitle(e.currentTarget.value);
                    }}
                  />
                </FormControl>
              </AccordionDetails>
            </Accordion>
          </CardContent>
          <CardActions>
            <LoadingButton
              loading={loading}
              variant="contained"
              disabled={selectedUsers.length === 0}
              startIcon={<CreateTwoTone />}
              onClick={async () => {
                const isGroup = selectedUsers.length > 1;
                const newChat = {
                  chat_image: localStorage.getItem("template_url")!,
                  created_dt: Timestamp.fromDate(new Date()),
                  group: isGroup,
                  title:
                    convoTitle === ""
                      ? selectedUsers
                          .map(
                            (e) =>
                              `${e.data()["firstname"]} ${e.data()["lastname"]}`
                          )
                          .join(", ")
                      : convoTitle,
                  users: [...selectedUsers.map((e) => e.id), user!.uid],
                };
                const newChatDocRef = doc(collection(db, "chats"));
                await setDoc(newChatDocRef, { ...newChat });
                navigate("/chat");
              }}
            >
              Create
            </LoadingButton>
            <Button
              variant="text"
              onClick={() => {
                navigate("/chat");
              }}
            >
              Cancel
            </Button>
          </CardActions>
        </Card>
      </Container>
    </Container>
  );
};

export default NewMessage;
