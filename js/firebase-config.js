/**
 * Firebase 설정 파일 (v12 최신 버전)
 * Import 방식으로 사용
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// Firebase 설정 (Firebase Console에서 받은 값)
const firebaseConfig = {
  apiKey: "AIzaSyByExFtzQhHz4GxYCuOgEhzaCqLhTC78hs",
  authDomain: "fc-pir.firebaseapp.com",
  projectId: "fc-pir",
  storageBucket: "fc-pir.firebasestorage.app",
  messagingSenderId: "893953660387",
  appId: "1:893953660387:web:7783c6ceae695bb1157cd6",
  measurementId: "G-VS8207R00X",
  // Realtime Database URL (아시아 리전)
  databaseURL: "https://fc-pir-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

console.log('🔥 Firebase v12 초기화 완료');

// Export
export { app, db, auth };
