import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { inputSearchAction, saveAnimeClickedAction } from "../redux/actions";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const inputSearch = useSelector(state => state.input.name);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [nrPage, setNrPage] = useState(1);
  const [pageOffset, setPageOffset] = useState(0);
  const pagesToShow = 4;

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

  useEffect(() => {
    dispatch(inputSearchAction(inputSearch, nrPage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputSearch, nrPage]);

  const inputResponse = useSelector(state => state.input.input); //TODO: ON SUBMIT -> OTHER PAGE WITH SEARCHED INFO
  const totalPages = inputResponse.pagination && inputResponse.pagination.last_visible_page;

  return (
    <Container className="mainContainer">
      {inputResponse.data && (
        <Row>
          <Col xs={12}>
            <h2 className="mb-4">{inputSearch}</h2>
            <Row className=" ">
              {inputResponse.data.map((anime, index) => (
                <Col
                  onClick={() => {
                    dispatch(saveAnimeClickedAction(anime));
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
        </Row>
      )}
    </Container>
  );
};

export default Search;
