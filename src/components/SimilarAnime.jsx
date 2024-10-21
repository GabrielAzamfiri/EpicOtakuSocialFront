import { useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { saveAnimeClickedAction } from "../redux/actions";
import { useNavigate } from "react-router-dom";

const SimilarAnime = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedAnime = useSelector(state => state.animeClick.animeClicked);

  const [similarAnime, setSimilarAnime] = useState([]);

  const getSimilarAnime = async () => {
    const [firstGenre, secondGenre] = selectedAnime.data.genres;
    const firstGenreId = firstGenre?.mal_id ? firstGenre.mal_id : 2;
    const secondGenreId = secondGenre?.mal_id ? secondGenre.mal_id : 1;

    try {
      const resp = await fetch(`http://localhost:3001/anime?genres=${firstGenreId},${secondGenreId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        setSimilarAnime(data.data);
      } else {
        console.error("getSimilarAnime fetch error");
      }
    } catch (error) {
      console.error("Errore: ", error);
    }
  };
  useEffect(() => {
    getSimilarAnime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnime]);
  return (
    <div>
      <h3 className="text-center mb-3 goldColor">Similar Anime</h3>

      <Row className="m-1">
        {similarAnime.length > 0 &&
          similarAnime.map(anime => (
            <Col
              key={anime.mal_id}
              xs={12}
              onClick={() => {
                dispatch(saveAnimeClickedAction(anime.mal_id));
                navigate("/anime/" + anime.title);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="pointer d-flex  bg-dark border rounded p-2 mb-3 shadowScale"
            >
              <Image src={anime.images.jpg.large_image_url} style={{ width: "100px", objectFit: "contain" }} />

              <div className="ms-2 w-100">
                <h4 className="text-start fs-5 mb-3 truncate-2-lines">{anime.title}</h4>

                <p className=" fs-8 m-0 text-start">
                  <b className="fs-7">Status:</b> {anime.status}
                </p>

                <p className=" fs-8 text-start">
                  <b className="fs-7">Genres:</b> {anime.genres.map(genre => genre.name).join(", ")}
                </p>
              </div>
            </Col>
          ))}
      </Row>
    </div>
  );
};
export default SimilarAnime;
