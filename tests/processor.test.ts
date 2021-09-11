import { Item, PackageItems, IProcessor } from '../src/types';
import Processor from '../src/processor';

describe('Processor', () => {
  describe('processPackage', () => {
    let processor: IProcessor;
    beforeEach(() => {
      processor = new Processor();
    });
    test('should select packages that maximises cost and fit into capacity', () => {
      const capacity = 81;
      const package1: Item = { index: 1, weight: 53.38, cost: 45 };
      const package2: Item = { index: 2, weight: 88.62, cost: 98 };
      const package3: Item = { index: 3, weight: 78.48, cost: 3 };
      const package4: Item = { index: 4, weight: 72.3, cost: 76 };
      const package5: Item = { index: 5, weight: 30.18, cost: 9 };
      const package6: Item = { index: 6, weight: 46.34, cost: 48 };
      const packages = [
        package1,
        package2,
        package3,
        package4,
        package5,
        package6,
      ];
      const packageItems: PackageItems = { capacity, items: packages };

      const expectedPackages = [package4];

      const selectedPackages = processor.processPackage(packageItems);
      expect(selectedPackages).toStrictEqual(expectedPackages)
    });
    test('should not select any package if every package weight is greater than the capacity', () => {
        const capacity = 8;
        const package1: Item = { index: 1, weight: 15.3, cost: 34 };
        const packageItems: PackageItems = { capacity, items: [package1] };
        const expectedPackages:Item[] = [];
        const selectedPackages = processor.processPackage(packageItems);
        expect(selectedPackages).toStrictEqual(expectedPackages)
    });
    test('should select package with less weight if there are packages with same weight that can fit in', () => {
        const capacity = 85;
        const package1: Item = { index: 1, weight: 50, cost: 45 };
        const package2: Item = { index: 2, weight: 35, cost: 30 };
        const package3: Item = { index: 3, weight: 35, cost: 85 };
        const package4: Item = { index: 4, weight: 72.3, cost: 20 };
        const packages = [
            package1,
            package2,
            package3,
            package4,
          ];
          const packageItems: PackageItems = { capacity, items: packages };
          const expectedPackages = [package1, package3];
          const selectedPackages = processor.processPackage(packageItems);
          expect(selectedPackages).toStrictEqual(expectedPackages)
    });
  });
});
