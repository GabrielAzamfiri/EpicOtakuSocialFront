import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch } from "react-redux";
import { logoutAction, saveInputSearchAction, saveUserInfoAction } from "../redux/actions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const TopBar = () => {
  const [input, setInput] = useState("");
  const [utente, setUtente] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSearch = e => {
    e.preventDefault();
    dispatch(saveInputSearchAction(input));
    localStorage.setItem("inputSearch", input);
    navigate("/" + input);
  };

  const handleLogin = async () => {
    try {
      const resp = await fetch(`http://localhost:3001/utenti/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (resp.ok) {
        const me = await resp.json();

        dispatch(saveUserInfoAction(me));
        setUtente(me);
      } else {
        localStorage.removeItem("accessToken");

        setUtente({});
        toast.warn("Login expired ⚠️. Please log in again 😊");
      }
    } catch (error) {
      console.error("Errore: ", error);
      alert("Save user info failed!");
    }
  };

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (token) {
      handleLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <Navbar expand="lg" id="navbar " variant="dark">
      <Container fluid>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>

            <NavDropdown title="Genres" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Adventure</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Fantasy</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Kids</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form onSubmit={handleSearch} className=" m-auto w-50 ">
            <Form.Control
              onChange={e => {
                setInput(e.target.value);
              }}
              value={input}
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
          </Form>
          <Nav className="me-3">
            {token ? (
              <>
                <Nav.Link href="#profile">
                  <img src={utente.avatar} alt="avatar" className="rounded" width={30} />
                </Nav.Link>
                <NavDropdown title="Account" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Settings</NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => {
                      dispatch(logoutAction());
                      localStorage.removeItem("accessToken");
                    }}
                    href="#"
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Nav.Link href="/auth/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopBar;
