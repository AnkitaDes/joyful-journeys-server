const bcrypt = require("bcrypt");

exports.seed = async function (knex) {
  await knex("memories").del();
  await knex("users").del();

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash("password", saltRounds);

  await knex("users").insert([
    {
      id: 1,
      username: "user1",
      email: "user1@example.com",
      password_hash: hashedPassword,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 2,
      username: "user2",
      email: "user2@example.com",
      password_hash: hashedPassword,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 3,
      username: "user3",
      email: "user3@example.com",
      password_hash: hashedPassword,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 4,
      username: "user4",
      email: "user4@example.com",
      password_hash: hashedPassword,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);

  await knex("memories").insert([
    {
      id: 1,
      description: "This is a cute baby smiling",
      image:
        "https://images.unsplash.com/photo-1650023932630-0c249bbf2e96?q=80&w=1943&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      likes: 10,
      users_id: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 2,
      description: "This is a cute baby laughing",
      image: "baby2.jpg",
      likes: 20,
      users_id: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 3,
      description: "This is a cute baby sleeping",
      image: "baby3.jpg",
      likes: 30,
      users_id: 2,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 4,
      description: "This is a cute baby playing",
      image: "baby4.jpg",
      likes: 40,
      users_id: 2,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
