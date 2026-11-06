import Particles from "./components/Particles.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Gallery from "./components/Gallery.jsx";
import Testimonial from "./components/Testimonial.jsx";

export default function App() {
  return (
    <>
      <Particles />
      <div className="premium-aura" aria-hidden="true"></div>
      <div className="premium-aura-2" aria-hidden="true"></div>

      <div className="glow-orb"></div>
      <div className="glow-orb-2"></div>

      <div className="container">
        <Header />
        <Hero />
        <Gallery />
        <Testimonial />
      </div>
    </>
  );
}
