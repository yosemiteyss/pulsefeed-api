import { shuffle } from '@pulsefeed/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ShuffleService {
  /**
   * Shuffles items by interleaving them based on a specified key.
   * Groups items by the key extracted using the selector function,
   * shuffles each group, and then interleaves the shuffled groups.
   * @param items The items to shuffle.
   * @param selector A function to extract the key from each item.
   * @returns The shuffled and interleaved array of items.
   */
  shuffleByKey<T>(items: T[], selector: (item: T) => string): T[] {
    const itemsByKey: { [key: string]: T[] } = {};

    items.forEach((item) => {
      const key = selector(item) || 'unknown';
      if (!itemsByKey[key]) {
        itemsByKey[key] = [];
      }
      itemsByKey[key].push(item);
    });

    const shuffledGroups = Object.values(itemsByKey).map((group) => shuffle(group));

    const result: T[] = [];
    let addedAny: boolean;

    do {
      addedAny = false;
      for (const group of shuffledGroups) {
        if (group.length > 0) {
          result.push(group.shift()!);
          addedAny = true;
        }
      }
    } while (addedAny);

    return result;
  }
}
