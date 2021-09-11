import { Item, PackageItems, IProcessor } from './types';

export default class Processor implements IProcessor {
  /**
   * Process a list of packages, pick the best packages that fit the capacity while maximizing cost
   * @param {PackageItems} items
   * @returns {Item[]}
   */
  public processPackage(items: PackageItems): Item[] {
    return this.selectPackages(items);
  }
  /**
   * Select list of packages, using Dynamic programming, 0-1 Knapsack problem
   * @param {PackageItems} items
   * @returns {Item[]}
   */
  private selectPackages(items: PackageItems): Item[] {
    let itemArray = items.items.sort(
      (item1: Item, item2: Item): number => item1.weight - item2.weight
    );
    let capacity = items.capacity;
    if (!this.allPackageItemWeightsAreDiscrete(items)) {
      capacity *= 100;
      itemArray = items.items.map((item) => {
        const weight = Math.round(item.weight * 100);
        const cost = item.cost;
        const index = item.index;
        return { weight, cost, index };
      });
    }

    const knapsackValues = [];
    for (let i = 0; i < itemArray.length + 1; i++) {
      const itemRow = new Array(capacity + 1).fill(0);
      knapsackValues.push(itemRow);
    }

    const itemsLength = itemArray.length;

    for (let k = 1; k <= itemsLength; k++) {
      const itemIndex = k - 1;
      const currentWeight = itemArray[itemIndex].weight;
      const currentCost = itemArray[itemIndex].cost;

      for (let weight = 1; weight <= capacity; weight++) {
        if (currentWeight > weight) {
          knapsackValues[k][weight] = knapsackValues[k - 1][weight];
        } else {
          knapsackValues[k][weight] = Math.max(
            knapsackValues[k - 1][weight],
            knapsackValues[k - 1][weight - currentWeight] + currentCost
          );
        }
      }
    }

    const result: Item[] = [];
    let row = knapsackValues.length - 1;
    let column = knapsackValues[0].length - 1;
    while (row > 0) {
      if (knapsackValues[row][column] === knapsackValues[row - 1][column]) {
        row -= 1;
      } else {
        const itemIndex = row - 1;
        result.unshift(items.items[itemIndex]);
        column -= itemArray[itemIndex].weight;
        row -= 1;
      }
      if (column === 0) {
        break;
      }
    }
    return result.sort(
      (item1: Item, item2: Item): number => item1.index - item2.index
    );
  }

/**
   * checks if the weights of all packages are discrete
   * @param {PackageItems} items
   * @returns {boolean}
   */
  private allPackageItemWeightsAreDiscrete(items: PackageItems): boolean {
    return items.items.every((item) => Number.isInteger(item.weight));
  }
}
