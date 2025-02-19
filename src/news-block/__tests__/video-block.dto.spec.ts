import { VideoBlock } from '../video.block';

describe('VideoBlock', () => {
  it('should serialize VideoBlock to JSON correctly', () => {
    const block = new VideoBlock('videoUrl');
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: VideoBlock.identifier,
      videoUrl: 'videoUrl',
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
