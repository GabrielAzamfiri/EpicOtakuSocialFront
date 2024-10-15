import { Button } from "react-bootstrap";
import { HandThumbsDownFill, HandThumbsUpFill, Trash } from "react-bootstrap-icons";
import ModalPostComments from "./ModalPostComments";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Post = ({ post, getAnimePosts }) => {
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

  return (
    <>
      <div key={post.id}>
        <p className="fs-7 text-muted mb-0 ">Posted by: {post.autore.username}</p>
        <div className="mb-3 border rounded p-2 bg-dark ">
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
            {post.autore.id === profile.id && (
              <div className="ms-auto">
                <Button variant="danger" className="me-1" onClick={() => deletePost(post.id)}>
                  <Trash className="fs-5" />
                </Button>
                <Button variant="primary">Edit</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
