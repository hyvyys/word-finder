import { shallowMount, mount } from '@vue/test-utils'
import LetteringOptions from '../../src/components/LetteringOptions.vue';
import { getLetteringOption, letteringOptionDefaults } from '../../src/logic/letteringOptions';

function propsFactory(options, optionsValidation) {
  return ({
    options: Object.assign({}, options),
    optionsValidation: Object.assign({}, optionsValidation),
  });
}

describe('LetteringOptions', () => {
  it('allows for setting options', async () => {
    let propsData = propsFactory(letteringOptionDefaults, {});
    const component = mount(LetteringOptions, { propsData });

    function last(array) {
      return array[array.length - 1];
    }
    function emittedPropValue(prop) {
      return last(component.emitted()['input'])[0][prop];
    }

    for (let prop in propsData.options) {
      const optionMeta = getLetteringOption(prop);

      async function testOption() {
        if (!optionMeta.if || optionMeta.if(propsData.options)) {
          switch (optionMeta.type) {
            case 'boolean': {
              let input = component.find(`#lettering-option-${prop} .ui-checkbox`);
              if (!input.exists())
                input = component.find(`#lettering-option-${prop} .ui-switch`);
              input.trigger('click');
              const newOption = emittedPropValue(prop);
              expect(newOption).not.toBe(letteringOptionDefaults[prop]);
              break;
            }
            case 'string': {
              const input = component.find(`#lettering-option-${prop} input`);
              input.setValue('test');
              const newOption = emittedPropValue(prop);
              expect(newOption).toBe('test');
              break;
            }
            case 'number': {
              const input = component.find(`#lettering-option-${prop} input`);
              const min = optionMeta.min || 0, max = optionMeta.max || 100;
              const val = Math.floor(Math.random() * max + 1 - min) + min;
              input.setValue(val);
              const newOption = emittedPropValue(prop);
              expect(newOption).toBe(val);
              break;
            }
            case 'select': {
              const letteringOption = component.find(`#lettering-option-${prop}`);
              const uiSelect = letteringOption.find({ name: `ui-select` });

              const opener = uiSelect.find(`.ui-select__display`);
              const value = opener.find('.ui-select__display-value').text().split(', ');
              const options = optionMeta.optionsFunc ? optionMeta.optionsFunc(value) : optionMeta.options;

              const index = Math.floor(Math.random() * options.length);
              opener.trigger('click');
              await uiSelect.vm.$nextTick();

              const option = uiSelect.find(`.ui-select__dropdown-content .ui-select-option:nth-child(${index + 1})`);
              option.trigger('click');
              const newOption = emittedPropValue(prop);

              if (!optionMeta.multiple) {
                expect(newOption).toBe(options[index]);
              }
              else {
                const before = letteringOptionDefaults[prop].includes(options[index]);
                if (before)
                  expect(newOption).not.toContain(options[index]);
                else
                  expect(newOption).toContain(options[index]);
              }
              break;
            }
          }
        }
      }

      const toggles = optionMeta.labelToggles || [];
      for (let i = 0; i < Math.pow(2, toggles.length); i++) {
        for (let j = 0; j < toggles.length; j++) {
          const val = ((i >> j) & 1) == 1;
          propsData.options[toggles[j]] = val;
        }
        propsData = propsFactory(propsData.options, {})
        component.setProps(propsData);
        await testOption();
      }
    }
  });
});