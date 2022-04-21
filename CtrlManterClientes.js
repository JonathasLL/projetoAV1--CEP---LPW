"use strict";

import Status from "/Status.js";
import Cliente from "/Cliente.js";   //Alterado 'Aluno' para 'Cliente'
import DaoCliente from "/DaoCliente.js";  //Alterado 'DaoAluno' para 'DaoCliente'
import ViewerCliente from "/ViewerCliente.js";  //Alterado 'ViewerAluno' para 'ViewerCliente'

export default class CtrlManterClientes {  //Alterando o nome da classe para 'CtrlManterClientes'
  
  //-----------------------------------------------------------------------------------------//

  //
  // Atributos do Controlador
  //
  #dao;      // Referência para o Data Access Object para o Store de Alunos
  #viewer;   // Referência para o gerenciador do viewer 
  #posAtual; // Indica a posição do objeto Aluno que estiver sendo apresentado
  #status;   // Indica o que o controlador está fazendo 
  
  //-----------------------------------------------------------------------------------------//

  constructor() {
    this.#dao = new DaoCliente();  //Alterado 'DaoAluno()' para 'DaoCliente()'
    this.#viewer = new ViewerCliente(this);  //Alterado 'ViewerAluno(this)' para 'ViewerCliente(this)'
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();    
  }
  
  //-----------------------------------------------------------------------------------------//

  async #atualizarContextoNavegacao() {
    // Guardo a informação que o controlador está navegando pelos dados
    this.#status = Status.NAVEGANDO;

    // Determina ao viewer que ele está apresentando dos dados 
    this.#viewer.statusApresentacao();
    
    // Solicita ao DAO que dê a lista de todos os alunos presentes na base
    let conjClientes = await this.#dao.obterClientes();  //Alterado 'conjAlunos' para 'conjClientes' e Alterado '#dao.obterAlunos()' para '#dao.obterClientes()'
    
    // Se a lista de alunos estiver vazia
    if(conjClientes.length == 0) {  //Alterado 'conjAlunos' para 'conjClientes'
      // Posição Atual igual a zero indica que não há objetos na base
      this.#posAtual = 0;
      
      // Informo ao viewer que não deve apresentar nada
      this.#viewer.apresentar(0, 0, null);
    }
    else {
      // Se é necessário ajustar a posição atual, determino que ela passa a ser 1
      if(this.#posAtual == 0 || this.#posAtual > conjClientes.length)  //Alterado 'conjAlunos' para 'conjClientes'
        this.#posAtual = 1;
      // Peço ao viewer que apresente o objeto da posição atual
      this.#viewer.apresentar(this.#posAtual, conjClientes.length, conjClientes[this.#posAtual - 1]);  //Alterado 'conjAlunos' para 'conjClientes'
    }
  }
  
  //-----------------------------------------------------------------------------------------//

  async apresentarPrimeiro() {
    let conjClientes = await this.#dao.obterClientes();  //Alterado 'conjAlunos' para 'conjClientes' e Alterado '#dao.obterAlunos()' para '#dao.obterClientes()''
    if(conjClientes.length > 0)  //Alterado 'conjAlunos' para 'conjClientes'
      this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarProximo() {
    let conjClientes = await this.#dao.obterClientes();  //Alterado 'conjAlunos' para 'conjClientes' e Alterado '#dao.obterAlunos()' para '#dao.obterClientes()''
    if(this.#posAtual < conjAlunos.length)
      this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarAnterior() {
    let conjAlunos = await this.#dao.obterAlunos();
    if(this.#posAtual > 1)
      this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarUltimo() {
    let conjAlunos = await this.#dao.obterAlunos();
    this.#posAtual = conjAlunos.length;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarIncluir() {
    this.#status = Status.INCLUINDO;
    this.#viewer.statusEdicao(Status.INCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de 
    // "incluir"
    this.efetivar = this.incluir;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewer.statusEdicao(Status.ALTERANDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de 
    // "alterar"
    this.efetivar = this.alterar;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewer.statusEdicao(Status.EXCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de 
    // "excluir"
    this.efetivar = this.excluir;
  }

  //-----------------------------------------------------------------------------------------//
 
  async incluir(matr, cpf, nome, email, telefone) {
    if(this.#status == Status.INCLUINDO) {
      try {
        let aluno = new Aluno(matr, cpf, nome, email, telefone);
        await this.#dao.incluir(aluno); 
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//
 
  async alterar(matr, cpf, nome, email, telefone) {
    if(this.#status == Status.ALTERANDO) {
      try {
        let aluno = await this.#dao.obterAlunoPelaMatricula(matr); 
        if(aluno == null) {
          alert("Aluno com a matrícula " + matr + " não encontrado.");
        } else {
          aluno.setCpf(cpf);
          aluno.setNome(nome);
          aluno.setEmail(email);
          aluno.setTelefone(telefone);
          await this.#dao.alterar(aluno); 
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//
 
  async excluir(matr) {
    if(this.#status == Status.EXCLUINDO) {
      try {
        let aluno = await this.#dao.obterAlunoPelaMatricula(matr); 
        if(aluno == null) {
          alert("Aluno com a matrícula " + matr + " não encontrado.");
        } else {
          await this.#dao.excluir(aluno); 
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//

  cancelar() {
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  getStatus() {
    return this.#status;
  }

  //-----------------------------------------------------------------------------------------//
}

//------------------------------------------------------------------------//

//------------------------------------------------------------------------//

//var aluno1 = new Aluno('1234', '123.456.789-09', 'José da Silva Xavier','jose@eu.com.br','(21)98765-4321');
//aluno1.mostrar();

//var aluno2 = new Aluno('67890', '555.555.555-55', 'Maria de Souza','maria@eu.com.br','(21)99999-8888')//aluno2.mostrar();

//ctrl.dao.incluir(aluno1);
//ctrl.dao.incluir(aluno2);


//ctrl.dao.obterAlunos().then( async (value) => await alert(JSON.stringify(value)) ) ;

//aluno2.setNome('Maria de Souza RAMOS');
//ctrl.dao.alterar(aluno2);

//ctrl.dao.obterAlunos().then( async (value) => await alert(JSON.stringify(value)) ) ;

//ctrl.dao.excluir(aluno1);
//ctrl.dao.excluir(aluno2);

//alert("Atenção 3");
//ctrl.dao.obterAlunos().then( async (value) => await alert(JSON.stringify(value)) ) ;


