const faker = require('faker');

const wikis = [];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

for (i = 1; i <= 10; i++) {
  wikis.push({
    title: faker.hacker.noun(),
    body: faker.lorem.sentence(),
    private: false,
    userId: getRandomInt(1, 10),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Wikis', wikis, {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Wikis', null, {}),
};
