<template>
  <div v-if="liga" class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-lg-12">
        <!-- Header -->
        <div class="text-center mb-5">
          <h1 class="display-5 fw-bold text-primary mb-3">
            <i class="fas fa-trophy me-3"></i>{{ liga.nombre }}
          </h1>
          <p class="lead text-muted">Gestiona equipos, fechas y resultados de la liga</p>
        </div>

        <!-- Información de la liga -->
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="card shadow-sm border-0 h-100">
              <div class="card-body p-4">
                <h5 class="card-title text-primary mb-3">
                  <i class="fas fa-info-circle me-2"></i>Información de la Liga
                </h5>
                <div class="mb-3">
                  <strong>ID:</strong> {{ liga.id }}
                </div>
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
                  <span :class="getRolClass(user.rol)" class="badge rounded-pill ms-2">
                    {{ user.rol.toUpperCase() }}
                  </span>
                </div>
                <div v-if="user.rol === 'dt' && user.equipo" class="mb-3">
                  <strong>Equipo:</strong> 
                  <span class="badge bg-primary rounded-pill ms-2">{{ user.equipo }}</span>
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
                    <button @click="editarNombreLiga" class="btn btn-outline-primary btn-sm">
                      <i class="fas fa-edit me-1"></i>Editar
                    </button>
                  </div>
                </template>
              </div>
              <div v-if="editandoNombre" class="col-md-4">
                <button @click="guardarNombreLiga" class="btn btn-success btn-sm me-2">
                  <i class="fas fa-check me-1"></i>Guardar
                </button>
                <button @click="cancelarEdicionNombre" class="btn btn-secondary btn-sm">
                  <i class="fas fa-times me-1"></i>Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Agregar equipo (solo admin, solo si no hay fixture generado) -->
        <div v-if="user.rol === 'admin' && !liga.fechas.length" class="card shadow-sm border-0 mb-4">
          <div class="card-body p-4">
            <h5 class="card-title text-primary mb-3">
              <i class="fas fa-plus-circle me-2"></i>Agregar Equipo
            </h5>
            <div class="row g-3">
              <div class="col-md-8">
                <input v-model="nuevoEquipo" placeholder="Nombre del equipo" class="form-control" />
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
              <div v-for="equipo in liga.equipos" :key="equipo" class="col-md-6 col-lg-4">
                <div class="p-3 border-bottom border-end">
                  <div class="d-flex justify-content-between align-items-center">
                    <router-link :to="`/ligas/${liga.id}/plantel/${encodeURIComponent(equipo)}`" 
                                class="text-decoration-none">
                      <div class="d-flex align-items-center">
                        <div class="avatar-sm me-3">
                          <i class="fas fa-shield-alt text-primary"></i>
                        </div>
                        <span class="fw-medium text-dark">{{ equipo }}</span>
                      </div>
                    </router-link>
                    <button v-if="user.rol === 'admin' && !liga.fechas.length"
                            @click="borrarEquipo(equipo)"
                            class="btn btn-outline-danger btn-sm">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Selección de equipo para DT -->
        <div v-if="user.rol === 'dt' && (!user.equipo || user.ligaId !== liga.id)" class="card shadow-sm border-0 mb-4">
          <div class="card-body p-4">
            <h5 class="card-title text-primary mb-3">
              <i class="fas fa-hand-pointer me-2"></i>Selecciona tu Equipo
            </h5>
            <div class="row g-3">
              <div class="col-md-8">
                <select v-model="equipoSeleccionado" class="form-select">
                  <option value="">Selecciona un equipo...</option>
                  <option v-for="equipo in liga.equipos" :key="equipo" :value="equipo">{{ equipo }}</option>
                </select>
              </div>
              <div class="col-md-4">
                <button @click="asignarEquipoDT" class="btn btn-primary w-100" :disabled="!equipoSeleccionado">
                  <i class="fas fa-check me-2"></i>Asignar
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="user.rol === 'dt' && user.ligaId === liga.id" class="card shadow-sm border-0 mb-4">
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
                  <tr v-for="(equipo, index) in tablaPosiciones" :key="equipo.nombre" class="align-middle">
                    <td class="px-4 py-3">
                      <span :class="getPosicionClass(index + 1)" class="badge rounded-pill">
                        {{ index + 1 }}
                      </span>
                    </td>
                    <td class="px-4 py-3 fw-medium">{{ equipo.nombre }}</td>
                    <td class="px-4 py-3 text-center fw-bold">{{ equipo.puntos }}</td>
                    <td class="px-4 py-3 text-center">{{ equipo.jugados }}</td>
                    <td class="px-4 py-3 text-center text-success">{{ equipo.ganados }}</td>
                    <td class="px-4 py-3 text-center text-warning">{{ equipo.empatados }}</td>
                    <td class="px-4 py-3 text-center text-danger">{{ equipo.perdidos }}</td>
                    <td class="px-4 py-3 text-center">{{ equipo.gf }}</td>
                    <td class="px-4 py-3 text-center">{{ equipo.gc }}</td>
                    <td class="px-4 py-3 text-center" :class="equipo.gf - equipo.gc > 0 ? 'text-success' : equipo.gf - equipo.gc < 0 ? 'text-danger' : 'text-muted'">
                      {{ equipo.gf - equipo.gc }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Generar fixture (solo admin, solo si hay equipos y aún no hay fechas) -->
        <div v-if="user.rol === 'admin' && liga.equipos.length > 1 && liga.fechas.length === 0" class="text-center mb-4">
          <button @click="generarFixture" class="btn btn-primary btn-lg">
            <i class="fas fa-calendar-plus me-2"></i>Generar Fechas (Fixture)
          </button>
        </div>

        <!-- Fechas y partidos -->
        <div v-for="(fecha, fechaIdx) in liga.fechas" :key="fecha.numero" class="card shadow-sm border-0 mb-4">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0">
              <i class="fas fa-calendar-day me-2"></i>Fecha {{ fecha.numero }}
            </h5>
          </div>
          <div class="card-body p-0">
            <div v-for="(partido, partidoIdx) in fecha.partidos" :key="partido.local + partido.visitante" 
                 class="p-4 border-bottom">
              <div class="row align-items-center">
                <div class="col-md-6">
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                      <div class="avatar-sm me-3">
                        <i class="fas fa-shield-alt text-primary"></i>
                      </div>
                      <span class="fw-medium">{{ partido.local }}</span>
                    </div>
                    <div class="text-center mx-3">
                      <span class="badge bg-secondary rounded-pill px-3 py-2">VS</span>
                    </div>
                    <div class="d-flex align-items-center">
                      <span class="fw-medium me-3">{{ partido.visitante }}</span>
                      <div class="avatar-sm">
                        <i class="fas fa-shield-alt text-primary"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center justify-content-between">
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
                          <span v-for="(goles, nombre) in partido.goleadores" :key="nombre" v-if="goles > 0" class="me-2">
                            {{ nombre }} ({{ goles }})
                          </span>
                        </small>
                      </div>
                    </div>
                    <!-- Solo el DT de ese equipo o el admin pueden cargar resultado -->
                    <div v-if="(
                      (user.rol === 'admin') ||
                      (user.rol === 'dt' && user.equipo && (partido.local === user.equipo || partido.visitante === user.equipo) && user.ligaId === liga.id)
                    ) && !partido.resultado" class="ms-3">
                      <div class="d-flex align-items-center">
                        <input v-model="resultadosInputs[fechaIdx][partidoIdx]" 
                               placeholder="2-1" 
                               class="form-control form-control-sm me-2" 
                               style="width: 80px;" />
                        <button @click="prepararAsignacionGoleadores(fechaIdx, partidoIdx)" 
                                class="btn btn-success btn-sm">
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
                              <input type="number" min="0" v-model.number="j.goles" 
                                     class="form-control form-control-sm text-center" 
                                     style="width: 80px;"
                                     :readonly="!puedeEditarEquipo(equipoLocal)" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="text-center mt-3">
                      <span class="badge" :class="sumaGolesLocal === golesEsperadosLocal ? 'bg-success' : 'bg-danger'">
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
                              <input type="number" min="0" v-model.number="j.goles" 
                                     class="form-control form-control-sm text-center" 
                                     style="width: 80px;"
                                     :readonly="!puedeEditarEquipo(equipoVisitante)" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="text-center mt-3">
                      <span class="badge" :class="sumaGolesVisitante === golesEsperadosVisitante ? 'bg-success' : 'bg-danger'">
                        Total: {{ sumaGolesVisitante }} / {{ golesEsperadosVisitante }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center mt-4">
              <button class="btn btn-success btn-lg me-3"
                @click="guardarResultadoConGoleadores"
                :disabled="sumaGolesLocal !== golesEsperadosLocal || sumaGolesVisitante !== golesEsperadosVisitante">
                <i class="fas fa-save me-2"></i>Guardar Resultado y Goleadores
              </button>
              <button class="btn btn-secondary btn-lg" @click="cancelarAsignacionGoleadores">
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
                  <tr v-for="(g, index) in tablaGoleadores" :key="g.nombre + g.equipo" class="align-middle">
                    <td class="px-4 py-3">
                      <span :class="getGoleadorClass(index + 1)" class="badge rounded-pill">
                        {{ index + 1 }}
                      </span>
                    </td>
                    <td class="px-4 py-3 fw-medium">{{ g.nombre }}</td>
                    <td class="px-4 py-3">
                      <span class="badge bg-primary rounded-pill">{{ g.equipo }}</span>
                    </td>
                    <td class="px-4 py-3 text-center fw-bold fs-5">{{ g.goles }}</td>
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
            <i class="fas fa-exclamation-triangle text-warning" style="font-size: 4rem;"></i>
          </div>
          <h4 class="text-muted mb-3">Liga no encontrada</h4>
          <p class="text-muted">La liga solicitada no existe o no está disponible</p>
        </div>
      </div>
    </div>
  </div>
</template> 