const faker = require('faker');

const users = [];
for (let i = 1; i <= 10; i++) {
  users.push({
    userName: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: new Date(),
    updatedAt: new Date(),
    role: 0,
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', users, {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {}),

};
