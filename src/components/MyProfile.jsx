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
  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showP, setShowP] = useState(true);
  const [showC, setShowC] = useState(false);
  const [showA, setShowA] = useState(false);

  const showPosts = async () => {
    setShowP(true);
    setShowA(false);
    setShowC(false);
    try {
      const resp = await fetch(`http://localhost:3001/utenti/me/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      const resp = await fetch(`http://localhost:3001/utenti/me/commenti`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
    setShowA(false);
  };
  const showAnime = async () => {
    try {
      const resp = await fetch(`http://localhost:3001/utenti/me/anime`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
    setShowA(true);
    setShowP(false);
    setShowC(false);
  };

  const dispatch = useDispatch();

  const token = localStorage.getItem("accessToken");

  const handleSubmit = async event => {
    event.preventDefault();

    const utente = { nome, cognome, username, email, password };

    try {
      const resp = await fetch(`http://localhost:3001/utenti/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      {me ? (
        <Container fluid>
          <Row className="align-items-end mb-4 sezione rounded p-3 ">
            <Col xs={3} id="profileImg" className="position-relative  ">
              <Image roundedCircle src={me.avatar} alt="User profile picture" style={{ height: "250px", width: "250px", objectFit: "cover" }} />
              <ModalSelectImg />
            </Col>
            <Col className="ms-3 ps-0">
              <h1>
                {me.nome} {me.cognome}{" "}
                <Button variant="transparent" onClick={handleShow}>
                  <Pencil className="fs-5 " />
                </Button>
              </h1>
              <div>
                <p className="m-0">User: {me.username}</p>
                <p>{me.email}</p>
              </div>
            </Col>
          </Row>

          <Row className="sezione rounded p-3 gap-3">
            <Col xs={8} className="p-0">
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
                    <Nav.Item>
                      <Nav.Link href="#Anime" onClick={showAnime}>
                        Anime
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>
                <Card.Body className={showP ? "" : "d-none"}>
                  {listPosts.length > 0 ? (
                    <>
                      <Card.Title>List of personal Posts</Card.Title>
                      {listPosts.map((post, index) => (
                        <Post key={index} post={post} />
                      ))}
                    </>
                  ) : (
                    <p>No posts</p>
                  )}
                </Card.Body>
                <Card.Body className={showC ? "" : "d-none"}>
                  {listComments.length > 0 ? (
                    <>
                      <Card.Title>List of personal Comments</Card.Title>
                      {listComments.map((comment, index) => (
                        <Comment key={index} comment={comment} />
                      ))}
                    </>
                  ) : (
                    <p>No comments</p>
                  )}
                </Card.Body>
                <Card.Body className={showA ? "" : "d-none"}>
                  {listAnime.length > 0 ? (
                    <>
                      <Card.Title>List of Favorite Anime</Card.Title>
                      <Row>
                        {listAnime.map((anime, index) => (
                          <Col
                            onClick={() => {
                              dispatch(saveAnimeClickedAction(anime.idAnime));
                              navigate("/anime/" + anime.title);
                            }}
                            key={index}
                            className="mb-3 p-0  text-center animeContainer"
                          >
                            <Card.Img className="animePoster" src={anime.image} style={{ height: "210px", width: "140px", objectFit: "cover" }} />
                            <h6 className="truncate-2-lines  animeTitle">{anime.title}</h6>
                            <h6 className="truncate-2-lines mt-2  d-md-none">{anime.title}</h6>
                          </Col>
                        ))}
                      </Row>
                    </>
                  ) : (
                    <p>No comments</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col className="bg-dark rounded border"></Col>
          </Row>
        </Container>
      ) : (
        navigate("/")
      )}

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
    </>
  );
};
export default MyProfile;
