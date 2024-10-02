import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        console.log(data);
        localStorage.setItem("accessToken", data.AccessToken);
        alert("Login effettuato con successo.");
      } else {
        alert("Login fallito.");
      }
    } catch (error) {
      console.error("Errore: ", error);
      alert("Errore durante il login");
    }
  };
  return (
    <div>
      <div className="contFormTot">
        <Form onSubmit={handleLogin}>
          <h1 className="h1Login">EFFETTUA IL LOGIN</h1>
          <Form.Group className="mb-3 emailForm " controlId="exampleForm.ControlInput1">
            <Form.Label className="emailSign">Email</Form.Label>
            <Form.Control type="email" placeholder="Inserisci la tua email" className="formText" value={email} onChange={e => setEmail(e.target.value)} />
          </Form.Group>
          <Form.Group as={Row} className="mb-3 pwForm d-flex" controlId="formPlaintextPassword">
            <Form.Label column sm="4" className="pwSign">
              Password
            </Form.Label>
            <Col sm="10">
              <Form.Control type="password" placeholder="Inserisci la tua email" className="formText" value={password} onChange={e => setPassword(e.target.value)} />
            </Col>
          </Form.Group>
          <div className="ContBtn">
            <Button type="submit" className="btnlogin">
              ACCEDI
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default Login;
