<template>
  <div class="root-verification-view">
    <div class="my-3">
      <smart-button simple @click.native="() => $emit('state-list')">
        <span>Voltar</span>
      </smart-button>
    </div>
    <div class="verification-content p-3 d-flex">
      <div class="verification-title">
        <h3>Verificação </h3>
      </div>
      <div class="verification-separetor">
      </div>
      <div class="form-verification">
        <div class="text-solution-verification">
          <simple-input v-model="inputValues.solutionDescription" :label="'Solução Realizada:'" :type="'text'" />
        </div>
        <div class="form-verification-option">
          <label>O problema foi resolvido?</label>
          <toggle-button
            v-model="inputValues.resolved"
            :labels="{ checked: 'Sim', unchecked: 'Não' }"
            :width="70"
            :height="30"
            :font-size="14"
          />
        </div>
      </div>
    </div>
    <form class="formPosition" @submit.prevent="verificationOrder()">
      <div class="d-flex justify-content-center m-3">
        <smart-button>
          <span>Verificar</span>          
        </smart-button>
      </div>
    </form>
  </div>
</template>

<script>
import Vue from 'vue';
import { ToggleButton } from 'vue-js-toggle-button';
import { getToken, getErrors } from '../../utils/utils';

Vue.use(ToggleButton);

export default {
  components: {
    'toggle-button': ToggleButton,
  },

  props: {
    order: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      solution: '',
      inputValues: {
        solutionDescription: '',
        resolved: true,
        dateVerification: '',
        order: '',
        typeVerification: '',
      },
    };
  },
  
  methods: {
    async verificationOrder() {
      try {
        this.inputValues.dateVerification = this.$moment().format('YYYY-MM-DD HH-mm-ss');
        this.inputValues.order = this.order.idOrdemServico;
        this.inputValues.typeVerification = this.$store.state.user.nivelAcesso;
        this.inputValues.cracha = this.$store.state.user.cracha;

        const response = await this.$http.post('verificacao', getToken(), this.inputValues);

        this.$swal({
          type: 'success',
          title: `${response.result}`,
          confirmButtonColor: '#F34336',
        }).then(() =>{
          if (this.inputValues.typeVerification === 2)
            this.$emit('change-status', 'Pendente');
          else if (this.inputValues.typeVerification === 1)
            this.$emit('change-status', 'Encerrada');
          else if (this.inputValues.typeVerification === 3)
            this.$emit('state-list');
        });
      } catch (err) {
        console.log('verificationOrder =>', err);
        return this.$swal({
          type: 'error',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.root-verification-view{
  margin: 30px;
  .verification-content {
    width: 60vw;
    background-color:#fff;
    border-radius: 10px;
    flex-wrap: wrap;
    .verification-title{
      margin-left: 15px;
    }
    .verification-separetor{
      width:95%;
      height:3px;
      background-color:#F34336;
    }
    .form-verification{
      margin-left:15px;
      display:flex;
      width:100%;
      height:10%;
      flex-direction: row;
      align-items: center;
      .text-solution-verification{
        width:40%;
      }
      .form-verification-option{
        display:flex;
        flex-direction: column;
        margin-left:30px;
      }
    }
  }
}
</style>
