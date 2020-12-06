<template>
  <div class="root-profile">
    <div class="cadCard">
      <div class="d-flex">
        <div class="col-md-8 no-padding">
          <label class="nome1">Nome:</label>

          <div class="nome2">
            <span>{{ user.nome }}</span>
          </div>
        </div>

        <div class="col-md-4 no-padding">
          <label class="email1">E-mail:</label>

          <div class="email2">
            <span>{{ user.email }}</span>
          </div>
        </div>
      </div>
      
      <div class="d-flex">
        <div class="col-md-8 no-padding">
          <label class="nivel1">Nível de acesso:</label>

          <div class="nivel2">
            <span>{{ getAccessLevelName(user.nivelAcesso) }}</span>
          </div>
        </div>

        <div class="col-md-4 no-padding">
          <label class="funcao1">Função:</label>

          <div class="funcao2">
            <span>{{ user.funcao }}</span>
          </div>
        </div>
      </div>

      <div class="col-md-12 no-padding">
        <label class="cracha1">Nº Crachá:</label>

        <div class="cracha2">
          {{ user.cracha }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAccessLevelName } from '../../utils/utils';

export default {
  name: 'perfil',

  data() {
    return {
      getAccessLevelName,
    };
  },

  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  
  mounted() {
    this.$store.commit('addPageName', 'Meu Perfil');
    this.$store.commit('setMainIcon', 'fa-user-circle')
  },
};
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
    font-family: 'Nunito';
    font-size: 23px;
    i {
      color: #878787;
      font-size: 12px;
    }
    }


  .nome1 {
    color: #878787;
    font-family: 'Nunito';
    font-size: 14px;
    margin-bottom: 0px;

  }

  .nome2 {
    color: #565656;
    font-family: 'Nunito';
    font-size: 18px;

  }

  .email1 {
    color: #878787;
    font-family: 'Nunito';
    font-size: 14px;
    margin-bottom: 0px;
    white-space: nowrap;
  }

  .email2 {
    color: #565656;
    font-family: 'Nunito';
    font-size: 18px;
  }

  .funcao1 {
    color: #878787;
    font-family: 'Nunito';
    font-size: 14px;
    margin-bottom: 0px;
  }

  .funcao2 {
    color: #565656;
    font-family: 'Nunito';
    font-size: 18px;
  }

  .cracha1 {
    color: #878787;
    font-family: 'Nunito';
    font-size: 14px;
    margin-bottom: 0px;
  }

  .cracha2 {
    color: #565656;
    font-family: 'Nunito';
    font-size: 18px;
  }

  .nivel1 {
    color: #878787;
    font-family: 'Nunito';
    font-size: 14px;
    margin-bottom: 0px;
  }

  .nivel2 {
    color: #565656;
    font-family: 'Nunito';
    font-size: 18px;
  }
}
</style>
