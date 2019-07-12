const fs = require("fs");
const consultar = require("./mysql.js");
const swig = require("swig");
const prettier = require("prettier");
const phpPlugin = require("@prettier/plugin-php/standalone");
const { prettyString } = require("./util");

const createForm = require("./createForm");

const { exec } = require("child_process");

const inquirer = require("inquirer");
const { camelCase, kebabCase } = require("lodash");

const getPath = require("./makePath");

const execute = cmd =>
	new Promise((resolve, reject) => {
		try {
			exec(cmd, resolve);
		} catch (error) {
			reject(error);
		}
	});

const createDirectoryContents = async (templatePath, answers) => {
	const module = answers["project-name"];
	const moduleSingular = answers["project-name-singular"];
	const choice = answers["project-choice"];
	const choiceFile = answers["project-file-choice"];
	const table = answers["table-name"];

	const fields = table ? await consultar(`SHOW COLUMNS FROM ${table}`) : {};

	const form = createForm(fields);

	//console.log("form", form);

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
	const filesToCreate = fs.readdirSync(templatePath);

	filesToCreate.forEach(async file => {
		const origFilePath = `${templatePath}/${file}`;

		// get stats about the current file
		const stats = fs.statSync(origFilePath);

		if (choiceFile !== "Todos" && file !== choiceFile) return;

		if (stats.isFile()) {
			// const contents = fs.readFileSync(origFilePath, "utf8");

			// const contentsFinal = replacer({
			// 	fields,
			// 	module,
			// 	table,
			// 	moduleSingular,
			// 	contents,
			// 	choice
			// });

			const writePath = getPath({
				module,
				choice,
				file,
				choiceFile,
				module
			});

			swig.setFilter("camelCase", camelCase);
			swig.setFilter("prettyString", prettyString);

			swig.setFilter("typeIsNumber", string => {
				return numbersSQL.filter(e => string.toLowerCase().indexOf(e) !== -1)
					.length;
			});

			swig.setFilter("listWithNumbersAndIds", fields => {
				return fields.filter(f => {
					return (
						(f.Field.indexOf("_ids") !== -1 ||
							numbersSQL.filter(e => f.Type.toLowerCase().indexOf(e) !== -1)
								.length) &&
						f.Type.indexOf("date") === -1
					);
				});
			});

			swig.setFilter("listWithoutNumbersAndIds", fields => {
				return fields.filter(f => {
					return (
						f.Field.indexOf("_ids") === -1 &&
						f.Type.indexOf("date") === -1 &&
						numbersSQL.filter(e => f.Type.toLowerCase().indexOf(e) !== -1)
							.length === 0
					);
				});
			});

			swig.setFilter("kebabCase", kebabCase);

			swig.setFilter("nameGetter", string => {
				const newString = string.replace("ids", "");

				return `getBy${newString[0].toUpperCase() +
					camelCase(newString)
						.split("")
						.filter((w, i) => i != 0)
						.join("")}`;
			});

			const contents = swig.compileFile(origFilePath)({
				form,
				numbersSQL,
				table,
				alias: table[0],
				fields,
				module,
				moduleSingular
			});

			console.log(`Arquivo criado com sucesso ${writePath} \n`);

			if (fs.existsSync(writePath)) {
				const answers = await inquirer.prompt({
					message:
						"Você já possui um arquivo do mesmo nome, deseja substituir ?",
					name: "continue",
					type: "confirm"
				});

				if (!answers["continue"]) return;
			}

			//console.log("contents", contents);

			fs.writeFileSync(
				writePath, // contents,
				prettier.format(contents, {
					plugins: [phpPlugin],
					useTabs: true,
					tabWidth: 4,
					semi: true,
					parser: choice === "php" ? "php" : "babylon"
				}),
				"utf8"
			);
		}

		//  else if (stats.isDirectory()) {
		// 	fs.mkdirSync(`${CURR_DIR}/${module}/${file}`);

		// 	// recursive call
		// 	createDirectoryContents(`${templatePath}/${file}`, `${module}/${file}`);
		// }
	});
};

module.exports = createDirectoryContents;
