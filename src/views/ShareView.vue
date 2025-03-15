<template>
  <div class="min-h-screen bg-gradient-to-t from-yellow-300 to-purple-400 flex flex-col items-center justify-center p-6">
    <div class="bg-gradient-to-b from-yellow-200 to-purple-200 rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all hover:scale-105 hover:shadow-4xl">
      <h2 class="text-2xl font-bold text-purple-800 mb-5 animate__animated animate__fadeInDown">
        Nickname: <span class="text-yellow-600">{{ nickname }}</span>
      </h2>
      <h2 class="text-2xl font-bold text-purple-800 mb-5 animate__animated animate__fadeInDown animate__delay-1s">
        Full name: <span class="text-yellow-600">{{ first_name }} {{ last_name }}</span>
      </h2>
      <h2 class="text-2xl font-bold text-purple-800 mb-5 animate__animated animate__fadeInDown animate__delay-2s">
        Age: <span class="text-yellow-600">{{ age }}</span>
      </h2>
      <h2 class="text-2xl mb-5 font-bold text-purple-800 animate__animated animate__fadeInDown animate__delay-3s">
        Time left until birthday: <span class="text-yellow-600">{{ daysUntilBirthday }}</span>
      </h2>
      <button
          @click="shareProfile"
          class="p-4 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all transform hover:scale-110 hover:shadow-xl"
      >
        <FontAwesomeIcon :icon="faShareAlt" class="text-2xl text-purple-600" />
      </button>
    </div>

    <div class="fixed bottom-8 flex justify-center w-full animate__animated animate__fadeInUp animate__delay-4s">
      <button
          @click="goToHome"
          class="p-4 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all transform hover:scale-110 hover:shadow-xl"
      >
        <FontAwesomeIcon :icon="faArrowDown" class="text-3xl text-purple-600" />
      </button>
    </div>

    <!-- Модальное окно -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style="z-index: 1000;">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">Copy this link manually:</h2>
        <p class="bg-gray-100 p-2 rounded break-all">{{ shareUrl }}</p>
        <div class="mt-4 flex justify-end gap-2">
          <button @click="showModal = false" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Close</button>
          <button @click="copyToClipboard" class="px-4 py-2 bg-blue-500 rounded hover:bg-gray-400">Copy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowDown, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { useUserStore } from '../stores/userStore';

const router = useRouter();
const userStore = useUserStore();

const showModal = ref<boolean>(false);
const shareUrl = ref<string>('');
const nickname = ref<string>('loading...');
const first_name = ref<string>('loading...');
const last_name = ref<string>('');
const age = ref<number>(0);

const daysUntilBirthday = computed(() => {
  if (!userStore.birthDate) return 'Invalid date of birth';
  const { day, month, year } = userStore.birthDate;
  const today = new Date();
  const nextBirthday = new Date(today.getFullYear(), month - 1, day);
  if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
  const diffInMs = nextBirthday.getTime() - today.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${diffInDays} days, ${diffInHours} hours, ${diffInMinutes} minutes`;
});

const shareProfile = () => {
  if (userStore.telegramId) {
    shareUrl.value = `https://t.me/GdowskiyBot/TgProfileApp?startapp=${userStore.telegramId}`;
    showModal.value = true;
  } else {
    alert('Telegram ID is missing! Please try to sign in via our bot!');
  }
};

const copyToClipboard = () => {
  navigator.clipboard.writeText(shareUrl.value).then(() => {
    alert('Link copied to clipboard!');
    showModal.value = false;
  });
};

onMounted(async () => {
  if (userStore.telegramId) {
    try {
      const response = await axios.get(`api/users/get_by_id/${userStore.telegramId}`);
      nickname.value = response.data.nickname;
      first_name.value = response.data.first_name;
      last_name.value = response.data.last_name;
      age.value = response.data.age;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }
});

const goToHome = () => {
  router.push('/');
};
</script>