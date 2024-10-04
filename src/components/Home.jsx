import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

const Home = () => {
  const [anime, setAnime] = useState([]);
  const [newAnime, setNewAnime] = useState([]);

  const [nrPage, setNrPage] = useState(1);
  const [pageOffset, setPageOffset] = useState(0);
  const totalPages = 1098;
  const pagesToShow = 10;
  const today = new Date(); // Data odierna
  const lastMonth = new Date(today); // Crea una nuova data basata su quella odierna
  lastMonth.setMonth(today.getMonth() - 3); // Imposta il mese al mese scorso
  let formattedDateToday = today.toLocaleDateString("en-CA");
  let formattedDate = lastMonth.toLocaleDateString("en-CA"); //en-CA format to yyyy-mm-dd

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

  const fetchGetAnimeAsidebar = async () => {
    try {
      const resp = await fetch(`https://api.jikan.moe/v4/anime?start_date=${formattedDate}&end_date=${formattedDateToday}`, {});

      if (resp.ok) {
        const data = await resp.json();
        console.log(data);
        setNewAnime(data.data);
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
    fetchGetAnimeAsidebar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nrPage]);

  const renderPageNumbers = () => {
    const pages = [];

    for (let i = pageOffset + 1; i <= Math.min(pageOffset + pagesToShow, totalPages); i++) {
      pages.push(
        <Button key={i} variant={nrPage === i ? "light" : "transparent"} onClick={() => handlePageClick(i)} className="mx-1">
          {i}
        </Button>
      );
    }
    return pages;
  };

  const handlePageClick = pageNumber => {
    setNrPage(pageNumber);
    // Se clicchi sull'ultima pagina del gruppo, aggiorna l'offset per mostrare le successive 10
    if (pageNumber > pageOffset + pagesToShow - 1) {
      setPageOffset(pageOffset + pagesToShow);
    }
    // Se clicchi sulla prima pagina del gruppo, aggiorna l'offset per mostrare le precedenti 10
    if (pageNumber <= pageOffset) {
      setPageOffset(Math.max(pageOffset - pagesToShow, 0));
    }
  };

  return (
    <>
      <Container fluid>
        {anime && (
          <Row className="gap-3">
            <Col lg={8}>
              <h1 className="mb-4">Anime</h1>
              <Row>
                {anime.map((anime, index) => (
                  <Col md={6} key={index} className="mb-4 custom-col ">
                    <Card.Img variant="top" src={anime.images.jpg.large_image_url} style={{ height: "260px", objectFit: "cover" }} />
                  </Col>
                ))}
              </Row>
              <Row className="justify-content-center mb-5">
                <Col xs="auto">
                  <Button variant="transparent" onClick={() => setPageOffset(Math.max(pageOffset - pagesToShow, 0))} disabled={pageOffset === 0}>
                    Previous 10
                  </Button>
                </Col>

                <Col xs="auto" className="text-center">
                  {renderPageNumbers()}
                </Col>

                <Col xs="auto">
                  <Button variant="transparent" onClick={() => setPageOffset(Math.min(pageOffset + pagesToShow, totalPages - pagesToShow))} disabled={pageOffset + pagesToShow >= totalPages}>
                    Next 10
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col className="d-none d-lg-block">
              <h1 className="mb-4">Latest Releases</h1>
              <Row style={{ maxHeight: "1400px", overflowY: "scroll", padding: "10px" }}>
                {newAnime.map((anime, index) => (
                  <Row key={index} className="align-items-center ">
                    <Col className="mb-4 ">
                      <Card.Img variant="top" src={anime.images.jpg.large_image_url} style={{ height: "160px", objectFit: "cover" }} />
                    </Col>
                    <Col md={8} className="mb-4 ">
                      <Card.Body className="">
                        <Card.Title className="">{anime.title}</Card.Title>
                        <Card.Text className="mb-0 mt-2">Year: {anime.aired.string}</Card.Text>
                        <Card.Text>
                          Genres:{" "}
                          {anime.genres.map((genre, index) => (
                            <span key={index}> - {genre.name}</span>
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
      </Container>
    </>
  );
};
export default Home;
