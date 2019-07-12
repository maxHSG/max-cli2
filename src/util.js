const capitalize = require("lodash/capitalize");

const numbersSQL = [
	"int",
	"tinyint",
	"smallint",
	"mediumint",
	"bigint",
	"bit",
	"float",
	"double",
	"decimal"
];

const prettyString = (string = "") => {
	return `${capitalize(
		string
			.replace("_", " ")
			.replace("-", " ")
			.replace("cao", "ção")
			.replace("sao", "são")
	)}`;
};

const stringsSQL = ["text", "varchar", "char"];

const isNumericSQL = type => {
	return numbersSQL.some(e => e.indexOf(type.toLowerCase()));
};

const isStringSQL = type => {
	return stringsSQL.some(e => e.indexOf(type.toLowerCase()));
};

module.exports = { isNumericSQL, isStringSQL, prettyString };
