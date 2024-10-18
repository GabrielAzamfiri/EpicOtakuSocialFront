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
        getAnimePosts();
      }
    } catch (e) {
      console.error(e);
      toast.error("Error fetching addLike POST! ��");
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
            <Button variant="transparent" className="d-flex" onClick={() => addLikeDislike(post, "like")}>
              <HandThumbsUpFill className="fs-5 me-2" fill={post.numeroLike.map(like => like).includes(profile.id) ? "yellow" : "white"} />
              {post.numeroLike.length}
            </Button>
            <Button variant="transparent" className="d-flex" onClick={() => addLikeDislike(post, "dislike")}>
              <HandThumbsDownFill className="fs-5 me-2" fill={post.numeroDislike.map(like => like).includes(profile.id) ? "yellow" : "white"} />
              {post.numeroDislike.length}
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
