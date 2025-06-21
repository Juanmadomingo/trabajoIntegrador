<template>
  <div>
    <h3>Fecha {{ fecha.numero }}</h3>
    <div v-for="partido in fecha.partidos" :key="partido.local + partido.visitante">
      <span>{{ partido.local }} vs {{ partido.visitante }}</span>
      <span v-if="!partido.resultado"> - Sin resultado</span>
      <span v-else> - {{ partido.resultado }}</span>

      <div v-if="rol === 'dt' && !partido.resultado">
        <input v-model="resultado" placeholder="Resultado (ej: 2-1)" />
        <button @click="guardarResultado(partido)">Guardar</button>
      </div>
   <div v-if="rol === 'admin'">
  <!-- Controles de administración -->
</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['fecha', 'rol'],
  data() {
    return {
      resultado: ''
    };
  },
  methods: {
    guardarResultado(partido) {
      partido.resultado = this.resultado;
      this.resultado = '';
    }
  }
};
</script>