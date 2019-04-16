const request = require('request');
const server = require('../../src/server');
const { User } = require('../../src/db/models');
const { sequelize } = require('../../src/db/models/index');

const base = 'http://localhost:3000/users/';

describe('routes : users', () => {
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
  describe('GET /users/sign_up', () => {
    it('should render a view with a sign up page', (done) => {
      request.get(`${base}sign_up`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain('Sign up');
        done();
      });
    });
  });
  describe('POST /users/', () => {
    it('should create a user with valid username, email, and password', (done) => {
      const options = {
        url: base,
        form: {
          userName: 'smannas',
          email: 'email@email.com',
          password: '123456',
        },
      };
      request.post(options, (err, res, body) => {
        User.findOne({ where: { email: 'email@email.com' } })
        .then((user) => {
          expect(user).not.toBeNull();
          expect(user.email).toBe('email@email.com');
          expect(user.userName).toBe('smannas');
          expect(user.id).toBe(1);
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
    it('should not create a user with invalid values', (done) => {
      const options = {
        url: base,
        form: {
          userName: 'smannas',
          email: 'noEmail',
          password: 'password',
        },
      };
      request.post(options, (err, res, body) => {
        User.findOne({ where: { email: 'noEmail'} })
        .then((user) => {
          expect(user).toBeNull();
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });
});
