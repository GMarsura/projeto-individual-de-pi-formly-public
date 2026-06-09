const db = require('../connection/connection');

async function signup(name, username, password) {
    const sql = `
        INSERT INTO users(name, username, password)
        VALUES ("${name}", "${username}", "${password}")
    `;

    const [result] = await db.execute(sql);

    return result;
}

async function login(username, password) {
    const sql = `
        SELECT id, name, username, role
        FROM users
        WHERE username = "${username}"
        AND password = "${password}"
    `;

    const [rows] = await db.execute(sql);

    return rows;
}

module.exports = {
    signup,
    login
};