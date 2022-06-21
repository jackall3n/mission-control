import { getApps, initializeApp } from "firebase/app";

const config = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
}
const firebaseConfig = {
  apiKey: "AIzaSyB2YXgcUob-R1g_Vh_AsZ1V5nWlVmFsUhA",
  authDomain: "houstn-io.firebaseapp.com",
  projectId: "houstn-io",
  storageBucket: "houstn-io.appspot.com",
  messagingSenderId: "978691732275",
  appId: "1:978691732275:web:5e5041fcfbd14261d68446",
  measurementId: "G-FZZTVD9K5R"
};

const apps = getApps();

const app = apps[0] ?? initializeApp(firebaseConfig ?? config);

export default app;
