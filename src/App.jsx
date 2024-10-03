import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import TopBar from "./components/TopBar";
import { Container, Row } from "react-bootstrap";

function App() {
  return (
    <Container fluid className="vh-100">
      <Row>
        <BrowserRouter>
          <TopBar />

          <Routes>
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </Row>
    </Container>
  );
}

export default App;
