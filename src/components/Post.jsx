import { Button, Col, Row } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

const Post = ({ post }) => {
  const deletePost = () => {};
  const editPost = () => {};
  const likePost = () => {};
  const dislikePost = () => {};

  return (
    <>
      <div>
        {post && (
          <div>
            <p>{post.text}</p> {/* Sostituisci 'text' con il campo del post che vuoi mostrare */}
            <Row>
              <Col>
                <Button className="me-3" variant="primary" onClick={() => likePost(post.id)}>
                  Like
                </Button>
                <Button className="me-3" variant="primary" onClick={() => dislikePost(post.id)}>
                  Dislike
                </Button>
              </Col>
              <Col className="d-flex justify-content-end">
                <Button className="me-3" variant="danger" onClick={() => deletePost(post.id)}>
                  <Trash />
                </Button>
                <Button className="me-3" variant="primary" onClick={() => editPost(post.id)}>
                  Edit
                </Button>
              </Col>
            </Row>
            <hr />
          </div>
        )}
      </div>
    </>
  );
};

export default Post;
