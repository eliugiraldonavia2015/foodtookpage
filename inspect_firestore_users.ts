
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, initializeFirestore } from 'firebase/firestore';

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
// Try to connect to 'logincloud' database as per App.tsx
const db = initializeFirestore(app, {}, "logincloud");

async function run() {
  console.log('Fetching users with role=restaurant...');
  try {
    const q = query(collection(db, "users"), where("role", "==", "restaurant"));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('No restaurants found with role=restaurant.');
      // Try fetching all to see roles
      const all = await getDocs(collection(db, "users"));
      console.log(`Total users found: ${all.size}`);
      all.forEach((doc) => {
         const d = doc.data();
         if (d.role === 'restaurant' || d.type === 'restaurant') {
            console.log(`Found via scan: ${doc.id} => ${d.name}`);
         }
      });
    } else {
      console.log(`Found ${querySnapshot.size} restaurants.`);
      querySnapshot.forEach((doc) => {
        const d = doc.data();
        console.log(`${doc.id} => ${d.name || d.firstName} (Rating: ${d.rating || 'N/A'})`);
      });
    }
  } catch (e) {
    console.error("Error fetching users: ", e);
  }
}

run();
