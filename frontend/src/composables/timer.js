// Vue
import { ref, computed } from 'vue';

// Utils
import { formatSeconds } from '@/assets/utils/date-time-utils';

export function useTimer() {
    // Data
    const timer = ref(null);
    const time = ref(0);

    // Computed
    const formattedTime = computed(() => formatSeconds(time.value));

    // Methods
    function reset() {
        if (timer.value) {
            clearTimeout(timer.value);
            timer.value = null;
        }

        time.value = 0;
    }

    function start(seconds = 10) {
        const formattedSeconds = Number(seconds);
    
        if (!formattedSeconds) {
            return;
        }
    
        if (timer.value) {
            clearTimeout(timer.value);
        }
    
        time.value = formattedSeconds;    
        timer.value = getTimer();
    }

    function getTimer() {
        return setTimeout(() => {
            if (time.value <= 0) {
                timer.value = null;
                time.value = 0;
                return;
            }

            time.value -= 1;
            timer.value = getTimer();
        }, 1000);
    }

    return {
        time,
        formattedTime,
        start,
        reset,
    };
}
