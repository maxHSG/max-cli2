const { prettyString } = require("./util");

const createLabel = (Field, Null) => {
	return `Form::label("${prettyString(Field)} ${Null !== "YES" ? ",1" : ""}").`;
};

const createInputHidden = ({ Field }) => `
	$body[] = Form::input_hidden("${Field}",$reg["${Field}"]);
`;

const createInputText = ({ Field, Null }) => `
	$body[] = Form::grid(			
			${createLabel(Field, Null)}
			Form::input_text("${Field}",$reg["${Field}"])
		);
`;
const createInputTextArea = ({ Field, Null }) => `
	$body[] = Form::grid(
			${createLabel(Field, Null)}
			Form::textarea("${Field}",$reg["${Field}"])
		);
`;

const createInputMoeda = ({ Field, Null }) => `
	$body[] = Form::grid(
		${createLabel(Field, Null)}
		Form::input_moeda("${Field}",util::reais($reg["${Field}"]) )
	,3);
`;

const createInputDate = ({ Field, Null }) => `
	$body[] = Form::grid(
		${createLabel(Field, Null)}
		Form::input_data("${Field}",util::databr($reg["${Field}"]) )
	,3);
`;

module.exports = fields => {
	const out = fields.map(field => {
		const { Field, Key, Default, Type } = field;

		if (Field === "id") {
			return createInputHidden(field);
		}

		if (~Type.toLowerCase().indexOf("tinyint")) {
			return createInputHidden(field);
		}

		if (~Type.toLowerCase().indexOf("varchar")) {
			return createInputText(field);
		}

		if (~Type.toLowerCase().indexOf("text")) {
			return createInputTextArea(field);
		}

		if (~Type.toLowerCase().indexOf("double")) {
			return createInputMoeda(field);
		}

		if (
			~Type.toLowerCase().indexOf("date") &&
			Field != "data_atualizacao" &&
			Field != "data_cadastro"
		) {
			return createInputDate(field);
		}

		return "";
	});

	return out.join("\n");
};
