import { useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

function App() {
  useEffect(() => {
    const test = async () => {
      const snap = await getDocs(collection(db, "test"));
      snap.forEach((doc) => console.log(doc.id, doc.data()));
    };
    test();
  }, []);

  return <h1>Firebase conectado 🚀</h1>;
}

export default App;
