import { useEffect, useState } from "react";
import { Image, Row, Button } from "react-bootstrap";
import { ChatLeftDotsFill, HandThumbsDownFill, HandThumbsUpFill } from "react-bootstrap-icons";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ModalCreateComment from "./ModalCreateComment";
import { toast } from "react-toastify";
import Comment from "./Comment";

const ModalPostComments = ({ postId }) => {
  const [show, setShow] = useState(false);
  const [post, setPost] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    getPost();
    setShow(true);
  };
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

  const profile = useSelector(state => state.user.userInfo);
  useEffect(() => {
    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    post && (
      <>
        <Button variant="transparent" className="d-flex" onClick={handleShow}>
          <ChatLeftDotsFill className="fs-5 me-2" />
          {post.commentiPrincipali.length}
        </Button>

        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Image rounded src={post.autore.avatar} alt="User profile picture " style={{ height: "60px", width: "60px", objectFit: "cover" }} onClick={() => navigate("/profile")} />
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
            <h5 className="fs-6 text-muted mb-0">{profile.username}</h5>
            <ModalCreateComment post={post} getPost={getPost} />
          </Modal.Footer>
          {post && post.commentiPrincipali.map(comment => <Comment key={comment.id} post={post} comment={comment} getPost={getPost} />)}
        </Modal>
      </>
    )
  );
};

export default ModalPostComments;
