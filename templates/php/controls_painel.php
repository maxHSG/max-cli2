<?php
/******************************************************************************
 *   	Control {{module}} 
 *****************************************************************************/

class {{module|camelCase}}Control extends appControl {


	public function __construct(){
		global $config;

    	user::autenticado(true);
    	//user::temPermissao('{{module}}',true);

    	$this
    		->titulo($config['nomebase'].' -> Gerenciamento de {{module|capitalize}}')
    		->tituloConteudo("{{module|capitalize}}".tpl::col(Form::busca(['action'=>'/painel/{{module|kebabCase}}/listar/']),'col-md-4 margin-top-10-sm pull-right'),"fa fa-list");
	}


	public function index($param=[]){
		$this->tabelar();

	}
	public function form($reg=""){
		$form = {{module}}::form($reg);


		if (util::isAjax()) {
			$out['modal_id'] = "{{module}}";
			$out['modal'] = $form;
			$out['init'] = true;
			$this->json($out);
		}else{
			$this->view($form);	
		}
	}
	
	public function add(){
		$this->form();
	}


	public function editar($id){
		
		if(is_numeric($id))
			$reg = {{module}}::get($id);
		else
			direcionar("","/painel/");
		
		$this->form($reg);
	}


	public function salvar($reg=[]){
		$dados = !empty($reg) ? $reg : $_POST;

		$out = {{module}}::salvar($dados);

		if (!empty($out['sucesso'])) {
			$out['direciona'] = "/painel/{{module|kebabCase}}/";
		}

		$out['msg'] = bd::getMsgJson();
		

		$this->json($out);
	}

	public function excluir($id){
		$msg = "Registro excluído com sucesso";

		if(bd::excluir((int)$id,"{{table}}","id")){
			
			if (util::isAjax()) 
				return $this->json(['direciona'=>'/painel/{{module|kebabCase}}/tabelar/','msg'=>$msg]);
			
			return direciona($msg,"/painel/{{module|kebabCase}}/tabelar");
		}
	}
	
	public function listar(){
		return $this->tabelar();
	}

	public function tabelar(){

		$p = set_param({{module}}::getParams(),$_GET);
		${{module}} = {{module}}::consulta($p);


		$total_{{module}} = ${{module}}['total'];
		unset(${{module}}['total']);

		$this->view({{module}}::tabelar(${{module}}));
		$this->view(paginacao($total_{{module}},$p['qtde_por_pagina'],$p['qtde_por_pagina']));

	}

	public function pesquisar(){
		$this->view({{module}}::formBusca());		
		$this->tabelar();
	}


}
