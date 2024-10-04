import PokemonGame from '@pokemon/pages/PokemonGame.vue';
import { mount } from '@vue/test-utils';

import { usePokemonGame } from '@pokemon/composables/usePokemonGame';
import type { Mock } from 'vitest';
import { GameStatus } from '@/modules/pokemon/interfaces';
import { pokemonListFake } from '../../../../tests/data/fake-pokemons';

vi.mock('@pokemon/composables/usePokemonGame', () => ({
  usePokemonGame: vi.fn(),
}));

const pokemonsOptions = [...pokemonListFake]
  .slice(0, 4)
  .map((p, i) => ({ id: i + 1, name: p.name }));

describe('<PokemonGame />', () => {
  test('should initialize with default values', () => {
    (usePokemonGame as Mock).mockReturnValue({
      isLoading: true,
      randomPokemon: undefined,
      gameStatus: GameStatus.Playing,
      pokemonsOptions: [],
      checkAnswer: vi.fn(),
      getNextRound: vi.fn(),
    });

    const wrapper = mount(PokemonGame);

    expect(wrapper.find('h1').text()).toBe('Espere por favor');
    expect(wrapper.find('h1').classes()).toEqual(['text-3xl']);
    expect(wrapper.find('h3').classes()).toEqual(['animate-pulse']);
    expect(wrapper.find('h3').text()).toBe('Cargando Pokémons');
  });

  test('should render <PokemonPicture /> and <PokemonOptions />', () => {
    (usePokemonGame as Mock).mockReturnValue({
      isLoading: false,
      randomPokemon: pokemonsOptions[0],
      gameStatus: GameStatus.Playing,
      pokemonsOptions: pokemonsOptions,
      checkAnswer: vi.fn(),
      getNextRound: vi.fn(),
    });

    const wrapper = mount(PokemonGame);
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png`;
    const buttons = wrapper.findAll('.capitalize.disabled\\:shadow-none.disabled\\:bg-gray-100');

    expect(wrapper.find('img').attributes('src')).toBe(imageUrl);
    expect(buttons).length(pokemonsOptions.length);
    buttons.forEach((button) => {
      expect(pokemonsOptions.map((p) => p.name)).contain(button.text());
    });
  });

  test('should render button for new game', () => {
    (usePokemonGame as Mock).mockReturnValue({
      isLoading: false,
      randomPokemon: pokemonsOptions[0],
      gameStatus: GameStatus.Won,
      pokemonsOptions: pokemonsOptions,
      checkAnswer: vi.fn(),
      getNextRound: vi.fn(),
    });

    const wrapper = mount(PokemonGame);
    //const button = wrapper.find('#btn-nuevo');
    const button = wrapper.find('[data-test-id="btn-nuevo"]');

    expect(button.text()).toBe('¿Jugar de Nuevo?');
  });

  test('should call the getNextRound function when the button is clicked', () => {
    const spyGetNextRoundFn = vi.fn();

    (usePokemonGame as Mock).mockReturnValue({
      isLoading: false,
      randomPokemon: pokemonsOptions[0],
      gameStatus: GameStatus.Won,
      pokemonsOptions: pokemonsOptions,
      checkAnswer: vi.fn(),
      getNextRound: spyGetNextRoundFn,
    });

    const wrapper = mount(PokemonGame);
    const button = wrapper.find('#btn-nuevo');
    button.trigger('click');

    expect(spyGetNextRoundFn).toHaveBeenCalled();
    expect(spyGetNextRoundFn).toHaveBeenCalledWith(4);
  });
});
