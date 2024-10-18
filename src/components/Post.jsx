import { Button, NavDropdown } from "react-bootstrap";
import { Gear, HandThumbsDownFill, HandThumbsUpFill } from "react-bootstrap-icons";
import ModalPostComments from "./ModalPostComments";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import ModalCreatePost from "./ModalCreatePost";
import { useEffect } from "react";
import { getUserSelectedAction } from "../redux/actions";
import { useNavigate } from "react-router-dom";

const Post = ({ post, getAnimePosts }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const deletePost = async postId => {
    // Chiedi conferma all'utente
    const confirmed = window.confirm("Are you sure you want to delete your comment? This action cannot be undone.");
    if (!confirmed) {
      return; // Se l'utente non conferma, non fare nulla
    }
    try {
      const resp = await fetch(`http://localhost:3001/utenti/me/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (resp.ok) {
        getAnimePosts();
        toast.success("Post deleted succesfuly ✅", { autoClose: 1000 });
      } else {
        toast.warn("Something went wrong! ⚠️ Please try again...");
      }
    } catch (error) {
      console.error("Errore: ", error);
      toast.warn("Error during remove Anime Favorite fetch❌");
    }
  };

  const profile = useSelector(state => state.user.userInfo);

  useEffect(() => {
    getAnimePosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="p-1">
        <div className="d-flex fs-7 text-muted mb-0 ">
          <span>
            Posted by:{" "}
            <a
              onClick={() => {
                {
                  profile && dispatch(getUserSelectedAction(post.autore.id));
                  profile && navigate("/profile");
                  profile && window.scrollTo({ top: 0 });
                }
              }}
              className="pointer color-primary text-decoration-none fw-bold"
            >
              {" "}
              {post.autore.username}{" "}
            </a>
          </span>

          <span className="ms-auto ">
            {new Date(post.ora).toLocaleDateString("en-CA", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="mb-3 border rounded p-2 bg-dark shadowScale">
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
            <ModalPostComments postId={post.id} />
            {profile && post.autore.id === profile.id && (
              <div className="ms-auto">
                <NavDropdown title={<Gear className="fs-5" />} id="basic-nav-dropdown" align="end">
                  <ModalCreatePost text={post.text} post={post} file={post.file} getAnimePosts={getAnimePosts} />

                  <NavDropdown.Item onClick={() => deletePost(post.id)}>Delete</NavDropdown.Item>
                </NavDropdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
