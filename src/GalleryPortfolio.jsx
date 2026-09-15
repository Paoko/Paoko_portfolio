import './GalleryPortfolio.css';
import PhotoBoard from './PhotoBoard';
import tattoo1 from './assets/galería/tattoo_1.png';
import photo6 from './assets/galería/6.png';
import photo7 from './assets/galería/7.png';
import photo12 from './assets/galería/12.png';
import dreamworld from './assets/galería/DREAMWORLD.jpg';
import tattooNeck from './assets/galería/Captura de pantalla 2026-09-15 105228.png';
import illustration1 from './assets/galería/Captura de pantalla 2026-09-15 105300.png';
import illustration2 from './assets/galería/Captura de pantalla 2026-09-15 105913.png';

const PHOTOS = [
  tattoo1, photo6, photo7, photo12, dreamworld,
  tattooNeck, illustration1, illustration2,
];

const GalleryPortfolio = () => (
  <PhotoBoard
    photos={PHOTOS}
    background={
      <>
        <video
          className="background-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="https://videos.pexels.com/video-files/3945683/3945683-sd_640_360_24fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="video-overlay"></div>
      </>
    }
  />
);

export default GalleryPortfolio;
