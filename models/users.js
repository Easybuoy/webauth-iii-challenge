const db = require("../data/dbConfig.js");

function get() {
  return db("users");
}

function getById(id) {
  return db("users")
    .where({ id })
    .first();
}

function insert(project) {
  return db("users")
    .insert(project)
    .then(ids => {
      return getById(ids[0]);
    });
}

function update(id, changes) {
  return db("users")
    .where({ id })
    .update(changes);
}

function remove(id) {
  return db("users")
    .where("id", id)
    .del();
}

function getByUsername(username) {
  return db("users").where("username", username);
}

module.exports = {
  get,
  getById,
  insert,
  update,
  remove,
  getByUsername
};
