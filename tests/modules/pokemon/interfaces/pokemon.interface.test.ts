import { type Pokemon } from '@pokemon/interfaces/pokemon.interface';

describe('Pokemon', () => {
  const pokemon: Pokemon = { id: 1, name: 'Pikachu' };

  test('should hava an id property of type number', () => {
    expect(pokemon.id).toEqual(expect.any(Number));
  });

  test('should hava a name property of type string', () => {
    expect(pokemon.name).toEqual(expect.any(String));
  });
});
