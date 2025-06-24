<template>
  <div v-if="plantel" class="main-container">
    <div class="main-content">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">
          <i class="fas fa-users"></i> Plantel de {{ equipo }}
        </h1>
        <p class="page-subtitle">Gestiona los jugadores de tu equipo</p>
      </div>

      <!-- Tabla de jugadores -->
      <div class="custom-card">
        <div class="card-header-custom">
          <h5 class="card-title-custom">
            <i class="fas fa-list"></i> Jugadores del Equipo
          </h5>
        </div>
        <div style="overflow-x: auto;">
          <table class="table-custom">
            <thead>
              <tr>
                <th>
                  <i class="fas fa-user"></i> Jugador
                </th>
                <th>
                  <i class="fas fa-map-marker-alt"></i> Posición
                </th>
                <th v-if="puedeEditar" class="text-center">
                  <i class="fas fa-cogs"></i> Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="jugador in plantel.jugadores" :key="jugador.nombre">
                <td>
                  <template v-if="editandoJugador === jugador.nombre">
                    <input v-model="editNombre" class="form-input-custom" />
                  </template>
                  <template v-else>
                    <div style="display: flex; align-items: center;">
                      <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: var(--primary-color); margin-right: 1rem;">
                        <i class="fas fa-user-circle"></i>
                      </div>
                      <span style="font-weight: 500;">{{ jugador.nombre }}</span>
                    </div>
                  </template>
                </td>
                <td>
                  <template v-if="editandoJugador === jugador.nombre">
                    <select v-model="editPosicion" class="form-select-custom">
                      <option value="ARQ">ARQ</option>
                      <option value="DEF">DEF</option>
                      <option value="VOL">VOL</option>
                      <option value="DEL">DEL</option>
                    </select>
                  </template>
                  <template v-else>
                    <span :class="getPosicionClass(jugador.posicion)" class="badge-custom">
                      {{ jugador.posicion }}
                    </span>
                  </template>
                </td>
                <td v-if="puedeEditar" class="text-center">
                  <template v-if="editandoJugador === jugador.nombre">
                    <button @click="guardarEdicion(jugador)" class="btn-success-custom" style="margin-right: 0.5rem; padding: 0.5rem 1rem; font-size: 0.875rem;">
                      <i class="fas fa-check"></i> Guardar
                    </button>
                    <button @click="cancelarEdicion" class="btn-custom" style="background: var(--text-muted); padding: 0.5rem 1rem; font-size: 0.875rem;">
                      <i class="fas fa-times"></i> Cancelar
                    </button>
                  </template>
                  <template v-else>
                    <button @click="editarJugador(jugador)" class="btn-custom" style="margin-right: 0.5rem; padding: 0.5rem 1rem; font-size: 0.875rem;">
                      <i class="fas fa-edit"></i> Editar
                    </button>
                    <button @click="borrarJugador(jugador)" class="btn-danger-custom" style="padding: 0.5rem 1rem; font-size: 0.875rem;">
                      <i class="fas fa-trash"></i> Borrar
                    </button>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Formulario para agregar jugador -->
      <div v-if="puedeEditar" class="custom-card">
        <h5 class="card-title-custom">
          <i class="fas fa-plus-circle"></i> Agregar Jugador
        </h5>
        <div class="grid-custom" style="grid-template-columns: 2fr 1fr 1fr; align-items: end;">
          <div>
            <label style="font-weight: 600; color: var(--dark-color); margin-bottom: 0.5rem; display: block;">Nombre del jugador</label>
            <input v-model="nuevoNombre" placeholder="Nombre del jugador" class="form-input-custom" />
          </div>
          <div>
            <label style="font-weight: 600; color: var(--dark-color); margin-bottom: 0.5rem; display: block;">Posición</label>
            <select v-model="nuevaPosicion" class="form-select-custom">
              <option value="ARQ">ARQ</option>
              <option value="DEF">DEF</option>
              <option value="VOL">VOL</option>
              <option value="DEL">DEL</option>
            </select>
          </div>
          <div>
            <button @click="agregarJugador" class="btn-custom" style="width: 100%;">
              <i class="fas fa-plus"></i> Agregar
            </button>
          </div>
        </div>
      </div>

      <!-- Mensaje cuando no hay jugadores -->
      <div v-if="plantel.jugadores.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-users-slash"></i>
        </div>
        <h4 class="empty-title">No hay jugadores en el plantel</h4>
        <p class="empty-text">Agrega jugadores para comenzar a formar tu equipo</p>
      </div>
    </div>
  </div>
  <div v-else class="error-state">
    <div class="error-content">
      <div class="error-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h4 class="error-title">Plantel no encontrado</h4>
      <p class="error-text">El plantel solicitado no existe o no está disponible</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../store/user';
import { useLigasStore } from '../store/ligas';

const route = useRoute();
const ligasStore = useLigasStore();
const user = useUserStore().user;
const ligaId = Number(route.params.id);
const equipo = decodeURIComponent(route.params.equipo);

const liga = computed(() => ligasStore.ligas.find(l => l.id === ligaId));
const plantel = computed(() => {
  if (!liga.value) return null;
  if (!liga.value.planteles) liga.value.planteles = [];
  let p = liga.value.planteles.find(p => p.equipo === equipo);
  if (!p) {
    p = { equipo, jugadores: [] };
    liga.value.planteles.push(p);
    ligasStore.ligas = [...ligasStore.ligas];
  }
  return p;
});

// Permisos: admin puede editar todos, DT solo su equipo
const puedeEditar = computed(() =>
  user.rol === 'admin' || (user.rol === 'dt' && user.equipo === equipo && user.ligaId === ligaId)
);

const nuevoNombre = ref('');
const nuevaPosicion = ref('DEF');

// Edición de jugador
const editandoJugador = ref(null);
const editNombre = ref('');
const editPosicion = ref('DEF');

function agregarJugador() {
  if (!nuevoNombre.value.trim()) return;
  ligasStore.addJugador(ligaId, equipo, {
    nombre: nuevoNombre.value.trim(),
    posicion: nuevaPosicion.value
  });
  nuevoNombre.value = '';
  nuevaPosicion.value = 'DEF';
}

function borrarJugador(jugador) {
  if (confirm('¿Borrar jugador?')) {
    ligasStore.removeJugador(ligaId, equipo, jugador.nombre);
  }
}

function editarJugador(jugador) {
  editandoJugador.value = jugador.nombre;
  editNombre.value = jugador.nombre;
  editPosicion.value = jugador.posicion;
}

function cancelarEdicion() {
  editandoJugador.value = null;
  editNombre.value = '';
  editPosicion.value = 'DEF';
}

function guardarEdicion(jugador) {
  // Borrar el anterior y agregar el nuevo (simple)
  ligasStore.removeJugador(ligaId, equipo, jugador.nombre);
  ligasStore.addJugador(ligaId, equipo, {
    nombre: editNombre.value.trim(),
    posicion: editPosicion.value
  });
  cancelarEdicion();
}

function getPosicionClass(posicion) {
  const classes = {
    'ARQ': 'badge-warning',
    'DEF': 'badge-info',
    'VOL': 'badge-success',
    'DEL': 'badge-danger'
  };
  return classes[posicion] || 'badge-custom';
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
  margin-bottom: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
}

.card-title-custom {
  margin: 0;
  font-size: 1.3rem;
}

.card-title-custom i {
  margin-right: 0.5rem;
}

.table-custom {
  width: 100%;
  border-collapse: collapse;
}

.table-custom th {
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
  color: #495057;
}

.table-custom th i {
  margin-right: 0.5rem;
}

.table-custom td {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

.table-custom tr:last-child td {
  border-bottom: none;
}

.table-custom tr:hover {
  background: #f8f9fa;
}

.form-input-custom, .form-select-custom {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input-custom:focus, .form-select-custom:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-custom:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
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

.error-state {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.error-content {
  text-align: center;
  max-width: 500px;
}

.error-icon {
  font-size: 4rem;
  color: #ffc107;
  margin-bottom: 1.5rem;
}

.error-title {
  color: #6c757d;
  margin-bottom: 1rem;
}

.error-text {
  color: #6c757d;
}

@media (max-width: 768px) {
  .main-container {
    padding: 1rem;
  }
  
  .grid-custom {
    grid-template-columns: 1fr;
  }
  
  .table-custom th,
  .table-custom td {
    padding: 0.75rem 0.5rem;
  }
  
  .btn-custom {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style>