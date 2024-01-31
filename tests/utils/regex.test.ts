import { isValidLimit, isValidPage } from '../../src/utils/regex';

test('Should valid limit', () => {
  const testCases = [
    { value: '123', expect: true },
    { value: '12', expect: true },
    { value: 'abc', expect: false },
    { value: '5', expect: true },
    { value: '0', expect: true },
    { value: '-1', expect: false },
    { value: '1ea', expect: false },
  ];

  testCases.forEach((c) => {
    expect(isValidLimit(c.value)).toEqual(c.expect);
  });
});

test('Should valid page', () => {
  const testCases = [
    { value: '123', expect: true },
    { value: '12', expect: true },
    { value: 'abc', expect: false },
    { value: '5', expect: true },
    { value: '0', expect: false },
    { value: '-1', expect: false },
    { value: '1ea', expect: false },
  ];

  testCases.forEach((c) => {
    expect(isValidPage(c.value)).toEqual(c.expect);
  });
});
