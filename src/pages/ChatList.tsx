import { AccountBox, Add, Logout, Person, Send } from "@mui/icons-material";
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Card,
  CardHeader,
  Divider,
  Skeleton,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  FormControl,
  TextField,
  Button,
  ButtonGroup,
  LinearProgress,
} from "@mui/material";
import moment from "moment";
import { signOut, User } from "firebase/auth";
import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { auth, db } from "../firebase/clientApp";
import useLocalStorage from "../hooks/hooks";
import "../styles/Chat.scss";

const ChatSkeleton = () => {
  return (
    <Card style={{ maxWidth: 345, margin: 2 }}>
      <div style={{ margin: 2 }}>
        <CardHeader
          avatar={
            <Skeleton variant="circular" width={40} height={40}></Skeleton>
          }
          title={<Skeleton variant="rectangular"></Skeleton>}
          subheader={
            <Skeleton
              className="mt-2"
              variant="rectangular"
              height={20}
            ></Skeleton>
          }
        ></CardHeader>
        <Divider className="mx-2"></Divider>
      </div>
      <div style={{ maxWidth: "100vw", margin: 2 }}>
        <CardHeader
          avatar={
            <Skeleton variant="circular" width={40} height={40}></Skeleton>
          }
          title={<Skeleton variant="rectangular"></Skeleton>}
          subheader={
            <Skeleton
              className="mt-2"
              variant="rectangular"
              height={20}
            ></Skeleton>
          }
        ></CardHeader>
        <Divider className="mx-2"></Divider>
      </div>
      <div style={{ maxWidth: "100vw", margin: 2 }}>
        <CardHeader
          avatar={
            <Skeleton variant="circular" width={40} height={40}></Skeleton>
          }
          title={<Skeleton variant="rectangular"></Skeleton>}
          subheader={
            <Skeleton
              className="mt-2"
              variant="rectangular"
              height={20}
            ></Skeleton>
          }
        ></CardHeader>
        <Divider className="mx-2"></Divider>
      </div>
      <div style={{ maxWidth: "100vw", margin: 2 }}>
        <CardHeader
          avatar={
            <Skeleton variant="circular" width={40} height={40}></Skeleton>
          }
          title={<Skeleton variant="rectangular"></Skeleton>}
          subheader={
            <Skeleton
              className="mt-2"
              variant="rectangular"
              height={20}
            ></Skeleton>
          }
        ></CardHeader>
        <Divider className="mx-2"></Divider>
      </div>
      <div style={{ maxWidth: "100vw", margin: 2 }}>
        <CardHeader
          avatar={
            <Skeleton variant="circular" width={40} height={40}></Skeleton>
          }
          title={<Skeleton variant="rectangular"></Skeleton>}
          subheader={
            <Skeleton
              className="mt-2"
              variant="rectangular"
              height={20}
            ></Skeleton>
          }
        ></CardHeader>
        <Divider className="mx-2"></Divider>
      </div>
      <div style={{ maxWidth: "100vw", margin: 2 }}>
        <CardHeader
          avatar={
            <Skeleton variant="circular" width={40} height={40}></Skeleton>
          }
          title={<Skeleton variant="rectangular"></Skeleton>}
          subheader={
            <Skeleton
              className="mt-2"
              variant="rectangular"
              height={20}
            ></Skeleton>
          }
        ></CardHeader>
        <Divider className="mx-2"></Divider>
      </div>
    </Card>
  );
};

const windowStyling: React.CSSProperties = {
  width: "100vw",
  padding: 0,
  margin: 0,
  display: "flex",
  flexFlow: "column",
  height: "100vh",
};

const chatsContainer: React.CSSProperties = {
  flex: 1,
  width: "100vw",
  maxWidth: "100vw",
  padding: 0,
  display: "flex",
  flexDirection: "row",
};

const ChatList = () => {
  const [user, authLoading] = useAuthState(auth);
  const [authUser, setAuthUser] = useLocalStorage(
    "firebase:authUser:AIzaSyA-uMoXeXjTyfeCp9F-gBgCEVVOobeoiaU:[DEFAULT]",
    null
  );
  const [userInfoLoading, setUserInfoLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<DocumentData | null>();
  const [chatsLoading, setChatLoading] = useState<boolean>(false);
  const [chatsList, setChatsList] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [chatId, setChatId] =
    useState<QueryDocumentSnapshot<DocumentData> | null>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !authUser) {
      navigate("/");
    }

    if (user) {
      const userRef = doc(db, "users", user.uid);
      setUserInfoLoading(true);
      getDoc(userRef).then((doc) => {
        setUserInfoLoading(false);
        setUserInfo(doc.data());
      });

      const chatsCollection = collection(db, "chats");
      const chatsQuery = query(
        chatsCollection,
        where("users", "array-contains", user.uid)
      );
      onSnapshot(
        chatsQuery,
        (querySnapshot) => {
          setChatLoading(true);
          setChatsList(querySnapshot.docs);
          setChatLoading(false);
        },
        () => {},
        () => {
          setChatLoading(false);
        }
      );
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authUser]);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: React.MouseEvent<HTMLElement | null>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Container style={windowStyling}>
      <Box width={"100vw"}>
        <AppBar position="static">
          <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h5">Conversations</Typography>
            </Box>
            {!authLoading && !userInfoLoading && userInfo && (
              <Tooltip
                title={
                  <Typography variant="subtitle1">{`${userInfo["username"]} - Account Options`}</Typography>
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
            {(authLoading || userInfoLoading) && (
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
            setAuthUser(null);
            signOut(auth);
          }}
        >
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      {chatsLoading && <ChatSkeleton />}
      {!chatsLoading && (
        <Container style={chatsContainer} key={"chatsContainer"}>
          <Container className="chatsList" key={"chatsList"}>
            <Card
              style={{ height: "100%", width: "100%", borderRadius: 0 }}
              elevation={10}
            >
              <ButtonGroup style={{ display: "flex", justifyContent: "end" }}>
                <Tooltip title="New Conversation">
                  <Button
                    variant="contained"
                    id="newMsgBtn"
                    onClick={() => {
                      navigate("/new", {
                        state: { ...userInfo, uid: user?.uid },
                      });
                    }}
                  >
                    <Add />
                  </Button>
                </Tooltip>
              </ButtonGroup>
              <Divider variant="fullWidth" />
              <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                {chatsList.length > 0 &&
                  chatsList.map((chat, _) => (
                    <ConversationListItem
                      chat={chatId?.id}
                      refChat={chat}
                      conversationClick={() => {
                        setChatId(chat);
                      }}
                      uid={user?.uid!}
                    />
                  ))}
              </List>
            </Card>
          </Container>
          {!chatId && <EmptyConversationContainer />}
          {chatId && <ConversationWrapper chat={chatId} me={user} />}
        </Container>
      )}
    </Container>
  );
};

interface ConversationListItemProps {
  chat?: string;
  refChat: QueryDocumentSnapshot<DocumentData>;
  uid: string;
  conversationClick?: React.MouseEventHandler<HTMLLIElement>;
}

const ConversationListItem = (props: ConversationListItemProps) => {
  const { conversationClick, chat, refChat, uid } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [chatTitle, setChatTitle] = useState<string>("");

  useEffect(() => {
    let users: string[] = refChat.data()["users"];
    users = users.filter((val) => val !== uid);
    setLoading(true);
    const userDocFutures = users.map((e) => getDoc(doc(db, "users", e)));

    Promise.all(userDocFutures).then((docs) => {
      const names = docs
        .map((value) => {
          return [
            value.get("firstname").toString(),
            value.get("lastname").toString(),
          ].join(" ");
        })
        .join(", ");
      console.log(names);
      setChatTitle(names);
      setLoading(false);
    });

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refChat]);

  return (
    <>
      <ListItem
        key={refChat.id}
        alignItems="flex-start"
        onClick={conversationClick}
        sx={{
          "&:active": { bgcolor: "ButtonShadow" },
          cursor: "pointer",
          bgcolor: chat === refChat.id ? "ButtonHighlight" : "background.paper",
        }}
      >
        <ListItemAvatar>
          <Avatar
            alt={refChat.id + "-image"}
            src={refChat.data()["chat_image"]}
          />
        </ListItemAvatar>
        <Tooltip
          placement="left-end"
          arrow={true}
          title={refChat.data()["title"] ?? ""}
          followCursor
        >
          <ListItemText
            primary={
              <div className="titleTruncate">
                {loading && <LinearProgress />}
                {!loading && chatTitle}
              </div>
            }
            secondary={
              <Container
                style={{
                  padding: 0,
                  display: "flex",
                  justifyContent: "start",
                }}
                component={"span"}
              >
                <span className="msgTruncate">
                  {refChat.data()["last_message"]
                    ? refChat.data()["last_message"]["message"]
                    : "No Messages Yet"}
                </span>
                <span style={{ paddingLeft: 2, paddingRight: 2 }}>
                  &middot;
                </span>
                <span>
                  {refChat.data()["last_message"] ? (
                    <>
                      {moment(
                        refChat.data()["last_message"]["sent"].toDate()
                      ).fromNow()}
                    </>
                  ) : (
                    <></>
                  )}
                </span>
              </Container>
            }
          />
        </Tooltip>
      </ListItem>
      <Divider variant="middle" component="li" />
    </>
  );
};

const EmptyConversationContainer = () => {
  return (
    <Container
      style={{
        padding: 0,
        maxWidth: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4">No Chat Selected</Typography>
      <Typography variant="body1">
        Click on a conversation on the left to view messages
      </Typography>
    </Container>
  );
};

interface ConversationWrapperProps {
  chat: QueryDocumentSnapshot<DocumentData>;
  me: User | undefined | null;
}

const ConversationWrapper = (props: ConversationWrapperProps) => {
  const { chat, me } = props;
  const [messageList, setMessageList] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messageLoading, setMessageLoading] = useState<boolean>(false);

  useEffect(() => {
    if (chat) {
      const messageCollection = collection(db, "chats", chat.id, "messages");
      const messageQuery = query(
        messageCollection,
        where("created_dt", "<", Timestamp.fromDate(new Date()))
      );
      setMessageLoading(true);
      onSnapshot(
        messageQuery,
        (snapshot) => {
          setMessageList(snapshot.docs);
        },
        () => {},
        () => {
          setMessageLoading(false);
        }
      );
    }

    return () => {};
  }, [chat]);

  return (
    <Container
      style={{
        padding: 0,
        maxWidth: "100%",
        width: "100%",
        height: "100%",
      }}
    >
      {messageList && (
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <MessageBoardWrapper chat={chat} messages={messageList} me={me} />
          <MessageForm refChat={chat} me={me} />
        </div>
      )}
    </Container>
  );
};

interface MessageBoardProps {
  messages: QueryDocumentSnapshot<DocumentData>[];
  chat: QueryDocumentSnapshot<DocumentData>;
  me: User | null | undefined;
}

const MessageBoardWrapper = (props: MessageBoardProps) => {
  const { chat, messages, me } = props;
  return (
    <div
      id="MessageList"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 70,
        overflow: "auto",
      }}
    >
      <MessageBoard chat={chat} messages={messages} me={me} />
    </div>
  );
};

const MessageBoard = (props: MessageBoardProps) => {
  const { messages, chat, me } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<DocumentData[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    setLoading(true);
    const membersRefs = (chat.data()["users"] as []).map((user) =>
      doc(db, "users", user)
    );

    Promise.all<DocumentSnapshot<DocumentData>>(
      membersRefs.map((member) => getDoc(member))
    ).then((members) => {
      let u: DocumentData[] = [];
      members.forEach((member) => {
        u = [...u, { ...member.data(), uid: member.id }];
      });
      setUsers(u);
      setLoading(false);
      scrollToBottom();
    });

    return () => {};
  }, [chat]);

  return (
    <>
      {!loading && messages.length === 0 && (
        <Container
          style={{
            padding: 0,
            maxWidth: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            src={chat.data()["chat_image"]}
            sx={{ height: 100, width: 100 }}
          ></Avatar>
          <Typography variant="h5" sx={{ m: 4 }}>
            Type a message to begin a conversation
          </Typography>
        </Container>
      )}
      {!loading && messages.length >= 1 && (
        <List>
          {messages.map((message) => (
            <MessageItem message={message} users={users} me={me} />
          ))}
          <div className="endRef" ref={messagesEndRef} />
        </List>
      )}
    </>
  );
};

interface MessageFormProps {
  refChat: QueryDocumentSnapshot<DocumentData>;
  me: User | undefined | null;
}

const MessageForm = (props: MessageFormProps) => {
  const { refChat, me } = props;
  const [message, setMessage] = useState<string>("");
  return (
    <div
      id="MessageInputForm"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <FormControl style={{ flex: 1, marginRight: 5, marginLeft: 5 }}>
        <TextField
          label="Type a message ..."
          value={message}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setMessage(e.currentTarget.value);
          }}
        />
      </FormControl>
      <Button
        variant="contained"
        style={{ height: 35, marginLeft: 5, marginRight: 5 }}
        onClick={async () => {
          const newMessage = {
            created_dt: Timestamp.fromDate(new Date()),
            message,
            sent_by: me?.uid,
          };

          const messageDoc = doc(
            collection(db, "chats", refChat.id, "messages")
          );

          await setDoc(messageDoc, {
            ...newMessage,
          });

          await updateDoc(doc(db, "chats", refChat.id), {
            last_message: {
              message: message,
              sent: newMessage.created_dt,
            },
          });

          setMessage("");
        }}
      >
        <Send />
      </Button>
    </div>
  );
};

interface MessageItemProps {
  message: QueryDocumentSnapshot<DocumentData>;
  users: DocumentData[];
  me: User | undefined | null;
}

const MessageItem = (props: MessageItemProps) => {
  const { message, users, me } = props;
  const [item, setItem] = useState<{ me: boolean; info: DocumentData } | null>(
    null
  );

  const getUser = (sentBy: string) => {
    const myself = sentBy === me?.uid;
    const found = users.filter((user) => {
      if (myself) {
        return user.uid === me?.uid;
      } else {
        return user.uid !== me?.uid;
      }
    })[0];
    return {
      me: myself,
      info: found,
    };
  };

  useEffect(() => {
    setItem(getUser(message.data()["sent_by"]));
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{ display: "flex", justifyContent: item?.me ? "end" : "start" }}
    >
      <div>
        <div
          style={{
            marginRight: item?.me ? 15 : 0,
            marginLeft: !item?.me ? 15 : 0,
            display: "flex",
            justifyContent: item?.me ? "end" : "start",
            gap: 5,
          }}
        >
          <span>{item?.me ? "Me" : item?.info["username"]} </span>
          <span>&middot; </span>
          <span>
            {moment(message.data()["created_dt"].toDate()).fromNow()}{" "}
          </span>
        </div>
        <div
          style={{
            backgroundColor: "ActiveCaption",
            margin: 10,
            padding: 10,
            borderRadius: 5,
          }}
        >
          <span>{message.data()["message"]}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
