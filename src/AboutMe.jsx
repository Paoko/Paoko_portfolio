import './AboutMe.css';
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

const AboutMe = () => (
  <PhotoBoard
    photos={PHOTOS}
    overlay={
      <div className="about-text">
        <span className="t-bold">Diseñador Web (Front/UX/UI)</span> y{' '}
        <span className="t-bold">Artista Visual</span> especializado en la{' '}
        <span className="t-italic">Ilustración</span>, enfocado en la
        experimentación de técnicas digitales y en la realización de
        proyectos visuales de alta calidad.{' '}
        <span className="t-mono">Me titulé de la Universidad de Chile.</span>{' '}
        Me apasiona el mundo del{' '}
        <span className="t-italic">arte y la moda</span>. Sueño con diseñar mi
        propia marca y crear{' '}
        <span className="t-bold">mundos imaginarios</span> con los que la
        gente pueda identificarse y empoderarse.
      </div>
    }
  />
);

export default AboutMe;
