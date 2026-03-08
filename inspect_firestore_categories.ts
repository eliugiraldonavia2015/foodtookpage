
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBnd_pJdUzd_AsRNsEKL4gjEQ0MbT5pR4g",
  authDomain: "toctoc-1e18c.firebaseapp.com",
  projectId: "toctoc-1e18c",
  storageBucket: "toctoc-1e18c.firebasestorage.app",
  messagingSenderId: "478456051663",
  appId: "1:478456051663:web:7705a45e278917a92a84ba",
  measurementId: "G-8BLTM2848R"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {}, "logincloud");

async function run() {
  console.log('Fetching categories...');
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    if (querySnapshot.empty) {
      console.log('No categories collection found.');
    } else {
      console.log(`Found ${querySnapshot.size} categories.`);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data().name);
      });
    }
  } catch (e) {
    console.error("Error fetching categories: ", e);
  }
}

run();
