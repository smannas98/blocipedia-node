const { Wiki } = require('./models');
const { User } = require('./models');
const { Collaborator } = require('./models');

module.exports = {
  createCollaborator(req, callback) {
    User.findOne({ where: { userName: req.body.collaboratorUserName } }).then((user) => {
      Collaborator.findAll({ where: { userId: user.id } }).then((collaborators) => {
        if (collaborators.length !== 0) {
          callback('collaborator already exists');
        } else {
          Collaborator.create({
            userId: user[0].id,
            wikiId: req.params.id,
          })
            .then((collaborator) => {
              callback(null, collaborator);
            })
            .catch((err) => {
              callback(err);
            });
        }
      })
        .catch((err) => {
          callback(err);
        });
    })
      .catch((err) => {
        callback(err);
      });
  },
  destroyCollaborator(req, callback) {
    User.findOne({ where: { userName: req.body.collaboratorUserName } }).then((user) => {
      Collaborator.findOne({ where: { userId: user.id } }).then((collaborator) => {
        collaborator.destroy().then((deletedCollaborator) => {
          callback(null, deletedCollaborator);
        })
          .catch((err) => {
            callback(err);
          });
      })
        .catch((err) => {
          callback('collaborator not found.');
        });
    })
      .catch((err) => {
        callback('user not found.');
      });
  },
};
