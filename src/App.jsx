import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Registrazione from "./components/Registrazione";
import Login from "./components/Login";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/register" element={<Registrazione />} />
          <Route path="/auth/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
