import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { removeFromFavoritesAction } from "../redux/actions";
import { Heart, HeartFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";

const Anime = () => {
  const dispatch = useDispatch();
  const selectedAnime = useSelector(state => state.animeClick.animeClicked);
  const [listFavoritAnime, setListFavoritAnime] = useState([]);

  const getMyAnimeFavorite = async () => {
    try {
      const resp = await fetch(`http://localhost:3001/utenti/me/anime`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        setListFavoritAnime(data);
      } else {
        console.error("getMyAnimeFavorite fetch error");
      }
    } catch (error) {
      console.error("Errore: ", error);
      toast.warn("Error during add Anime Favorite fetch❌");
    }
  };

  const addToListFavoritAnime = async anime => {
    let genres = [];
    anime.genres.forEach(genre => genres.push(genre.name));
    const animeLiked = {
      id: anime.mal_id,
      title: anime.title,
      image: anime.images.jpg.large_image_url,
      genres: genres,
      aired: anime.aired.string,
    };
    try {
      const resp = await fetch(`http://localhost:3001/animeFavorite/crea`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(animeLiked),
      });
      if (resp.ok) {
        getMyAnimeFavorite();
        toast.success("Anime successfully added to favorite ✅");
      } else {
        toast.warn("Something went wrong! ⚠️ Please try again...");
      }
    } catch (error) {
      console.error("Errore: ", error);
      toast.warn("Error during add Anime Favorite fetch❌");
    }
  };
  const removeFormListFavoritAnime = async anime => {
    try {
      const resp = await fetch(`http://localhost:3001/utenti/me/anime/${anime.mal_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (resp.ok) {
        getMyAnimeFavorite();
        toast.success("Anime successfully removed from favorite ✅");
      } else {
        toast.warn("Something went wrong! ⚠️ Please try again...");
      }
    } catch (error) {
      console.error("Errore: ", error);
      toast.warn("Error during remove Anime Favorite fetch❌");
    }
    setListFavoritAnime(listFavoritAnime.filter(i => i.mal_id !== anime.mal_id));
    dispatch(removeFromFavoritesAction(anime));
  };

  useEffect(() => {
    getMyAnimeFavorite();
  }, []);
  return (
    <Container fluid>
      {selectedAnime && (
        <>
          <Row>
            <img src={selectedAnime.images.jpg.large_image_url} alt={selectedAnime.title} style={{ width: "200px" }} />
            <Col>
              <h1 className="me-3">
                {selectedAnime.title}
                {listFavoritAnime.map(anime => anime.idAnime).includes(selectedAnime.mal_id) ? (
                  <Button className="ms-4" variant="transparent" onClick={() => removeFormListFavoritAnime(selectedAnime)}>
                    <HeartFill className="fs-3" fill="red" />
                  </Button>
                ) : (
                  <Button className="ms-4" variant="transparent" onClick={() => addToListFavoritAnime(selectedAnime)}>
                    <Heart className="fs-3" />
                  </Button>
                )}
              </h1>

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
