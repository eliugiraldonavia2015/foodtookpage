
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, initializeFirestore } = require('firebase/firestore');

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
  console.log('Fetching users...');
  try {
    const q = query(collection(db, "users"), where("role", "==", "restaurant"));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('No restaurants found.');
    } else {
      console.log(`Found ${querySnapshot.size} restaurants.`);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data().name || doc.data().firstName);
      });
    }
  } catch (e) {
    console.error("Error fetching users: ", e);
  }
}

run();
