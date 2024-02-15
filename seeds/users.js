const bcrypt = require("bcrypt");

exports.seed = async function (knex) {
  await knex("users").del();

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash("password", saltRounds);

  await knex("users").insert([
    {
      id: 1,
      username: "user1",
      email: "user1@example.com",
      password: hashedPassword,
    },
    {
      id: 2,
      username: "user2",
      email: "user2@example.com",
      password: hashedPassword,
    },
    {
      id: 3,
      username: "user3",
      email: "user3@example.com",
      password: hashedPassword,
    },
    {
      id: 4,
      username: "user4",
      email: "user4@example.com",
      password: hashedPassword,
    },
  ]);
};
