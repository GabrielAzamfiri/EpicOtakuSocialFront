import { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
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
    <Container fluid>
      {inputResponse.data && (
        <Row className="sezione p-2 rounded">
          <Col xs={12}>
            <h2 className="mb-4 text-center goldColor">{inputSearch}</h2>
            <Row className=" justify-content-center">
              {inputResponse.data.map((anime, index) => (
                <Col
                  xs={10}
                  lg={5}
                  onClick={() => {
                    dispatch(saveAnimeClickedAction(anime.mal_id));
                    navigate("/anime/" + anime.title);
                  }}
                  key={index}
                  className="pointer m-3 p-2 d-flex text-center blackGold rounded shadowScale flex-column flex-sm-row"
                >
                  <Image src={anime.images.jpg.large_image_url} style={{ height: "210px", width: "140px", objectFit: "cover" }} className="m-auto" />

                  <div className="ms-sm-2 w-100 " style={{ maxHeight: "210px", overflowY: "scroll" }}>
                    <h4 className="text-center text-sm-start truncate-2-lines goldColor mt-3 mt-sm-0">
                      <b>{anime.title}</b>
                    </h4>
                    <p className=" fs-7 text-start d-none d-sm-block">{anime.synopsis}</p>
                    <p className=" fs-7 m-0 text-center d-sm-none">
                      <b>Status:</b> {anime.status}
                    </p>
                    <p className=" fs-7 text-center d-sm-none">
                      <b>Genres:</b> {anime.genres.map(genre => genre.name).join(", ")}
                    </p>
                  </div>
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
