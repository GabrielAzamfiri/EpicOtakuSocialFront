import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

import { useSelector } from "react-redux";
import { Heart, HeartFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import ModalCreatePost from "./ModalCreatePost";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import SimilarAnime from "./SimilarAnime";
import Post from "./Post";

const Anime = () => {
  const navigate = useNavigate();
  const selectedAnime = useSelector(state => state.animeClick.animeClicked);
  const [listFavoritAnime, setListFavoritAnime] = useState([]);
  const [listAnimePosts, setListAnimePosts] = useState([]);

  const getAnimePosts = async () => {
    try {
      const resp = await fetch(`http://localhost:3001/posts/anime/${selectedAnime.data.mal_id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        setListAnimePosts(data);
      } else {
        console.error("getAnimePosts fetch error");
      }
    } catch (error) {
      console.error("Errore: ", error);
      toast.warn("Error during get Anime Posts fetch❌");
    }
  };
  const getMyAnimeFavorite = async () => {
    if (localStorage.getItem("accessToken")) {
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
        toast.warn("Error during get Anime Favorite fetch❌");
      }
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
      synopsis: anime.synopsis ? (anime.synopsis.length > 250 ? anime.synopsis.substring(0, 250) + "..." : anime.synopsis) : "",
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
        toast.success("Added to favorite ✅", { autoClose: 1000 });
      } else {
        toast.warn("Something went wrong! ⚠️ Please ...");
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
        toast.success("Removed from favorite ✅", { autoClose: 1000 });
      } else {
        toast.warn("Something went wrong! ⚠️ Please try again...");
      }
    } catch (error) {
      console.error("Errore: ", error);
      toast.warn("Error during remove Anime Favorite fetch❌");
    }
  };

  const profile = useSelector(state => state.user.userInfo);

  useEffect(() => {
    if (selectedAnime) {
      getAnimePosts();
      getMyAnimeFavorite();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnime]);

  return (
    <Container fluid>
      {selectedAnime && (
        <>
          <Row className="sezione mb-3 rounded p-2">
            <Col className="d-flex flex-column justify-content-center align-items-center p-0">
              <h1 className="fw-bold truncate-2-lines text-center goldColor ">{selectedAnime.data.title}</h1>

              <div className="mt-3 text-center" style={{ color: "#cccccc" }}>
                <p className="mb-1">
                  <b>Type:</b> {selectedAnime.data.type}
                </p>
                <p className="mb-1">
                  <b>Status:</b> {selectedAnime.data.status}
                </p>
                <p className="mb-1">
                  <b>Score:</b> {selectedAnime.data.score} / 10
                </p>
              </div>

              {listFavoritAnime.map(anime => anime.idAnime).includes(selectedAnime.data.mal_id) ? (
                <Button className="" variant="transparent" onClick={() => profile && removeFormListFavoritAnime(selectedAnime.data)}>
                  <HeartFill className="fs-3" fill="red" />
                </Button>
              ) : (
                <Button className="" variant="transparent" onClick={() => profile && addToListFavoritAnime(selectedAnime.data)}>
                  <Heart className="fs-3" />
                </Button>
              )}
              <Button variant="success mt-3 w-50" className="episodeBTN ">
                Start from EP-1
              </Button>
            </Col>

            <Col className="d-flex justify-content-center p-0">
              <VideoPlayer videoUrl={selectedAnime.data.trailer.embed_url} />
            </Col>
          </Row>
          <Row className="rounded sezione p-2">
            <img className="" src={selectedAnime.data.images.jpg.large_image_url} alt={selectedAnime.data.title} style={{ width: "200px", objectFit: "contain" }} />
            <Col className="d-flex flex-column justify-content-center">
              <h2 className="me-3 goldColor ">{selectedAnime.data.title}</h2>

              <p className="fs-7">{selectedAnime.data.synopsis}</p>
            </Col>
          </Row>
          <Row className="mt-3 gap-3">
            <Col xs={3} className=" py-2 rounded sezione">
              <h3 className="mx-2 goldColor">Info</h3>

              <div className="bg-dark p-2 mx-2 mt-3 border rounded shadowScale">
                <h5>Alternative Titles:</h5>
                <p className="fs-7 m-0 ">
                  Title english: <b>{selectedAnime.data.title_english}</b>{" "}
                </p>
                <p className="fs-7 m-0">
                  Title japanese: <b>{selectedAnime.data.title_japanese}</b>{" "}
                </p>
              </div>
              <div className="bg-dark p-2 mx-2 mt-3 border rounded shadowScale">
                <h5>Genres:</h5>
                {selectedAnime.data.genres.map(genre => (
                  <p className="m-0 fs-7 " key={genre.mal_id}>
                    {" "}
                    - {genre.name}
                  </p>
                ))}
              </div>
              <div className="bg-dark p-2 mx-2 mt-3 border rounded shadowScale">
                <h5>Stats:</h5>
                <p className="fs-7 m-0">Score: {selectedAnime.data.score}</p>
                <p className="fs-7 m-0">Ranked: {selectedAnime.data.rank}</p>
                <p className="fs-7 m-0">Popularity: {selectedAnime.data.popularity} 🔝</p>
                <p className="fs-7 m-0">Favorites: {selectedAnime.data.favorites} 💓</p>
              </div>
              <div className="bg-dark p-2 mx-2 mt-3 border rounded shadowScale">
                <h5>Episodes:</h5>
                <p className="fs-7 m-0">Aired: {selectedAnime.data.aired.string}</p>
                <p className="fs-7 m-0">Source: {selectedAnime.data.source}</p>
                <p className="fs-7 m-0">Rating: {selectedAnime.data.rating}</p>
                <p className="fs-7 m-0">Status: {selectedAnime.data.status}</p>
                <p className="fs-7 m-0">Episodes: {selectedAnime.data.episodes}</p>
                <p className="fs-7 m-0">Duration: {selectedAnime.data.duration}</p>
              </div>
            </Col>
            <Col className=" py-2 rounded sezione">
              {profile && (
                <>
                  <h3 className="text-center goldColor">Posts & Comments</h3>
                  <div className="d-flex  align-items-end  ">
                    <img src={profile.avatar} alt="User Avatar" className="pointer rounded me-3" style={{ width: "40px", height: "40px", objectFit: "cover" }} onClick={() => navigate("/profile")} />

                    <ModalCreatePost getAnimePosts={getAnimePosts} />
                  </div>
                </>
              )}
              <div className="mt-3">
                {listAnimePosts && listAnimePosts.sort((a, b) => new Date(b.ora) - new Date(a.ora)).map(post => <Post key={post.id} post={post} getAnimePosts={getAnimePosts} />)}
              </div>
            </Col>
            <Col xs={3} className=" py-2 rounded sezione">
              <SimilarAnime />
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Anime;
