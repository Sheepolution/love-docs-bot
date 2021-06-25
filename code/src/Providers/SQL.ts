const { Model } = require('objection');
const Knex = require('knex');

// Initialize knex.
const knex = Knex({
    client: 'pg',
    connection: process.env.DB_CONNECTION_STRING
});

// Give the knex instance to objection.
Model.knex(knex);