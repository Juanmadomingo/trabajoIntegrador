import { defineStore } from 'pinia';

const STORAGE_KEY = 'usuarios';

function loadUsuarios() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveUsuarios(usuarios) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    usuarios: loadUsuarios()
  }),
  getters: {
    isLogged: (state) => !!state.user,
    isAdmin: (state) => state.user?.rol === 'admin',
    isDT: (state) => state.user?.rol === 'dt',
    isUser: (state) => state.user?.rol === 'user',
  },
  actions: {
    register({ nombre, dni, password, rol }) {
      if (this.usuarios.find(u => u.dni === dni)) throw new Error('DNI ya registrado');
      this.usuarios.push({ nombre, dni, password, rol, equipo: null });
      saveUsuarios(this.usuarios);
    },
    login(dni, password) {
      const u = this.usuarios.find(u => u.dni === dni && u.password === password);
      if (!u) throw new Error('Credenciales incorrectas');
      this.user = { ...u };
    },
    logout() {
      this.user = null;
    },
    setEquipoDT(equipo, ligaId) {
      if (this.user && this.user.rol === 'dt') {
        this.user.equipo = equipo;
        this.user.ligaId = ligaId;
        // Actualiza en usuarios persistidos
        const idx = this.usuarios.findIndex(u => u.dni === this.user.dni);
        if (idx !== -1) {
          this.usuarios[idx].equipo = equipo;
          this.usuarios[idx].ligaId = ligaId;
          saveUsuarios(this.usuarios);
        }
      }
    }
  }
});