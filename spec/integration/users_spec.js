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
        User.findOne({ where: { email: 'noEmail' } })
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
  describe('GET /users/sign_in', () => {
    it('should render a sign in page', (done) => {
      request.get(`${base}sign_in`, (err, res, body) => {
        expect(body).toContain('Sign In');
        expect(err).toBeNull();
        done();
      });
    });
  });
  describe('POST /users/:id/upgrade', () => {
    it('should update the user role to premium', (done) => {
      const options = {
        url: `${base}${this.user.id}/upgrade`,
        form: {
          role: 1,
        },
      };
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        User.findOne({ where: { id: this.user.id } }).then((user) => {
          expect(user.role).toBe(1);
          done();
        });
      });
    });
  });
});
