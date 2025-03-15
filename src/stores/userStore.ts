import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {

    const telegramId = ref<string | null>(null);
    const birthDate = ref<{ day: number; month: number; year: number } | null>(null);
    const statusMessage = ref<string | null>(null);


    function setTelegramId(id: string) {
        telegramId.value = id;
    }

    function setBirthDate(day: number, month: number, year: number) {
        birthDate.value = { day, month, year };
    }

    function setStatusMessage(message: string) {
        statusMessage.value = message;
    }

    const formattedDate = computed(() => {
        if (!birthDate.value) return '';
        const { day, month, year } = birthDate.value;
        return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
    });

    return {
        telegramId,
        birthDate,
        statusMessage,
        setTelegramId,
        setBirthDate,
        setStatusMessage,
        formattedDate,
    };
});