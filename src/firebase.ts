import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';

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
// Usamos initializeFirestore para conectarnos a la base de datos correcta.
// En iOS usas: Firestore.firestore(database: "logincloud")
// Si "logincloud" es el nombre de una base de datos secundaria, usamos esto:
// export const db = initializeFirestore(app, {}, "logincloud");
// PERO: Si "logincloud" era solo una confusión con el nombre del proyecto o bucket,
// y tu base de datos principal es la default, usa getFirestore(app).
// Dado que en la consola web NO te pidió crear una base de datos con nombre específico,
// lo más probable es que debamos usar la default primero. Si falla, cambiamos.
// Voy a configurar la default primero para asegurar compatibilidad web estándar.
export const db = getFirestore(app);

export default app;
