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
      } else if (req.user) {
        res.render('wikis/edit', { wiki });
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  },
  new(req, res, next) {
    if (req.user) {
      res.render('wikis/new');
    } else {
      res.redirect('/');
    }
  },
  create(req, res, next) {
    if (req.user) {
      const newWiki = {
        title: req.body.title,
        body: req.body.body,
        userId: req.user.id,
      };
      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if (err) {
          res.redirect(500, 'wikis/new');
        } else {
          res.redirect(303, `/wikis/${wiki.id}`);
        }
      });
    }
  },
  update(req, res, next) {
    if (req.user) {
      wikiQueries.updateWiki(req.params.id, req.body, (err, wiki) => {
        if (err || wiki == null) {
          res.redirect(404, `wikis/${req.params.id}/edit`);
        } else {
          res.redirect(`wikis/${req.params.id}`);
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
