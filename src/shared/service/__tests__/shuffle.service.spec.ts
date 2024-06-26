import { Test, TestingModule } from '@nestjs/testing';
import { ShuffleService } from '../shuffle.service';

describe('ShuffleService', () => {
  let shuffleService: ShuffleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShuffleService],
    }).compile();

    shuffleService = module.get<ShuffleService>(ShuffleService);
  });

  describe('shuffleByAlternatedKey', () => {
    it('should shuffle items by alternated key', () => {
      const items = [
        { source: { id: 'a' }, content: 'item1' },
        { source: { id: 'b' }, content: 'item2' },
        { source: { id: 'a' }, content: 'item3' },
        { source: { id: 'b' }, content: 'item4' },
        { source: { id: 'c' }, content: 'item5' },
      ];

      const shuffledItems = shuffleService.shuffleByKey(
        items,
        (item) => item.source?.id || 'unknown',
      );

      expect(shuffledItems).toHaveLength(items.length);

      // Ensure that items are alternated by source
      const sources = shuffledItems.map((item) => item.source?.id || 'unknown');
      for (let i = 1; i < sources.length; i++) {
        expect(sources[i]).not.toBe(sources[i - 1]);
      }
    });

    it('should handle items with unknown keys', () => {
      const items = [
        { source: { id: 'a' }, content: 'item1' },
        { source: { id: 'unknown' }, content: 'item2' },
        { source: { id: 'a' }, content: 'item3' },
      ];

      const shuffledItems = shuffleService.shuffleByKey(
        items,
        (item) => item.source?.id || 'unknown',
      );

      expect(shuffledItems).toHaveLength(3);
    });

    it('should handle an empty array', () => {
      const items: any[] = [];
      const shuffledItems = shuffleService.shuffleByKey(
        items,
        (item) => item.source?.id || 'unknown',
      );

      expect(shuffledItems).toEqual([]);
    });
  });
});
