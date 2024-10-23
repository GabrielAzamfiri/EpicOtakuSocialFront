import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveAnimeClickedAction } from "../redux/actions";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import HomeCarousel from "./HomeCarousel";
const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anime, setAnime] = useState([]);
  const [totalPages, setTotalPages] = useState(1098);
  const [newAnime, setNewAnime] = useState([]);
  const [genreName, setGenreName] = useState("");

  const genre = useSelector(state => state.genreReducer.genreClicked);

  const [nrPage, setNrPage] = useState(1);
  const [pageOffset, setPageOffset] = useState(0);

  const pagesToShow = 6;

  const today = new Date();
  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 3); // 3 month ago
  let formattedDateToday = today.toLocaleDateString("en-CA"); //en-CA format to yyyy-mm-dd
  let formattedDate = lastMonth.toLocaleDateString("en-CA");

  const fetchGetAnime = async () => {
    try {
      const resp = await fetch(`http://localhost:3001/anime?genres=${genre}&nrPage=${nrPage}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (resp.ok) {
        const data = await resp.json();

        setAnime(data.data);
        setTotalPages(data.pagination.last_visible_page);
      } else {
        toast.warn("Too many request! ⚠️ Please reload");
      }
    } catch (error) {
      console.error("Errore: ", error);
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
        toast.warn("Too many request! ⚠️ Please reload");
      }
    } catch (error) {
      console.error("Errore: ", error);
    }
  };

  const genreNames = () => {
    switch (genre) {
      case "1":
        setGenreName("Action");
        break;
      case "2":
        setGenreName("Adventure");
        break;
      case "10":
        setGenreName("Fantasy");
        break;
      case "8":
        setGenreName("Drama");
        break;
      case "46":
        setGenreName("Award Winning");
        break;
      case "22":
        setGenreName("Romance");
        break;
      case "9":
        setGenreName("Ecchi");
        break;
      case "62":
        setGenreName("Isekai");
        break;
      case "17":
        setGenreName("Martial Arts");
        break;
      case "38":
        setGenreName("Military");
        break;
      case "27":
        setGenreName("Shounen");
        break;
      case "15":
        setGenreName("Kids");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    fetchGetAnime();
    setTimeout(() => {
      //to avoid too many requests on home page
      fetchGetAnimeAsidebar();
    }, 300);
    genreNames();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nrPage, genre]);

  const renderPageNumbers = () => {
    const pages = [];

    for (let i = pageOffset + 1; i <= Math.min(pageOffset + pagesToShow, totalPages); i++) {
      pages.push(
        <Button key={i} variant={nrPage === i ? "light" : "transparent"} onClick={() => handlePageClick(i)} className="mx-1 ">
          {i}
        </Button>
      );
    }
    return pages;
  };

  const handlePageClick = pageNumber => {
    setNrPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Container fluid>
        <Row className="sezione p-2 rounded">
          <HomeCarousel />
        </Row>
        {anime && (
          <Row className="sezione p-2  rounded mt-3">
            <Col xs={12} lg={8} className="d-flex flex-column align-items-center">
              <h2 className="mb-4 goldColor">Anime {genreName}</h2>
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
                    className="d-flex mt-1 border-0  fs-4 "
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
                <Row className="asideScrollBar">
                  <h2 className="mb-4 goldColor">Latest Releases</h2>
                  {newAnime.map((anime, index) => (
                    <Row key={index} className="mb-3 ">
                      <img
                        onClick={() => {
                          dispatch(saveAnimeClickedAction(anime.mal_id));
                          navigate("/anime/" + anime.title);
                        }}
                        src={anime.images.jpg.large_image_url}
                        className=" pointer "
                        style={{ width: "100px", height: "120px", objectFit: "cover" }}
                      />

                      <Col className="blackGold p-2   rounded shadowScale">
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
