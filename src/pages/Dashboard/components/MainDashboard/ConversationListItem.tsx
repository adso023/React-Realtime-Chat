import {
  Avatar,
  Container,
  Divider,
  LinearProgress,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from "@mui/material";
import {
  doc,
  DocumentData,
  getDoc,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import moment from "moment";
import { useEffect, useState } from "react";
import { db } from "../../../../firebase/clientApp";

interface ConversationListItemProps {
  chat?: string;
  refChat: QueryDocumentSnapshot<DocumentData>;
  uid: string;
  conversationClick?: React.MouseEventHandler<HTMLLIElement>;
}

export const ConversationListItem = (props: ConversationListItemProps) => {
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
