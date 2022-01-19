import { Container } from "@mui/material";
import { User } from "firebase/auth";
import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  Timestamp,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../../firebase/clientApp";
import { MessageForm } from "../MessagingWrapper/MessageForm";
import { MessageBoardWrapper } from "../MessagingWrapper/MessageBoard";

interface ConversationWrapperProps {
  chat: QueryDocumentSnapshot<DocumentData>;
  me: User | undefined | null;
}

export const ConversationWrapper = (props: ConversationWrapperProps) => {
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
