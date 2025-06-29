<template>
  <div class="home-page">
    <!-- Sección del carrusel con texto -->
    <div class="hero-section">
      <!-- Texto a la izquierda -->
      <div class="hero-text">
        <h1 class="hero-title">TU MEJOR GESTOR DE TORNEOS!</h1>
        <p class="hero-description">
          Miles alrededor del mundo confían en LigasApp para manejar sus
          partidos y mantener sus comunidades competitivas organizadas,
          informadas, y listas para el desafío... ¿y vos? ¿ya estás listo para
          el desafío?
        </p>
      </div>

      <!-- Carrusel de imágenes -->
      <div class="carousel-container">
        <div
          class="carousel"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div
            class="carousel-slide"
            v-for="(image, index) in carouselImages"
            :key="index"
          >
            <img :src="image.src" :alt="image.alt" />
            <div class="carousel-overlay">
              <h2>{{ image.title }}</h2>
              <p>{{ image.description }}</p>
            </div>
          </div>
        </div>

        <!-- Indicadores -->
        <div class="carousel-indicators">
          <button
            v-for="(image, index) in carouselImages"
            :key="index"
            class="indicator"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
          ></button>
        </div>
      </div>
    </div>

    <!-- Sección de torneos actuales -->
    <div class="tournaments-section">
      <div class="container">
        <h2 class="section-title">Torneos Actuales</h2>
        <p class="section-subtitle">
          Descubre las competencias más emocionantes del momento
        </p>

        <div class="tournaments-grid">
          <div
            class="tournament-card"
            v-for="tournament in currentTournaments"
            :key="tournament.id"
          >
            <div class="tournament-image">
              <img :src="tournament.image" :alt="tournament.name" />
              <div class="tournament-status" :class="tournament.status">
                {{ tournament.statusText }}
              </div>
            </div>
            <div class="tournament-content">
              <h3>{{ tournament.name }}</h3>
              <p>{{ tournament.description }}</p>
              <div class="tournament-stats">
                <span
                  ><i class="fas fa-users"></i>
                  {{ tournament.participants }} equipos</span
                >
                <span
                  ><i class="fas fa-calendar"></i> {{ tournament.date }}</span
                >
              </div>
              <router-link :to="tournament.link" class="tournament-btn">
                Ver Detalles
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de información adicional -->
    <div class="info-section">
      <div class="container">
        <div class="info-grid">
          <div class="info-card">
            <i class="fas fa-trophy"></i>
            <h3>Competiciones Profesionales</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div class="info-card">
            <i class="fas fa-users"></i>
            <h3>Comunidad Activa</h3>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div class="info-card">
            <i class="fas fa-chart-line"></i>
            <h3>Estadísticas en Tiempo Real</h3>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Carrusel de imágenes
const carouselImages = ref([
  {
    src: "/images/carr01.jpeg",
    alt: "Torneo de Fútbol",
    title: "Liga Virtual 2024",
    description: "Las competencias más emocionantes",
  },
  {
    src: "/images/carr02.jpeg",
    alt: "Equipos Compitiendo",
    title: "Campeonato Nacional",
    description: "Los mejores equipos de la zona",
  },
  {
    src: "/images/carr03.jpeg",
    alt: "Final del Torneo",
    title: "Gran Final",
    description: "El momento más esperado",
  },
  {
    src: "/images/carr04.jpeg",
    alt: "Celebración",
    title: "Celebración del Campeón",
    description: "La gloria del ganador",
  },
  {
    src: "/images/carr05.jpeg",
    alt: "Torneo Internacional",
    title: "Copa Internacional",
    description: "Competencia de nivel mundial",
  },
]);

const currentSlide = ref(0);
let carouselInterval;

// Funciones del carrusel
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % carouselImages.value.length;
};

const prevSlide = () => {
  currentSlide.value =
    currentSlide.value === 0
      ? carouselImages.value.length - 1
      : currentSlide.value - 1;
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

// Auto-play del carrusel
const startCarousel = () => {
  carouselInterval = setInterval(nextSlide, 5000);
};

const stopCarousel = () => {
  clearInterval(carouselInterval);
};

// Torneos actuales
const currentTournaments = ref([
  {
    id: 1,
    name: "Liga Virtual 2024",
    description:
      "La competencia más importante del año con los mejores equipos virtuales.",
    image: "/images/img01.jpg",
    participants: 16,
    date: "En curso",
    status: "active",
    statusText: "Activo",
    link: "/ligas",
  },
  {
    id: 2,
    name: "Copa Nacional",
    description: "Torneo eliminatorio que determina al campeón nacional.",
    image: "/images/img02.jpg",
    participants: 8,
    date: "Próximamente",
    status: "upcoming",
    statusText: "Próximo",
    link: "/ligas",
  },
  {
    id: 3,
    name: "Torneo de Verano",
    description: "Competencia especial durante la temporada de verano.",
    image: "/images/img03.jpg",
    participants: 12,
    date: "Julio 2024",
    status: "upcoming",
    statusText: "Próximo",
    link: "/ligas",
  },
]);

onMounted(() => {
  startCarousel();
});

onUnmounted(() => {
  stopCarousel();
});
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* Sección Hero con texto y carrusel */
.hero-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  margin-bottom: 1rem;
  min-height: 30em;
  width: 95%;
  margin-left: auto;
}

.hero-text {
  flex: 1;
  max-width: 500px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 1rem;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: var(--font-radio-canada-big);
  font-style: italic;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #cec6c6;
  margin-bottom: 1rem;
  text-transform: uppercase;
  text-align: justify;
}

/* Carrusel */
.carousel-container {
  position: relative;
  height: 30em;
  overflow: hidden;
  width: 70%;
  margin-bottom: 0.5em;
  margin-top: 0.5em;
  margin-left: auto;
  /* Aplicar el efecto de borde inclinado */
  --p: 40%; /* control the shape (puede ser porcentaje) */
  clip-path: polygon(0 0, 100% 0, 100% 100%, var(--p) 100%);
}

.carousel {
  display: flex;
  transition: transform 0.5s ease-in-out;
  height: 100%;
}

.carousel-slide {
  min-width: 100%;
  position: relative;
  height: 100%;
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(44, 46, 58, 0.8) 0%,
    rgba(82, 40, 21, 0.8) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  padding: 1em;
}

.carousel-overlay h2 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.carousel-overlay p {
  font-size: 1.2rem;
  max-width: 600px;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  padding: 15px;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  z-index: 10; /* Asegurar que esté por encima del clip-path */
}

.carousel-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

.carousel-btn.prev {
  left: 20px;
}

.carousel-btn.next {
  right: 20px;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10; /* Asegurar que esté por encima del clip-path */
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: white;
  transform: scale(1.2);
}

/* Sección de torneos */
.tournaments-section {
  padding: 60px 0;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 700;
}

.section-subtitle {
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 50px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.tournaments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.tournament-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tournament-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.tournament-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.tournament-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tournament-status {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.tournament-status.active {
  background: #28a745;
  color: white;
}

.tournament-status.upcoming {
  background: #ffc107;
  color: #333;
}

.tournament-content {
  padding: 25px;
}

.tournament-content h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #333;
}

.tournament-content p {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.tournament-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #888;
}

.tournament-stats span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.tournament-btn {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.tournament-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

/* Sección de información */
.info-section {
  padding: 80px 0;
  background: white;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 40px;
}

.info-card {
  text-align: center;
  padding: 40px 20px;
}

.info-card i {
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 20px;
}

.info-card h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
}

.info-card p {
  color: #666;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    padding: 1rem 2rem;
    gap: 2rem;
    text-align: center;
  }

  .hero-text {
    max-width: 100%;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .carousel-container {
    height: 300px;
    width: 100%;
    margin-left: 0;
  }

  .carousel-overlay h2 {
    font-size: 2rem;
  }

  .carousel-overlay p {
    font-size: 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .tournaments-grid {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
