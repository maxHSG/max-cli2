const CURR_DIR = process.cwd();
const inquirer = require("inquirer");
const fs = require("fs");
const config = require(`${CURR_DIR}/config.cli.json`);
const createDirectoryContents = require("./createDirectoryContents.js");

const CHOICES = ["Todos", ...fs.readdirSync(`${__dirname}/../templates`)];

const QUESTIONS = [
	{
		name: "project-choice",
		type: "list",
		message: "O que você gostaria de gerar?",
		choices: CHOICES
	},
	{
		name: "project-file-choice",
		type: "list",
		message: "Qual arquivo você gostaria de gerar?",
		choices: answers => {
			return [
				"Todos",
				...fs
					.readdirSync(`${__dirname}/../templates/${answers["project-choice"]}`)
					.map(file => file)
			];
		}

		// when(answers) {
		// 	return answers["project-choice"] == "php";
		// }
	},
	{
		name: "project-name",
		type: "input",
		message: "Nome do Módulo:",
		validate: function(input) {
			if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
			else
				return "Project name may only include letters, numbers, underscores and hashes.";
		}
	},
	{
		name: "project-name-singular",
		type: "input",
		message: "Nome do Módulo no singular:",
		default(answers) {
			const nameArray = answers["project-name"].split("");
			return nameArray.filter((w, i) => i != nameArray.length - 1).join("");
		}
	},
	{
		name: "table-name",
		type: "input",
		message: "O nome da tabela no banco de dados:",
		default(answers) {
			return answers["project-name"];
		}
		// when(answers) {
		// 	return answers["project-choice"] != "modulo-vuex";
		// }
	}
];

inquirer
	.prompt(QUESTIONS)
	.then(async answers => {
		const templatePath = `${__dirname}/../templates/${
			answers["project-choice"]
		}`;

		const path = `${CURR_DIR}/${config.vue.store}/${answers["project-name"]}`;

		if (answers["project-choice"] === "modulo-vuex" && !fs.existsSync(path))
			fs.mkdirSync(path);

		createDirectoryContents(templatePath, answers);
	})
	.catch(err => console.log("Erro:", err));
