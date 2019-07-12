const CURR_DIR = process.cwd();
const inquirer = require("inquirer");
const fs = require("fs");

const PATH_CONFIG = `${CURR_DIR}/config.cli.json`;

(async () => {
	try {
		if (!fs.existsSync(PATH_CONFIG)) {
			const QUESTIONS_CONFIG = [
				{
					name: "config-db-database",
					type: "input",
					message: "Qual o nome do banco de dados?"
				},
				{
					name: "config-db-host",
					type: "input",
					message: "Qual o HOST do banco de dados:",
					validate: function(input) {
						if (
							/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/g.test(
								input
							)
						)
							return true;
						else return "Host do banco de dados inválido.";
					}
				},
				{
					name: "config-db-user",
					type: "input",
					message: "Qual o USER do banco de dados",
					default: "dev"
				},
				{
					name: "config-db-password",
					type: "input",
					message: "Qual a SENHA do banco de dados?",
					default: ""
				}
			];

			const answersConfig = await inquirer.prompt(QUESTIONS_CONFIG);

			fs.writeFileSync(
				PATH_CONFIG, // contents,
				JSON.stringify(
					{
						db: {
							database: answersConfig["config-db-database"],
							host: answersConfig["config-db-host"],
							password: answersConfig["config-db-password"],
							user: answersConfig["config-db-user"]
						},
						vue: {
							src: "",
							store: ""
						},
						php: {
							class: "/classes",
							model: "/models",
							controls_painel: "/controls_painel",
							controls: "/controls",
							controls_api: "/controls_api"
						}
					},
					null,
					2
				),
				"utf8"
			);
		}

		const config = require(PATH_CONFIG);
		const createDirectoryContents = require("./createDirectoryContents.js");

		//const CHOICES = ["Todos", ...fs.readdirSync(`${__dirname}/../templates`)];

		const QUESTIONS = [
			// {
			// 	name: "project-choice",
			// 	type: "list",
			// 	message: "O que você gostaria de gerar?",
			// 	choices: CHOICES
			// },
			{
				name: "project-file-choice",
				type: "list",
				message: "Qual arquivo você gostaria de gerar?",
				choices: [
					"Todos",
					...fs.readdirSync(`${__dirname}/../templates/php`).map(file => file)
				]

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

		const answers = await inquirer.prompt(QUESTIONS);

		answers["project-choice"] = "php";

		const templatePath = `${__dirname}/../templates/${
			answers["project-choice"]
		}`;

		const path = `${CURR_DIR}/${config.vue.store}/${answers["project-name"]}`;

		if (answers["project-choice"] === "modulo-vuex" && !fs.existsSync(path))
			fs.mkdirSync(path);

		createDirectoryContents(templatePath, answers);
	} catch (error) {
		console.log("[MAX-CLI]:error", error);
	}
})();
