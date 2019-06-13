const collaboratorQueries = require('../db/queries.collaborators.js');

module.exports = {
  add(req, res, next) {
    res.render('collaborators/create', { wikiId: req.params.id });
  },
  create(req, res, next) {
    collaboratorQueries.createCollaborator(req, (err, collaborator) => {
      if (err) {
        req.flash('error', err);
        res.redirect(`/wikis/${req.params.id}`);
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  },
  delete(req, res, next) {
    res.render('collaborators/delete', { wikiId: req.params.id });
  },
  destroy(req, res, next) {
    collaboratorQueries.destroyCollaborator(req, (err, collaborator) => {
      if (err) {
        req.flash('error', err);
        res.redirect(`/wikis/${req.params.id}`);
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  },
};
