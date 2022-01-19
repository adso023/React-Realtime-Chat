import { Send } from "@mui/icons-material";
import { FormControl, TextField, Button } from "@mui/material";
import { User } from "firebase/auth";
import {
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
  doc,
  collection,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";
import { db } from "../../../../firebase/clientApp";

interface MessageFormProps {
  refChat: QueryDocumentSnapshot<DocumentData>;
  me: User | undefined | null;
}

export const MessageForm = (props: MessageFormProps) => {
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
