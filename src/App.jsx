import "../assets/dist/css/style.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import TopBar from "./components/TopBar";
import { Container } from "react-bootstrap";
import Home from "./components/Home";

function App() {
  return (
    <Container fluid className="vh-100">
      <BrowserRouter>
        <TopBar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
