const { sequelize } = require('../../src/db/models/index');
const { Wiki } = require('../../src/db/models');
const { User } = require('../../src/db/models');

describe('Wiki', () => {
  beforeEach((done) => {
    sequelize.sync({ force: true })
      .then(() => {
        User.create({
          userName: 'test',
          email: 'test@test.com',
          password: '123456',
        })
          .then((user) => {
            this.user = user;
            done();
          });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
  });
  describe('#create', () => {
    it('should create a wiki page with the valid attributes', (done) => {
      Wiki.create({
        title: 'wikis!',
        body: 'this is informational.',
        userId: this.user.id,
        private: false,
      })
        .then((wiki) => {
          expect(wiki.title).toBe('wikis!');
          expect(wiki.body).toContain('this is informational.');
          expect(wiki.userId).toBe(1);
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
    });
  });
});
