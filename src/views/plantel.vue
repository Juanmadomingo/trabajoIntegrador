<template>
  <div v-if="plantel">
    <h2>Plantel de {{ equipo }}</h2>
    <table>
      <thead>
        <tr>
          <th>Jugador</th>
          <th>Posición</th>
          <th v-if="puedeEditar">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="jugador in plantel.jugadores" :key="jugador.nombre">
          <td>
            <template v-if="editandoJugador === jugador.nombre">
              <input v-model="editNombre" />
            </template>
            <template v-else>
              {{ jugador.nombre }}
            </template>
          </td>
          <td>
            <template v-if="editandoJugador === jugador.nombre">
              <select v-model="editPosicion">
                <option value="ARQ">ARQ</option>
                <option value="DEF">DEF</option>
                <option value="VOL">VOL</option>
                <option value="DEL">DEL</option>
              </select>
            </template>
            <template v-else>
              {{ jugador.posicion }}
            </template>
          </td>
          <td v-if="puedeEditar">
            <template v-if="editandoJugador === jugador.nombre">
              <button @click="guardarEdicion(jugador)">Guardar</button>
              <button @click="cancelarEdicion">Cancelar</button>
            </template>
            <template v-else>
              <button @click="editarJugador(jugador)">Editar</button>
              <button @click="borrarJugador(jugador)">Borrar</button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="puedeEditar" style="margin-top:1em;">
      <h3>Agregar jugador</h3>
      <input v-model="nuevoNombre" placeholder="Nombre del jugador" />
      <select v-model="nuevaPosicion">
        <option value="ARQ">ARQ</option>
        <option value="DEF">DEF</option>
        <option value="VOL">VOL</option>
        <option value="DEL">DEL</option>
      </select>
      <button @click="agregarJugador">Agregar</button>
    </div>
  </div>
  <div v-else>
    <p>Plantel no encontrado.</p>
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
</script>

<style scoped>
table {
  width: 100%;
  max-width: 500px;
  margin: 1em auto;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(60,60,120,0.08);
}
th, td {
  padding: 0.7em 1em;
  border-bottom: 1px solid #e0e0e0;
  text-align: left;
}
th {
  background: #646cff;
  color: #fff;
}
tr:last-child td {
  border-bottom: none;
}
input, select {
  padding: 0.3em 0.7em;
  border-radius: 5px;
  border: 1px solid #bdbdbd;
}
button {
  border-radius: 5px;
  border: none;
  background: #646cff;
  color: #fff;
  padding: 0.3em 1em;
  font-size: 1em;
  cursor: pointer;
  margin-right: 0.3em;
  transition: background 0.2s;
}
button:hover {
  background: #535bf2;
}
</style>