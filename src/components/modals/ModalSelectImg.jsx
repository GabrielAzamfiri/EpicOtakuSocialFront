import { useState } from "react";
import { Col, Form, Image, Row, Button } from "react-bootstrap";
import { CameraFill } from "react-bootstrap-icons";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getMyProfileAction } from "../../redux/actions";

function ModalSelectImg({ me, showUtente }) {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const formData = new FormData();
  const onFileChange = e => {
    if (e.target && e.target.files[0]) {
      formData.append("avatar", e.target.files[0]);
    }
  };
  const handleClick = () => {
    if (showUtente.id === me.id) {
      handleShow();
    }
  };
  const myImageAction = () => {
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadImage = async () => {
        try {
          const response = await fetch(`http://localhost:3001/utenti/me/avatar`, {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });

          if (response.ok) {
            dispatch(getMyProfileAction());
            resolve(); // Risolvi la Promise se tutto è andato bene
          } else {
            throw new Error("Error during upload of image! ");
          }
        } catch (error) {
          reject(error); // Rifiuta la Promise in caso di errore
        }
      };
      uploadImage();
    });

    // gestione dei messaggi di caricamento, successo o errore
    toast.promise(uploadPromise, {
      pending: "Uploading image...",
      success: "Image uploaded successfully! ✅",
      error: "Error loading image!  🤯",
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
      <Button className="d-flex" variant="transparent" onClick={handleClick}>
        <Image id="profileImg" className="pointer position-relative" roundedCircle src={showUtente ? showUtente.avatar : me.avatar} alt="User profile picture" />
      </Button>

      {profile && (
        <Modal show={show} onHide={handleClose} size="lg">
          <div className="sezione">
            <Modal.Header closeButton>
              <Modal.Title className="goldColor">Change picture</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="justify-content-center">
                <Col xs={8} className="d-flex flex-column justify-content-center align-items-center">
                  <h4 className="my-3 goldColor">Hello {profile.nome}, change your profile picture!</h4>
                  <Image rounded src={profile.avatar} alt="User profile picture " style={{ height: "200px", width: "200px", objectFit: "cover" }} onClick={handleShow} />
                </Col>
              </Row>
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-between">
              <Form onSubmit={e => handleSubmit(e)}>
                <Form.Group className="d-inline-block me-5" controlId="exampleForm.endDate">
                  <Form.Label className="pointer d-flex flex-column align-items-center">
                    <CameraFill className="fs-4 " fill="#b59562" />
                    <p className="goldColor">Change Photo</p>
                  </Form.Label>
                  <Form.Control className="d-none" onChange={e => onFileChange(e)} name="profile" type="file" />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Salva
                </Button>
              </Form>
            </Modal.Footer>
          </div>
        </Modal>
      )}
    </>
  );
}

export default ModalSelectImg;
