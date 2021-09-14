import Processor from './processor';
import { PackageItems, IProcessor } from './types';
import { Util } from './utils/utils';

export class Packer {
 
  /**
   * Takes an input file of packages and return indexes of packed packages for each line
   * @param {string} inputFile a file path in the local file system to read packages from
   * @returns {Promise<string>} indexes of the packed packages
   * @throws {ApiError}
   */
  static async pack(inputFile: string): Promise<string> {
    const fileContent = await Util.readFile(inputFile);
    const packageItems = Util.parseLines(fileContent.trim());
    const processor: IProcessor = new Processor();
    return packageItems
      .map((packages: PackageItems): string =>
        Util.formatSelectedPackages(processor.processPackage(packages))
      )
      .join('\n');
  }
}
