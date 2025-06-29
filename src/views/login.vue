<template>
  <div class="login-page">
    <div class="login-container">
      <div v-if="showRegister">
        <h3>Crear cuenta</h3>
        <input v-model="regNombre" placeholder="Nombre" />
        <input v-model="regDni" placeholder="DNI" />
        <input v-model="regPassword" type="password" placeholder="Contraseña" />
        <select v-model="regRol">
          <option value="user">Usuario</option>
          <option value="dt">DT</option>
          <option value="admin">Admin</option>
        </select>
        <button @click="register">Registrar</button>
        <button @click="showRegister = false" class="btn-secondary">
          Ya tengo cuenta
        </button>
        <p v-if="regError" style="color: red">{{ regError }}</p>
      </div>
      <div v-else>
        <h3>Iniciar sesión</h3>
        <input v-model="loginDni" placeholder="DNI" />
        <input
          v-model="loginPassword"
          type="password"
          placeholder="Contraseña"
        />
        <button @click="login">Entrar</button>
        <button @click="showRegister = true" class="btn-secondary">
          Crear cuenta
        </button>
        <p v-if="loginError" style="color: red">{{ loginError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "../store/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

const store = useUserStore();
const router = useRouter();
const { user } = storeToRefs(store);

const showRegister = ref(false);

// Registro
const regNombre = ref("");
const regDni = ref("");
const regPassword = ref("");
const regRol = ref("user");
const regError = ref("");

// Login
const loginDni = ref("");
const loginPassword = ref("");
const loginError = ref("");

function register() {
  try {
    store.register({
      nombre: regNombre.value,
      dni: regDni.value,
      password: regPassword.value,
      rol: regRol.value,
    });
    regError.value = "";
    showRegister.value = false;
    // Limpia campos
    regNombre.value = "";
    regDni.value = "";
    regPassword.value = "";
    regRol.value = "user";
    // Redirige al home después del registro
    router.push("/");
  } catch (e) {
    regError.value = e.message;
  }
}

function login() {
  try {
    store.login(loginDni.value, loginPassword.value);
    loginError.value = "";
    // Limpia campos
    loginDni.value = "";
    loginPassword.value = "";
    // Redirige al home después del login
    router.push("/");
  } catch (e) {
    loginError.value = e.message;
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 70px);
  background-image: url("/images/loginBG.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px;
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(60, 60, 120, 0.15);
  padding: 2.5em 2em 2em 2em;
  max-width: 350px;
  width: 100%;
}

.login-container h3 {
  margin-bottom: 1em;
  color: #3a3a6a;
  font-weight: 700;
  letter-spacing: 1px;
}

.login-container input,
.login-container select {
  width: 100%;
  padding: 0.7em 1em;
  margin-bottom: 1em;
  border: 1px solid #bdbdbd;
  border-radius: 6px;
  font-size: 1em;
  background: #f7f7fa;
  transition: border 0.2s;
}

.login-container input:focus,
.login-container select:focus {
  border: 1.5px solid #646cff;
  outline: none;
}

.login-container button {
  width: 100%;
  margin-bottom: 0.7em;
  padding: 0.7em 0;
  border-radius: 6px;
  border: none;
  background: #646cff;
  color: #fff;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  box-shadow: 0 2px 8px rgba(100, 108, 255, 0.08);
}

.login-container button:hover {
  background: #535bf2;
}

.login-container .btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.login-container .btn-secondary:hover {
  background: #bdbdbd;
}

.login-container p {
  margin: 0.5em 0 0 0;
  color: #d32f2f;
  font-size: 0.98em;
  text-align: center;
}
</style>
