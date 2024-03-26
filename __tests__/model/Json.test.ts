import {
  camelToSnake, fromJson, snakeToCamel, toJson,
} from '../../app/model/Json';

describe('camelToSnake', () => {
  it('converts single words', () => {
    expect(camelToSnake('hello')).toBe('hello');
  });

  it('converts two words', () => {
    expect(camelToSnake('helloWorld')).toBe('hello_world');
  });

  it('converts multiple words', () => {
    expect(camelToSnake('helloMyNameIs')).toBe('hello_my_name_is');
  });
});

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

const object = fromJson(json, {
  convertSnakeToCamel: true,
  convertIso8601ToDate: true,
});

describe('toJson', () => {
  it('is the same as JSON.stringify when no options are enabled', () => {
    expect(toJson(object)).toEqual(JSON.stringify(object));
  });

  it('converts Dates to ISO8601 strings', () => {
    expect(fromJson(toJson(object))).toEqual({
      oneTwo: 'three',
      fourFiveSix: ['seven'],
      eightNine: {
        tenEleven: '2023-11-14T22:13:20.000Z',
        twelve: 12,
      },
    });
  });

  it('converts camelCase keys to snake_case keys when option enabled', () => {
    expect(fromJson(toJson(object, { convertCamelToSnake: true }))).toEqual({
      one_two: 'three',
      four_five_six: ['seven'],
      eight_nine: {
        ten_eleven: '2023-11-14T22:13:20.000Z',
        twelve: 12,
      },
    });
  });
});
