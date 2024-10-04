import { pokemonApi } from '@pokemon/api/pokemonApi';

describe('pokemonApi', () => {
  test('should be configured as expected', () => {
    const url = 'https://pokeapi.co/api/v2/pokemon';
    expect(pokemonApi.defaults.baseURL).toBe(url);
  });
});
