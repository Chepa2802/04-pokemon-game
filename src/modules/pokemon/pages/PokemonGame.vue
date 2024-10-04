<template>
  <div
    v-if="isLoading || randomPokemon?.id == null"
    class="flex flex-col justify-center items-center h-screen w-screen"
  >
    <h1 class="text-3xl">Espere por favor</h1>
    <h3 class="animate-pulse">Cargando Pokémons</h3>
  </div>
  <div v-else class="flex flex-col justify-center items-center h-screen w-screen">
    <h1 class="m-5">¿Quién es ese Pokémon?</h1>
    <h2 v-if="gameStatus !== GameStatus.Playing">{{ gameStatus }}</h2>
    <div class="h-20">
      <button
        id="btn-nuevo"
        v-if="gameStatus !== GameStatus.Playing"
        @click="getNextRound(4)"
        class="bg-teal-500 text-white rounded-md p-1 hover:bg-teal-300 transition-all"
        data-test-id="btn-nuevo"
      >
        ¿Jugar de Nuevo?
      </button>
    </div>

    <!-- PokemonPicture -->
    <PokemonPicture
      :pokemon-id="randomPokemon?.id ?? 0"
      :show-pokemon="gameStatus !== GameStatus.Playing"
    />

    <!-- PokemonOptions -->
    <PokemonOptions
      :options="options"
      :block-selection="gameStatus !== GameStatus.Playing"
      :correct-answer="randomPokemon?.id"
      @selected-option="checkAnswer"
    />
  </div>
</template>

<script setup lang="ts">
import PokemonOptions from '../components/PokemonOptions.vue';
import PokemonPicture from '../components/PokemonPicture.vue';
import { usePokemonGame } from '../composables/usePokemonGame';
import { GameStatus } from '../interfaces';

const {
  isLoading,
  randomPokemon,
  gameStatus,
  pokemonsOptions: options,
  checkAnswer,
  getNextRound,
} = usePokemonGame();
</script>

<style scoped></style>
