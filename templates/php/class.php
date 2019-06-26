<?php
class {{module|camelCase}} extends {{module|camelCase}}Model{

	public static function tabelar($recordset=[],$param=[]){

		return 
		!empty($recordset) ? 
			tpl::a('/painel/{{module|kebabCase}}/add','Adicionar','fa fa-plus',['class'=>'pull-right btn btn-primary btn-ajax']).
			tpl::div(
				tpl::table(
					tpl::thead(
						tpl::tr(
						{% for field in fields -%}
							{% if field.Field !== 'etiquetas_ids' -%}
								tpl::th('{{field.Field}}').
							{%- endif %}
						{%- endfor %}
							tpl::th('Menu')
						)
					).
					tpl::tbody(
						!empty($recordset) ? 
						tpl::join(
							array_map("self::tr",$recordset)
						) : NULL
					)
				)
			,['class'=>'table-responsive'])

			: util::semRegistros('Nenhum registro encontrado','/painel/{{module|kebabCase}}/add/');


	}

	public static function tr($reg=[],$p=""){	

		return 
		tpl::tr(
	{% for field in fields -%}
		{% if Field === "status" %}
	 		tpl::td((int)$reg["status"] ? "Ativo" : "Inativo").
		{% elseif Type === "date" %}
	 		tpl::td(util::databr($reg["{{field.Field}}"])).
		{% elseif Type === "datetime" %}
	 		tpl::td(util::parseDate($reg["{{field.Field}}"]),"['databr'] ['horario']" ).
		{% elseif field.Field.indexOf(field.Type) !== -1 %}
	 		tpl::td(util::reais($reg["{{field.Field}}"]) ).
		{% elseif field.Field.indexOf('etiquetas_ids') === -1 %}
 			tpl::td($reg["{{field.Field}}"]). 
		{% endif %}
	{%- endfor %}			
			tpl::td(self::menu($reg,$p))
		)
	{% if field.Field === 'etiquetas_ids' %}
		.etiquetas::tr($reg,'{{module}}')
	{% else %}
		;
	{% endif %}
	}

	public static function menu($reg=""){
		$btn = [];
		
		//if(user::temPermissao('{{module}}-edit')){
			$btn[] = tpl::btnWarning(tpl::i('fa fa-edit'),[
					'class'=>'btn-ajax margin-right-5 btn-sm',
					'data-url'=>"/painel/{{module|kebabCase}}/editar/{$reg['id']}/"
			]);				
		//}
		//if(user::temPermissao('{{module}}-edit-del')){
			$btn[] = tpl::btnDanger(tpl::i('fa fa-trash'),[
					'class'=>'btn-ajax btn-sm',
					'data-url'=>"/painel/{{module|kebabCase}}/excluir/{$reg['id']}/",
					'data-confirm'=>'Tem certeza que deseja excluir definitivamente este item?',

				]);
		//}

		return tpl::join($btn);
	}	

	public static function form($reg=[],$param=[]){

		$reg = !empty($reg) ? $reg : {{module}}::getFields();

		$body[] = tpl::wam();

		{{form}}

		return 
		Form::create(['action'=>'/painel/{{module|kebabCase}}/salvar/','class'=>'form form-ajax','method'=>'POST'],
			$body,
		'Adicionar','{{module}}');

	}

	public function formBusca(){
		global $opcoes;

		$get_default = [
			'f_busca' => null,
			{{filtros}}

		];

		$reg = set_param($get_default,$_GET);

		$body[] = 
		Form::grid(
			Form::label("Palavra chave") . 
			Form::input_text("f_busca",$reg['f_busca'])
		,'col-md-12 col-sm-12');

		{{formBusca}}


		return 
		Form::create(['action'=>'/painel/{{module|kebabCase}}/pesquisar/','class'=>'form ','method'=>'GET'],
			$body,
		'Buscar','{{module}}');
	}	

}