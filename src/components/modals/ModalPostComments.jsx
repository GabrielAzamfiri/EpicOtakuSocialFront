import { useEffect, useState } from "react";
import { Image, Row, Button } from "react-bootstrap";
import { ChatLeftDotsFill, HandThumbsDownFill, HandThumbsUpFill } from "react-bootstrap-icons";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ModalCreateComment from "./ModalCreateComment";
import { toast } from "react-toastify";
import Comment from "../Comment";
import { getUserSelectedAction } from "../../redux/actions";

const ModalPostComments = ({ thePost, getAnimePosts }) => {
  const [show, setShow] = useState(false);
  const [post, setPost] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    getPost();
    setShow(true);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getPost = async () => {
    try {
      const resp = await fetch(`http://localhost:3001/posts/${thePost.id}`, {
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
  const addLikeDislike = async (post, btn) => {
    let url;

    if (btn === "like") {
      if (post.numeroLike.includes(profile.id)) {
        url = `http://localhost:3001/posts/${post.id}/likes/remove`;
      } else {
        url = `http://localhost:3001/posts/${post.id}/likes`;
      }
    } else if (btn === "dislike") {
      if (post.numeroDislike.includes(profile.id)) {
        url = `http://localhost:3001/posts/${post.id}/dislikes/remove`;
      } else {
        url = `http://localhost:3001/posts/${post.id}/dislikes`;
      }
    }

    try {
      const resp = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (resp.ok) {
        getPost();
        getAnimePosts();
      }
    } catch (e) {
      console.error(e);
      toast.error("Error fetching addLikeDislike POST! ��");
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
          {thePost.commentiPrincipali.length}
        </Button>

        <Modal show={show} onHide={handleClose} size="lg" className="">
          <div className="sezione">
            <Modal.Header closeButton>
              <Image
                className="pointer"
                rounded
                src={post.autore.avatar}
                alt="User profile picture "
                style={{ height: "60px", width: "60px", objectFit: "cover" }}
                onClick={() => {
                  {
                    profile && dispatch(getUserSelectedAction(post.autore.id));
                    profile && handleClose();
                    profile && navigate("/profile");
                    profile && window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              />
              <div className="ms-3">
                <Modal.Title
                  className="pointer goldColor"
                  onClick={() => {
                    {
                      profile && dispatch(getUserSelectedAction(post.autore.id));
                      profile && handleClose();
                      profile && navigate("/profile");
                      profile && window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                >
                  {post.autore.nome} {post.autore.cognome}
                </Modal.Title>
                <p className="fs-7 text-muted mb-0 goldColor">
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
              <Row className="justify-content-center p-3">
                <div key={post.id} className="mb-3 border rounded p-2 blackGold shadowScale">
                  <p className="fs-6">{post.text}</p>
                  <img src={post.file} alt="post file" style={{ width: "100%", objectFit: "cover" }} />
                  <hr />
                  <div className="d-flex justify-content-start">
                    <Button variant="transparent" className="d-flex" onClick={() => profile && addLikeDislike(post, "like")}>
                      <HandThumbsUpFill className="fs-5 me-2" fill={profile && post.numeroLike.map(like => like).includes(profile.id) ? "yellow" : "white"} />
                      {post.numeroLike.length}
                    </Button>
                    <Button variant="transparent" className="d-flex" onClick={() => profile && addLikeDislike(post, "dislike")}>
                      <HandThumbsDownFill className="fs-5 me-2" fill={profile && post.numeroDislike.map(like => like).includes(profile.id) ? "yellow" : "white"} />
                      {post.numeroDislike.length}
                    </Button>
                    <Button variant="transparent" className="d-flex">
                      <ChatLeftDotsFill className="fs-5 me-2" />
                      {post.commentiPrincipali.length}
                    </Button>
                  </div>
                </div>
              </Row>
            </Modal.Body>

            <h3 className="ms-3 goldColor">Comments</h3>
            {profile && (
              <Modal.Footer className="d-flex justify-content-start">
                <img src={profile.avatar} alt="User Avatar" className="pointer rounded " style={{ width: "30px", height: "30px", objectFit: "cover" }} onClick={() => navigate("/profile")} />
                <h5 className="fs-6 text-muted mb-0">{profile.username}</h5>
                <ModalCreateComment post={post} getPost={getPost} getAnimePosts={getAnimePosts} />
              </Modal.Footer>
            )}
            {post &&
              post.commentiPrincipali
                .sort((a, b) => new Date(b.ora) - new Date(a.ora))
                .map(comment => <Comment key={comment.id} post={post} comment={comment} getPost={getPost} handleClose={handleClose} getAnimePosts={getAnimePosts} />)}
          </div>
        </Modal>
      </>
    )
  );
};

export default ModalPostComments;
