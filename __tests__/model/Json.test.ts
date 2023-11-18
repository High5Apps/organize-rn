import { fromJson, snakeToCamel } from '../../app/model/Json';

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

const json = '{"one_two":"three","four_five_six":["seven"],"eight_nine":{"ten_eleven":"2023-11-14T22:13:20.000Z","twelve":12}}';
const timestamp = 1700000000000;

describe('fromJson', () => {
  it('is the same as JSON.parse when no options are enabled', () => {
    expect(fromJson(json)).toEqual(JSON.parse(json));
  });

  it('converts ISO8601 strings to Dates when option enabled', () => {
    expect(fromJson(json, { convertIso8601ToDate: true })).toEqual({
      one_two: 'three',
      four_five_six: ['seven'],
      eight_nine: {
        ten_eleven: new Date(timestamp),
        twelve: 12,
      },
    });
  });

  it('converts snake_case keys to camelCase keys when option enabled', () => {
    expect(fromJson(json, { convertSnakeToCamel: true })).toEqual({
      oneTwo: 'three',
      fourFiveSix: ['seven'],
      eightNine: {
        tenEleven: '2023-11-14T22:13:20.000Z',
        twelve: 12,
      },
    });
  });
});
