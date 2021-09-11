import fs from 'fs';
import { ApiError } from '../error';
import { Item, PackageItems } from '../types';
import {
  MAX_CAPACITY,
  MAX_COST,
  MAX_WEIGHT,
  CURRENCY_SYMBOL,
} from './constants';
import is_number from 'is-number';

  /**
   * Parse a capacity 
   * @param {string} capacity
   * @returns {number}
   * @throws {ApiError}
   */
function parseCapacity(capacity: string): number {
  if (!is_number(capacity)) {
    throw new ApiError(`Parse error, invalid capacity : ${capacity}`);
  }
  const value = parseInt(capacity, 10);
  if (value > MAX_CAPACITY || value <= 0) {
    throw new ApiError(`Parse error, capacity not within range : ${capacity}`);
  }
  return value;
}

  /**
   * Parse a Index 
   * @param {string} index
   * @returns {number}
   * @throws {ApiError}
   */
function parseIndex(index: string): number {
  if (!is_number(index)) {
    throw new ApiError(`Parse error, invalid index : ${index}`);
  }
  const value = parseInt(index, 10);
  return value;
}

  /**
   * Parse a weight 
   * @param {string} weight
   * @returns {number}
   * @throws {ApiError}
   */
function parseWeight(weight: string): number {
  if (!is_number(weight)) {
    throw new ApiError(`Parse error, invalid weight : ${weight}`);
  }
  const value = parseFloat(weight);
  if (value > MAX_WEIGHT || value <= 0) {
    throw new ApiError(`Parse error, weight not within range : ${weight}`);
  }
  return value;
}

  /**
   * Parse a cost
   * @param {string} cost
   * @returns {number}
   * @throws {ApiError}
   */
function parseCost(cost: string): number {
  const amount = cost.replace(CURRENCY_SYMBOL, '');
  if (!is_number(amount)) {
    throw new ApiError(`Parse error, invalid cost : ${cost}`);
  }
  const value = parseInt(amount, 10);
  if (value > MAX_COST || value <= 0) {
    throw new ApiError(`Parse error, cost not within range : ${cost}`);
  }
  return value;
}

  /**
   * Parse an item
   * @param {string} item
   * @returns {Item}
   * @throws {ApiError}
   */
function parseItem(item: string): Item {
  const parts = item.split(',');
  if (parts.length !== 3) {
    throw new ApiError(`Parse error: item : ${item}`);
  }
  const index = parseIndex(parts[0]);
  const weight = parseWeight(parts[1]);
  const cost = parseCost(parts[2]);
  return { index, cost, weight };
}

  /**
   * Parse a package
   * @param {string} items
   * @returns {Item[]}
   */
function parseItems(items: string): Item[] {
  const parts = items.replace(/\(|\)/g, '').split(' ');
  const filteredParts = parts.filter((part: string): boolean =>
    Boolean(part.trim())
  );
  const result = filteredParts.map((item: string): Item => parseItem(item));
  return result;
}

  /**
   * Parse a line with capacity and packages separated by a colon
   * @param {string} items
   * @returns {Item[]}
   * @throws {ApiError}
   */
function parseLine(line: string): PackageItems {
  const parts = line.split(' : ');
  if (parts.length !== 2) {
    throw new ApiError(`Parse error: invalid line : ${line}`);
  }
  const capacity = parseCapacity(parts[0]);
  const items = parseItems(parts[1]);
  return { capacity, items };
}

export class Util {
  /**
   * Reads a file file path synchronously and returns the content as utf8
   * @param {string} filePath
   * @returns {string}
   */
  public static readFile(filePath: string): string {
    try {
      const content = fs.readFileSync(filePath);
      return content.toString('utf8');
    } catch (ex) {
      throw new ApiError(`Error reading file: ${ex}`);
    }
  }

  /**
   * Takes a string text and return to a list of items and capacity to package
   * @param {string} lines
   * @returns {PackageItems[]}
   */
  public static parseLines(lines: string): PackageItems[] {
      const parts = lines.split(/\r?\n/);
      return parts.map((line: string): PackageItems => parseLine(line));
  }

  /**
   * Format a list of packages as comma separated indexes of the packages
   * @param {Item[]} items
   * @returns {string}
   */
  public static formatSelectedPackages(items: Item[]): string {
    if (!items.length) {
      return '_';
    }
    return items.map((item: Item): number => item.index).join(',');
  }
}
