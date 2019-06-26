 <?php 

class {{module|camelCase}}Control extends appControl
{
	
	public function __construct()
	{
		user::autenticado();
	}

	public function getIndex(){

		$get = $this->getRequest();
	
		${{module}} = {{module}}::consulta($get);
		
		if(!empty(${{module}}))
			return $this->status(200)->json(${{module}});

		return $this->status(400)->json(['erro'=>bd::getMsgJson()]);
	}

	public function deleteIndex($id = ''){

		$this->_responder([
			'sucesso'=>is_numeric($id) ? bd::excluir($id,'{{module}}','id') : NULL,
			'msg'=>bd::getMsgJson()
		]);
	}

  
    public function patchIndex(){
    	return $this->salvar($this->patchRequest());
    }

	public function postIndex(){
		return $this->salvar($this->postRequest());
	}
    
    public function salvar($dados){
       	${{module}} = {{module}}::salvar($dados);

		return $this->_responder(${{module}});
    }


	public function _responder($dados = []){
		if(!empty($dados['sucesso']))
			return $this->status(200)->json($dados);

		return $this->status(400)->json(['erro'=>bd::getMsgJson()]);
	}
  
}
 ?>
