import { Add } from "@mui/icons-material";
import {
  Container,
  Tooltip,
  Card,
  Divider,
  List,
  Button,
  ButtonGroup,
} from "@mui/material";
import { signOut } from "firebase/auth";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { auth, db } from "../../firebase/clientApp";
import useLocalStorage from "../../hooks/hooks";
import "../../styles/Chat.scss";
import { ChatSkeleton } from "./components/MainDashboard/ChatSkeleton";
import { ConversationWrapper } from "./components/ConversationWrapper/ConversationWrapper";
import { ChatNavMenu } from "./components/MainDashboard/ChatNavMenu";
import { ChatTopBar } from "./components/MainDashboard/ChatTopBar";
import { ConversationListItem } from "./components/MainDashboard/ConversationListItem";
import { EmptyConversationContainer } from "./components/MainDashboard/EmptyConversation";

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
  }, [user]);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLElement | null>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Container style={windowStyling}>
      <ChatTopBar
        title="Conversations"
        authLoading={authLoading}
        userInfoLoading={userInfoLoading}
        userInfo={userInfo}
        onClick={handleClick}
      />
      <ChatNavMenu
        anchorPoint={anchorEl}
        userInfo={userInfo}
        onCloseClick={handleClose}
        onLogOutClick={() => {
          handleClose();
          setAuthUser(null);
          signOut(auth);
        }}
      />
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

export default ChatList;
