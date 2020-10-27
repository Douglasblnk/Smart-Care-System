<template>
  <div class="root-note-view">
    <div class="my-3">
      <smart-button simple @click.native="() => $emit('state-list')">
        <span>Voltar</span>
      </smart-button>
    </div>
    <div class="note-content p-3 d-flex">
      <div class="note-title">
        <h3>Apontamentos </h3>
      </div>
      <div class="note-separetor">
      </div>
      <div class="note">
        <div class="description-activity">
          <simple-input v-model="inputValues.description" :label="'Descrição Atividade:'" :type="'text'" />
        </div>
        <div>
          <simple-input
            v-model="inputValues.date"
            :label="'Data do lançamento:'"
            :type="'date'"
          />
        </div>
        <div>
          <simple-input
            v-model="inputValues.time"
            :label="'Tempo Dedicado:'"
            :type="'time'"
          />
        </div>
      </div>
    </div>
    <form class="formPosition" @submit.prevent="NoteOrder()">
      <div class="d-flex justify-content-center m-3">
        <smart-button>
          <span>Apontar</span>
        </smart-button>
      </div>
    </form>
  </div>
</template>

<script>
import { getToken, getErrors } from '../../../../utils/utils';

export default {
  name: 'Apontamentos',

  props: {
    order: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      solution: '',
      inputValues: {
        date: '',
        time: true,
        description: '',
      },
    };
  },
  
  methods: {
    async NoteOrder() {
      try {
        this.inputValues.user = this.$store.state.user.userId;
        this.inputValues.order = this.order.idOrdemServico;

        const response = await this.$http.post('order-note', this.inputValues);
        
        this.$swal({
          type: 'success',
          title: response.result,
          confirmButtonColor: '#F34336',
        });
      } catch (err) {
        console.log('NoteOrder =>', err);

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
.root-note-view{
  margin: 30px;
  .note-content {
    width: 60vw;
    background-color:#fff;
    border-radius: 10px;
    flex-wrap: wrap;
    .note-title{
      margin-left: 15px;
    }
    .note-separetor{
      width:95%;
      height:3px;
      background-color:#F34336;
    }
    .note{
      margin-left:15px;
      display:flex;
      width:100%;
      height:10%;
      flex-direction: row;
      align-items: center;
      .description-activity{
        width:40%;
      }
      .note-option{
        display:flex;
        flex-direction: column;
        margin-left:30px;
      }
    }
  }
}
</style>
