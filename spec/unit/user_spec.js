const { sequelize } = require('../../src/db/models/index');
const { User } = require('../../src/db/models');

describe('User', () => {
  beforeEach((done) => {
    sequelize.sync({ force: true })
      .then(() => {
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
  });
  describe('#create', () => {
    it('should create a User object with a valid email and password', (done) => {
      User.create({
        userName: 'user1',
        email: 'seanmanns02@gmail.com',
        password: '123456',
      })
      .then((user) => {
        expect(user.email).toBe('seanmanns02@gmail.com');
        expect(user.password).toBe('123456');
        done();
        })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
    it('should not create a user with invalid email or password', (done) => {
      User.create({
        userName: 'user1',
        email: 'this is my email',
        password: 'passwords',
      })
      .then((user) => {
        done();
      })
      .catch((err) => {
        expect(err.message).toContain('Validation error: must be a valid email');
        done();
      });
    });
    it('should not create a user with an email that has already been taken', (done) => {
      User.create({
        userName: 'user1',
        email: 'user@example.com',
        password: 'password',
      })
      .then((user) => {
        User.create({
          userName: 'user2',
          email: 'user@example.com',
          password: 'passwords',
        })
        .then((user) => {
          done();
        })
        .catch((err) => {
          expect(err.message).toContain('Validation error');
          done();
        });
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });
});
