import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch } from "react-redux";
import { logoutAction, saveInputSearchAction, saveUserInfoAction, setGenreAnimeAction } from "../redux/actions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const TopBar = () => {
  const [input, setInput] = useState("");
  const [utente, setUtente] = useState({});
  // const [token, setToken] = useState(localStorage.getItem("accessToken"));

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
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (resp.ok) {
        const me = await resp.json();

        dispatch(saveUserInfoAction(me));
        setUtente(me);
      } else {
        localStorage.removeItem("accessToken");
        // setToken(localStorage.getItem("accessToken"));
        setUtente({});
        toast.warn("Login expired ⚠️. Please log in again 😊");
      }
    } catch (error) {
      console.error("Errore: ", error);
      toast.warn("Save user info failed!");
    }
  };

  let token = localStorage.getItem("accessToken");
  useEffect(() => {
    if (token) {
      handleLogin();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <Navbar expand="lg" id="navbar " variant="dark" className=" py-2 rounded sezione mt-2 mb-3">
      <Container fluid>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link
              href="/"
              onClick={() => {
                dispatch(setGenreAnimeAction(""));
              }}
            >
              Home
            </Nav.Link>

            <NavDropdown title="Genres" id="basic-nav-dropdown">
              <NavDropdown.Item
                onClick={() => {
                  dispatch(setGenreAnimeAction("1"));
                }}
              >
                Action
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => {
                  dispatch(setGenreAnimeAction("2"));
                }}
              >
                Adventure
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => {
                  dispatch(setGenreAnimeAction("10"));
                }}
              >
                Fantasy
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => {
                  dispatch(setGenreAnimeAction("8"));
                }}
              >
                Drama
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => {
                  dispatch(setGenreAnimeAction("46"));
                }}
              >
                Award Winning
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => {
                  dispatch(setGenreAnimeAction("22"));
                }}
              >
                Romance
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => {
                  dispatch(setGenreAnimeAction("9"));
                }}
              >
                Ecchi
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => {
                  dispatch(setGenreAnimeAction("62"));
                }}
              >
                Isekai
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => {
                  dispatch(setGenreAnimeAction("17"));
                }}
              >
                Martial Arts
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => {
                  dispatch(setGenreAnimeAction("38"));
                }}
              >
                Military
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => {
                  dispatch(setGenreAnimeAction("27"));
                }}
              >
                Shounen
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={() => {
                  dispatch(setGenreAnimeAction("15"));
                }}
              >
                Kids
              </NavDropdown.Item>
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
                <Nav.Link>
                  <img src={utente.avatar} alt="avatar" className="rounded " style={{ height: "30px", width: "30px", objectFit: "cover" }} />
                  <span className="ms-2">{utente.nome}</span>
                </Nav.Link>
                <NavDropdown title="" id="basic-nav-dropdown" align="end">
                  <NavDropdown.Item onClick={() => navigate("/profile")}>Profile</NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => {
                      dispatch(logoutAction());
                      localStorage.removeItem("accessToken");
                      setUtente(null);
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
