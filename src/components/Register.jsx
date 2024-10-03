import { useState } from "react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [validated, setValidated] = useState(false);
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    const utente = { nome, cognome, username, email, password };

    try {
      const resp = await fetch(`http://localhost:3001/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(utente),
      });

      if (resp.ok) {
        const data = await resp.json();
        console.log(data);
        alert("Utente registrato con successo.");
        navigate("/auth/login");
      } else {
        alert("Registrazione fallita.");
      }
    } catch (error) {
      console.error("Errore: ", error);
      alert("Errore durante la registrazione");
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center " style={{ height: "calc(100vh - 60px)" }}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <h1 className="mb-5 text-center">REGISTER</h1>

        <Row className="mb-3 ">
          <Form.Group as={Col} md="6" controlId="validationCustom01">
            <Form.Label>First name</Form.Label>
            <Form.Control required type="text" placeholder="First name" value={nome} onChange={e => setNome(e.target.value)} />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="validationCustom02">
            <Form.Label>Last name</Form.Label>
            <Form.Control required type="text" placeholder="Last name" value={cognome} onChange={e => setCognome(e.target.value)} />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="validationCustom03">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="exemple@gmail.com" required value={email} onChange={e => setEmail(e.target.value)} />
            <Form.Control.Feedback type="invalid">Please provide a valid Email.</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="validationCustom04">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
            <Form.Control.Feedback type="invalid">Please provide a valid password.</Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3 ">
          <Form.Group as={Col} md="6" className="mt-4">
            <Form.Check className="text-start" required label="Agree to terms and conditions" feedback="You must agree before submitting." feedbackType="invalid" />
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="validationCustomUsername" className="mb-5">
            <Form.Label>Username</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
              <Form.Control type="text" placeholder="Username" aria-describedby="inputGroupPrepend" required value={username} onChange={e => setUsername(e.target.value)} />
              <Form.Control.Feedback type="invalid">Please choose a username.</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Button type="submit" variant="dark" className="px-3">
            Submit
          </Button>
        </Row>
      </Form>
    </Container>
  );
};

export default Register;
