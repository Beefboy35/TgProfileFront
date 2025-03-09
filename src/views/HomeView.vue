<template>
  <div class="min-h-screen bg-gradient-to-t from-yellow-300 to-purple-400 flex flex-col items-center justify-center p-10">
    <!-- Блок status-info -->
    <div
        v-if="statusMessage"
        class="status-info mb-4 p-4 bg-green-500 text-white rounded-lg shadow-lg animate__animated"
        :class="{ 'animate__fadeInDown': statusMessage, 'animate__fadeOutUp': !statusMessage }"
    >
      {{ statusMessage }}
    </div>

    <h1 class="text-2xl font-bold mb-8 animate__animated animate__fadeInDown">
      Введи свою дату рождения
    </h1>
    <div
        class="bg-gradient-to-b from-yellow-200 to-purple-200 rounded-lg shadow-lg p-6 max-w-md w-full animate__animated"
        :class="{ 'animate__slideInUp': isFormVisible }"
    >
      <!-- Компонент для выбора даты -->
      <div class="flex items-center justify-center p-2 space-x-4 mt-8 mb-8">
        <!-- День -->
        <select
            v-model="selectedDay"
            class="p-2 border rounded-lg animate__animated"
            :class="{ 'animate__fadeInLeft': isFormVisible, 'animate__delay-1s': isFormVisible }"
        >
          <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
        </select>
        <!-- Месяц -->
        <select
            v-model="selectedMonth"
            class="p-2 border rounded-lg animate__animated"
            :class="{ 'animate__fadeInLeft': isFormVisible, 'animate__delay-1s': isFormVisible }"
        >
          <option v-for="(month, index) in months" :key="index" :value="index + 1">{{ month }}</option>
        </select>
        <!-- Год -->
        <select
            v-model="selectedYear"
            class="p-2 border rounded-lg animate__animated"
            :class="{ 'animate__fadeInLeft': isFormVisible, 'animate__delay-1s': isFormVisible }"
        >
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
      <!-- Прямоугольник с выбранной датой -->
      <div
          class="mt-4 mb-8 p-4 bg-yellow-300 rounded-lg text-center animate__animated"
          :class="{ 'animate__fadeInUp': isFormVisible, 'animate__delay-2s': isFormVisible }"
      >
        <p class="text-black-600 font-bold">
          Выбрано: {{ formattedDate }}
        </p>
      </div>

      <button
          class="mb-8 w-full bg-yellow-300 text-black py-2 px-4 rounded-lg hover:bg-purple-300 transition-colors animate__animated"
          :class="{ 'animate__fadeInUp': isFormVisible, 'animate__delay-2s': isFormVisible }"
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
const isFormVisible = ref<boolean>(false);
const statusMessage = ref<string | null>(null); // Сообщение от API

const formattedDate = computed<string>(() => {
  const day = String(selectedDay.value).padStart(2, '0');
  const month = String(selectedMonth.value).padStart(2, '0');
  const year = selectedYear.value;
  return `${year}.${month}.${day}`;
});

const continueToNextStep = async (): Promise<void> => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.post(`${backendUrl}/update_birthday/${telegramId.value}`, {
      date_of_birth: formattedDate.value,
    });
    statusMessage.value = response.data.message; // Устанавливаем сообщение от API
    setTimeout(() => {
      statusMessage.value = null; // Скрываем сообщение через 3 секунды
    }, 3000);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      statusMessage.value = 'Ошибка: ' + (error.response?.data?.detail || error.message);
    } else {
      statusMessage.value = 'Произошла ошибка: ' + (error as Error).message;
    }
    setTimeout(() => {
      statusMessage.value = null; // Скрываем сообщение через 3 секунды
    }, 3000);
  }
};

onMounted(() => {
  setTimeout(() => {
    isFormVisible.value = true;
  }, 100);
  const urlParams = new URLSearchParams(window.location.search);
  telegramId.value = urlParams.get('telegramId');

  if (!telegramId.value) {
    alert('Telegram ID не найден в URL');
    return;
  }
});
</script>

<style scoped>
/* Анимации для hover на селекторах */
select:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}

/* Анимации для кнопки */
button:hover {
  transform: translateY(-4px);
  transition: transform 0.2s ease-in-out;
}

/* Анимации для status-info */
.status-info {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}
</style>