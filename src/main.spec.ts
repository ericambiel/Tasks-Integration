import main from './main';

describe('Start Server', () => {
  it('Should be possible Start Server', done => {
    main().then(done);
  });
});
