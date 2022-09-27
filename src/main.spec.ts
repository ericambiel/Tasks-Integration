import main from './main';

describe('Start Server', () => {
  it('Should be possible Start Server', async done => {
    await main().then(done);
  });
});
