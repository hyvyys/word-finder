const capitalize = require('../../src/logic/utils').capitalize;

// test('draws random array element', () => {
//   expect(randomElement([0, 1, 2, 3, 4])).toBe()
// });
describe('capitalize()', () => {
  it("should capitalize a Latin word", () => {
    expect(capitalize('adam')).toBe('Adam');
  });
  it("should capitalize a Greek word", () => {
    expect(capitalize('έλκομαι')).toBe('Έλκομαι');
  });
  it("should capitalize a Cyrillic word", () => {
    expect(capitalize('ћудљиво')).toBe('Ћудљиво');
  });
  it("shouldn't capitalize a Latin word with Greek prefix", () => {
    expect(capitalize('μLED')).toBe('μLED');
  });
});

