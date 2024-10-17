import { useState } from "react";
import { Form, NavDropdown } from "react-bootstrap";
import { CameraFill, CaretDownFill, Clock, EyeFill } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ModalCreatePost = ({ text, post, file, getAnimePosts }) => {
  const [show, setShow] = useState(false);
  const [textPost, setTextPost] = useState(text ? text : "");
  const [selectedFile, setSelectedFile] = useState(file ? file : null);

  const selectedAnime = useSelector(state => state.animeClick.animeClicked);
  const profile = useSelector(state => state.user.userInfo);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const formData = new FormData();

  const onFileChange = e => {
    if (e.target && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const createPost = async () => {
    let url;
    let method;

    if (text && file) {
      url = `http://localhost:3001/utenti/me/posts/${post.id}`;
      method = "PUT";
    } else {
      url = `http://localhost:3001/posts/${selectedAnime.data.mal_id}/crea`;
      method = "POST";
    }

    formData.append("message", textPost);
    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }

    try {
      const resp = await fetch(url, {
        method: method,
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (resp.ok) {
        if (text && file) {
          toast.success("Post updated successfully 👌");
        } else {
          toast.success("Post created successfully 👌");
          setTextPost("");
        }
        getAnimePosts();
      } else {
        toast.warn("Something went wrong");
      }
    } catch (error) {
      console.error("Errore: ", error);
      toast.warn("Error during Post Creation ❌");
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    createPost();
    handleClose();
  };

  return (
    <>
      {text ? (
        <NavDropdown.Item onClick={handleShow}>Edit</NavDropdown.Item>
      ) : (
        <Button variant="transparent" onClick={handleShow} className="mt-2 py-2 w-100 rounded border bg-dark shadowScale">
          Create a post
        </Button>
      )}

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-3">
            <img src={profile.avatar} alt="profile image" className="rounded-circle my-3" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
            <div>
              <h4>
                {profile.nome} {profile.cognome} <CaretDownFill />
              </h4>
              <p className="fs-6 opacity-75">
                Publish: Anyone <EyeFill className="ms-2" />
              </p>
              <p className="fs-6 opacity-75">Create your own post!</p>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={e => handleSubmit(e)}>
            <Form.Group>
              <Form.Control onChange={e => setTextPost(e.target.value)} value={textPost} as="textarea" rows={5} placeholder="Text" />
            </Form.Group>
            <Modal.Footer className="d-flex mt-4 justify-content-between">
              <Form.Group className="d-inline-block mt-3" controlId="exampleForm.endDate">
                <Form.Label className="pointer d-flex flex-column align-items-center">
                  <CameraFill className="fs-4" />
                  <p>Change Photo</p>
                </Form.Label>
                <Form.Control className="d-none" onChange={e => onFileChange(e)} name="profile" type="file" />
              </Form.Group>
              <Clock className="fs-4 ms-auto me-3" />
              <Button variant="primary" className="rounded-pill me-2 px-4  fw-bold" type="submit">
                Send
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalCreatePost;
