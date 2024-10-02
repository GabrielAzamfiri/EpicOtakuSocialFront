import { useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Registrazione = () => {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleRegister = async e => {
    e.preventDefault();

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
      } else {
        alert("Registrazione fallita.");
      }
    } catch (error) {
      console.error("Errore: ", error);
      alert("Errore durante la registrazione");
    }
  };

  return (
    <div>
      <Form>
        <h1 className="h1Login">EFFETTUA LA REGISTRAZIONE</h1>

        <div className="unione">
          <InputGroup className="mb-3 emailFormCliente">
            <InputGroup.Text id="basic-addon1" className="testo">
              Nome
            </InputGroup.Text>
            <Form.Control placeholder="Nome" aria-label="Nome" aria-describedby="basic-addon1" className="formTextCliente" value={nome} onChange={e => setNome(e.target.value)} />
          </InputGroup>

          <InputGroup className="mb-3 emailFormCliente">
            <InputGroup.Text id="basic-addon1" className="testo">
              Cognome
            </InputGroup.Text>
            <Form.Control placeholder="Cognome" aria-label="Cognome" aria-describedby="basic-addon1" className="formTextCliente" value={cognome} onChange={e => setCognome(e.target.value)} />
          </InputGroup>
        </div>
        <InputGroup className="mb-3 emailFormCliente">
          <InputGroup.Text id="basic-addon1" className="testo" autoComplete="username">
            Username
          </InputGroup.Text>
          <Form.Control placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" className="formTextCliente" value={username} onChange={e => setUsername(e.target.value)} />
        </InputGroup>

        <div className="unione">
          <Form.Group className="mb-3 emailFormReg " controlId="exampleForm.ControlInput1">
            <Form.Label className="testo">Email</Form.Label>
            <Form.Control type="email" placeholder="Inserisci la tua email" className="formTextReg" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} />
          </Form.Group>
          <Form.Group as={Row} className="mb-3 pwFormReg d-flex" controlId="formPlaintextPassword">
            <Form.Label column sm="4" className="testo">
              Password
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="password"
                placeholder="Inserisci la tua password"
                className="formTextReg"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Col>
          </Form.Group>
        </div>
        <Button
          onClick={e => {
            e.preventDefault();
            handleRegister(e);
            navigate("/auth/login");
          }}
          type="submit"
          value="Submit"
          variant="light"
        >
          Registrati
        </Button>
      </Form>
    </div>
  );
};

export default Registrazione;
