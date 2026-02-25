import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBnd_pJdUzd_AsRNsEKL4gjEQ0MbT5pR4g",
  authDomain: "toctoc-1e18c.firebaseapp.com",
  projectId: "toctoc-1e18c",
  storageBucket: "toctoc-1e18c.firebasestorage.app",
  messagingSenderId: "478456051663",
  appId: "1:478456051663:web:7705a45e278917a92a84ba",
  measurementId: "G-8BLTM2848R"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth
export const auth = getAuth(app);

// Inicializar Firestore
// Intentamos usar la base de datos "logincloud" explícitamente como en iOS.
// Si esto falla, podemos probar con getFirestore(app) que usa la default.
export const db = initializeFirestore(app, {}, "logincloud");

// Conexión a la base de datos 'ghkm' para Admins y Staff
export const dbAdmin = initializeFirestore(app, {}, "ghkm");

// Inicializar Storage
export const storage = getStorage(app);

export default app;
