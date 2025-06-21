<template>
  <div v-if="liga">
    <h2>Detalle de la Liga</h2>
    <p>ID: {{ liga.id }}</p>

    <!-- Nombre editable solo para admin -->
    <div class="nombre-liga">
      <template v-if="user.rol === 'admin' && editandoNombre">
        <input v-model="nuevoNombreLiga" />
        <button class="btn" @click="guardarNombreLiga">Guardar</button>
        <button class="btn btn-cancel" @click="cancelarEdicionNombre">Cancelar</button>
      </template>
      <template v-else>
        <span><strong>Nombre:</strong> {{ liga.nombre }}</span>
        <button
          v-if="user.rol === 'admin'"
          class="btn btn-edit"
          @click="editarNombreLiga"
        >Editar</button>
      </template>
    </div>

    <!-- Agregar equipo (solo admin, solo si no hay fixture generado) -->
    <div v-if="user.rol === 'admin' && !liga.fechas.length" class="agregar-equipo">
      <h3>Agregar equipo</h3>
      <div class="input-row">
        <input v-model="nuevoEquipo" placeholder="Nombre del equipo" />
        <button class="btn" @click="agregarEquipo">Agregar</button>
      </div>
    </div>

    <!-- Listado de equipos con opción de borrar (solo admin, solo si no hay fixture generado) -->
    <div v-if="liga.equipos.length">
      <h3>Equipos</h3>
      <ul class="equipos-lista">
        <li v-for="equipo in liga.equipos" :key="equipo">
          <router-link :to="`/ligas/${liga.id}/plantel/${encodeURIComponent(equipo)}`">
            {{ equipo }}
          </router-link>
          <button
            v-if="user.rol === 'admin' && !liga.fechas.length"
            class="btn btn-delete"
            @click="borrarEquipo(equipo)"
          >Borrar</button>
        </li>
      </ul>
    </div>

    <!-- Selección de equipo para DT -->
    <div v-if="user.rol === 'dt' && (!user.equipo || user.ligaId !== liga.id)" class="asignar-dt">
      <h3>Selecciona tu equipo</h3>
      <div class="input-row">
        <select v-model="equipoSeleccionado">
          <option v-for="equipo in liga.equipos" :key="equipo" :value="equipo">{{ equipo }}</option>
        </select>
        <button class="btn" @click="asignarEquipoDT">Asignar</button>
      </div>
    </div>
    <div v-else-if="user.rol === 'dt' && user.ligaId === liga.id">
      <p><strong>Equipo asignado:</strong> {{ user.equipo }}</p>
    </div>

    <!-- Tabla de posiciones -->
    <div v-if="liga.equipos.length">
      <h3>Tabla de posiciones</h3>
      <table border="1" style="margin:auto;">
        <thead>
          <tr>
            <th>Equipo</th>
            <th>Puntos</th>
            <th>Jugados</th>
            <th>Ganados</th>
            <th>Empatados</th>
            <th>Perdidos</th>
            <th>Goles a favor</th>
            <th>Goles en contra</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="equipo in tablaPosiciones" :key="equipo.nombre">
            <td>{{ equipo.nombre }}</td>
            <td>{{ equipo.puntos }}</td>
            <td>{{ equipo.jugados }}</td>
            <td>{{ equipo.ganados }}</td>
            <td>{{ equipo.empatados }}</td>
            <td>{{ equipo.perdidos }}</td>
            <td>{{ equipo.gf }}</td>
            <td>{{ equipo.gc }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Generar fixture (solo admin, solo si hay equipos y aún no hay fechas) -->
    <div v-if="user.rol === 'admin' && liga.equipos.length > 1 && liga.fechas.length === 0" class="generar-fixture">
      <button class="btn" @click="generarFixture">Generar Fechas (Fixture)</button>
    </div>

    <!-- Fechas y partidos -->
    <div v-for="(fecha, fechaIdx) in liga.fechas" :key="fecha.numero" class="fecha-block">
      <h3>Fecha {{ fecha.numero }}</h3>
      <div v-for="(partido, partidoIdx) in fecha.partidos" :key="partido.local + partido.visitante" class="partido-row">
        <span>{{ partido.local }} vs {{ partido.visitante }}</span>
        <span v-if="!partido.resultado"> - Sin resultado</span>
        <span v-else>
          - {{ partido.resultado }}
          <span v-if="partido.goleadores">
            <br />
            <small>
              <b>Goleadores:</b>
              <span v-for="(goles, nombre) in partido.goleadores" :key="nombre" v-if="goles > 0">
                {{ nombre }} ({{ goles }})&nbsp;
              </span>
            </small>
          </span>
        </span>
        <!-- Solo el DT de ese equipo o el admin pueden cargar resultado -->
        <div
          v-if="(
            (user.rol === 'admin') ||
            (user.rol === 'dt' && user.equipo && (partido.local === user.equipo || partido.visitante === user.equipo) && user.ligaId === liga.id)
          ) && !partido.resultado"
          class="input-row"
        >
          <input v-model="resultadosInputs[fechaIdx][partidoIdx]" placeholder="Ej: 2-1" style="width:70px;" />
          <button class="btn btn-save" @click="prepararAsignacionGoleadores(fechaIdx, partidoIdx)">Asignar Goleadores</button>
        </div>
      </div>
    </div>

    <!-- Asignación de goles a jugadores de ambos equipos -->
    <div v-if="asignandoGoleadores" class="asignar-goleadores">
      <h4>Asignar goles a jugadores</h4>
      <div style="display:flex; gap:2em; flex-wrap:wrap;">
        <div>
          <h5>{{ equipoLocal }}</h5>
          <table>
            <tr>
              <th>Jugador</th>
              <th>Goles</th>
            </tr>
            <tr v-for="j in golesLocal" :key="j.nombre">
              <td>{{ j.nombre }}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  v-model.number="j.goles"
                  style="width:50px;"
                  :readonly="!puedeEditarEquipo(equipoLocal)"
                />
              </td>
            </tr>
          </table>
          <p>Total asignado: {{ sumaGolesLocal }} / {{ golesEsperadosLocal }}</p>
        </div>
        <div>
          <h5>{{ equipoVisitante }}</h5>
          <table>
            <tr>
              <th>Jugador</th>
              <th>Goles</th>
            </tr>
            <tr v-for="j in golesVisitante" :key="j.nombre">
              <td>{{ j.nombre }}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  v-model.number="j.goles"
                  style="width:50px;"
                  :readonly="!puedeEditarEquipo(equipoVisitante)"
                />
              </td>
            </tr>
          </table>
          <p>Total asignado: {{ sumaGolesVisitante }} / {{ golesEsperadosVisitante }}</p>
        </div>
      </div>
      <button class="btn btn-save"
        @click="guardarResultadoConGoleadores"
        :disabled="sumaGolesLocal !== golesEsperadosLocal || sumaGolesVisitante !== golesEsperadosVisitante"
      >Guardar resultado y goleadores</button>
      <button class="btn btn-cancel" @click="cancelarAsignacionGoleadores">Cancelar</button>
    </div>

    <!-- Tabla de goleadores del torneo -->
    <div v-if="tablaGoleadores.length">
      <h3>Goleadores del torneo</h3>
      <table border="1" style="margin:auto;">
        <thead>
          <tr>
            <th>Jugador</th>
            <th>Equipo</th>
            <th>Goles</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="g in tablaGoleadores" :key="g.nombre + g.equipo">
            <td>{{ g.nombre }}</td>
            <td>{{ g.equipo }}</td>
            <td>{{ g.goles }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-else>
    <p>Liga no encontrada.</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../store/user';
import { useLigasStore } from '../store/ligas';

const route = useRoute();
const ligasStore = useLigasStore();
const store = useUserStore();
const { user } = store;
const ligaId = Number(route.params.id);
const liga = computed(() => ligasStore.ligas.find(l => l.id === ligaId));

const nuevoEquipo = ref('');

// Nombre editable
const editandoNombre = ref(false);
const nuevoNombreLiga = ref('');
function editarNombreLiga() {
  editandoNombre.value = true;
  nuevoNombreLiga.value = liga.value.nombre;
}
function guardarNombreLiga() {
  if (!liga.value) return;
  liga.value.nombre = nuevoNombreLiga.value.trim();
  ligasStore.ligas = [...ligasStore.ligas]; // Forzar reactividad
  editandoNombre.value = false;
}
function cancelarEdicionNombre() {
  editandoNombre.value = false;
}

// Para inputs de resultados (reactivo por fecha y partido)
const resultadosInputs = ref([]);
watch(
  () => liga.value && liga.value.fechas,
  (fechas) => {
    if (!fechas) return;
    resultadosInputs.value = fechas.map(fecha =>
      fecha.partidos.map(partido => partido.resultadoInput || '')
    );
  },
  { immediate: true, deep: true }
);

// Tabla de posiciones computada
const tablaPosiciones = computed(() => {
  if (!liga.value) return [];
  const tabla = liga.value.equipos.map(nombre => ({
    nombre,
    puntos: 0,
    jugados: 0,
    ganados: 0,
    empatados: 0,
    perdidos: 0,
    gf: 0,
    gc: 0
  }));

  liga.value.fechas.forEach(fecha => {
    fecha.partidos.forEach(partido => {
      if (partido.resultado) {
        const [golesLocal, golesVisitante] = partido.resultado.split('-').map(Number);
        const local = tabla.find(e => e.nombre === partido.local);
        const visitante = tabla.find(e => e.nombre === partido.visitante);

        local.jugados++;
        visitante.jugados++;
        local.gf += golesLocal;
        local.gc += golesVisitante;
        visitante.gf += golesVisitante;
        visitante.gc += golesLocal;

        if (golesLocal > golesVisitante) {
          local.ganados++; local.puntos += 3;
          visitante.perdidos++;
        } else if (golesLocal < golesVisitante) {
          visitante.ganados++; visitante.puntos += 3;
          local.perdidos++;
        } else {
          local.empatados++; visitante.empatados++;
          local.puntos++; visitante.puntos++;
        }
      }
    });
  });

  return tabla.sort((a, b) =>
    b.puntos - a.puntos ||
    (b.gf - b.gc) - (a.gf - a.gc) ||
    b.gf - a.gf
  );
});

// Agregar equipo
function agregarEquipo() {
  if (!liga.value) return;
  const nombre = nuevoEquipo.value.trim();
  if (nombre && !liga.value.equipos.includes(nombre)) {
    ligasStore.addEquipo(ligaId, nombre);
    nuevoEquipo.value = '';
  }
}

// Borrar equipo
function borrarEquipo(nombre) {
  if (!liga.value) return;
  if (confirm('¿Borrar equipo?')) {
    ligasStore.removeEquipo(ligaId, nombre);
  }
}

// Generar fixture round-robin
function generarFixture() {
  if (!liga.value) return;
  const eqs = [...liga.value.equipos];
  if (eqs.length % 2 !== 0) eqs.push('Libre');
  const n = eqs.length;
  const totalFechas = n - 1;
  const partidosPorFecha = n / 2;
  const fixture = [];

  for (let f = 0; f < totalFechas; f++) {
    const partidos = [];
    for (let p = 0; p < partidosPorFecha; p++) {
      const local = eqs[p];
      const visitante = eqs[n - 1 - p];
      if (local !== 'Libre' && visitante !== 'Libre') {
        partidos.push({
          local,
          visitante,
          resultado: null,
          goleadores: null
        });
      }
    }
    fixture.push({ numero: f + 1, partidos });
    eqs.splice(1, 0, eqs.pop());
  }
  ligasStore.setFechas(ligaId, fixture);
  resultadosInputs.value = fixture.map(fecha => fecha.partidos.map(() => ''));
}

// Estado para asignar goles a jugadores de ambos equipos
const asignandoGoleadores = ref(false);
const partidoCargando = ref(null);
const fechaCargando = ref(null);
const golesLocal = ref([]);
const golesVisitante = ref([]);
const equipoLocal = ref('');
const equipoVisitante = ref('');
const golesEsperadosLocal = ref(0);
const golesEsperadosVisitante = ref(0);

function puedeEditarEquipo(equipo) {
  return user.rol === 'admin' || (user.rol === 'dt' && user.equipo === equipo && user.ligaId === ligaId);
}

function prepararAsignacionGoleadores(fechaIdx, partidoIdx) {
  const partido = liga.value.fechas[fechaIdx].partidos[partidoIdx];
  partidoCargando.value = partido;
  fechaCargando.value = fechaIdx;
  equipoLocal.value = partido.local;
  equipoVisitante.value = partido.visitante;
  // Extrae goles del resultado (ej: "4-2")
  const [golesL, golesV] = (resultadosInputs.value[fechaIdx][partidoIdx] || '').split('-').map(Number);
  golesEsperadosLocal.value = isNaN(golesL) ? 0 : golesL;
  golesEsperadosVisitante.value = isNaN(golesV) ? 0 : golesV;
  // Busca planteles
  const plantelLocal = liga.value.planteles?.find(p => p.equipo === partido.local);
  const plantelVisitante = liga.value.planteles?.find(p => p.equipo === partido.visitante);
  golesLocal.value = plantelLocal
    ? plantelLocal.jugadores.map(j => ({ nombre: j.nombre, goles: 0 }))
    : [];
  golesVisitante.value = plantelVisitante
    ? plantelVisitante.jugadores.map(j => ({ nombre: j.nombre, goles: 0 }))
    : [];
  asignandoGoleadores.value = true;
}

const sumaGolesLocal = computed(() => golesLocal.value.reduce((acc, j) => acc + Number(j.goles), 0));
const sumaGolesVisitante = computed(() => golesVisitante.value.reduce((acc, j) => acc + Number(j.goles), 0));

function guardarResultadoConGoleadores() {
  if (sumaGolesLocal.value !== golesEsperadosLocal.value || sumaGolesVisitante.value !== golesEsperadosVisitante.value) {
    alert('La suma de goles asignados no coincide con el resultado.');
    return;
  }
  // Guarda el resultado
  const fechaIdx = fechaCargando.value;
  const partidoIdx = liga.value.fechas[fechaIdx].partidos.indexOf(partidoCargando.value);
  ligasStore.setResultado(ligaId, fechaIdx, partidoIdx, resultadosInputs.value[fechaIdx][partidoIdx]);
  // Guarda los goleadores
  partidoCargando.value.goleadores = {};
  golesLocal.value.forEach(j => {
    if (j.goles > 0) partidoCargando.value.goleadores[j.nombre + ' (' + equipoLocal.value + ')'] = Number(j.goles);
  });
  golesVisitante.value.forEach(j => {
    if (j.goles > 0) partidoCargando.value.goleadores[j.nombre + ' (' + equipoVisitante.value + ')'] = Number(j.goles);
  });
  ligasStore.ligas = [...ligasStore.ligas];
  // Limpiar estado
  asignandoGoleadores.value = false;
  partidoCargando.value = null;
  fechaCargando.value = null;
  golesLocal.value = [];
  golesVisitante.value = [];
  equipoLocal.value = '';
  equipoVisitante.value = '';
  golesEsperadosLocal.value = 0;
  golesEsperadosVisitante.value = 0;
}

function cancelarAsignacionGoleadores() {
  asignandoGoleadores.value = false;
  partidoCargando.value = null;
  fechaCargando.value = null;
  golesLocal.value = [];
  golesVisitante.value = [];
  equipoLocal.value = '';
  equipoVisitante.value = '';
  golesEsperadosLocal.value = 0;
  golesEsperadosVisitante.value = 0;
}

// Tabla de goleadores del torneo
const tablaGoleadores = computed(() => {
  if (!liga.value) return [];
  const goles = {};
  liga.value.fechas.forEach(fecha => {
    fecha.partidos.forEach(partido => {
      if (partido.goleadores) {
        Object.entries(partido.goleadores).forEach(([nombre, cant]) => {
          if (!goles[nombre]) goles[nombre] = 0;
          goles[nombre] += cant;
        });
      }
    });
  });
  // Separar nombre y equipo para mostrar en columnas
  return Object.entries(goles)
    .map(([nombreEquipo, goles]) => {
      const match = nombreEquipo.match(/^(.*) \((.*)\)$/);
      return match
        ? { nombre: match[1], equipo: match[2], goles }
        : { nombre: nombreEquipo, equipo: '', goles };
    })
    .sort((a, b) => b.goles - a.goles || a.nombre.localeCompare(b.nombre));
});

// Selección de equipo para DT
const equipoSeleccionado = ref('');
function asignarEquipoDT() {
  if (equipoSeleccionado.value) {
    store.setEquipoDT(equipoSeleccionado.value, liga.value.id);
  }
}
</script>

<style scoped>
/* Puedes mantener tus estilos existentes aquí */
</style>