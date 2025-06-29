<template>
  <div v-if="liga" class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-lg-12">
        <!-- Header -->
        <div class="text-center mb-5">
          <h1 class="display-5 fw-bold text-primary mb-3">
            <i class="fas fa-trophy me-3"></i>{{ liga.nombre }}
          </h1>
          <p class="lead text-muted">
            Gestiona equipos, fechas y resultados de la liga
          </p>
        </div>

        <!-- Información de la liga -->
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="card shadow-sm border-0 h-100">
              <div class="card-body p-4">
                <h5 class="card-title text-primary mb-3">
                  <i class="fas fa-info-circle me-2"></i>Información de la Liga
                </h5>
                <div class="mb-3"><strong>ID:</strong> {{ liga.id }}</div>
                <div class="mb-3">
                  <strong>Equipos:</strong> {{ liga.equipos.length }}
                </div>
                <div class="mb-3">
                  <strong>Fechas:</strong> {{ liga.fechas.length }}
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card shadow-sm border-0 h-100">
              <div class="card-body p-4">
                <h5 class="card-title text-primary mb-3">
                  <i class="fas fa-user-cog me-2"></i>Tu Rol
                </h5>
                <div class="mb-3">
                  <strong>Rol:</strong>
                  <span
                    :class="getRolClass(user.rol)"
                    class="badge rounded-pill ms-2"
                  >
                    {{ user.rol.toUpperCase() }}
                  </span>
                </div>
                <div v-if="user.rol === 'dt' && user.equipo" class="mb-3">
                  <strong>Equipo:</strong>
                  <span class="badge bg-primary rounded-pill ms-2">{{
                    user.equipo
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Nombre editable solo para admin -->
        <div v-if="user.rol === 'admin'" class="card shadow-sm border-0 mb-4">
          <div class="card-body p-4">
            <h5 class="card-title text-primary mb-3">
              <i class="fas fa-edit me-2"></i>Editar Nombre de la Liga
            </h5>
            <div class="row g-3">
              <div class="col-md-8">
                <template v-if="editandoNombre">
                  <input v-model="nuevoNombreLiga" class="form-control" />
                </template>
                <template v-else>
                  <div class="d-flex align-items-center">
                    <span class="fw-medium me-3">{{ liga.nombre }}</span>
                    <button
                      @click="editarNombreLiga"
                      class="btn btn-outline-primary btn-sm"
                    >
                      <i class="fas fa-edit me-1"></i>Editar
                    </button>
                  </div>
                </template>
              </div>
              <div v-if="editandoNombre" class="col-md-4">
                <button
                  @click="guardarNombreLiga"
                  class="btn btn-success btn-sm me-2"
                >
                  <i class="fas fa-check me-1"></i>Guardar
                </button>
                <button
                  @click="cancelarEdicionNombre"
                  class="btn btn-secondary btn-sm"
                >
                  <i class="fas fa-times me-1"></i>Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Agregar equipo (solo admin, solo si no hay fixture generado) -->
        <div
          v-if="user.rol === 'admin' && !liga.fechas.length"
          class="card shadow-sm border-0 mb-4"
        >
          <div class="card-body p-4">
            <h5 class="card-title text-primary mb-3">
              <i class="fas fa-plus-circle me-2"></i>Agregar Equipo
            </h5>
            <div class="row g-3">
              <div class="col-md-8">
                <input
                  v-model="nuevoEquipo"
                  placeholder="Nombre del equipo"
                  class="form-control"
                />
              </div>
              <div class="col-md-4">
                <button @click="agregarEquipo" class="btn btn-primary w-100">
                  <i class="fas fa-plus me-2"></i>Agregar Equipo
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Listado de equipos -->
        <div v-if="liga.equipos.length" class="card shadow-sm border-0 mb-4">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">
              <i class="fas fa-users me-2"></i>Equipos Participantes
            </h5>
          </div>
          <div class="card-body p-0">
            <div class="row g-0">
              <div
                v-for="equipo in liga.equipos"
                :key="equipo"
                class="col-md-6 col-lg-4"
              >
                <div class="p-3 border-bottom border-end">
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <router-link
                      :to="`/ligas/${liga.id}/plantel/${encodeURIComponent(
                        equipo
                      )}`"
                      class="text-decoration-none"
                    >
                      <div class="d-flex align-items-center">
                        <div class="avatar-sm me-3">
                          <i class="fas fa-shield-alt text-primary"></i>
                        </div>
                        <span class="fw-medium text-dark">{{ equipo }}</span>
                      </div>
                    </router-link>
                    <button
                      v-if="user.rol === 'admin' && !liga.fechas.length"
                      @click="borrarEquipo(equipo)"
                      class="btn btn-outline-danger btn-sm"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Selección de equipo para DT -->
        <div
          v-if="user.rol === 'dt' && (!user.equipo || user.ligaId !== liga.id)"
          class="card shadow-sm border-0 mb-4"
        >
          <div class="card-body p-4">
            <h5 class="card-title text-primary mb-3">
              <i class="fas fa-hand-pointer me-2"></i>Selecciona tu Equipo
            </h5>
            <div class="row g-3">
              <div class="col-md-8">
                <select v-model="equipoSeleccionado" class="form-select">
                  <option value="">Selecciona un equipo...</option>
                  <option
                    v-for="equipo in liga.equipos"
                    :key="equipo"
                    :value="equipo"
                  >
                    {{ equipo }}
                  </option>
                </select>
              </div>
              <div class="col-md-4">
                <button
                  @click="asignarEquipoDT"
                  class="btn btn-primary w-100"
                  :disabled="!equipoSeleccionado"
                >
                  <i class="fas fa-check me-2"></i>Asignar
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else-if="user.rol === 'dt' && user.ligaId === liga.id"
          class="card shadow-sm border-0 mb-4"
        >
          <div class="card-body p-4">
            <h5 class="card-title text-primary mb-3">
              <i class="fas fa-user-check me-2"></i>Tu Equipo Asignado
            </h5>
            <div class="d-flex align-items-center">
              <div class="avatar-sm me-3">
                <i class="fas fa-shield-alt text-primary"></i>
              </div>
              <span class="fw-medium fs-5">{{ user.equipo }}</span>
            </div>
          </div>
        </div>

        <!-- Tabla de posiciones -->
        <div v-if="liga.equipos.length" class="card shadow-sm border-0 mb-4">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0">
              <i class="fas fa-table me-2"></i>Tabla de Posiciones
            </h5>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th class="border-0 px-4 py-3">Pos</th>
                    <th class="border-0 px-4 py-3">Equipo</th>
                    <th class="border-0 px-4 py-3 text-center">Pts</th>
                    <th class="border-0 px-4 py-3 text-center">PJ</th>
                    <th class="border-0 px-4 py-3 text-center">G</th>
                    <th class="border-0 px-4 py-3 text-center">E</th>
                    <th class="border-0 px-4 py-3 text-center">P</th>
                    <th class="border-0 px-4 py-3 text-center">GF</th>
                    <th class="border-0 px-4 py-3 text-center">GC</th>
                    <th class="border-0 px-4 py-3 text-center">DG</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(equipo, index) in tablaPosiciones"
                    :key="equipo.nombre"
                    class="align-middle"
                  >
                    <td class="px-4 py-3">
                      <span
                        :class="getPosicionClass(index + 1)"
                        class="badge rounded-pill"
                      >
                        {{ index + 1 }}
                      </span>
                    </td>
                    <td class="px-4 py-3 fw-medium">{{ equipo.nombre }}</td>
                    <td class="px-4 py-3 text-center fw-bold">
                      {{ equipo.puntos }}
                    </td>
                    <td class="px-4 py-3 text-center">{{ equipo.jugados }}</td>
                    <td class="px-4 py-3 text-center text-success">
                      {{ equipo.ganados }}
                    </td>
                    <td class="px-4 py-3 text-center text-warning">
                      {{ equipo.empatados }}
                    </td>
                    <td class="px-4 py-3 text-center text-danger">
                      {{ equipo.perdidos }}
                    </td>
                    <td class="px-4 py-3 text-center">{{ equipo.gf }}</td>
                    <td class="px-4 py-3 text-center">{{ equipo.gc }}</td>
                    <td
                      class="px-4 py-3 text-center"
                      :class="
                        equipo.gf - equipo.gc > 0
                          ? 'text-success'
                          : equipo.gf - equipo.gc < 0
                          ? 'text-danger'
                          : 'text-muted'
                      "
                    >
                      {{ equipo.gf - equipo.gc }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Generar fixture (solo admin, solo si hay equipos y aún no hay fechas) -->
        <div
          v-if="
            user.rol === 'admin' &&
            liga.equipos.length > 1 &&
            liga.fechas.length === 0
          "
          class="text-center mb-4"
        >
          <button @click="generarFixture" class="btn btn-primary btn-lg">
            <i class="fas fa-calendar-plus me-2"></i>Generar Fechas (Fixture)
          </button>
        </div>

        <!-- Fechas y partidos -->
        <div
          v-for="(fecha, fechaIdx) in liga.fechas"
          :key="fecha.numero"
          class="card shadow-sm border-0 mb-4"
        >
          <div class="card-header bg-info text-white">
            <h5 class="mb-0">
              <i class="fas fa-calendar-day me-2"></i>Fecha {{ fecha.numero }}
            </h5>
          </div>
          <div class="card-body p-0">
            <div
              v-for="(partido, partidoIdx) in fecha.partidos"
              :key="partido.local + partido.visitante"
              class="p-4 border-bottom"
            >
              <div class="row align-items-center">
                <div class="col-md-6">
                  <div
                    class="d-flex align-items-center justify-content-between"
                  >
                    <div class="d-flex align-items-center">
                      <div class="avatar-sm me-3">
                        <i class="fas fa-shield-alt text-primary"></i>
                      </div>
                      <span class="fw-medium">{{ partido.local }}</span>
                    </div>
                    <div class="text-center mx-3">
                      <span class="badge bg-secondary rounded-pill px-3 py-2"
                        >VS</span
                      >
                    </div>
                    <div class="d-flex align-items-center">
                      <span class="fw-medium me-3">{{
                        partido.visitante
                      }}</span>
                      <div class="avatar-sm">
                        <i class="fas fa-shield-alt text-primary"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div
                    class="d-flex align-items-center justify-content-between"
                  >
                    <div class="flex-grow-1">
                      <span v-if="!partido.resultado" class="text-muted">
                        <i class="fas fa-clock me-1"></i>Sin resultado
                      </span>
                      <span v-else class="fw-bold fs-5">
                        {{ partido.resultado }}
                      </span>
                      <div v-if="partido.goleadores" class="mt-2">
                        <small class="text-muted">
                          <i class="fas fa-futbol me-1"></i>
                          <strong>Goleadores:</strong>
                          <span
                            v-for="(goles, nombre) in partido.goleadores"
                            :key="nombre"
                            v-if="goles > 0"
                            class="me-2"
                          >
                            {{ nombre }} ({{ goles }})
                          </span>
                        </small>
                      </div>
                    </div>
                    <!-- Solo el DT de ese equipo o el admin pueden cargar resultado -->
                    <div
                      v-if="
                        (user.rol === 'admin' ||
                          (user.rol === 'dt' &&
                            user.equipo &&
                            (partido.local === user.equipo ||
                              partido.visitante === user.equipo) &&
                            user.ligaId === liga.id)) &&
                        !partido.resultado
                      "
                      class="ms-3"
                    >
                      <div class="d-flex align-items-center">
                        <input
                          v-model="resultadosInputs[fechaIdx][partidoIdx]"
                          placeholder="2-1"
                          class="form-control form-control-sm me-2"
                          style="width: 80px"
                        />
                        <button
                          @click="
                            prepararAsignacionGoleadores(fechaIdx, partidoIdx)
                          "
                          class="btn btn-success btn-sm"
                        >
                          <i class="fas fa-save me-1"></i>Asignar Goleadores
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Asignación de goles a jugadores de ambos equipos -->
        <div v-if="asignandoGoleadores" class="card shadow-lg border-0 mb-4">
          <div class="card-header bg-warning text-dark">
            <h5 class="mb-0">
              <i class="fas fa-futbol me-2"></i>Asignar Goles a Jugadores
            </h5>
          </div>
          <div class="card-body p-4">
            <div class="row g-4">
              <div class="col-md-6">
                <div class="card border-primary">
                  <div class="card-header bg-primary text-white">
                    <h6 class="mb-0">{{ equipoLocal }}</h6>
                  </div>
                  <div class="card-body">
                    <div class="table-responsive">
                      <table class="table table-sm">
                        <thead>
                          <tr>
                            <th>Jugador</th>
                            <th class="text-center">Goles</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="j in golesLocal" :key="j.nombre">
                            <td>{{ j.nombre }}</td>
                            <td class="text-center">
                              <input
                                type="number"
                                min="0"
                                v-model.number="j.goles"
                                class="form-control form-control-sm text-center"
                                style="width: 80px"
                                :readonly="!puedeEditarEquipo(equipoLocal)"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="text-center mt-3">
                      <span
                        class="badge"
                        :class="
                          sumaGolesLocal === golesEsperadosLocal
                            ? 'bg-success'
                            : 'bg-danger'
                        "
                      >
                        Total: {{ sumaGolesLocal }} / {{ golesEsperadosLocal }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card border-primary">
                  <div class="card-header bg-primary text-white">
                    <h6 class="mb-0">{{ equipoVisitante }}</h6>
                  </div>
                  <div class="card-body">
                    <div class="table-responsive">
                      <table class="table table-sm">
                        <thead>
                          <tr>
                            <th>Jugador</th>
                            <th class="text-center">Goles</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="j in golesVisitante" :key="j.nombre">
                            <td>{{ j.nombre }}</td>
                            <td class="text-center">
                              <input
                                type="number"
                                min="0"
                                v-model.number="j.goles"
                                class="form-control form-control-sm text-center"
                                style="width: 80px"
                                :readonly="!puedeEditarEquipo(equipoVisitante)"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="text-center mt-3">
                      <span
                        class="badge"
                        :class="
                          sumaGolesVisitante === golesEsperadosVisitante
                            ? 'bg-success'
                            : 'bg-danger'
                        "
                      >
                        Total: {{ sumaGolesVisitante }} /
                        {{ golesEsperadosVisitante }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center mt-4">
              <button
                class="btn btn-success btn-lg me-3"
                @click="guardarResultadoConGoleadores"
                :disabled="
                  sumaGolesLocal !== golesEsperadosLocal ||
                  sumaGolesVisitante !== golesEsperadosVisitante
                "
              >
                <i class="fas fa-save me-2"></i>Guardar Resultado y Goleadores
              </button>
              <button
                class="btn btn-secondary btn-lg"
                @click="cancelarAsignacionGoleadores"
              >
                <i class="fas fa-times me-2"></i>Cancelar
              </button>
            </div>
          </div>
        </div>

        <!-- Tabla de goleadores del torneo -->
        <div v-if="tablaGoleadores.length" class="card shadow-sm border-0">
          <div class="card-header bg-danger text-white">
            <h5 class="mb-0">
              <i class="fas fa-crown me-2"></i>Goleadores del Torneo
            </h5>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th class="border-0 px-4 py-3">Pos</th>
                    <th class="border-0 px-4 py-3">Jugador</th>
                    <th class="border-0 px-4 py-3">Equipo</th>
                    <th class="border-0 px-4 py-3 text-center">Goles</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(g, index) in tablaGoleadores"
                    :key="g.nombre + g.equipo"
                    class="align-middle"
                  >
                    <td class="px-4 py-3">
                      <span
                        :class="getGoleadorClass(index + 1)"
                        class="badge rounded-pill"
                      >
                        {{ index + 1 }}
                      </span>
                    </td>
                    <td class="px-4 py-3 fw-medium">{{ g.nombre }}</td>
                    <td class="px-4 py-3">
                      <span class="badge bg-primary rounded-pill">{{
                        g.equipo
                      }}</span>
                    </td>
                    <td class="px-4 py-3 text-center fw-bold fs-5">
                      {{ g.goles }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-lg-6">
        <div class="text-center">
          <div class="mb-4">
            <i
              class="fas fa-exclamation-triangle text-warning"
              style="font-size: 4rem"
            ></i>
          </div>
          <h4 class="text-muted mb-3">Liga no encontrada</h4>
          <p class="text-muted">
            La liga solicitada no existe o no está disponible
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../store/user";
import { useLigasStore } from "../store/ligas";

const route = useRoute();
const ligasStore = useLigasStore();
const store = useUserStore();
const { user } = store;
const ligaId = Number(route.params.id);
const liga = computed(() => ligasStore.ligas.find((l) => l.id === ligaId));

const nuevoEquipo = ref("");

// Nombre editable
const editandoNombre = ref(false);
const nuevoNombreLiga = ref("");
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
    resultadosInputs.value = fechas.map((fecha) =>
      fecha.partidos.map((partido) => partido.resultadoInput || "")
    );
  },
  { immediate: true, deep: true }
);

// Tabla de posiciones computada
const tablaPosiciones = computed(() => {
  if (!liga.value) return [];
  const tabla = liga.value.equipos.map((nombre) => ({
    nombre,
    puntos: 0,
    jugados: 0,
    ganados: 0,
    empatados: 0,
    perdidos: 0,
    gf: 0,
    gc: 0,
  }));

  liga.value.fechas.forEach((fecha) => {
    fecha.partidos.forEach((partido) => {
      if (partido.resultado) {
        const [golesLocal, golesVisitante] = partido.resultado
          .split("-")
          .map(Number);
        const local = tabla.find((e) => e.nombre === partido.local);
        const visitante = tabla.find((e) => e.nombre === partido.visitante);

        local.jugados++;
        visitante.jugados++;
        local.gf += golesLocal;
        local.gc += golesVisitante;
        visitante.gf += golesVisitante;
        visitante.gc += golesLocal;

        if (golesLocal > golesVisitante) {
          local.ganados++;
          local.puntos += 3;
          visitante.perdidos++;
        } else if (golesLocal < golesVisitante) {
          visitante.ganados++;
          visitante.puntos += 3;
          local.perdidos++;
        } else {
          local.empatados++;
          visitante.empatados++;
          local.puntos++;
          visitante.puntos++;
        }
      }
    });
  });

  return tabla.sort(
    (a, b) => b.puntos - a.puntos || b.gf - b.gc - (a.gf - a.gc) || b.gf - a.gf
  );
});

// Agregar equipo
function agregarEquipo() {
  if (!liga.value) return;
  const nombre = nuevoEquipo.value.trim();
  if (nombre && !liga.value.equipos.includes(nombre)) {
    ligasStore.addEquipo(ligaId, nombre);
    nuevoEquipo.value = "";
  }
}

// Borrar equipo
function borrarEquipo(nombre) {
  if (!liga.value) return;
  if (confirm("¿Borrar equipo?")) {
    ligasStore.removeEquipo(ligaId, nombre);
  }
}

// Generar fixture round-robin
function generarFixture() {
  if (!liga.value) return;
  const eqs = [...liga.value.equipos];
  if (eqs.length % 2 !== 0) eqs.push("Libre");
  const n = eqs.length;
  const totalFechas = n - 1;
  const partidosPorFecha = n / 2;
  const fixture = [];

  for (let f = 0; f < totalFechas; f++) {
    const partidos = [];
    for (let p = 0; p < partidosPorFecha; p++) {
      const local = eqs[p];
      const visitante = eqs[n - 1 - p];
      if (local !== "Libre" && visitante !== "Libre") {
        partidos.push({
          local,
          visitante,
          resultado: null,
          goleadores: null,
        });
      }
    }
    fixture.push({ numero: f + 1, partidos });
    eqs.splice(1, 0, eqs.pop());
  }
  ligasStore.setFechas(ligaId, fixture);
  resultadosInputs.value = fixture.map((fecha) => fecha.partidos.map(() => ""));
}

// Estado para asignar goles a jugadores de ambos equipos
const asignandoGoleadores = ref(false);
const partidoCargando = ref(null);
const fechaCargando = ref(null);
const golesLocal = ref([]);
const golesVisitante = ref([]);
const equipoLocal = ref("");
const equipoVisitante = ref("");
const golesEsperadosLocal = ref(0);
const golesEsperadosVisitante = ref(0);

function puedeEditarEquipo(equipo) {
  return (
    user.rol === "admin" ||
    (user.rol === "dt" && user.equipo === equipo && user.ligaId === ligaId)
  );
}

function prepararAsignacionGoleadores(fechaIdx, partidoIdx) {
  const partido = liga.value.fechas[fechaIdx].partidos[partidoIdx];
  partidoCargando.value = partido;
  fechaCargando.value = fechaIdx;
  equipoLocal.value = partido.local;
  equipoVisitante.value = partido.visitante;
  // Extrae goles del resultado (ej: "4-2")
  const [golesL, golesV] = (resultadosInputs.value[fechaIdx][partidoIdx] || "")
    .split("-")
    .map(Number);
  golesEsperadosLocal.value = isNaN(golesL) ? 0 : golesL;
  golesEsperadosVisitante.value = isNaN(golesV) ? 0 : golesV;
  // Busca planteles
  const plantelLocal = liga.value.planteles?.find(
    (p) => p.equipo === partido.local
  );
  const plantelVisitante = liga.value.planteles?.find(
    (p) => p.equipo === partido.visitante
  );
  golesLocal.value = plantelLocal
    ? plantelLocal.jugadores.map((j) => ({ nombre: j.nombre, goles: 0 }))
    : [];
  golesVisitante.value = plantelVisitante
    ? plantelVisitante.jugadores.map((j) => ({ nombre: j.nombre, goles: 0 }))
    : [];
  asignandoGoleadores.value = true;
}

const sumaGolesLocal = computed(() =>
  golesLocal.value.reduce((acc, j) => acc + Number(j.goles), 0)
);
const sumaGolesVisitante = computed(() =>
  golesVisitante.value.reduce((acc, j) => acc + Number(j.goles), 0)
);

function guardarResultadoConGoleadores() {
  if (
    sumaGolesLocal.value !== golesEsperadosLocal.value ||
    sumaGolesVisitante.value !== golesEsperadosVisitante.value
  ) {
    alert("La suma de goles asignados no coincide con el resultado.");
    return;
  }
  // Guarda el resultado
  const fechaIdx = fechaCargando.value;
  const partidoIdx = liga.value.fechas[fechaIdx].partidos.indexOf(
    partidoCargando.value
  );
  ligasStore.setResultado(
    ligaId,
    fechaIdx,
    partidoIdx,
    resultadosInputs.value[fechaIdx][partidoIdx]
  );
  // Guarda los goleadores
  partidoCargando.value.goleadores = {};
  golesLocal.value.forEach((j) => {
    if (j.goles > 0)
      partidoCargando.value.goleadores[
        j.nombre + " (" + equipoLocal.value + ")"
      ] = Number(j.goles);
  });
  golesVisitante.value.forEach((j) => {
    if (j.goles > 0)
      partidoCargando.value.goleadores[
        j.nombre + " (" + equipoVisitante.value + ")"
      ] = Number(j.goles);
  });
  ligasStore.ligas = [...ligasStore.ligas];
  // Limpiar estado
  asignandoGoleadores.value = false;
  partidoCargando.value = null;
  fechaCargando.value = null;
  golesLocal.value = [];
  golesVisitante.value = [];
  equipoLocal.value = "";
  equipoVisitante.value = "";
  golesEsperadosLocal.value = 0;
  golesEsperadosVisitante.value = 0;
}

function cancelarAsignacionGoleadores() {
  asignandoGoleadores.value = false;
  partidoCargando.value = null;
  fechaCargando.value = null;
  golesLocal.value = [];
  golesVisitante.value = [];
  equipoLocal.value = "";
  equipoVisitante.value = "";
  golesEsperadosLocal.value = 0;
  golesEsperadosVisitante.value = 0;
}

// Tabla de goleadores del torneo
const tablaGoleadores = computed(() => {
  if (!liga.value) return [];
  const goles = {};
  liga.value.fechas.forEach((fecha) => {
    fecha.partidos.forEach((partido) => {
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
        : { nombre: nombreEquipo, equipo: "", goles };
    })
    .sort((a, b) => b.goles - a.goles || a.nombre.localeCompare(b.nombre));
});

// Selección de equipo para DT
const equipoSeleccionado = ref("");
function asignarEquipoDT() {
  if (equipoSeleccionado.value) {
    store.setEquipoDT(equipoSeleccionado.value, liga.value.id);
  }
}

// Funciones de utilidad para estilos
function getRolClass(rol) {
  return rol === "admin" ? "bg-danger" : "bg-info";
}

function getPosicionClass(posicion) {
  if (posicion === 1) return "bg-warning text-dark";
  if (posicion === 2) return "bg-secondary text-white";
  if (posicion === 3) return "bg-info text-white";
  return "bg-light text-dark";
}

function getGoleadorClass(posicion) {
  if (posicion === 1) return "bg-warning text-dark";
  if (posicion === 2) return "bg-secondary text-white";
  if (posicion === 3) return "bg-info text-white";
  return "bg-light text-dark";
}
</script>

<style scoped>
.text-primary {
  color: #667eea !important;
}

.bg-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.bg-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
}

.bg-info {
  background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%) !important;
}

.bg-danger {
  background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%) !important;
}

.bg-warning {
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%) !important;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(40, 167, 69, 0.3);
}

.btn-outline-primary {
  border-color: #667eea;
  color: #667eea;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  transform: translateY(-2px);
}

.card {
  border-radius: 15px;
  overflow: hidden;
}

.table {
  margin-bottom: 0;
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
}

.avatar-sm {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.form-control,
.form-select {
  border-radius: 10px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.badge {
  font-weight: 600;
  padding: 0.5em 1em;
}
</style>
