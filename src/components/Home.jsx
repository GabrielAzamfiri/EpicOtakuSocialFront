import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveAnimeClickedAction } from "../redux/actions";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anime, setAnime] = useState([]);
  const [newAnime, setNewAnime] = useState([]);

  const [nrPage, setNrPage] = useState(1);
  const [pageOffset, setPageOffset] = useState(0);
  const totalPages = 1098;
  const pagesToShow = 6;

  const today = new Date();
  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 3); // 3 month ago
  let formattedDateToday = today.toLocaleDateString("en-CA"); //en-CA format to yyyy-mm-dd
  let formattedDate = lastMonth.toLocaleDateString("en-CA");

  const fetchGetAnime = async () => {
    try {
      const resp = await fetch(`http://localhost:3001/anime?nrPage=${nrPage}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (resp.ok) {
        const data = await resp.json();
        setAnime(data.data);
      } else {
        toast.warn("Error during Fetch anime! ⚠️ Please reload");
      }
    } catch (error) {
      console.error("Errore: ", error);
      toast.warn("Error during Fetch anime! ⚠️ server error!");
    }
  };

  const fetchGetAnimeAsidebar = async () => {
    try {
      const resp = await fetch(`http://localhost:3001/anime?start_date=${formattedDate}&end_date=${formattedDateToday}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (resp.ok) {
        const data = await resp.json();
        setNewAnime(data.data);
      } else {
        toast.warn("Error during Fetch anime! ⚠️ Please reload!");
      }
    } catch (error) {
      console.error("Errore: ", error);
      toast.warn("Error during Fetch anime! ⚠️ server error!");
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
  };

  return (
    <>
      <Container fluid>
        {anime && (
          <Row className="sezione p-2  rounded ">
            <Col xs={12} lg={8} className="d-flex flex-column align-items-center">
              <h2 className="mb-4">Anime</h2>
              <Row id="homeAnimeList">
                {anime.map((anime, index) => (
                  <Col
                    onClick={() => {
                      dispatch(saveAnimeClickedAction(anime.mal_id));
                      navigate("/anime/" + anime.title);
                    }}
                    key={index}
                    className="mb-3 p-0  text-center animeContainer"
                  >
                    <Card.Img className="animePoster" src={anime.images.jpg.large_image_url} style={{ height: "210px", width: "140px", objectFit: "cover" }} />
                    <h6 className="truncate-2-lines  animeTitle">{anime.title}</h6>
                    <h6 className="truncate-2-lines mt-2  d-md-none">{anime.title}</h6>
                  </Col>
                ))}
              </Row>

              <Row className="justify-content-center mb-5">
                <Col xs="auto">
                  <Button
                    variant="transparent border-none"
                    onClick={() => setPageOffset(Math.max(pageOffset - pagesToShow, 0))} //Math.max prende il valore piu grande tra quelli dati
                    //se va sotto 0 l'offset prendera sempre valore 0
                    disabled={pageOffset === 0}
                    className="d-flex mt-1 border-0  fs-4"
                  >
                    <ArrowLeft />
                  </Button>
                </Col>

                <Col xs="auto" className="text-center">
                  {renderPageNumbers()}
                </Col>

                <Col xs="auto">
                  <Button
                    variant="transparent"
                    onClick={() => setPageOffset(Math.min(pageOffset + pagesToShow, totalPages - pagesToShow))}
                    //se va sopra totalPages l'offset prendera sempre valore minore
                    disabled={pageOffset + pagesToShow >= totalPages}
                  >
                    <ArrowRight className="d-flex mt-1 border-0 fs-4" />
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col xs={12} lg={4}>
              <Container fluid>
                <h2 className="mb-4 ">Latest Releases</h2>
                <Row id="asideScrollBar">
                  {newAnime.map((anime, index) => (
                    <Row key={index} className="mb-3 ">
                      <img
                        onClick={() => {
                          dispatch(saveAnimeClickedAction(anime.mal_id));
                          navigate("/anime/" + anime.title);
                        }}
                        src={anime.images.jpg.large_image_url}
                        className=" pointer"
                        style={{ width: "100px", height: "120px", objectFit: "cover" }}
                      />

                      <Col className="bg-dark p-2 border rounded">
                        <h6
                          onClick={() => {
                            dispatch(saveAnimeClickedAction(anime.mal_id));
                            navigate("/anime/" + anime.title);
                          }}
                          className="asideTitle my-0 pointer"
                        >
                          {anime.title}
                        </h6>
                        <p className="mb-0 fs-7">Aired: {anime.aired.string}</p>

                        <p className="fs-7">
                          Genres:{" "}
                          {anime.genres.map((genre, index) => (
                            <span key={index}> - {genre.name}</span>
                          ))}
                        </p>
                      </Col>
                    </Row>
                  ))}
                </Row>
              </Container>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};
export default Home;
