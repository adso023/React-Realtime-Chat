import { User } from "firebase/auth";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import moment from "moment";
import { useState, useEffect } from "react";

interface MessageItemProps {
  message: QueryDocumentSnapshot<DocumentData>;
  users: DocumentData[];
  me: User | undefined | null;
}

export const MessageItem = (props: MessageItemProps) => {
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
