import { VideoIntroductionBlock } from '../video-introduction-block.dto';
import { CategoryDto } from '../../../category';

describe('VideoIntroductionBlock', () => {
  it('should serialize VideoIntroductionBlock to JSON correctly', () => {
    const block = new VideoIntroductionBlock(
      new CategoryDto('key', 'name', 1.0),
      'title',
      'videoUrl',
    );
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: VideoIntroductionBlock.identifier,
      category: {
        key: 'key',
        name: 'name',
        priority: 1.0,
      },
      title: 'title',
      videoUrl: 'videoUrl',
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
