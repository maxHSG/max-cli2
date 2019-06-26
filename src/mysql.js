const mysql = require("mysql");
const CURR_DIR = process.cwd();
const config = require(`${CURR_DIR}/config.cli.json`);

const connection = mysql.createConnection(config.db);

module.exports = sql => {
	return new Promise((resolve, reject) => {
		connection.connect();

		connection.query(sql, (error, ...args) => {
			if (error) reject(error);

			resolve(...args);
		});

		connection.end();
	});
};
