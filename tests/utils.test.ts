import { Util } from '../src/utils/utils';
import { Item } from '../src/types';
import { ApiError } from '../src/error';

describe('Util', () => {
  describe('formatSelectedPackages', () => {
    test('should return underscore when when no item is given', () => {
      const items: Item[] = [];
      const result = Util.formatSelectedPackages(items);
      expect(result).toBe('_');
    });

    test('should return item index when an item is given', () => {
      const index = 2;
      const item: Item = { index, cost: 20, weight: 10 };
      const items: Item[] = [item];
      const result = Util.formatSelectedPackages(items);
      expect(result).toBe(`${2}`);
    });

    test('should return comma separated item indexes when list of item is given', () => {
      const index1 = 1;
      const index2 = 2;
      const items: Item[] = [
        { index: index1, cost: 20, weight: 10 },
        { index: index2, cost: 20, weight: 10 },
      ];
      const result = Util.formatSelectedPackages(items);
      expect(result).toBe(`${1},${2}`);
    });
  });
  describe('parseLines', () => {
    const invalidLines = [
      '81 : (1,53.38,€45) : 9',
      '80 : 20.0,€45',
      '200 : (1,20.0,€45)',
      '55 : (1,20.0,€400)',
      '55 : (1,20.0,€40) (2,200.0,€40) (1,20.0,€4)',
      '55 : (1,20.0,€40) (2,200.0,€40) (1,20.0,€4) \n 200 : (1,20.0,€45)'
    ];

    for (const invalidLine of invalidLines) {
        test(`show throw API error when line is invalid: ${invalidLine}`, () => {
            const t = () => Util.parseLines(invalidLine);
            expect(t).toThrowError(ApiError);
        })
    }

    test('should parse a line as weight : packages', () => {
      const line = '81 : (1,53.38,€45)';
      const item = { index: 1, weight: 53.38, cost: 45 };
      const packagesList = Util.parseLines(line);
      const packageItems = packagesList[0];
      expect(packageItems.capacity).toBe(81);
      expect(packageItems.items).toEqual([item]);
    });

  });
});
