<template>
  <div class="min-h-screen bg-gradient-to-t from-yellow-300 to-purple-400 flex flex-col items-center justify-center pt-0 p-8">
    <!-- Блок status-info -->
    <div
        v-if="statusMessage"
        class="status-info text-center mb-4 p-4 bg-green-500 text-white rounded-lg shadow-lg animate__animated animate__fadeInDown"
    >
      {{ statusMessage }}
    </div>

    <h1 class="text-xl font-bold mb-8 animate__animated animate__fadeInDown">
      Введи свою дату рождения
    </h1>
    <div
        class="bg-gradient-to-b from-yellow-200 to-purple-200 rounded-lg shadow-lg p-6 max-w-md w-full animate__animated animate__slideInUp"
    >
      <!-- Компонент для выбора даты -->
      <div class="flex items-center justify-center p-2 space-x-2 mt-8 mb-8">
        <!-- День -->
        <select
            v-model="selectedDay"
            class="p-2 border rounded-lg animate__animated animate__fadeInLeft animate__delay-1s"
        >
          <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
        </select>
        <!-- Месяц -->
        <select
            v-model="selectedMonth"
            class="p-2 border rounded-lg animate__animated animate__fadeInLeft animate__delay-1s"
        >
          <option v-for="(month, index) in months" :key="index" :value="index + 1">{{ month }}</option>
        </select>
        <!-- Год -->
        <select
            v-model="selectedYear"
            class="p-2 border rounded-lg animate__animated animate__fadeInLeft animate__delay-1s"
        >
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
      <!-- Прямоугольник с выбранной датой -->
      <div
          class="mt-4 mb-8 p-4 bg-yellow-300 rounded-lg text-center animate__animated animate__fadeInUp animate__delay-2s"
      >
        <p class="text-black-600 font-bold">
          Выбрано: {{ formattedDate }}
        </p>
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
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from "vue-router";

const router = useRouter();
const days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
const months: string[] = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];
const years: number[] = Array.from({ length: 95 }, (_, i) => 1930 + i);

const selectedDay = ref<number>(1);
const selectedMonth = ref<number>(1);
const selectedYear = ref<number>(1990);
const telegramId = ref<string | null>(null);
const statusMessage = ref<string | null>(null); // Сообщение от API

const formattedDate = computed<string>(() => {
  const day = String(selectedDay.value).padStart(2, '0');
  const month = String(selectedMonth.value).padStart(2, '0');
  const year = selectedYear.value;
  return `${year}.${month}.${day}`;
});

const calculateAge = (birthYear: number, birthMonth: number, birthDay: number): number => {
  const today = new Date();
  let age = today.getFullYear() - birthYear;

  const hasBirthdayPassed =
      today.getMonth() > birthMonth - 1 ||
      (today.getMonth() === birthMonth - 1 && today.getDate() >= birthDay);

  if (!hasBirthdayPassed) {
    age--;
  }

  return age;
};

const continueToNextStep = async (): Promise<void> => {
  try {
    //const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.post(`api/users/update_birthday`, {
      date_of_birth: formattedDate.value,
      age: calculateAge(selectedYear.value, selectedMonth.value, selectedDay.value),
      telegram_id: telegramId.value,
    });
    localStorage.setItem("birth's year", selectedYear.value.toString());
    localStorage.setItem("birth's month", selectedMonth.value.toString());
    localStorage.setItem("birth's day", selectedDay.value.toString());
    statusMessage.value = response.data;
    setTimeout(() => {
      statusMessage.value = null;
      router.push(`/${telegramId.value}`);
    }, 3000);
  } catch (error) {
    if (error instanceof Error) {
      statusMessage.value = 'Error: ' + error.message;
    } else {
      statusMessage.value = 'An unknown error occurred';
    }
    setTimeout(() => {
      statusMessage.value = null;
    }, 3000);
  }
};

onMounted(() => {
  const savedTelegramId = localStorage.getItem('telegramId');
  if (savedTelegramId) {
    telegramId.value = savedTelegramId;
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    const newTelegramId = urlParams.get('telegramId');
    if (newTelegramId) {
      localStorage.setItem('telegramId', newTelegramId);
      telegramId.value = newTelegramId;
    } else {
      statusMessage.value = 'Something went wrong. Please sign in via our telegram bot!';
      setTimeout(() => {
        statusMessage.value = null;
      }, 1000);
    }
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