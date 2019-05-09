const wikiQueries = require('../db/queries.wikis.js');

module.exports = {
  index(req, res, next) {
    wikiQueries.getAllWikis((wikis) => {
      res.render('wikis/index', { wikis });
    });
  },
  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, '/');
      } else {
        res.render('wikis/show', { wiki });
      }
    });
  },
  edit(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, '/');
      }
      res.render('wikis/edit', { wiki });
    });
  },
  new(req, res, next) {
    res.render('wikis/new');
  },
  create(req, res, next) {
    if (req.user) {
      console.log('DEBUG: wikiController.create -> user object in session');
      console.log('\n----------------------------------------\n\n');
      console.log(req.user);
      console.log('\n----------------------------------------\n\n');
      console.log('DEBUG: wikiController.create -> user id');
      console.log('\n----------------------------------------\n\n');
      console.log(Object.keys(req.user[0]));
      console.log('\n----------------------------------------\n\n');
      const newWiki = {
        title: req.body.title,
        body: req.body.body,
        private: false,
        userId: req.user[0].id,
      };
      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if (err) {
          console.log(err);
          res.redirect(500, 'wikis/new');
        } else {
          res.redirect(303, `/wikis/${wiki.id}`);
        }
      });
    }
  },
  update(req, res, next) {
    if (req.user.length) {
      wikiQueries.updateWiki(req.params.id, req.body, (err, wiki) => {
        if (err || wiki == null) {
          res.redirect(404, `/wikis/${req.params.id}/edit`);
        } else {
          console.log(`wikis/${req.params.id}`);
          res.redirect(`/wikis/${req.params.id}`);
        }
      });
    }
  },
  destroy(req, res, next) {
    if (req.user) {
      wikiQueries.deleteWiki(req.params.id, (err, deletedRecordsCount) => {
        if (err) {
          res.redirect(500, `/wikis/${req.params.id}`);
        } else {
          res.redirect(303, '/wikis');
        }
      });
    }
  },
};
