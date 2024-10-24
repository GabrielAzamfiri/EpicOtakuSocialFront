import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <Container fluid>
        <Row className="justify-content-center  align-items-center sezione rounded p-5">
          <Col xs={11} md={6} className="blackGold shadowScale p-5 rounded ">
            <div className=" text-center">
              <h1 className="goldColor mb-4">404 Not Found</h1>
              <p className="mb-5">The page you are looking for does not exist.</p>
              <div className="d-flex justify-content-around ">
                <Button className="" onClick={() => navigate("/")}>
                  Home
                </Button>
                <Button className="" onClick={() => navigate("/auth/login")}>
                  LOG IN
                </Button>
              </div>

              <p className="text-center mt-3">
                Do not have an account? <a href="/auth/register">SIGN IN</a>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default NotFound;
