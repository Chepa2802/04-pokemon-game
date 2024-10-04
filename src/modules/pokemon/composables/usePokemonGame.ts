import { computed, onMounted, ref } from 'vue';
import { pokemonApi } from '../api/pokemonApi';
import { GameStatus, type Pokemon, type PokemonListResponse } from '../interfaces';
import confetti from 'canvas-confetti';

export const usePokemonGame = () => {
  const gameStatus = ref<GameStatus>(GameStatus.Playing);
  const pokemons = ref<Pokemon[]>([]);
  const pokemonsOptions = ref<Pokemon[]>([]);
  const isLoading = computed(() => pokemons.value.length == 0);

  const randomPokemon = computed(() => {
    const randomIndex = Math.floor(Math.random() * pokemonsOptions.value.length);
    return pokemonsOptions.value[randomIndex];
  });

  const getPokemons = async (): Promise<Pokemon[]> => {
    const response = await pokemonApi.get<PokemonListResponse>('?limit=151');

    const pokemonArray = response.data.results.map((p) => {
      const urlParts = p.url.split('/');

      //const id = urlParts.at(-2) ?? 0;
      const id = urlParts[urlParts.length - 2] ?? 0;

      return { name: p.name, id: +id };
    });

    return pokemonArray;
  };

  const getNextRound = (howMany: number = 4) => {
    gameStatus.value = GameStatus.Playing;
    pokemons.value.sort(() => Math.random() - 0.5);
    pokemonsOptions.value = pokemons.value.slice(0, howMany);
    //pokemons.value = pokemons.value.slice(howMany);
  };

  const checkAnswer = (idAnswer: number) => {
    const hasWon = idAnswer === randomPokemon.value.id;

    if (!hasWon) {
      gameStatus.value = GameStatus.Lost;
      return;
    }

    gameStatus.value = GameStatus.Won;
    confetti({
      particleCount: 300,
      spread: 150,
      origin: { y: 0.6 },
    });
  };

  onMounted(async () => {
    pokemons.value = await getPokemons();
    getNextRound();
  });

  return {
    gameStatus,
    isLoading,
    pokemonsOptions,
    randomPokemon,

    //Methods
    getNextRound,
    checkAnswer,
  };
};
