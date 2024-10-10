import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, Modal } from "react-bootstrap";
import { Pencil } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfileAction } from "../redux/actions";

const MyProfile = () => {
  const [show, setShow] = useState(false);
  const me = useSelector(state => state.user.userInfo);

  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
        const data = await resp.json();
        console.log(data);
        dispatch(getMyProfileAction());

        alert("Edit profile successfully completed 👌");
        handleClose();
      } else {
        alert("Edit profile failed! Please try again...");
      }
    } catch (error) {
      console.error("Errore: ", error);
      alert("Error during Edit profile");
    }
  };

  useEffect(() => {
    if (me) {
      setNome(me.nome);
      setCognome(me.cognome);
      setUsername(me.username);
      setEmail(me.email);
    }
  }, [me]);

  return (
    <>
      <Container>
        {me ? (
          <div className="d-flex align-items-center">
            <Image rounded src={me.avatar} alt="User profile picture" style={{ height: "80px", width: "80px", objectFit: "cover" }} />
            <div className="ms-3">
              <h4>
                {me.nome} {me.cognome}
                <Button variant="transparent" className="rounded" onClick={handleShow}>
                  <Pencil />
                </Button>
              </h4>
              <div>
                <p className="m-0">User: {me.username}</p>
                <p>{me.email}</p>
              </div>
            </div>
          </div>
        ) : null}
      </Container>
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
