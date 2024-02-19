import knex from "knex";
import knexConfig from "../knexfile.js";

const environment = "production";

const config = knexConfig[environment];

const db = knex(config);

export default db;
