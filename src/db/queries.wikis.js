const Sequelize = require('sequelize');
const { Wiki } = require('./models');
const { User } = require('./models');
const { Collaborator } = require('./models');
const Authorizer = require('../policies/application');

const { Op } = Sequelize;

module.exports = {
  addWiki(newWiki, callback) {
    return Wiki.create(newWiki).then((wiki) => {
      callback(null, wiki);
    })
      .catch((err) => {
        callback(err);
      });
  },
  getWiki(req, callback) {
    return Wiki.findOne({ where: { id: req.params.id } }, {
      include: [
        {
          model: Collaborator,
          as: 'collaborators',
          include: [
            { model: User },
          ],
        },
      ],
    })
      .then((wiki) => {
        if (wiki.private === false) {
          callback(null, wiki);
        } else if (req.user.role === 1 || req.user.role === 2) {
          callback(null, wiki);
        } else if (req.user.role === 0) {
          Collaborator.findOne({ where: { userId: req.user.id } }).then((collaborator) => {
            if (!collaborator) {
              callback('not authorized');
            } else if (collaborator.wikiId === wiki.id) {
              callback(null, wiki);
            } else {
              callback('not authorized');
            }
          })
            .catch((err) => {
              callback(err);
            });
        } else {
          callback('not authorized');
        }
      })
      .catch((err) => {
        callback(err);
      });
  },
  getCollaboratorWikis(collaborator, callback) {
    return Wiki.findAll({
      where: {
        [Op.or]: [{ private: false }, { id: collaborator.wikiId }],
      },
    })
      .then((wikis) => {
        callback(null, wikis);
      })
      .catch((err) => {
        callback(err);
      });
  },
  getPublicWikis(callback, callbackOnError) {
    return Wiki.findAll({ where: { private: false } }).then((wikis) => {
      callback(wikis);
    })
      .catch((err) => {
        callbackOnError(err);
      });
  },
  getAllWikis(callback, callbackOnError) {
    return Wiki.findAll().then((wikis) => {
      callback(wikis);
    })
      .catch((err) => {
        callbackOnError(err);
      });
  },
  updateWiki(req, updatedWiki, callback) {
    return Wiki.findOne({ where: { id: req.params.id } }).then((wiki) => {
      if (!wiki) {
        return callback('Wiki not found.');
      }
      const authorized = new Authorizer(req.user).update();

      if (authorized) {
        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki),
        })
          .then(() => {
            callback(null, wiki);
          })
          .catch((err) => {
            callback(err);
          });
      } else {
        callback(401);
      }
    });
  },
  deleteWiki(req, callback) {
    return Wiki.findOne({
      where: { id: req.params.id },
    })
      .then((wiki) => {
        const authorized = new Authorizer(req.user, wiki).destroy();

        if (authorized) {
          Wiki.destroy({ where: { id: req.params.id } }).then((deletedRecordsCount) => {
            callback(null, deletedRecordsCount);
          })
            .catch((err) => {
              callback(err);
            });
        } else {
          callback(401);
        }
      })
      .catch((err) => {
        callback(err);
      });
  },
  downgradeWikis(req, callback) {
    return Wiki.findAll({ where: { userId: req.user.id } }).then((wikis) => {
      wikis.forEach((wiki) => {
        if (wiki.private === true) {
          wiki.update({ private: false });
        }
      });
      callback(null, wikis);
    })
      .catch((err) => {
        callback(err);
      });
  },
};
