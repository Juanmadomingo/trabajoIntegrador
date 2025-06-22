<template>
  <div class="main-container">
    <div class="main-content">
      <div class="custom-card fade-in">
        <div class="page-header">
          <div class="empty-icon">
            <i class="fas fa-trophy"></i>
          </div>
          <h1 class="page-title">Liga Virtual</h1>
          <p class="page-subtitle">Bienvenido al sistema de gestión de ligas de fútbol virtual</p>
          <router-link to="/ligas" class="btn-custom">
            <i class="fas fa-list me-2"></i>Ver Ligas
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup></script>

<style scoped>
.main-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.empty-icon {
  color: var(--warning-color);
}
</style>