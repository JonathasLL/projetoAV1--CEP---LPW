"use strict";

import CtrlManterClientes from "/CtrlManterClientes.js";  //Alterado 'CtrlManterAlunos.js' (e sem js) para 'CtrlManterClientes'

export default class CtrlSessao {
  
  //-----------------------------------------------------------------------------------------//
  
  constructor() {
    this.ctrlAtual = new CtrlManterClientes();  //Alterado método 'CtrlManterAlunos()' para 'CtrlManterClientes()'
  }
  
  //-----------------------------------------------------------------------------------------//
}

var sessao = new CtrlSessao();

//------------------------------------------------------------------------//

//
// O código abaixo está relacionado com o deploy do Service Worker. Isso permite que nossa 
// aplicação se torne um App para Dispositivos Mobile
//
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', {scope: '/'})
  .then(function(reg) {
    // registration worked
    console.log('Registration succeeded. Scope is ' + reg.scope);
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}


//------------------------------------------------------------------------//