<?php
/******************************************************************************
 *   	Model {{module|camelCase}} 
 *****************************************************************************/

class {{module|camelCase}}Model {

	protected static $fields = [
	{% for field in fields -%}

		'{{field.Field}}'=> null,
		
	{%- endfor %}
	];

	protected static $param = [
	{% for field in fields -%}
		{% if field.Field !== 'id' -%}
			'f_{{field.Field | replace("_ids","") | replace("_id","") }}'=> null,
		{% elseif field.Type.indexOf('date') !== -1 -%}
			'f_{{field.Field}}1'=> null,
			'f_{{field.Field}}2'=> null,
		{% else -%}
			'f_{{field.Field}}'=> null,
		{%- endif %}
	{%- endfor %}
		'f_busca'=>'',
		'debug'=>false,
		'first'=>false,
		'debug'=>false,
		'css'=>null,
		'ordem'=>'{{alias}}.id DESC',
		'limite'=>null,
		'campos'=>null,
		'qtde_por_pagina'=>25,
		'count'=>false,
		'pg'=>1,
		'ini'=>0,
		'indice' => null,
	];
	
	public static function consulta($param=[]){
		global $dominio;

		$j = $c = $g  = $f = null;
		
		$p = set_param(self::$param,$param);

		//Filtros
		{% for field in fields -%}

		{% if (field.Field.indexOf("dominio") !== -1) -%}
			$f[] = "{{alias}}.{{field.Field}} = {$dominio['id']}";

		{% elseif (field.Field.indexOf("_ids") !== -1) -%}

			if(is_numeric($p['f_{{field.Field | replace("_ids","")}}'])) 
				$f[] = "FIND_IN_SET({$p['f_{{field.Field | replace("_ids","")}}']},{{alias}}.{{field.Field}})";

			elseif(is_array($p['f_{{field.Field}}'])) 
				$f[] = array_find_in_set($p['f_{{field.Field | replace("_ids","")}}'],"`{{alias}}`.{{field.Field}}");			
		
			elseif(is_numeric($p['f_not_{{field.Field | replace("_ids","")}}'])) 
				$f[] = " NOT FIND_IN_SET({$p['f_{{field.Field | replace("_ids","")}}']},{{alias}}.{{field.Field}})";
			
		{% elseif field.Type.indexOf("date") !== -1 -%}
		
			if(!empty($p['f_{{field.Field}}1'])) 
				$f[] = "{{alias}}.{{field.Field}} >= '".util::datasql($p['{{field.Field}}'])."'";		
			
			if(!empty($p['f_{{field.Field}}2']))
				 $f[] = "{{alias}}.{{field.Field}} <= '".util::datasql($p['{{field.Field}}'])."'";
			
		{% elseif numbersSQL.includes(field.Field) -%}
			{% if field.Field === 'id' %}
				if(is_numeric($p['f_{{field.Field}}'])) 
					$f[]="{{alias}}.{{field.Field}} = {$p['f_{{field.Field}}']}";
				
				
				elseif(is_array($p['f_{{field.Field}}'])) 
					$f[] = "{{alias}}.${field.Field} IN ('".join("','",$p['f_{{field.Field}}'])."')";
				
				elseif(is_array($p['f_not_{{field.Field}}'])) 
					$f[] = "{{alias}}.{{field.Field}} IN ('".join("','",$p['f_{{field.Field}}'])."')";
				
				
				else if(is_numeric($p['f_not_{{field.Field}}'])) 
					$f[]="{{alias}}.{{field.Field}} != {$p['f_not_{{field.Field}}']}";

			{% else %}

				if(is_numeric($p['f_{{field.Field | replace("_id","")}}'])) 
					$f[]="{{alias}}.{{field.Field | replace("_id","")}} = {$p['f_{{field.Field | replace("_id","")}}']}";
				
				
				elseif(is_array($p['f_{{field.Field | replace("_id","")}}'])) 
					$f[] = "{{alias}}.${field.Field} IN ('".join("','",$p['f_{{field.Field | replace("_id","")}}'])."')";
				
				elseif(is_array($p['f_not_{{field.Field | replace("_id","")}}'])) 
					$f[] = "{{alias}}.${field.Field} IN ('".join("','",$p['f_{{field.Field | replace("_id","")}}'])."')";
				
				
				else if(is_numeric($p['f_not_{{field.Field | replace("_id","")}}'])) 
					$f[]="{{alias}}.{{field.Field | replace("_id","")}} != {$p['f_not_{{field.Field | replace("_id","")}}']}";

			{% endif %}

		{% else -%}			
			if(!empty($p['f_{{field.Field}}'])) 
				$f[] = "{{alias}}.{{field.Field}} = '{$p['f_{{field.Field}}']}' ";			

		{%- endif %}

	{%- endfor %}


		if($p['f_busca']){
			$f_busca = anti_sql_injection($p['f_busca']);
			
			$f_plv = [];

			if(is_numeric($f_busca)){
			{% for field in fields -%}
				{% if field.Field.indexOf('_ids') !== -1 -%}					
					$f_plv[] = "FIND_IN_SET($f_busca,`{{alias}}`.{field.Field}}) ";					
				{% else -%}
					$f_plv[] = "`{{alias}}`.{{field.Field}} = $f_busca ";					
				{%- endif %}
			{%- endfor %}
			}else{
			{% for field in fields -%}

				$f_plv[] = "`{{alias}}`.{{field.Field}} LIKE '%$f_busca%' ";				
				
			{%- endfor %}
			}

			$f[] = join(' OR ',$f_plv);

		 
		}


		// Peças da SQL
		$join = (count($j)) ? join(" " . PHP_EOL,$j) : null;
		$campos = (count($c)) ? join(", " . PHP_EOL,$c) : "*";
		$wherebusca = (count($f)>0) ? PHP_EOL . " WHERE " . join(PHP_EOL . " AND ",$f) : null;
		$ordem = ($p["ordem"]) ? PHP_EOL . " ORDER BY " . $p['ordem'] : "";
		$limite = ($p["limite"]) ? PHP_EOL . " LIMIT ".$p["limite"] : "";

		if($p["qtde_por_pagina"]){
		  	$p["ini"] = $p["ini"] > 0 ? $p["ini"] : 0;
		  	if($p["pg"]>1){
		  		$p["ini"] = $p["qtde_por_pagina"] * ($p["pg"]-1);
		  	}
		  	$limite = PHP_EOL . " LIMIT ".(int)$p["ini"].",".$p["qtde_por_pagina"];
		}			
		
		// SQL
		$sql_base = "FROM `{{table}}` `{{alias}}` {$join}{$wherebusca}";
		$sql = "SELECT {$campos} {$sql_base} GROUP BY `{{alias}}`.`id` {$ordem}{$limite}";
		$sql_count = "SELECT COUNT(DISTINCT(`{{alias}}`.`id`)) as total_regs ".$sql_base;
		$sql_count_paginado = "SELECT COUNT(DISTINCT(`regs`.`id`)) as total_regs FROM (SELECT DISTINCT(`{{alias}}`.`id`) {$sql_base} {$limite}) as regs";
	

		#echo nl2br($sql.str_repeat(PHP_EOL,2)); print_r($p); exit;
		
		if(empty($p["count"]))
			$recordset = consultasql($sql,$p["indice"]);

		//Efetua as consultas com ou sem paginacao
		if($p["count"] == "paginado")
			$recordset["total"] = consultabanco_count($sql_count_paginado,"total_regs");

		elseif($p["qtde_por_pagina"] || $p["count"])
			$recordset["total"] = consultabanco_count($sql_count,"total_regs");		

		if($p["count"])
			return $recordset["total"];

		if(!empty($p["first"])){
			return !empty($recordset) ? current($recordset) : false;
		}
		    
		return $recordset;
	}

	public static function getFields(){
		return self::$fields;
	}

	public static function getParams(){
		return self::$param;
	}

	public static function get($id = ''){
		if(is_numeric($id)) 
			return self::consulta(['f_id'=>$id,'first'=>true]);
		else if(is_array($id)) 
			return self::consulta(['f_id'=>$id]);

		return false;
		
	}

	public static  function salvar($dados=[],$param=[]){

		global $dominio;

		$out = NULL;

		$dados = !empty($dados) ? $dados : $_POST;

		$bdo = new bdo('{{table}}');

		$dados['dominio_id'] = !empty($dados['dominio_id']) ? $dados['dominio_id'] : $dominio['id'];

		//$bdo->setValid('nome',3,'Informe um nome com pelo menos 3 letras');							
		
		$bdo->setCampo($dados);

		if (empty($dados['id'])) {

			$dados['data_cadastro'] = date('Y-m-d');

			if ( !empty($id_add  = $bdo->adicionar()) ) {
				$out['sucesso'] = true;				 		
				$out['dados'] = $dados;
				$out['dados']['id'] = $id_add;
			}

		}elseif (!empty($dados['id']) && is_numeric($dados['id']) ) {

			$dados['data_atualizacao'] = date('Y-m-d');

			$bdo->setId($dados['id']);
			
			if ($bdo->atualizar()) {
				$out['sucesso']  = true;					
				$out['dados'] = $dados;
			}	


		}

		return $out;
	}


}
