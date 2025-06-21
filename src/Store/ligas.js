import { defineStore } from 'pinia';

const STORAGE_KEY = 'ligas';

function loadLigas() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveLigas(ligas) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ligas));
}

export const useLigasStore = defineStore('ligas', {
  state: () => ({
    ligas: loadLigas()
  }),
  actions: {
    addLiga(nombre) {
      const id = Date.now();
      this.ligas.push({ id, nombre, equipos: [], fechas: [], planteles: [] });
      saveLigas(this.ligas);
    },
    removeLiga(id) {
      this.ligas = this.ligas.filter(l => l.id !== id);
      saveLigas(this.ligas);
    },
    addEquipo(ligaId, nombreEquipo) {
      const liga = this.ligas.find(l => l.id === ligaId);
      if (liga && !liga.equipos.includes(nombreEquipo)) {
        liga.equipos.push(nombreEquipo);
        // Crear plantel vacío para el equipo
        if (!liga.planteles) liga.planteles = [];
        if (!liga.planteles.find(p => p.equipo === nombreEquipo)) {
          liga.planteles.push({ equipo: nombreEquipo, jugadores: [] });
        }
        saveLigas(this.ligas);
      }
    },
    removeEquipo(ligaId, nombreEquipo) {
      const liga = this.ligas.find(l => l.id === ligaId);
      if (liga) {
        liga.equipos = liga.equipos.filter(e => e !== nombreEquipo);
        if (liga.planteles) {
          liga.planteles = liga.planteles.filter(p => p.equipo !== nombreEquipo);
        }
        saveLigas(this.ligas);
      }
    },
    setFechas(ligaId, fechas) {
      const liga = this.ligas.find(l => l.id === ligaId);
      if (liga) {
        liga.fechas = fechas;
        saveLigas(this.ligas);
      }
    },
    setResultado(ligaId, fechaIdx, partidoIdx, resultado) {
      const liga = this.ligas.find(l => l.id === ligaId);
      if (liga && liga.fechas[fechaIdx] && liga.fechas[fechaIdx].partidos[partidoIdx]) {
        liga.fechas[fechaIdx].partidos[partidoIdx].resultado = resultado;
        saveLigas(this.ligas);
      }
    },
    // PLANTELES
    addJugador(ligaId, equipo, jugador) {
      const liga = this.ligas.find(l => l.id === ligaId);
      if (!liga) return;
      if (!liga.planteles) liga.planteles = [];
      let plantel = liga.planteles.find(p => p.equipo === equipo);
      if (!plantel) {
        plantel = { equipo, jugadores: [] };
        liga.planteles.push(plantel);
      }
      plantel.jugadores.push(jugador);
      saveLigas(this.ligas);
    },
    removeJugador(ligaId, equipo, nombreJugador) {
      const liga = this.ligas.find(l => l.id === ligaId);
      if (!liga || !liga.planteles) return;
      const plantel = liga.planteles.find(p => p.equipo === equipo);
      if (plantel) {
        plantel.jugadores = plantel.jugadores.filter(j => j.nombre !== nombreJugador);
        saveLigas(this.ligas);
      }
    },
    updateNombreLiga(ligaId, nuevoNombre) {
      const liga = this.ligas.find(l => l.id === ligaId);
      if (liga) {
        liga.nombre = nuevoNombre;
        saveLigas(this.ligas);
      }
    },
    reload() {
      this.ligas = loadLigas();
    }
  }
});