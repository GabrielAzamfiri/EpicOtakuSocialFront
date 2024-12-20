import { Button, Form, Modal, NavDropdown } from "react-bootstrap";
import { CaretDownFill, ChatLeftDotsFill, EyeFill, Gear, HandThumbsDownFill, HandThumbsUpFill } from "react-bootstrap-icons";
import ModalCreateComment from "./modals/ModalCreateComment";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useState } from "react";
import { getUserSelectedAction } from "../redux/actions";
import { useNavigate } from "react-router-dom";

const Comment = ({ post, comment, getPost, showComments, handleClose, getAnimePosts }) => {
  const [text, setText] = useState(comment.text);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleCloseComment = () => setShow(false);
  const handleShow = () => setShow(true);

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
        getPost ? getPost() : showComments();
        getAnimePosts();
      } else {
        console.error("deleteComment fetch error");
      }
    } catch (error) {
      console.error("Errore: ", error);
      toast.warn("Error during delete Comment fetch❌");
    }
  };
  const editComment = async commentId => {
    const commentOBJ = {
      commento: text,
      elementoCommentato: post ? post.id : comment.postId,
    };
    try {
      const resp = await fetch(`http://localhost:3001/utenti/me/commenti/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(commentOBJ),
      });
      if (resp.ok) {
        toast.success("Comment updated successfuly! 👍");
        getPost ? getPost() : showComments();
      } else {
        console.error("Comment updated fetch error");
      }
    } catch (error) {
      console.error("Errore: ", error);
      toast.warn("Error during updated Comment fetch❌");
    }
  };
  const addLikeDislike = async (comment, btn) => {
    let url;

    if (btn === "like") {
      if (comment.numeroLike.includes(profile.id)) {
        url = `http://localhost:3001/commenti/${comment.id}/likes/remove`;
      } else {
        url = `http://localhost:3001/commenti/${comment.id}/likes`;
      }
    } else if (btn === "dislike") {
      if (comment.numeroDislike.includes(profile.id)) {
        url = `http://localhost:3001/commenti/${comment.id}/dislikes/remove`;
      } else {
        url = `http://localhost:3001/commenti/${comment.id}/dislikes`;
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
        getPost ? getPost() : showComments();
      }
    } catch (e) {
      console.error(e);
      toast.error("Error fetching addLikeDislike POST! ��");
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    await editComment(comment.id);

    handleCloseComment();
  };

  const profile = useSelector(state => state.user.userInfo);

  return (
    <>
      <div className="p-3 " key={comment.id}>
        <div className="d-flex align-items-end mb-2">
          <img
            src={comment.autoreCommento.avatar}
            alt="avatar"
            style={{ width: "30px", height: "30px", objectFit: "cover" }}
            className="pointer"
            onClick={() => {
              {
                profile && dispatch(getUserSelectedAction(comment.autoreCommento.id));
                profile && handleClose();
                profile && navigate("/profile");
                profile && window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          />
          <span className="fs-7 text-muted ms-2 mb-0 ">
            By:{" "}
            <a
              onClick={() => {
                {
                  profile && dispatch(getUserSelectedAction(comment.autoreCommento.id));
                  profile && handleClose();
                  profile && navigate("/profile");
                  profile && window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="pointer color-primary text-decoration-none fw-bold"
            >
              {" "}
              {comment.autoreCommento.username}{" "}
            </a>
          </span>

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
            <Button variant="transparent" className="d-flex" onClick={() => profile && addLikeDislike(comment, "like")}>
              <HandThumbsUpFill className="fs-5 me-2" fill={profile && comment.numeroLike.map(like => like).includes(profile.id) ? "yellow" : "white"} />
              {comment.numeroLike.length}
            </Button>
            <Button variant="transparent" className="d-flex" onClick={() => profile && addLikeDislike(comment, "dislike")}>
              <HandThumbsDownFill className="fs-5 me-2" fill={profile && comment.numeroDislike.map(like => like).includes(profile.id) ? "yellow" : "white"} />
              {comment.numeroDislike.length}
            </Button>
            {post ? (
              <ModalCreateComment post={post} commentoPadre={comment} getPost={getPost} getAnimePosts={getAnimePosts} />
            ) : (
              <Button variant="transparent" className="d-flex">
                <ChatLeftDotsFill className="fs-5 me-2" />
                {comment.sottoCommenti.length}
              </Button>
            )}

            {profile && comment.autoreCommento.id === profile.id && (
              <div className="ms-auto">
                <NavDropdown title={<Gear className="fs-5" />} id="basic-nav-dropdown" align="end">
                  <NavDropdown.Item onClick={handleShow}>Edit</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => deleteComment(comment.id)}>Delete</NavDropdown.Item>
                </NavDropdown>
              </div>
            )}
          </div>
          {comment.sottoCommenti.length > 0 &&
            comment.sottoCommenti.map(sottoCommenti => (
              <Comment key={sottoCommenti.id} post={post} comment={sottoCommenti} getPost={getPost} showComments={showComments} handleClose={handleClose} getAnimePosts={getAnimePosts} />
            ))}
        </div>
      </div>

      {profile && (
        <Modal show={show} onHide={handleCloseComment} size="lg" className="">
          <div className="sezione">
            <Modal.Header closeButton>
              <Modal.Title className="d-flex align-items-center gap-3">
                <img src={profile.avatar} alt="profile image" className="rounded my-3 " style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                <div>
                  <h4 className="goldColor">
                    {profile.nome} {profile.cognome} <CaretDownFill fill="#b59562" />
                  </h4>
                  <p className="fs-6 opacity-75 goldColor">
                    Publish: Anyone <EyeFill className="ms-2" fill="#b59562" />
                  </p>
                  <p className="fs-6 opacity-75 m-0 p-0 goldColor">Create your own comment!</p>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={e => handleSubmit(e)}>
                <Form.Group>
                  <Form.Control className="blackGold shadowScale" onChange={e => setText(e.target.value)} value={text} as="textarea" rows={5} placeholder="Text" />
                </Form.Group>
                <Modal.Footer className="d-flex mt-4 justify-content-between">
                  <Button variant="primary" className="rounded  px-4  fw-bold ms-auto" type="submit">
                    Send
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal.Body>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Comment;
