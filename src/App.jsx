import "../assets/dist/css/style.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import TopBar from "./components/TopBar";
import { Container } from "react-bootstrap";
import Home from "./components/Home";
import Search from "./components/Search";
import Anime from "./components/Anime";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import MyProfile from "./components/MyProfile";
import MyFooter from "./components/MyFooter";

function App() {
  return (
    <>
      <Container fluid className="vh-100">
        <BrowserRouter>
          <TopBar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/:search" element={<Search />} />
            <Route path="/anime/:anime" element={<Anime />} />
            <Route path="/profile" element={<MyProfile />} />
          </Routes>
          <MyFooter />
        </BrowserRouter>
      </Container>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
      {/* Same as */}
    </>
  );
}

export default App;
