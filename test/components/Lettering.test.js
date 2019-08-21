import { shallowMount, mount } from '@vue/test-utils'
import Lettering from '../../src/components/Lettering.vue';
import { letteringOptionDefaults } from '../../src/logic/letteringOptions';
import eventBus from '@SRC/components/eventBus';

function propsFactory(options) {
  return ({
      options: Object.assign({}, options),
      dataPending: [],
      isSelected: true,
      loading: false,
  });
}

describe('Lettering', () => {
  it('displays words', async () => {
    let propsData = propsFactory(letteringOptionDefaults);
    const wrapper = shallowMount(Lettering, { propsData });
    const data = {
      English: [
        { letter: 'a', words: [ 'apple', 'arrange', 'another', 'antibiotic', 'arrangement', 'aid' ] },
        { letter: 'b', words: [ 'bad', 'bubble', 'bring', 'breathtaking' ] },
        { letter: 'c', words: [ 'circus', 'clothes', 'cache', 'civilization' ] },
        { letter: 'd', words: [ 'dead', 'danger', 'dribbled', 'dangerously' ] },
      ]
    };
    
    eventBus.$emit('data-ready', { key: wrapper.vm.$vnode.key, data });
    await wrapper.vm.$nextTick();
    const words = wrapper.findAll('.lettering-word');
    expect(words.length).toBe(4);
  });
});