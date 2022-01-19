import { Container, Avatar, Typography, List } from "@mui/material";
import { User } from "firebase/auth";
import {
  QueryDocumentSnapshot,
  DocumentData,
  doc,
  DocumentSnapshot,
  getDoc,
} from "firebase/firestore";
import { useState, useRef, useEffect } from "react";
import { db } from "../../../../firebase/clientApp";
import { MessageItem } from "./MessageItem";

interface MessageBoardProps {
  messages: QueryDocumentSnapshot<DocumentData>[];
  chat: QueryDocumentSnapshot<DocumentData>;
  me: User | null | undefined;
}

export const MessageBoardWrapper = (props: MessageBoardProps) => {
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
