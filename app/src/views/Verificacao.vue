<template>
  <div class="root-verification-view">
    <div class="verification-content p-3 d-flex">
      <div class="verification-title">
        <h3>Verificação </h3>
      </div>
      <div class="verification-separetor">
      </div>
      <div class="form-verification">
        <div class="text-solution-verification">
          <simple-input v-model="solution" :label="'Solução Realizada:'" :type="'text'" />
        </div>
        <div class="form-verification-option">
          <label>O problema foi resolvido?</label>
          <toggle-button :value="true"
                  :labels="{checked: 'Sim', unchecked: 'Não'}" :width="70" :height="30" :font-size="14"/>
        </div>
      </div>    
    </div>
    <form @submit.prevent="maintenanceOrderCheck()" class="formPosition">
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
    'cancel-button': cancelButton,
    'toggle-button': ToggleButton
  },

  props: {
    order: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      solution: ""
    };
  },

  mounted() {
    console.log(this.order)
  },
  
  methods: {
    maintenanceOrderCheck(){

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