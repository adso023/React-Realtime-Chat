import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  browserLocalPersistence,
} from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { firebase, node_env } from "../env";

initializeApp(firebase);

const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

auth.setPersistence(browserLocalPersistence);

if (node_env === "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  connectStorageEmulator(storage, "localhost", 9199);
}

export { db, auth, storage };
