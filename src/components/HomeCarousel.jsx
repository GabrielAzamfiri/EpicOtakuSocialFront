import { Carousel } from "react-bootstrap";

const HomeCarousel = () => {
  return (
    <Carousel controls={false} fade className="p-0">
      <Carousel.Item interval={5000}>
        <img src="src\assets\imgCarousel\oldLuffy.png" alt="foto-hero" className="rounded imgCarousel" style={{ objectPosition: "0% 15%" }} />
      </Carousel.Item>
      <Carousel.Item interval={5000}>
        <img src="src\assets\imgCarousel\dragonZ.jpg" alt="foto-hero" className="rounded imgCarousel" style={{ objectPosition: "0% 20%" }} />
      </Carousel.Item>
      <Carousel.Item interval={5000}>
        <img src="src\assets\imgCarousel\giganti.png" alt="foto-hero" className="rounded imgCarousel" style={{ objectPosition: "0% 30%" }} />
      </Carousel.Item>
      <Carousel.Item interval={5000}>
        <img src="src\assets\imgCarousel\jujitsu.jpg" alt="foto-hero" className="rounded imgCarousel" style={{ objectPosition: "0% 45%" }} />
      </Carousel.Item>
      <Carousel.Item interval={5000}>
        <img src="src\assets\imgCarousel\narutoVolpe.png" alt="foto-hero" className="rounded imgCarousel" style={{ objectPosition: "0% 20%" }} />
      </Carousel.Item>
      <Carousel.Item interval={5000}>
        <img src="src\assets\imgCarousel\DS_Pilastri.png" alt="foto-hero" className="rounded imgCarousel" style={{ objectPosition: "0% 50%" }} />
      </Carousel.Item>
      <Carousel.Item interval={5000}>
        <img src="src\assets\imgCarousel\pokemon.png" alt="foto-hero" className="rounded imgCarousel" style={{ objectPosition: "0% 70%" }} />
      </Carousel.Item>
      <Carousel.Item interval={5000}>
        <img src="src\assets\imgCarousel\soloLeveling.jpg" alt="foto-hero" className="rounded imgCarousel" style={{ objectPosition: "100% 50%" }} />
      </Carousel.Item>
      <Carousel.Item interval={5000}>
        <img src="src\assets\imgCarousel\Tghoul.jpg" alt="foto-hero" className="rounded imgCarousel" style={{ objectPosition: "0% 70%" }} />
      </Carousel.Item>
      <Carousel.Item interval={5000}>
        <img src="src\assets\imgCarousel\yourName.png" alt="foto-hero" className="rounded imgCarousel" style={{ objectPosition: "0% 50%" }} />
      </Carousel.Item>
    </Carousel>
  );
};

export default HomeCarousel;
