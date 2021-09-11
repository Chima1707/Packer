export interface Item {
  index: number;
  weight: number;
  cost: number;
}

export interface PackageItems {
  capacity: number;
  items: Item[];
}

export interface IProcessor {
  processPackage(items: PackageItems): Item[];
}
