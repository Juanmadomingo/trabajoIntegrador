<template>
  <div>
    <router-link :to="'/ligas/' + liga.id">
      <h2>{{ liga.nombre }}</h2>
    </router-link>
  </div>
</template>

<script>
export default {
  props: ['liga']
};
</script>