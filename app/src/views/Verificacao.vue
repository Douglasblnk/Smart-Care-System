<template>
  <div class="root-verification-view">
    <div class="my-3">
        <simple-button
          :no-margin="true"
          label="Voltar"
          prefix="fa-arrow-left"
          @click.native="() => $emit('state-list')"
        />
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
          <toggle-button v-model="inputValues.resolved"
                  :labels="{checked: 'Sim', unchecked: 'Não'}" :width="70" :height="30" :font-size="14"/>
        </div>
      </div>    
    </div>
    <form @submit.prevent="verificationOrder()" class="formPosition">
      <div class="d-flex justify-content-center m-3">
        <save-button label="Verificar"/>
      </div>
    </form>
  </div>
</template>

<script>
import { getLocalStorageToken } from '../utils/utils';
import simpleInput from '../components/inputs/simple-input';
import saveButton from '../components/button/save-button';
import cancelButton from '../components/button/cancel-button';
import { ToggleButton } from 'vue-js-toggle-button'

export default {
  components: {
    'simple-input': simpleInput,
    'save-button': saveButton,
    'toggle-button': ToggleButton
  },

  props: {
    order: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      solution: "",
      inputValues: {
        solutionDescription: '',
        resolved: true,
        dateVerification: '',
        order: '',
        typeVerification: ''
      }
    };
  },

  mounted() {
    console.log(this.order)
  },
  
  methods: {
    verificationOrder(){
      this.inputValues.dateVerification = this.$moment().format('YYYY-MM-DD HH-mm-ss')
      this.inputValues.order = this.order.idOrdemServico
      this.inputValues.typeVerification = this.$store.state.user.nivelAcesso
      console.log("INPUT VALUES: ")
      console.log(this.inputValues)
      this.$http.methodPost('verificacao', getLocalStorageToken(), this.inputValues)
        .then(res => {
          if (res.status !== 200) return this.$swal({
            type: 'error',
            title: `Ops! ${res.err}`,
            confirmButtonColor: '#F34336',
          })
          this.$swal({
            type: 'success',
            title: `${res.result}`,
            confirmButtonColor: '#F34336',
          })
        })
    }
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