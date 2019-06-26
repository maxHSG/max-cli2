const CURR_DIR = process.cwd();
const config = require(`${CURR_DIR}/config.cli.json`);
const { kebabCase } = require("lodash");

module.exports = ({ module, file, choice }) => {
	if (!file) return `${CURR_DIR}/`;

	let namefile = "";

	if (choice === "php") {
		console.log("file", file);

		switch (file) {
			case "model.php":
				namefile = `${module.toLowerCase()}_model.php`;
				break;
			case "controls_api.php":
				namefile = `${kebabCase(module)}_control.php`;
				break;
			// case "model2.php":
			// 	namefile = `${module}.php`;
			// break;
			case "controls_painel.php":
				namefile = `${kebabCase(module)}_control.php`;
				break;
			case "class.php":
			default:
				namefile = `class_${module.toLowerCase()}.php`;
				break;
		}

		return `${CURR_DIR}/${config.php[file.replace(".php", "")]}/${namefile}`;
	}

	return `${CURR_DIR}/${config.vue.store}/${module}/${file}`;
};
