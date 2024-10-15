import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { removeFromFavoritesAction } from "../redux/actions";
import { HandThumbsDownFill, HandThumbsUpFill, Heart, HeartFill, Trash } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import ModalCreatePost from "./ModalCreatePost";
import { useNavigate } from "react-router-dom";
import ModalPostComments from "./ModalPostComments";

const Anime = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedAnime = useSelector(state => state.animeClick.animeClicked);
  const [listFavoritAnime, setListFavoritAnime] = useState([]);
  const [listAnimePosts, setListAnimePosts] = useState([]);

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
      toast.warn("Error during get Anime Favorite fetch❌");
    }
  };
  const getAnimePosts = async () => {
    try {
      const resp = await fetch(`http://localhost:3001/posts`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        setListAnimePosts(data.content);
      } else {
        console.error("getAnimePosts fetch error");
      }
    } catch (error) {
      console.error("Errore: ", error);
      toast.warn("Error during get Anime Posts fetch❌");
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
        toast.success("Added to favorite ✅", { autoClose: 1000 });
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
        toast.success("Removed from favorite ✅", { autoClose: 1000 });
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
  const deletePost = async postId => {
    // Chiedi conferma all'utente
    const confirmed = window.confirm("Are you sure you want to delete your comment? This action cannot be undone.");
    if (!confirmed) {
      return; // Se l'utente non conferma, non fare nulla
    }
    try {
      const resp = await fetch(`http://localhost:3001/utenti/me/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (resp.ok) {
        getAnimePosts();
        toast.success("Post deleted succesfuly ✅", { autoClose: 1000 });
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
    getMyAnimeFavorite();
    getAnimePosts();
  }, []);

  return (
    <Container fluid>
      {selectedAnime && (
        <>
          <Row className=" py-2 rounded sezione">
            <img src={selectedAnime.data.images.jpg.large_image_url} alt={selectedAnime.data.title} style={{ width: "200px" }} />
            <Col>
              <h1 className="me-3">
                {selectedAnime.data.title}
                {listFavoritAnime.map(anime => anime.idAnime).includes(selectedAnime.data.mal_id) ? (
                  <Button className="ms-4" variant="transparent" onClick={() => removeFormListFavoritAnime(selectedAnime.data)}>
                    <HeartFill className="fs-3" fill="red" />
                  </Button>
                ) : (
                  <Button className="ms-4" variant="transparent" onClick={() => addToListFavoritAnime(selectedAnime.data)}>
                    <Heart className="fs-3" />
                  </Button>
                )}
              </h1>

              <p className="fs-7">{selectedAnime.data.synopsis}</p>
            </Col>
          </Row>
          <Row className="mt-3 gap-3">
            <Col xs={3} className=" py-2 rounded sezione">
              <h3 className="">Info</h3>

              <div className="bg-dark p-2 mt-3 border rounded">
                <h5>Alternative Titles:</h5>
                <p className="fs-7 m-0">
                  Title english: <b>{selectedAnime.data.title_english}</b>{" "}
                </p>
                <p className="fs-7 m-0">
                  Title japanese: <b>{selectedAnime.data.title_japanese}</b>{" "}
                </p>
              </div>
              <div className="bg-dark p-2 mt-3 border rounded">
                <h5>Genres:</h5>
                {selectedAnime.data.genres.map(genre => (
                  <p className="m-0 fs-7 " key={genre.mal_id}>
                    {" "}
                    - {genre.name}
                  </p>
                ))}
              </div>
              <div className="bg-dark p-2 mt-3 border rounded">
                <h5>Stats:</h5>
                <p className="fs-7 m-0">Score: {selectedAnime.data.score}</p>
                <p className="fs-7 m-0">Ranked: {selectedAnime.data.rank}</p>
                <p className="fs-7 m-0">Popularity: {selectedAnime.data.popularity} 🔝</p>
                <p className="fs-7 m-0">Favorites: {selectedAnime.data.favorites} 💓</p>
              </div>
              <div className="bg-dark p-2 mt-3 border rounded">
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
                  <h3 className="text-center">Posts & Comments</h3>
                  <div className="d-flex  align-items-end  ">
                    <img src={profile.avatar} alt="User Avatar" className="pointer rounded me-3" style={{ width: "40px", height: "40px", objectFit: "cover" }} onClick={() => navigate("/profile")} />

                    <ModalCreatePost getAnimePosts={getAnimePosts} />
                  </div>
                  <div className="mt-3">
                    {listAnimePosts
                      .filter(post => post.animeId === selectedAnime.data.mal_id)
                      .map(post => (
                        <div key={post.id}>
                          <p className="fs-7 text-muted mb-0 ">Posted by: {post.autore.username}</p>
                          <div className="mb-3 border rounded p-2 bg-dark ">
                            <p className="fs-6">{post.text}</p>
                            <img src={post.file} alt="post file" style={{ width: "100%", objectFit: "cover" }} />
                            <hr />
                            <div className="d-flex justify-content-start">
                              <Button variant="transparent" className="d-flex">
                                <HandThumbsUpFill className="fs-5 me-2" />
                                {post.numeroDislike}
                              </Button>
                              <Button variant="transparent" className="d-flex">
                                <HandThumbsDownFill className="fs-5 me-2" />
                                {post.numeroLike}
                              </Button>
                              <ModalPostComments postId={post.id} />
                              {post.autore.id === profile.id && (
                                <div className="ms-auto">
                                  <Button variant="danger" className="me-1" onClick={() => deletePost(post.id)}>
                                    <Trash className="fs-5" />
                                  </Button>
                                  <Button variant="primary">Edit</Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </Col>
            <Col xs={3} className=" py-2 rounded sezione">
              <h3 className="text-center">Similar Anime</h3>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Anime;
