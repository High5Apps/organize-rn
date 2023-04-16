import {
  recursiveSnakeToCamel, snakeToCamel,
} from '../../app/networking/SnakeCaseToCamelCase';

describe('snakeToCamel', () => {
  it('converts single words', () => {
    expect(snakeToCamel('hello')).toBe('hello');
  });

  it('converts two words', () => {
    expect(snakeToCamel('hello_world')).toBe('helloWorld');
  });

  it('converts multiple words', () => {
    expect(snakeToCamel('hello_my_name_is')).toBe('helloMyNameIs');
  });
});

describe('recursiveSnakeToCamel', () => {
  it('converts simple objects', () => {
    expect(recursiveSnakeToCamel({ foo_bar: 'baz' }))
      .toEqual({ fooBar: 'baz' });
  });

  it('converts nested objects', () => {
    expect(recursiveSnakeToCamel({ foo_bar: { wam_bam: 'hi' } }))
      .toEqual({ fooBar: { wamBam: 'hi' } });
  });

  it('converts objects with functions', () => {
    const f = () => {};
    const g = () => {};
    expect(recursiveSnakeToCamel({ bar_foo: f, bam_wam: g }))
      .toEqual({ barFoo: f, bamWam: g });
  });

  it('converts objects with arrays', () => {
    expect(recursiveSnakeToCamel({ ab_cd_ef: ['hi', 'there'] }))
      .toEqual({ abCdEf: ['hi', 'there'] });
  });

  it('converts arrays with objects', () => {
    expect(recursiveSnakeToCamel([{ gh_ij: 'a' }, { kl_mn: 'b' }]))
      .toEqual([{ ghIj: 'a' }, { klMn: 'b' }]);
  });
});
