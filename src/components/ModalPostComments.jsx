import { useEffect, useState } from "react";
import { Image, Row, Button, NavDropdown } from "react-bootstrap";
import { ChatLeftDotsFill, Gear, HandThumbsDownFill, HandThumbsUpFill, Trash } from "react-bootstrap-icons";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ModalCreateComment from "./ModalCreateComment";
import { toast } from "react-toastify";

const ModalPostComments = ({ postId }) => {
  const [show, setShow] = useState(false);
  const [post, setPost] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  const getPost = async () => {
    try {
      const resp = await fetch(`http://localhost:3001/posts/${postId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        setPost(data);
      } else {
        console.error("getPost fetch error");
      }
    } catch (error) {
      console.error("Errore: ", error);
      toast.warn("Error during get Post  fetch❌");
    }
  };
  const deleteComment = async commentId => {
    // Chiedi conferma all'utente
    const confirmed = window.confirm("Are you sure you want to delete your comment? This action cannot be undone.");
    if (!confirmed) {
      return; // Se l'utente non conferma, non fare nulla
    }
    try {
      const resp = await fetch(`http://localhost:3001/utenti/me/commenti/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (resp.ok) {
        toast.success("Comment deleted successfuly! 👍");
      } else {
        console.error("deleteComment fetch error");
      }
    } catch (error) {
      console.error("Errore: ", error);
      toast.warn("Error during delete Comment fetch❌");
    }
  };

  const profile = useSelector(state => state.user.userInfo);
  useEffect(() => {
    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);
  return (
    post && (
      <>
        <Button variant="transparent" className="d-flex" onClick={handleShow}>
          <ChatLeftDotsFill className="fs-5 me-2" />
          {post.commentiPrincipali.length}
        </Button>

        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Image rounded src={profile.avatar} alt="User profile picture " style={{ height: "60px", width: "60px", objectFit: "cover" }} onClick={() => navigate("/profile")} />
            <div className="ms-3">
              <Modal.Title>
                {post.autore.nome} {post.autore.cognome}
              </Modal.Title>
              <p className="fs-7 text-muted mb-0 ">
                {new Date(post.ora).toLocaleDateString("en-CA", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Row className="justify-content-center">
              <div key={post.id} className="mb-3 border rounded p-2 postModal">
                <p className="fs-6">{post.text}</p>
                <img src={post.file} alt="post file" style={{ width: "100%", objectFit: "cover" }} />
                <hr />
                <div className="d-flex justify-content-start">
                  <Button variant="transparent" className="d-flex">
                    <HandThumbsUpFill className="fs-5 me-2" />
                    {post.numeroDislike}
                  </Button>
                  <Button variant="transparent" className="d-flex">
                    <HandThumbsDownFill className="fs-5 me-2" />
                    {post.numeroLike}
                  </Button>
                  <Button variant="transparent" className="d-flex">
                    <ChatLeftDotsFill className="fs-5 me-2" />
                    {post.commentiPrincipali.length}
                  </Button>
                </div>
              </div>
            </Row>
          </Modal.Body>

          <h3 className="ms-3">Comments</h3>
          <Modal.Footer className="d-flex justify-content-start">
            <img src={profile.avatar} alt="User Avatar" className="pointer rounded " style={{ width: "30px", height: "30px", objectFit: "cover" }} onClick={() => navigate("/profile")} />
            <h5 className="fs-6 text-muted mb-0">{post.autore.username}</h5>
            <ModalCreateComment post={post} />
          </Modal.Footer>
          {post &&
            post.commentiPrincipali.map(comment => (
              <div className="p-3 " key={comment.id}>
                <div className="d-flex align-items-end mb-2">
                  <img src={comment.autoreCommento.avatar} alt="avatar" style={{ width: "30px", height: "30px", objectFit: "cover" }} />
                  <span className="fs-7 text-muted ms-2 mb-0 ">Posted by: {comment.autoreCommento.username}</span>

                  <span className="fs-8 text-muted ms-2 mb-0 ">
                    {" "}
                    on{" "}
                    {new Date(comment.ora).toLocaleDateString("en-CA", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="mb-3 border rounded p-2 commenti ">
                  <p className="fs-6">{comment.text}</p>
                  <hr />
                  <div className="d-flex justify-content-start">
                    <Button variant="transparent" className="d-flex">
                      <HandThumbsUpFill className="fs-5 me-2" />
                      {comment.numeroLike}
                    </Button>
                    <Button variant="transparent" className="d-flex">
                      <HandThumbsDownFill className="fs-5 me-2" />
                      {comment.numeroDislike}
                    </Button>
                    <ModalCreateComment post={post} commentoPadre={comment} />

                    {comment.autoreCommento.id === profile.id && (
                      <div className="ms-auto">
                        <Button variant="danger" className="me-2 " onClick={() => deleteComment(comment.id)}>
                          <Trash className="fs-5" />
                        </Button>
                        <Button variant="primary" onClick={() => editComment(comment.id)}>
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
                  {comment.sottoCommenti.length > 0 &&
                    comment.sottoCommenti.map(sottoCommenti => (
                      <div className="p-3 mt-1 border rounded" key={sottoCommenti.id}>
                        <div className="d-flex align-items-end mb-2">
                          <img src={sottoCommenti.autoreCommento.avatar} alt="avatar" style={{ width: "30px", height: "30px", objectFit: "cover" }} />
                          <span className="fs-7 text-muted ms-2 mb-0 ">Posted by: {sottoCommenti.autoreCommento.username}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="fs-6">{sottoCommenti.text}</span>
                          <span className="fs-8 text-muted ms-auto">
                            {new Date(sottoCommenti.ora).toLocaleDateString("en-CA", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <hr />
                        </div>
                        <div className="d-flex justify-content-start">
                          <Button variant="transparent" className="d-flex">
                            <HandThumbsUpFill className="fs-5 me-2" />
                            {sottoCommenti.numeroLike}
                          </Button>
                          <Button variant="transparent" className="d-flex">
                            <HandThumbsDownFill className="fs-5 me-2" />
                            {sottoCommenti.numeroDislike}
                          </Button>
                          <ModalCreateComment post={post} commentoPadre={sottoCommenti} />

                          {sottoCommenti.autoreCommento.id === profile.id && (
                            <div className="ms-auto">
                              <NavDropdown title={<Gear className="fs-5" />} id="basic-nav-dropdown" align="end">
                                <NavDropdown.Item onClick={() => editComment(sottoCommenti.id)}>Edit</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => deleteComment(sottoCommenti.id)}>Delete</NavDropdown.Item>
                              </NavDropdown>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </Modal>
      </>
    )
  );
};

export default ModalPostComments;
