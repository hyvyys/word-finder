import { shallowMount, mount } from '@vue/test-utils'
import OptionLabel from '../../src/components/OptionLabel.vue';

describe('OptionLabel', () => {
  it('sets label toggles', () => {
    const togglesInitial = [true, false];
    const toggles = togglesInitial.slice();
    const component = mount(OptionLabel, {
      propsData: {
        label: 'abc',
        info: '',
        toggles,
        toggleLabels: [],
      }
    })
    
    toggles.forEach((toggle, i) => {
      const checkbox = component.find(`.ui-checkbox:nth-of-type(${i + 1})`);
      checkbox.trigger('click');
    });
    toggles.forEach((toggle, i) => expect(toggle).toBe(!togglesInitial[i]));
  });
});