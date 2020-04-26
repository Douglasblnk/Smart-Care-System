<template>
  <div class="root-profile">
    <div class="cadCard">
      <div class="d-flex">
        <div class="col-md-8 no-padding">
          <div>
            <label for="" class="nome1">Nome:</label>
          </div>
          <div class="nome2">
            <span>{{user.nome}}</span>
          </div>
        </div>
        <div class="col-md-4 no-padding">
            <label for="" class="email1">E-mail:</label>
          <div class="email2">
           <span>{{user.email}}</span>
          </div>
        </div>
      </div>
      <div class="d-flex">
      <div class="col-md-8 no-padding">
        <div>
        <label for="" class="nivel1">Nível de acesso:</label>
        </div>
        <div class="nivel2">
          <span>{{getAccessLevel(user.nivelAcesso)}}</span>
        </div>
      </div>
      <div class="cold-md-4 no padding">
        <label for="" class="funcao1">Função:</label>
      <div class="funcao2">
        <span>{{user.funcao}}</span>
      </div>
      </div>
      </div>
      <div>
      <div>
        <label for="" class="cracha1">Nº Crachá:</label>
      </div>
      <div class="cracha2">
        {{user.cracha}}
      </div>
      </div>


    </div>
  </div>
</template>

<script>
import { getAccessLevel } from '../utils/utils';

export default {
  name:'perfil',

  data(){
    return{
      getAccessLevel,
    }
    
	},
	mounted(){
    this.$store.commit('addPageName', 'Meu Perfil');
    console.log(this.$store.state.user);
  },
  computed: {
    user(){
      return this.$store.state.user;
    }
  }
}
</script>

<style lang="scss" scoped>
.root-profile {
  display: flex;
  justify-content: center;
  .cadCard {
    width: 50vw;
    background-color: #ffffff;
    padding: 25px;
    border-radius: 10px;
    font-family: 'roboto';
    font-size: 23px;
    i {
      color: #878787;
      font-size: 12px;
    }
    }


  .nome1 {
    color: #878787;
    font-family: 'roboto';
    font-size: 14px;
    margin-bottom: 0px;

  }

  .nome2 {
    color: #565656;
    font-family: 'roboto';
    font-size: 18px;

  }

  .email1 {
    color: #878787;
    font-family: 'roboto';
    font-size: 14px;
    margin-bottom: 0px;
    white-space: nowrap;
  }

  .email2 {
    color: #565656;
    font-family: 'roboto';
    font-size: 18px;  
  }

  .funcao1 {
    color: #878787;
    font-family: 'roboto';
    font-size: 14px;
    margin-bottom: 0px;
  }

  .funcao2 {
    color: #565656;
    font-family: 'roboto';
    font-size: 18px; 
  }

  .cracha1 {
    color: #878787;
    font-family: 'roboto';
    font-size: 14px;
    margin-bottom: 0px;
  }

  .cracha2 {
    color: #565656;
    font-family: 'roboto';
    font-size: 18px;
  }

  .nivel1 {
    color: #878787;
    font-family: 'roboto';
    font-size: 14px;
    margin-bottom: 0px;
  }

  .nivel2 {
    color: #565656;
    font-family: 'roboto';
    font-size: 18px;
  }
}
</style>



