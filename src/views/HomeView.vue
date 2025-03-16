<template>
  <div class="min-h-screen bg-gradient-to-t from-yellow-300 to-purple-400 flex flex-col items-center justify-center pt-0 p-8">
    <div v-if="userStore.statusMessage" class="status-info text-center mb-4 p-4 bg-green-500 text-white rounded-lg shadow-lg animate__animated animate__fadeInDown">
      {{ userStore.statusMessage }}
    </div>

    <h1 class="text-xl font-bold mb-8 animate__animated animate__fadeInDown">
      Введи свою дату рождения
    </h1>
    <div class="bg-gradient-to-b from-yellow-200 to-purple-200 rounded-lg shadow-lg p-6 max-w-md w-full animate__animated animate__slideInUp">
      <div class="flex items-center justify-center p-2 space-x-2 mt-8 mb-8">
        <select v-model="selectedDay" class="p-2 border rounded-lg animate__animated animate__fadeInLeft animate__delay-1s">
          <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
        </select>
        <select v-model="selectedMonth" class="p-2 border rounded-lg animate__animated animate__fadeInLeft animate__delay-1s">
          <option v-for="(month, index) in months" :key="index" :value="index + 1">{{ month }}</option>
        </select>
        <select v-model="selectedYear" class="p-2 border rounded-lg animate__animated animate__fadeInLeft animate__delay-1s">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
      <div class="mt-4 mb-8 p-4 bg-yellow-300 rounded-lg text-center animate__animated animate__fadeInUp animate__delay-2s">
        <p class="text-black-600 font-bold">Выбрано: {{ userStore.formattedDate }}</p>
      </div>
      <button
          class="mb-8 w-full bg-yellow-400 text-black py-2 px-4 rounded-lg hover:font-semibold transition-colors animate__animated animate__fadeInUp animate__delay-2s"
          @click="continueToNextStep"
      >
        Продолжить
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

const router = useRouter();
const userStore = useUserStore();

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];
const years = Array.from({ length: 95 }, (_, i) => 1930 + i);

const selectedDay = ref<number>(1);
const selectedMonth = ref<number>(1);
const selectedYear = ref<number>(1990);

const calculateAge = (birthYear: number, birthMonth: number, birthDay: number): number => {
  const today = new Date();
  let age = today.getFullYear() - birthYear;
  const hasBirthdayPassed =
      today.getMonth() > birthMonth - 1 ||
      (today.getMonth() === birthMonth - 1 && today.getDate() >= birthDay);
  if (!hasBirthdayPassed) age--;
  return age;
};

const continueToNextStep = async (): Promise<void> => {
  try {
    const response = await axios.post(`api/users/update_birthday`, {
      date_of_birth: userStore.formattedDate,
      age: calculateAge(selectedYear.value, selectedMonth.value, selectedDay.value),
      telegram_id: userStore.telegramId,
    });
    userStore.setBirthDate(selectedDay.value, selectedMonth.value, selectedYear.value);
    userStore.setStatusMessage(response.data); // Используем метод из хранилища
    setTimeout(() => {
      userStore.setStatusMessage("");
      router.push(`/${userStore.telegramId}`);
    }, 3000);
  } catch (error) {
    userStore.setStatusMessage(error instanceof Error ? 'Error: ' + error.message : 'An unknown error occurred');
    setTimeout(() => userStore.setStatusMessage(""), 3000);
  }
};

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const newTelegramId = urlParams.get('telegramId');
  if (newTelegramId) {
    userStore.setTelegramId(newTelegramId);
  } else if (!userStore.telegramId) {
    userStore.setStatusMessage('Something went wrong. Please sign in via our telegram bot!');
    setTimeout(() => userStore.setStatusMessage(""), 1000);
  }
});
</script>

<style scoped>
select:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}

button:hover {
  transform: translateY(-4px);
  transition: transform 0.2s ease-in-out;
}

.status-info {
  position: fixed;
  top: 7%;
  z-index: 1000;
}
</style>