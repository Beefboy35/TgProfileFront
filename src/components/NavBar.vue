<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const shareLink = ref<string>('');

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const newTelegramId = urlParams.get('telegramId');
  if (newTelegramId) {
    userStore.setTelegramId(newTelegramId);
    shareLink.value = `/${newTelegramId}`;
  }
});
</script>

<template>
  <nav class="hidden">
    <router-link to="/" class="material-icons mr-20">home</router-link>
    <router-link :to="shareLink" class="material-icons">share</router-link>
  </nav>
</template>