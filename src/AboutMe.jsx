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
        <span className="t-bold">Sobre mi</span>{' '}
        <span className="t-italic">quién anda por aquí</span>{' '}
        SOY ARTISTA VISUAL, ME DEDICO AL TATUAJE Y A LA ILUSTRACIÓN{' '}
        <span className="t-red">hace ya varios años</span> mi trabajo nace de
        la intersección entre lo figurativo y lo abstracto,{' '}
        <span className="t-italic">explorando texturas, contrastes</span> y
        composiciones que buscan transmitir una atmósfera propia en cada
        pieza. <span className="t-mono">(no me repito dos veces)</span> cada
        proyecto es una colaboración{' '}
        <span className="t-bold">escucho la idea, la historia</span> o la
        emoción detrás de cada encargo, y la traduzco en algo único. trabajo
        tanto en estudio como en{' '}
        <span className="t-italic">colaboraciones itinerantes</span>, y
        disfruto especialmente los proyectos que representan{' '}
        <span className="t-red">un desafío técnico o conceptual</span>. si
        quieres verme, <span className="t-bold">bebe, conóceme</span>. no me
        hablas mucho pero seguro nos vamos a entender.{' '}
        <span className="t-italic">ese es el punto</span>.
      </div>
    }
  />
);

export default AboutMe;
