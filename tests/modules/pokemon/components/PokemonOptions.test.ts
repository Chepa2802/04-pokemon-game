import { mount } from '@vue/test-utils';
import PokemonOptions from '@pokemon/components/PokemonOptions.vue';

const options = [
  { id: 1, name: 'Charmader' },
  { id: 3, name: 'Charmilion' },
  { id: 5, name: 'Charizar' },
];

describe('<PokemonOptions />', () => {
  const wrapper = mount(PokemonOptions, {
    props: {
      options,
      blockSelection: false,
      correctAnswer: 3,
    },
  });

  test('should render buttons with correct text', () => {
    const buttons = wrapper.findAll('button');

    expect(buttons.length).toBe(options.length);

    buttons.forEach((button, index) => {
      expect(button.text()).toBe(options[index].name);
    });
  });

  test('should emit selectedOption when a button is clicked', async () => {
    const [b1] = wrapper.findAll('button');
    b1.trigger('click');

    expect(wrapper.emitted().selectedOption).toBeTruthy();
    expect(wrapper.emitted().selectedOption[0]).toEqual([1]);

    const buttons = wrapper.findAll('button');
    buttons.forEach((button, index) => {
      wrapper.emitted().selectedOption = [];
      button.trigger('click');

      expect(wrapper.emitted().selectedOption).toBeTruthy();
      expect(wrapper.emitted().selectedOption[0]).toEqual([options[index].id]);
    });
  });

  test('should disabled buttons when blockSelection prop is true', () => {
    const wrapper = mount(PokemonOptions, {
      props: {
        options,
        blockSelection: true,
        correctAnswer: 3,
      },
    });

    const buttons = wrapper.findAll('button');
    buttons.forEach((button) => {
      expect(button.attributes()).toEqual(
        expect.objectContaining({
          disabled: '',
        }),
      );

      const attributes = Object.keys(button.attributes());
      expect(attributes).contain('disabled');
    });
  });

  test('should apply correct styling to buttons based on correcty/incorrecty answer', () => {
    const correctAnswer = 5;
    const wrapper = mount(PokemonOptions, {
      props: {
        options,
        blockSelection: true,
        correctAnswer,
      },
    });

    const buttons = wrapper.findAll('button');
    buttons.forEach((button, index) => {
      const classButton = button.classes();
      if (options[index].id === correctAnswer) {
        expect(classButton).toContain('correcty');
      } else {
        expect(classButton).toContain('incorrecty');
      }
    });
  });
});
