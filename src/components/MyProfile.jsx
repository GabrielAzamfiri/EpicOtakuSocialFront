import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Image, Modal, Nav, Row } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfileAction, saveAnimeClickedAction } from "../redux/actions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ModalSelectImg from "./ModalSelectImg";
import Comment from "./Comment";
import Post from "./Post";
import logo from "../assets/logo.png";

const MyProfile = () => {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [listPosts, setListPosts] = useState([]);
  const [listComments, setListComments] = useState([]);
  const [listAnime, setListAnime] = useState([]);

  const [show, setShow] = useState(false);
  const me = useSelector(state => state.user.userInfo);
  const utente = useSelector(state => state.user.userSelected);

  const showUtente = utente ? utente : me;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showP, setShowP] = useState(true);
  const [showC, setShowC] = useState(false);

  const showPosts = async () => {
    setShowP(true);
    setShowC(false);
    try {
      const resp = await fetch(`http://localhost:3001/utenti/${showUtente?.id}/posts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        setListPosts(data);
      }
    } catch (e) {
      console.error(e);
      toast.error("Error fetching posts! ��");
    }
  };
  const showComments = async () => {
    try {
      const resp = await fetch(`http://localhost:3001/utenti/${showUtente?.id}/comments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        setListComments(data);
      }
    } catch (e) {
      console.error(e);
      toast.error("Error fetching comments! ��");
    }
    setShowC(true);
    setShowP(false);
  };
  const showAnime = async () => {
    try {
      const resp = await fetch(`http://localhost:3001/utenti/${showUtente?.id}/favoriteAnime`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        setListAnime(data);
      }
    } catch (e) {
      console.error(e);
      toast.error("Error fetching Anime! ��");
    }
    setShowP(false);
    setShowC(false);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const utente = { nome, cognome, username, email, password };

    try {
      const resp = await fetch(`http://localhost:3001/utenti/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(utente),
      });

      if (resp.ok) {
        dispatch(getMyProfileAction());
        toast.success("Edit profile successfully completed 👌");
        handleClose();
      } else {
        toast.warn("Edit profile failed! ⚠️ Please try again...");
      }
    } catch (error) {
      console.error("Errore: ", error);
      toast.warn("Error during Edit profile");
    }
  };
  const handleDeleteProfile = async () => {
    // Chiedi conferma all'utente
    const confirmed = window.confirm("Are you sure you want to delete your profile? This action cannot be undone.");

    if (!confirmed) {
      return; // Se l'utente non conferma, non fare nulla
    }
    try {
      const resp = await fetch(`http://localhost:3001/utenti/me`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (resp.ok) {
        toast.success("Delete profile successfully completed 👌");
        localStorage.removeItem("accessToken");
        navigate("/");
      } else {
        toast.warn("Delete profile failed! ⚠️ Please try again...");
      }
    } catch (error) {
      console.error("Errore: ", error);
      toast.warn("Error during delete profile ❌");
    }
  };
  useEffect(() => {
    if (showUtente) {
      showPosts();
      showAnime();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showUtente]);

  useEffect(() => {
    if (me) {
      setNome(me.nome);
      setCognome(me.cognome);
      setUsername(me.username);
      setEmail(me.email);
      showPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me]);

  return (
    <>
      {showUtente ? (
        <Container fluid>
          <Row className="align-items-end mb-4 sezione rounded p-3 ">
            <Col xs={12} sm={5} md={4} xl={3} className="d-flex justify-content-center">
              <ModalSelectImg me={me} showUtente={showUtente} />
            </Col>

            <Col className="d-flex justify-content-between flex-sm-column text-sm-center text-md-start  flex-md-row">
              <div className="mt-2 goldColor">
                <h1>
                  {showUtente.nome} {showUtente.cognome}{" "}
                  {me && showUtente.id === me.id && (
                    <Button variant="transparent" onClick={handleShow}>
                      <Pencil className="fs-5 " fill="#b59562" />
                    </Button>
                  )}
                </h1>
                <div>
                  <p className="m-0">User: {showUtente.username}</p>
                  <p>{showUtente.email}</p>
                </div>
              </div>
              <div className="d-flex align-items-end">
                <img src={logo} alt="logo" className="logoProfile " />
              </div>
            </Col>
          </Row>

          <Row className="sezione rounded p-3 gap-3 ">
            <Col className="p-0 ">
              <Card className="bg-dark rounded">
                <Card.Header>
                  <Nav variant="tabs" defaultActiveKey="#first" className="sezione">
                    <Nav.Item>
                      <Nav.Link href="#Posts" onClick={showPosts}>
                        Posts
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link href="#Comments" onClick={showComments}>
                        Comments
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>
                {/* *********************** List of personal Posts ******************************** */}

                <Card.Body className={showP ? "" : "d-none"}>
                  {listPosts.length > 0 ? (
                    <>
                      <Card.Title>List of personal Posts</Card.Title>
                      {listPosts
                        .sort((a, b) => new Date(b.ora) - new Date(a.ora))
                        .map((post, index) => (
                          <Post key={index} post={post} getAnimePosts={showPosts} />
                        ))}
                    </>
                  ) : (
                    <p>No posts</p>
                  )}
                </Card.Body>
                {/* *********************** List of personal Comments ******************************** */}

                <Card.Body className={showC ? "" : "d-none"}>
                  {listComments.length > 0 ? (
                    <>
                      <Card.Title>List of personal Comments</Card.Title>
                      {listComments
                        .sort((a, b) => new Date(b.ora) - new Date(a.ora))
                        .map((comment, index) => (
                          <Comment key={index} comment={comment} showComments={showComments} handleClose={handleClose} />
                        ))}
                    </>
                  ) : (
                    <p>No comments</p>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={3} lg={4} className="bg-dark rounded border ">
              <h3 className="text-center p-2">Favorite Anime 🧡</h3>
              <Row className="justify-content-center">
                {listAnime &&
                  listAnime.map((anime, index) => (
                    <Col
                      xs={11}
                      onClick={() => {
                        dispatch(saveAnimeClickedAction(anime.idAnime));
                        navigate("/anime/" + anime.title);
                      }}
                      key={index}
                      className="pointer p-2 m-2 d-flex text-center sezione shadowScale border rounded"
                    >
                      <Image className="m-auto" src={anime.image} style={{ height: "210px", width: "140px", objectFit: "cover" }} />

                      <div className="ms-2 w-100 d-md-none d-lg-flex flex-column justify-content-center d-xl-block" style={{ maxHeight: "210px", overflowY: "scroll" }}>
                        <h4 className="text-start  truncate-2-lines">{anime.title}</h4>
                        <p className=" fs-7 text-start p-0">
                          <b>Genres:</b> {anime.genres.map(genre => genre).join(", ")}
                        </p>
                        <p className="fs-7 text-start d-md-none d-xl-block">{anime.synopsis}</p>
                      </div>
                    </Col>
                  ))}
              </Row>
            </Col>
          </Row>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group as={Col} md="7" controlId="validationCustom01" className="mb-3 m-auto">
                  <Form.Label>First name</Form.Label>
                  <Form.Control required type="text" placeholder="First name" value={nome} onChange={e => setNome(e.target.value)} />
                </Form.Group>
                <Form.Group as={Col} md="7" controlId="validationCustom02" className="mb-3 m-auto">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control required type="text" placeholder="Last name" value={cognome} onChange={e => setCognome(e.target.value)} />
                </Form.Group>
                <Form.Group as={Col} md="7" controlId="validationCustomUsername" className="mb-3 m-auto">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" placeholder="Username" aria-describedby="inputGroupPrepend" required value={username} onChange={e => setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group as={Col} md="7" controlId="validationCustom03" className="mb-3 m-auto">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="exemple@gmail.com" required value={email} onChange={e => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group as={Col} md="7" controlId="validationCustom04" className="mb-3 m-auto">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <Modal.Footer>
                  <Button variant="danger" className="me-auto " onClick={() => handleDeleteProfile()}>
                    <Trash className="fs-5" />
                  </Button>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" type="submit">
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal.Body>
          </Modal>
        </Container>
      ) : (
        navigate("/")
      )}
    </>
  );
};
export default MyProfile;
