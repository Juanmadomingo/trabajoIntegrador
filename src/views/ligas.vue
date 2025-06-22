<template>
  <div class="main-container">
    <div class="main-content">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">
          <i class="fas fa-trophy"></i> Ligas Disponibles
        </h1>
        <p class="page-subtitle">Gestiona y administra tus ligas de fútbol virtual</p>
      </div>

      <!-- Formulario para crear liga (solo admin) -->
      <div v-if="user.rol === 'admin'" class="custom-card">
        <h5 class="card-title-custom">
          <i class="fas fa-plus-circle"></i> Crear Nueva Liga
        </h5>
        <div class="grid-custom" style="grid-template-columns: 2fr 1fr;">
          <input 
            v-model="nuevaLiga" 
            placeholder="Nombre de la liga" 
            class="form-input-custom"
          />
          <button @click="crearLiga" class="btn-custom">
            <i class="fas fa-plus"></i> Crear Liga
          </button>
        </div>
      </div>

      <!-- Lista de ligas -->
      <div class="grid-custom">
        <div v-for="liga in ligasStore.ligas" :key="liga.id" class="custom-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
            <div>
              <h5 style="color: var(--primary-color); font-size: 1.2rem; margin-bottom: 0.5rem;">
                <i class="fas fa-futbol"></i> {{ liga.nombre }}
              </h5>
              <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0;">
                <i class="fas fa-users"></i>
                {{ liga.equipos ? liga.equipos.length : 0 }} equipos
              </p>
            </div>
            <div v-if="user.rol === 'admin'">
              <button @click="borrarLiga(liga.id)" class="btn-danger-custom" style="padding: 8px 12px; font-size: 0.875rem;">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          
          <router-link :to="'/ligas/' + liga.id" class="btn-custom" style="width: 100%; text-align: center;">
            <i class="fas fa-eye"></i> Ver Detalles
          </router-link>
        </div>
      </div>

      <!-- Mensaje cuando no hay ligas -->
      <div v-if="ligasStore.ligas.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-inbox"></i>
        </div>
        <h4 class="empty-title">No hay ligas disponibles</h4>
        <p class="empty-text">Crea tu primera liga para comenzar</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../store/user';
import { useLigasStore } from '../store/ligas';

const user = useUserStore().user;
const ligasStore = useLigasStore();
const nuevaLiga = ref('');

function crearLiga() {
  if (nuevaLiga.value.trim()) {
    ligasStore.addLiga(nuevaLiga.value.trim());
    nuevaLiga.value = '';
  }
}

function borrarLiga(id) {
  if (confirm('¿Seguro que deseas borrar esta liga?')) {
    ligasStore.removeLiga(id);
  }
}
</script>

<style scoped>
.main-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 1rem;
}

.page-title i {
  margin-right: 1rem;
  color: #ffc107;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #6c757d;
}

.custom-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.card-title-custom {
  color: #667eea;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
}

.card-title-custom i {
  margin-right: 0.5rem;
}

.grid-custom {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.custom-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.custom-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.empty-title {
  color: #6c757d;
  margin-bottom: 1rem;
}

.empty-text {
  color: #6c757d;
}

@media (max-width: 768px) {
  .main-container {
    padding: 1rem;
  }
  
  .grid-custom {
    grid-template-columns: 1fr;
  }
}
</style>