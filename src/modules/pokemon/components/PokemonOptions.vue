<template>
  <div class="flex flex-col">
    <button
      v-for="{ id, name } in options"
      :key="id"
      :class="[
        'capitalize disabled:shadow-none disabled:bg-gray-100',
        {
          correcty: correctAnswer === id && blockSelection,
          incorrecty: correctAnswer !== id && blockSelection,
        },
      ]"
      @click="$emit('selectedOption', id)"
      :disabled="blockSelection"
    >
      {{ name }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Pokemon } from '../interfaces';

interface Props {
  options: Pokemon[];
  blockSelection: boolean;
  correctAnswer?: number;
}

defineProps<Props>();

defineEmits<{
  selectedOption: [id: number];
}>();
</script>

<style scoped>
button {
  @apply bg-white shadow-md rounded-lg p-3 m-2 cursor-pointer w-40 text-center transition-all hover:bg-gray-100;
}

.correcty {
  @apply bg-green-300;
}

.incorrecty {
  @apply bg-red-300;
}
</style>
