import { useState } from "react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
        toast.success("Sign In successfully completed 👌. Please login");
        navigate("/auth/login");
      } else {
        toast.warn("Error during Sign In! ⚠️ Please try again...");
      }
    } catch (error) {
      console.error("Errore: ", error);
      toast.warn("Error during Sign In");
    }
  };

  return (
    <Container fluid className=" sezione rounded">
      <Row className="align-items-center justify-content-center " style={{ height: "calc(100vh - 80px)" }}>
        <Col xs={12} md={8} lg={6} className="">
          <Form noValidate validated={validated} onSubmit={handleSubmit} className="blackGold p-3 shadowScale rounded ">
            <h1 className=" text-center goldColor">SIGN IN</h1>

            <Row className="mb-3 ">
              <Form.Group as={Col} xs="6" controlId="validationCustom01" className="mt-4">
                <Form.Label>First name</Form.Label>
                <Form.Control className="sezione border-0" required type="text" placeholder="First name" value={nome} onChange={e => setNome(e.target.value)} />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} xs="6" controlId="validationCustom02" className="mt-4">
                <Form.Label>Last name</Form.Label>
                <Form.Control className="sezione border-0" required type="text" placeholder="Last name" value={cognome} onChange={e => setCognome(e.target.value)} />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} xs="6" controlId="validationCustom03" className="mt-4">
                <Form.Label>Email</Form.Label>
                <Form.Control className="sezione border-0" type="email" placeholder="exemple@gmail.com" required value={email} onChange={e => setEmail(e.target.value)} />
                <Form.Control.Feedback type="invalid">Please provide a valid Email.</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} xs="6" controlId="validationCustom04" className="mt-4">
                <Form.Label>Password</Form.Label>
                <Form.Control className="sezione border-0" type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
                <Form.Control.Feedback type="invalid">Please provide a valid password.</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3 ">
              <Form.Group as={Col} xs="6" className="mt-4">
                <Form.Check className="text-start " required label="Agree to terms and conditions" feedback="You must agree before submitting." feedbackType="invalid" />
              </Form.Group>
              <Form.Group as={Col} xs="6" controlId="validationCustomUsername" className="mb-5 mt-4">
                <Form.Label>Username</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id="inputGroupPrepend" className="sezione border-0">
                    @
                  </InputGroup.Text>
                  <Form.Control
                    className="sezione border-0"
                    type="text"
                    placeholder="Username"
                    aria-describedby="inputGroupPrepend"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">Please choose a username.</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Button type="submit" variant="dark" className="px-3 sezione border-0">
                Submit
              </Button>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
