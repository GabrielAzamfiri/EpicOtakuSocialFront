import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

const Home = () => {
  const [anime, setAnime] = useState([]);
  const [nrPage, setNrPage] = useState(1);

  const fetchGetAnime = async () => {
    try {
      const resp = await fetch(`https://api.jikan.moe/v4/anime?orderBy=popularity&page=${nrPage}`, {});

      if (resp.ok) {
        const data = await resp.json();
        console.log(data);
        setAnime(data.data);
      } else {
        alert("Fetch anime no good!");
      }
    } catch (error) {
      console.error("Errore: ", error);
      alert("Errore durante la Fetch anime!");
    }
  };
  useEffect(() => {
    fetchGetAnime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nrPage]);

  return (
    <>
      <Container fluid>
        {anime && (
          <Row className="gap-3">
            <Col lg={8}>
              <h1 className="mb-4">Anime</h1>
              <Row>
                {anime.map((anime, index) => (
                  <Col md={6} key={index} className="mb-4 custom-col">
                    <Card.Img variant="top" src={anime.images.jpg.large_image_url} style={{ height: "260px", objectFit: "contain" }} />
                  </Col>
                ))}
              </Row>
            </Col>
            <Col className="d-none d-lg-block">
              <h1 className="mb-4">Last Minutes</h1>

              <Row>
                {anime.map((anime, index) => (
                  <Row key={index} className="align-items-center">
                    <Col md={4} className="mb-4  ms-auto">
                      <Card.Img variant="top" src={anime.images.jpg.large_image_url} style={{ height: "160px", objectFit: "contain" }} />
                    </Col>
                    <Col md={8} className="mb-4 ">
                      <Card.Body>
                        <Card.Title>{anime.title}</Card.Title>
                        <Card.Text className="mb-0 mt-2">Year: {anime.year}</Card.Text>
                        <Card.Text>
                          Genres:{" "}
                          {anime.genres.map((genre, index) => (
                            <span key={index}>{genre.name}, </span>
                          ))}
                        </Card.Text>
                      </Card.Body>
                    </Col>
                  </Row>
                ))}
              </Row>
            </Col>
          </Row>
        )}
        <div className="text-center">
          <button onClick={() => setNrPage(nrPage + 1)}>Next</button>
        </div>
        {nrPage > 1 && (
          <div className="text-center">
            <button onClick={() => setNrPage(nrPage - 1)}>Previous</button>
          </div>
        )}
      </Container>
    </>
  );
};
export default Home;
