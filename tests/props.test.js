import { describe, expect, test } from 'bun:test';

import { defaults, validate } from '../server/props.js';

describe('defaults', () => {
  test('reduces a schema to the values a preview needs', () => {
    expect(
      defaults([
        { name: 'label', type: 'text', default: 'Items' },
        { name: 'step', type: 'number', default: 2 },
      ]),
    ).toEqual({ label: 'Items', step: 2 });
  });

  test('an empty schema is an empty object', () => {
    expect(defaults([])).toEqual({});
    expect(defaults()).toEqual({});
  });
});

describe('validate', () => {
  test('keeps a well-formed prop', () => {
    expect(
      validate([{ name: 'label', type: 'text', default: 'Items', description: 'The caption.' }]),
    ).toEqual([{ name: 'label', type: 'text', default: 'Items', description: 'The caption.' }]);
  });

  test('carries options through for a select', () => {
    const [prop] = validate([
      { name: 'tone', type: 'select', default: 'info', options: ['info', 'danger'] },
    ]);

    expect(prop.options).toEqual(['info', 'danger']);
  });

  test('drops options from a type that has none', () => {
    const [prop] = validate([{ name: 'label', type: 'text', default: '', options: ['a'] }]);

    expect(prop.options).toBeUndefined();
  });

  test('refuses a prop name an attribute cannot carry', () => {
    expect(() => validate([{ name: 'My Label', type: 'text' }])).toThrow();
  });

  test('refuses an unknown type', () => {
    expect(() => validate([{ name: 'label', type: 'colour' }])).toThrow();
  });

  test('refuses a select with nothing to select', () => {
    expect(() => validate([{ name: 'tone', type: 'select', options: [] }])).toThrow();
  });

  test('refuses anything that is not a list', () => {
    expect(() => validate({ label: 'text' })).toThrow();
  });
});
