import { useState } from "react";
import { Form } from "react-bootstrap";
import { CaretDownFill, ChatLeftDotsFill, EyeFill } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ModalCreateComment = ({ post, commentoPadre, getPost }) => {
  const [show, setShow] = useState(false);
  const [textComment, setTextComment] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const createComment = async () => {
    const comment = {
      commento: textComment,
      elementoCommentato: post.id,
    };

    try {
      let url;
      if (commentoPadre) {
        url = `http://localhost:3001/commenti/${commentoPadre.id}/crea`;
      } else {
        url = `http://localhost:3001/commenti/crea`;
      }
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(comment),
      });
      if (resp.ok) {
        getPost();
        toast.success("Comment created successfully 👌");
      } else {
        console.error("Something went wrong! ");
      }
    } catch (error) {
      console.error("Errore: ", error);
      toast.warn("Error during Post Creation ❌");
    }
  };

  const profile = useSelector(state => state.user.userInfo);

  const handleSubmit = async e => {
    e.preventDefault();

    await createComment();
    setTextComment("");
    handleClose();
  };

  return (
    <>
      {commentoPadre ? (
        <Button variant="transparent" onClick={handleShow} className="d-flex ">
          <ChatLeftDotsFill className="fs-5 me-2" />
          {commentoPadre.sottoCommenti.length}
        </Button>
      ) : (
        <Button variant="transparent" onClick={handleShow} className="mt-2 py-2 w-100 sezione rounded border opacity-75 shadowScale">
          Create a comment
        </Button>
      )}

      {profile && (
        <Modal show={show} onHide={handleClose} size="lg" className="">
          <Modal.Header closeButton>
            <Modal.Title className="d-flex align-items-center gap-3">
              <img src={profile.avatar} alt="profile image" className="rounded my-3 " style={{ width: "100px", height: "100px", objectFit: "cover" }} />
              <div>
                <h4>
                  {profile.nome} {profile.cognome} <CaretDownFill />
                </h4>
                <p className="fs-6 opacity-75">
                  Publish: Anyone <EyeFill className="ms-2" />
                </p>
                <p className="fs-6 opacity-75 m-0 p-0">Create your own comment!</p>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={e => handleSubmit(e)}>
              <Form.Group>
                <Form.Control onChange={e => setTextComment(e.target.value)} value={textComment} as="textarea" rows={5} placeholder="Text" />
              </Form.Group>
              <Modal.Footer className="d-flex mt-4 justify-content-between">
                <Button variant="primary" className="rounded  px-4  fw-bold ms-auto" type="submit">
                  Send
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default ModalCreateComment;
