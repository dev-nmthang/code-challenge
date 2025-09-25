import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from './index';

describe('sum_to_n implementations', () => {
  const testCases = [
    // Positive numbers
    { input: 0, expected: 0, description: 'zero' },
    { input: 1, expected: 1, description: 'one' },
    { input: 2, expected: 3, description: 'two' },
    { input: 5, expected: 15, description: 'five' },
    { input: 10, expected: 55, description: 'ten' },
    { input: 100, expected: 5050, description: 'hundred' },
    
    // Negative numbers
    { input: -1, expected: -1, description: 'negative one' },
    { input: -2, expected: -3, description: 'negative two' },
    { input: -3, expected: -6, description: 'negative three' },
    { input: -5, expected: -15, description: 'negative five' },
    { input: -10, expected: -55, description: 'negative ten' },
    { input: -100, expected: -5050, description: 'negative hundred' },
  ];

  describe('sum_to_n_a (Mathematical Formula)', () => {
    testCases.forEach(({ input, expected, description }) => {
      test(`should return ${expected} for input ${input} (${description})`, () => {
        expect(sum_to_n_a(input)).toBe(expected);
      });
    });
  });

  describe('sum_to_n_b (Iterative Approach)', () => {
    testCases.forEach(({ input, expected, description }) => {
      test(`should return ${expected} for input ${input} (${description})`, () => {
        expect(sum_to_n_b(input)).toBe(expected);
      });
    });
  });

  describe('sum_to_n_c (Recursive Approach)', () => {
    testCases.forEach(({ input, expected, description }) => {
      test(`should return ${expected} for input ${input} (${description})`, () => {
        expect(sum_to_n_c(input)).toBe(expected);
      });
    });
  });

  describe('All implementations should produce same results', () => {
    testCases.forEach(({ input, description }) => {
      test(`all versions should return same result for ${input} (${description})`, () => {
        const result1 = sum_to_n_a(input);
        const result2 = sum_to_n_b(input);
        const result3 = sum_to_n_c(input);
        
        expect(result1).toBe(result2);
        expect(result2).toBe(result3);
        expect(result1).toBe(result3);
      });
    });
  });
});
