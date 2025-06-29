<template>
  <div id="app">
    <!-- Barra de navegación superior -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-left">
          <router-link to="/" class="nav-link">
            <img
              src="/images/ligasapp02.png"
              alt="LigasApp Logo"
              class="nav-logo"
            />
          </router-link>
        </div>
        <div class="nav-center">
          <img src="/images/ligasapp04.png" class="nav-title" />
        </div>
        <div class="nav-right">
          <router-link to="/ligas" class="nav-link" v-if="user"
            >Ligas</router-link
          >
          <router-link to="/about" class="nav-link">Acerca de..</router-link>
          <div v-if="user" class="user-menu">
            <span class="user-name">Hola {{ user.nombre }} !</span>
            <button @click="logout" class="btn-Sesion">Cerrar Sesión</button>
          </div>
          <div v-else>
            <button class="btn-Sesion" @click="$router.push('/login')">
              INICIAR SESION
            </button>
          </div>
          <!-- <router-link v-else to="/login" class="nav-link login-btn">Iniciar Sesión</router-link>  <- con router link no pude darle formato estetico al boton-->
        </div>
      </div>
    </nav>

    <!-- Contenido principal -->
    <router-view />

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>Enlaces Útiles</h4>
            <ul class="footer-links">
              <li><a href="#">Contacto</a></li>
              <li><a href="#">Acerca de Nosotros</a></li>
              <li><a href="#">Términos y Condiciones</a></li>
              <li><a href="#">Política de Privacidad</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Soporte</h4>
            <ul class="footer-links">
              <li><a href="#">Centro de Ayuda</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Reportar Problema</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <img src="/images/ligasapp01.png" class="footer-logo" />
            <p>Tu mejor gestor de torneos y ligas deportivas</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 LigasApp. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useUserStore } from "./store/user";
import { storeToRefs } from "pinia";

const store = useUserStore();
const { user } = storeToRefs(store);

function logout() {
  store.logout();
}
</script>

<style>
/* Estilos globales */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
  background-color: #f8f9fa;
  color: #333;
  overflow-x: hidden;
}

.navbar {
  /* CAMBIAR COLORES AQUÍ - Opciones de gradientes: */
  /* Azul-Púrpura: linear-gradient(135deg, #667eea 0%, #764ba2 100%) */
  /* Verde-Azul: linear-gradient(135deg, #11998e 0%, #38ef7d 100%) */
  /* Naranja-Rojo: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%) */
  /* Azul Oscuro: linear-gradient(135deg, #2c3e50 0%, #3498db 100%) */
  background: linear-gradient(135deg, #1a1716 0%, #f37329 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky !important;
  top: 0;
  z-index: 1000;
  width: 100%;
}

.nav-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 1em 2em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  width: 100%;
}

.nav-left {
  display: flex;
  align-items: center;
  flex-shrink: 0; /* Evita que se comprima */
}

.nav-logo {
  height: 6em;
  width: auto;
  border-radius: 8px;
  display: block; /* Asegura que se muestre correctamente */
}

.nav-center {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0; /* Evita que se comprima */
  margin-left: auto; /* Empuja hacia la derecha */
}

.nav-title {
  height: 5em;
  width: auto;
  margin-left: auto;
  display: block; /* Asegura que se muestre correctamente */
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0; /* Evita que se comprima */
  margin-left: auto; /* Empuja hacia la derecha */
}

.nav-link {
  /* CAMBIAR COLOR DE TEXTO AQUÍ */
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  white-space: nowrap; /* Evita que el texto se rompa */
}

.nav-link:hover {
  transform: translateY(-1px);
}

.login-btn {
  /* CAMBIAR COLOR DEL BOTÓN LOGIN AQUÍ */
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.login-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-shrink: 0;
}

.user-name {
  color: white;
  font-weight: 500;
  font-size: 1.3rem;
  white-space: nowrap;
}

.logout-btn {
  /* CAMBIAR COLOR DEL BOTÓN LOGOUT AQUÍ */
  background-color: rgba(220, 53, 69, 0.2);
  border: 1px solid rgba(220, 53, 69, 0.3);
  cursor: pointer;
  font-size: 0.9rem;
}

.logout-btn:hover {
  background-color: rgba(220, 53, 69, 0.3);
}

.btn-Sesion {
  --c: #fff;
  /* text color */
  background: linear-gradient(90deg, #0000 33%, #fff5, #0000 67%)
      var(--_p, 100%) / 300% no-repeat,
    #2e1f04;
  /* background color */
  color: #0000;
  border: none;
  transform: perspective(500px) rotateY(calc(20deg * var(--_i, -1)));
  text-shadow: calc(var(--_i, -1) * 0.08em) -0.01em 0 var(--c),
    calc(var(--_i, -1) * -0.08em) 0.01em 2px #0004;
  outline-offset: 0.1em;
  transition: 0.3s;
  font-weight: bold;
  font-size: 1.5rem;
  margin: 0;
  cursor: pointer;
  padding: 0.1em 0.3em;
}

.btn-Sesion:hover,
.btn-Sesion:focus-visible {
  --_p: 0%;
  --_i: 1;
}

.btn-Sesion:active {
  text-shadow: none;
  color: var(--c);
  box-shadow: inset 0 0 9e9Q #0005;
  transition: 0s;
}

/* Footer */
.footer {
  background: linear-gradient(135deg, #50422c 0%, #262627 100%);
  color: #ecf0f1;
  padding: 3rem 0 1rem 0;
  margin-top: 0rem;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h4 {
  color: #f37329;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.footer-section p {
  color: #bdc3c7;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.9rem;
}

.footer-links a:hover {
  color: #f37329;
}

.footer-bottom {
  border-top: 1px solid #34495e;
  padding-top: 1rem;
  text-align: center;
}

.footer-bottom p {
  color: #95a5a6;
  font-size: 0.9rem;
  margin: 0;
}

.footer-logo {
  height: 9em;
  width: auto;
  display: block;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 15px;
  }

  .nav-logo {
    height: 40px;
  }

  .nav-right {
    gap: 10px;
  }

  .nav-link {
    padding: 6px 12px;
    font-size: 14px;
  }

  .btn-Sesion {
    padding: 0.8rem 1rem;
    font-size: 14px;
  }

  .footer {
    padding: 2rem 0 1rem 0;
    margin-top: 2rem;
  }

  .footer-container {
    padding: 0 1rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .footer-section {
    text-align: center;
  }
}
</style>
