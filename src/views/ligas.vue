<template>
  <div>
    <h2>Ligas disponibles</h2>
    <div v-if="user.rol === 'admin'" style="margin-bottom:1em;">
      <input v-model="nuevaLiga" placeholder="Nombre de la liga" />
      <button @click="crearLiga">Crear liga</button>
    </div>
    <ul>
      <li v-for="liga in ligasStore.ligas" :key="liga.id">
        <router-link :to="'/ligas/' + liga.id">{{ liga.nombre }}</router-link>
        <button v-if="user.rol === 'admin'" @click="borrarLiga(liga.id)" style="margin-left:1em;">Borrar</button>
      </li>
    </ul>
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