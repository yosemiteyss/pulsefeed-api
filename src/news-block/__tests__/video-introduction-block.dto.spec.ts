import { VideoIntroductionBlock } from '../video-introduction.block';
import { CategoryResponse } from '../../category';

describe('VideoIntroductionBlock', () => {
  it('should serialize VideoIntroductionBlock to JSON correctly', () => {
    const block = new VideoIntroductionBlock(
      new CategoryResponse('key', 'title', 1.0),
      'title',
      'videoUrl',
    );
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: VideoIntroductionBlock.identifier,
      category: {
        key: 'key',
        title: 'title',
        priority: 1.0,
      },
      title: 'title',
      videoUrl: 'videoUrl',
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
