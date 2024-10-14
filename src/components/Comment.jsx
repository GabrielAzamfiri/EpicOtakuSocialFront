import { Button, NavDropdown } from "react-bootstrap";
import { Gear, HandThumbsDownFill, HandThumbsUpFill, Trash } from "react-bootstrap-icons";
import ModalCreateComment from "./ModalCreateComment";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Comment = ({ post, comment }) => {
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
  const editComment = () => {};
  const profile = useSelector(state => state.user.userInfo);

  return (
    <>
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
                <NavDropdown title={<Gear className="fs-5" />} id="basic-nav-dropdown" align="end">
                  <NavDropdown.Item onClick={() => editComment(comment.id)}>Edit</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => deleteComment(comment.id)}>Delete</NavDropdown.Item>
                </NavDropdown>
              </div>
            )}
          </div>
          {comment.sottoCommenti.length > 0 && comment.sottoCommenti.map(sottoCommenti => <Comment key={sottoCommenti.id} post={post} comment={sottoCommenti} />)}
        </div>
      </div>
    </>
  );
};

export default Comment;
