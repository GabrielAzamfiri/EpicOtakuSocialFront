import { useState } from "react";
import { Col, Form, Image, Row, Button } from "react-bootstrap";
import { CameraFill, Pencil } from "react-bootstrap-icons";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";

function ModalSelectImg() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const formData = new FormData();
  const onFileChange = e => {
    console.log(e.target.files[0]);
    if (e.target && e.target.files[0]) {
      formData.append("avatar", e.target.files[0]);
    }
  };

  const myImageAction = () => {
    fetch(`http://localhost:3001/utenti/me/avatar`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then(resp => {
        if (resp.ok) {
          alert(`Immagine caricata con successo!`);
        } else {
          throw new Error("Errore nel reperimento dei dati");
        }
      })
      .catch(Error => {
        console.log(Error);
      });
  };

  const profile = useSelector(state => state.user.userInfo);
  const handleSubmit = e => {
    e.preventDefault();
    myImageAction();
    handleClose();
  };
  return (
    <>
      <Button className="pencilImg" variant="transparent" onClick={handleShow}>
        <Pencil className="fs-5" />
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Change picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-center">
            <Col xs={8} className="d-flex flex-column justify-content-center align-items-center">
              <h4 className="my-3">Hello {profile.nome}, change your profile picture!</h4>
              <Image rounded src={profile.avatar} alt="User profile picture " style={{ height: "200px", width: "200px", objectFit: "cover" }} onClick={handleShow} />
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between">
          <Form onSubmit={e => handleSubmit(e)}>
            <Form.Group className="d-inline-block me-5" controlId="exampleForm.endDate">
              <Form.Label className="d-flex flex-column align-items-center">
                <CameraFill className="fs-4" />
                <p>Change Photo</p>
              </Form.Label>
              <Form.Control className="d-none" onChange={e => onFileChange(e)} name="profile" type="file" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Salva
            </Button>
          </Form>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalSelectImg;
