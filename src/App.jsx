import { useEffect } from "react";
import client from "./api/client";

function App() {
  useEffect(() => {
    console.log("usuarios de JSONPlaceholder sin errores");

    client.get("/users")
      .then((res) => {
        console.log("Usuarios:", res.data);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, []);

  return <h1>Axios funcionando</h1>;
}

export default App;