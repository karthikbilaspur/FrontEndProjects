// src/App.jsx
import './App.css';
import Menu from './components/Menu';
import ReservationForm from './components/ReservationForm';
import Gallery from './components/Gallery';
import AboutUs from './components/AboutUs';
import ContactForm from './components/ContactForm';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Welcome to Our Restaurant!</h1>
        <nav>
          <a href="#about">About Us</a> | <a href="#menu">Menu</a> | <a href="#gallery">Gallery</a> | <a href="#reservations">Reservations</a> | <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section id="hero">
          <h2>Experience Fine Dining</h2>
          <p>Taste the tradition, savor the innovation.</p>
          <button>View Our Menu</button>
        </section>

        <section id="about">
          <AboutUs /> {/* Render the AboutUs component here */}
        </section>

        <section id="menu">
          <h2>Our Delicious Menu</h2>
          <Menu /> {/* Render the Menu component here */}
        </section>

        <section id="gallery">
          <h2>A Glimpse Inside</h2>
          <Gallery /> {/* Render the Gallery component here */}
        </section>

        <section id="reservations">
          <h2>Make a Reservation</h2>
          <ReservationForm /> {/* Render the ReservationForm component here */}
        </section>

        <section id="contact">
          <h2>Get in Touch</h2>
          <ContactForm /> {/* Render the ContactForm component here */}
        </section>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Our Restaurant. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;