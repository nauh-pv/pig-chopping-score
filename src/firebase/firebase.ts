import { initializeApp } from "firebase/app";
import { get, getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDHtg8iFJMVYQKowZvVK_MJD9g8tiZB1h0",
  authDomain: "btap3-193b1.firebaseapp.com",
  projectId: "btap3-193b1",
  storageBucket: "btap3-193b1.firebasestorage.app",
  messagingSenderId: "923572572305",
  appId: "1:923572572305:web:ce23d4215372fd1c5caf30",
  measurementId: "G-ZG9BKZCN41",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const saveScore = (
  groupCode: string,
  players: { name: string; score: string }[]
) => {
  console.log("check click");

  set(ref(database, "scores/" + groupCode), {
    players: players,
  });
};

// Hàm lấy dữ liệu từ Firebase
export const getScores = (groupCode: string) => {
  const scoresRef = ref(database, "scores/" + groupCode);
  return get(scoresRef);
};
