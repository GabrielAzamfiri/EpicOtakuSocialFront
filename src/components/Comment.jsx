import { Button, Col, Row } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

const Comment = ({ comment }) => {
  const deleteComment = () => {};
  const editComment = () => {};
  const likeComment = () => {};
  const dislikeComment = () => {};

  return (
    <>
      <div>
        {comment && (
          <div>
            <p>{comment.text}</p> {/* Sostituisci 'text' con il campo del post che vuoi mostrare */}
            <Row>
              <Col>
                <Button className="me-3" variant="primary" onClick={() => likeComment(comment.id)}>
                  Like
                </Button>
                <Button className="me-3" variant="primary" onClick={() => dislikeComment(comment.id)}>
                  Dislike
                </Button>
              </Col>
              <Col className="d-flex justify-content-end">
                <Button className="me-3" variant="danger" onClick={() => deleteComment(comment.id)}>
                  <Trash />
                </Button>
                <Button className="me-3" variant="primary" onClick={() => editComment(comment.id)}>
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

export default Comment;
