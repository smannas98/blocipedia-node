const request = require('request');
const server = require('../../src/server');
const { User } = require('../../src/db/models');
const { Wiki } = require('../../src/db/models');
const { sequelize } = require('../../src/db/models/index');

const base = 'http://localhost:3000/wikis/';

describe('routes : wikis', () => {
  describe('Wikis: Public', () => {
    beforeEach((done) => {
      sequelize.sync({ force: true })
        .then(() => {
          User.create({
            userName: 'testUser',
            email: 'test@test.com',
            password: '123456',
          })
            .then((user) => {
              this.user = user;
              Wiki.create({
                title: 'wikis!',
                body: 'this is informational.',
                userId: this.user.id,
                private: false,
              })
                .then((wiki) => {
                  this.wiki = wiki;
                  done();
                })
                .catch((err) => {
                  console.log(err);
                  done();
                });
            });
        });
    });

    describe('GET /wikis', () => {
      it('should render a view that displays all wikis', (done) => {
        request.get(`${base}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain('All Wikis');
          expect(body).toContain('wikis!');
          done();
        });
      });
    });

    describe('GET /wikis/:id', () => {
      it('should render a view of the wiki', (done) => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain('this is informational.');
          expect(body).toContain('wikis!');
          done();
        });
      });
    });

    describe('GET /wikis/new', () => {
      it('should render a form to create a new wiki', (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain('New Wiki');
          done();
        });
      });
    });

    describe('GET /wikis/:id/edit', () => {
      it('should rener a view an edit form for selected wiki', (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain('Edit Wiki');
          expect(body).toContain('wikis!');
          done();
        });
      });
    });

    describe('POST /wikis/create', () => {
      it('should create a wiki with valid criteria', (done) => {
        const options = {
          url: `${base}create`,
          form: {
            title: 'new wiki',
            body: 'this is purely informational.',
            userId: this.user.id,
            private: false,
          },
        };

        request.post(options, (err, res, body) => {
          Wiki.findOne({ where: { title: 'new wiki' } })
            .then((wiki) => {
              expect(wiki).not.toBeNull();
              expect(wiki.title).toBe('new wiki');
              expect(wiki.body).toBe('this is purely informational.');
              expect(wiki.userId).not.toBeNull();
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
        });
      });
      /*
      xit('should not create a wiki that fails validation criteria', (done) => {
        const options = {
          url: `${base}create`,
          form: {
            title: 'a',
            body: 'b',
            userId: this.user.id,
            private: false,
          },
        };
        request.post(options, (err, res, body) => {
          Wiki.findOne({ where: { title: 'a' } })
            .then((wiki) => {
              expect(wiki).toBeNull();
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
        });
      });
      */
    });

    describe('POST /wikis/:id/update', () => {
      it('should update the wiki the given values', (done) => {
        const options = {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: 'updated title',
            body: 'this is an updated body',
          },
        };
        request.post(options, (err, res, body) => {
          expect(err).toBeNull();
          Wiki.findOne({ where: { id: this.wiki.id } })
            .then((wiki) => {
              expect(wiki.title).toBe('updated title');
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
        });
      });
    });

    describe('POST /wikis/:id/destroy', () => {
      it('should delete the selected wiki', (done) => {
        expect(this.wiki.id).toBe(1);
        request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
          Wiki.findOne({ where: { id: 1 } }).then((wiki) => {
            expect(err).toBeNull();
            expect(wiki).toBeNull();
            done();
          });
        });
      });
    });
  });
  describe('Wikis: Private', () => {
    beforeEach((done) => {
      sequelize.sync({ force: true }).then(() => {
        User.create({
          userName: 'testUser',
          email: 'test@test.com',
          password: '123456',
        })
          .then((user) => {
            this.user = user;
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
