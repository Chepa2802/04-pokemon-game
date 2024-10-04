import { usePokemonGame } from '@pokemon/composables/usePokemonGame';
import { withSetup } from '../../../utils/with-setup';
import { GameStatus } from '@pokemon/interfaces';
import { flushPromises } from '@vue/test-utils';
import MockAdapter from 'axios-mock-adapter';
import { pokemonApi } from '@pokemon/api/pokemonApi';
import { pokemonListFake } from '../../../data/fake-pokemons';
import confetti from 'canvas-confetti';

const mockPokemonApi = new MockAdapter(pokemonApi);
mockPokemonApi.onGet('?limit=151').reply(200, {
  results: pokemonListFake,
});

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('usePokemonGame', () => {
  test('should initialize with the correct default values', async () => {
    const [result] = withSetup(usePokemonGame);

    expect(result.gameStatus.value).toBe(GameStatus.Playing);
    expect(result.isLoading.value).toBeTruthy();
    expect(result.pokemonsOptions.value.length).toBe(0);
    expect(result.randomPokemon.value).toEqual(undefined);

    await flushPromises();
    expect(result.isLoading.value).toBeFalsy();
    expect(result.pokemonsOptions.value.length).toBe(4);
    expect(result.randomPokemon.value).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
    });
  });

  test('should correctly handle getNextRound', async () => {
    const [result] = withSetup(usePokemonGame);
    await flushPromises();
    result.gameStatus.value = GameStatus.Won;
    result.getNextRound(5);

    expect(result.gameStatus.value).toBe(GameStatus.Playing);
    expect(result.pokemonsOptions.value).toHaveLength(5);
  });

  test('should correctly handle getNextRound witout randomPokemon', async () => {
    const [result] = withSetup(usePokemonGame);
    await flushPromises();

    const firstRandomPokemon = result.randomPokemon.value;
    result.getNextRound();
    const secondRandomPokemon = result.randomPokemon.value;
    expect(firstRandomPokemon.id).not.toBe(secondRandomPokemon.id);
  });

  test('should correctly handle checkAnswer with incorrect answer', async () => {
    const [result] = withSetup(usePokemonGame);
    const idAnswerInexists = -1;
    await flushPromises();

    expect(result.gameStatus.value).toBe(GameStatus.Playing);
    result.checkAnswer(idAnswerInexists);
    expect(result.gameStatus.value).toBe(GameStatus.Lost);
  });

  test('should correctly handle checkAnswer with correct answer', async () => {
    const [result] = withSetup(usePokemonGame);
    await flushPromises();

    expect(result.gameStatus.value).toBe(GameStatus.Playing);
    result.checkAnswer(result.randomPokemon.value.id);
    expect(confetti).toHaveBeenCalled();
    expect(confetti).toHaveBeenCalledWith({
      particleCount: 300,
      spread: 150,
      origin: { y: 0.6 },
    });
    expect(result.gameStatus.value).toBe(GameStatus.Won);
  });
});
