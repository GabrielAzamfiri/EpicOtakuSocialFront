import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();

    const utente = { email, password };

    try {
      const resp = await fetch(`http://localhost:3001/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(utente),
      });

      if (resp.ok) {
        const data = await resp.json();
        localStorage.setItem("accessToken", data.AccessToken);
        toast.success("Welcome back 😎!");
        navigate("/");
      } else {
        toast.warn("Login failed! ⚠️ Please try again...");
      }
    } catch (error) {
      console.error("Errore: ", error);
      toast.warn("Error during login");
    }
  };
  return (
    <>
      <Container fluid>
        <Row className="justify-content-center  align-items-center sezione rounded" style={{ height: "calc(100vh - 60px)" }}>
          <Col xs={11} md={6} className="bg-dark p-2 rounded border">
            <Form onSubmit={e => handleLogin(e)}>
              <h1 className="mb-5 text-center">LOGIN</h1>
              <Row className="mb-4">
                <Form.Group as={Col} md="7" controlId="validationCustom03" className="mb-3 m-auto">
                  <Form.Label>Email</Form.Label>
                  <Form.Control className="sezione" type="email" placeholder="exemple@gmail.com" required value={email} onChange={e => setEmail(e.target.value)} />
                  <Form.Control.Feedback type="invalid">Please provide a valid Email.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="7" controlId="validationCustom04" className="mb-3 m-auto">
                  <Form.Label>Password</Form.Label>
                  <Form.Control className="sezione" type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
                  <Form.Control.Feedback type="invalid">Please provide a valid password.</Form.Control.Feedback>
                </Form.Group>
              </Row>
              <div className="text-center">
                <Button type="submit" variant="dark" className="px-5 border sezione">
                  LOG IN
                </Button>
              </div>
              <p className="text-center mt-3">
                Do not have an account? <a href="/auth/register">SIGN IN</a>
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default Login;
