import { useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { saveAnimeClickedAction } from "../redux/actions";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SimilarAnime = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,

    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    autoplay: true,
    pauseOnFocus: true,
    autoplaySpeed: 4000,

    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          speed: 500,
          infinite: true,
          dots: true,
        },
      },

      {
        breakpoint: 778,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          speed: 500,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          speed: 500,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 410,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          speed: 500,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

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
    <div className="animePageScrollBar">
      <h3 className="text-center mb-3 goldColor">Similar Anime</h3>

      <Row className="m-1 gap-sm-3 gap-lg-0 justify-content-center ">
        {similarAnime.length > 0 &&
          similarAnime.map(anime => (
            <Col
              key={anime.mal_id}
              lg={12}
              xs={3}
              onClick={() => {
                dispatch(saveAnimeClickedAction(anime.mal_id));
                navigate("/anime/" + anime.title);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="pointer d-none d-lg-flex flex-column flex-xl-row  blackGold rounded p-2 mb-3 shadowScale "
            >
              <Image src={anime.images.jpg.large_image_url} style={{ width: "100px", objectFit: "contain" }} className="m-auto" />

              <div className="ms-xl-3 w-100 ">
                <h4 className="text-center text-xl-start fs-5 mb-3 truncate-2-lines mt-3 mt-xl-0 goldColor">{anime.title}</h4>

                <p className=" fs-8 m-0 text-center text-xl-start">
                  <b className="fs-7">Status:</b> {anime.status}
                </p>

                <p className=" fs-8 text-center text-xl-start truncate-2-lines">
                  <b className="fs-7 ">Genres:</b> {anime.genres.map(genre => genre.name).join(", ")}
                </p>
              </div>
            </Col>
          ))}
      </Row>
      <Row>
        <Slider {...settings} className="d-lg-none">
          {similarAnime.length > 0 &&
            similarAnime.map(anime => (
              <Col
                key={anime.mal_id}
                onClick={() => {
                  dispatch(saveAnimeClickedAction(anime.mal_id));
                  navigate("/anime/" + anime.title);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="p-2"
              >
                <div className="p-3 blackGold shadowScale rounded pointer mb-3 ">
                  <Image src={anime.images.jpg.large_image_url} style={{ width: "100px", height: "140px", objectFit: "cover" }} className="m-auto" />

                  <div className=" ">
                    <h4 className="text-center fs-5 mb-3 truncate-1-lines mt-3 goldColor">{anime.title}</h4>

                    <p className=" fs-8 m-0 text-center ">
                      <b className="fs-7">Status:</b> {anime.status}
                    </p>

                    <p className=" fs-8 text-center truncate-1-lines">
                      <b className="fs-7 ">Genres:</b> {anime.genres.map(genre => genre.name).join(", ")}
                    </p>
                  </div>
                </div>
              </Col>
            ))}
        </Slider>
      </Row>
    </div>
  );
};
export default SimilarAnime;
