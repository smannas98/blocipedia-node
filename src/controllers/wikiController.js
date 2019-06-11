const { markdown } = require('markdown');
const wikiQueries = require('../db/queries.wikis.js');
const Authorizer = require('../policies/application');

module.exports = {
  index(req, res, next) {
    if (req.user.role === 1 || req.user.role === 2) {
      wikiQueries.getAllWikis((wikis) => {
        console.log('DEBUG: wikiQueries.getAllWikis -> ');
        console.log('/n---------------/n/n');
        res.render('wikis/index', { wikis });
      });
    } else {
      wikiQueries.getPublicWikis((wikis) => {
        console.log('DEBUG: wikiQueries.getPublicWikis -> ');
        console.log('/n---------------/n/n');
        res.render('wikis/index', { wikis });
      });
    }
  },
  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, '/');
      } else {
        wiki.body = markdown.toHTML(wiki.body);
        res.render('wikis/show', { wiki });
      }
    });
  },
  edit(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, '/');
      } else {
        const authorized = new Authorizer(req.user).edit();

        if (authorized) {
          res.render('wikis/edit', { wiki });
        } else {
          res.redirect('/wikis');
        }
      }
    });
  },
  new(req, res, next) {
    const authorized = new Authorizer(req.user).new();

    if (authorized) {
      res.render('wikis/new');
    } else {
      res.redirect('/wikis');
    }
  },
  create(req, res, next) {
    const authorized = new Authorizer(req.user).create();

    if (authorized) {
      const newWiki = {
        title: req.body.title,
        body: req.body.body,
        private: req.body.private,
        userId: req.user.id,
      };
      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if (err) {
          console.log(err);
          res.redirect(500, 'wikis/new');
        } else {
          res.redirect(303, `/wikis/${wiki.id}`);
        }
      });
    } else {
      res.redirect('/wikis');
    }
  },
  update(req, res, next) {
    wikiQueries.updateWiki(req, req.body, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, `/wikis/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  },
  destroy(req, res, next) {
    wikiQueries.deleteWiki(req, (err, deletedRecordsCount) => {
      if (err) {
        console.log(err);
        res.redirect(500, `/wikis/${req.params.id}`);
      } else {
        res.redirect(303, '/wikis');
      }
    });
  },
};
