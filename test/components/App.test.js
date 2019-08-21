import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import App from '../../src/components/App.vue';
import { letteringOptionDefaults } from '../../src/logic/letteringOptions';

import { getData } from "@SRC/logic/getData";
const resp = [
  'apple', 'arrange', 'another', 'antibiotic', 'arrangement', 'aid',
  'bad', 'bubble', 'bring', 'breathtaking',
  'circus', 'clothes', 'cache', 'civilization',
  'dead', 'danger', 'dribbled', 'dangerously'
]
.join('\n');
jest.mock("@SRC/logic/getData");
getData.mockResolvedValue(resp);

jest.useFakeTimers();

describe('App', () => {
  it('fetches and parses data', async () => {
    const wrapper = mount(App);
    await wrapper.vm.$nextTick();
    jest.runAllTimers();
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('data-ready').length).toBe(1);
  });

  // it('merges words starting with accents and bases', async () => {
  //   const options = letteringOptionDefaults.slice();
  //   options.collapseAccents = true;
  //   const component = shallowMount(App);
  //   await component.vm.$nextTick();
  //   const dataReadyEvents = component.emitted()['data-ready'];
  //   expect(dataReadyEvents.length).toBe(1);
  // });
});