import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";

const Anime = () => {
  const animeClicked = useSelector(state => state.animeClick.animeClicked);

  return (
    <Container>
      {animeClicked && (
        <>
          <img src={animeClicked.image_url} alt={animeClicked.title} />
          <h1>{animeClicked.title}</h1>
          <p>{animeClicked.synopsis}</p>
        </>
      )}
    </Container>
  );
};

export default Anime;
