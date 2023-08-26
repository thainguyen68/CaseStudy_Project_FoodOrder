import { initializeApp  } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDrFYcMoqo9rBlULMLDwm1dCsULw9VLioA",
    authDomain: "thainguyen689-54042.firebaseapp.com",
    projectId: "thainguyen689-54042",
    storageBucket: "thainguyen689-54042.appspot.com",
    messagingSenderId: "387915840614",
    appId: "1:387915840614:web:698ef67e0da0b2f74381a7",
    measurementId: "G-RGG8KRCLZC"
};

initializeApp(firebaseConfig);

const storage = getStorage()
export default storage;
