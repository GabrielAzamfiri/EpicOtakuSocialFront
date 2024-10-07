import { Col, Container, Row } from "react-bootstrap";

import { useSelector } from "react-redux";

const Anime = () => {
  const selectedAnime = useSelector(state => state.animeClick.animeClicked);

  return (
    <Container fluid>
      {selectedAnime && (
        <>
          <Row>
            <img src={selectedAnime.images.jpg.large_image_url} alt={selectedAnime.title} style={{ width: "200px" }} />
            <Col>
              <h1>{selectedAnime.title}</h1>
              <p className="fs-7">{selectedAnime.synopsis}</p>
            </Col>
          </Row>

          <h5 className="mt-3">Genres:</h5>
          <ul>
            {selectedAnime.genres.map(genre => (
              <li className="fs-7" key={genre.mal_id}>
                {genre.name}
              </li>
            ))}
          </ul>

          <h5 className="mt-3">Stats:</h5>
          <p className="fs-7 m-0">Score: {selectedAnime.score}</p>
          <p className="fs-7 m-0">Ranked: {selectedAnime.rank}</p>
          <p className="fs-7 m-0">Popularity: {selectedAnime.popularity}</p>
          <p className="fs-7 m-0">Favorites: {selectedAnime.favorites}</p>

          <h5 className="mt-3">Alternative Titles:</h5>
          <p className="fs-7 m-0">Title english: {selectedAnime.title_english}</p>
          <p className="fs-7 m-0">Title japanese: {selectedAnime.title_japanese}</p>

          <h5 className="mt-3">Episodes:</h5>
          <p className="fs-7 m-0">Episodes: {selectedAnime.episodes}</p>
          <p className="fs-7 m-0">Aired: {selectedAnime.aired.string}</p>
          <p className="fs-7 m-0">Duration: {selectedAnime.duration}</p>
          <p className="fs-7 m-0">Source: {selectedAnime.source}</p>
          <p className="fs-7 m-0">Rating: {selectedAnime.rating}</p>
          <p className="fs-7 m-0">Status: {selectedAnime.status}</p>
        </>
      )}
    </Container>
  );
};

export default Anime;
