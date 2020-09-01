<template>
  <div class="root-tipo-ordem-view">
    <div class="list-option">
      <div class="d-flex justify-content-between">
        <div class="option d-flex align-items-center m-4" @click="switchListRegister = 'list'">
          <i class="fas fa-list-alt" />
          <span>Listar</span>
        </div>
        <div class="option d-flex align-items-center m-4" @click="switchListRegister = 'register'">
          <i class="fas fa-edit" />
          <span>Cadastrar</span>
        </div>
      </div>
    </div>

    <transition name="slide-fade" mode="out-in">
      <template v-if="switchListRegister === 'list'">
        <div class="d-flex w-100 justify-content-center">
          <div class="table-content bg-white p-4 w-100">
            <div class="table-responsive">
              <table class="table table table-striped table-borderless table-hover" cellspacing="0">
                <thead class="table-head">
                  <tr>
                    <th scope="col">Tipo de manutenção</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody class="table-body">
                  <tr v-for="(order, index) in orderTypes" :key="`order-${index}`">
                    <td>{{ order.tipoManutencao }}</td>
                    <td style="width: 50px">
                      <div class="d-flex table-action">
                        <i class="fas fa-edit text-muted" @click="startEdition(order)"></i>
                        <i class="fas fa-trash text-muted" @click="deleteOrderType(order, index)"></i>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>

      <template v-if="switchListRegister === 'register'">
        <form class="formPosition" @submit.prevent="registerOrderType()">
          <div class="cadCard">
            <div class="w-100">
              <simple-input v-model="inputValues.tipoManutencao" :label="'Tipo de Ordem:'" :type="'text'" />
            </div>
          </div>

          <div class="d-flex justify-content-center m-3">
            <smart-button primary>
              {{ getSaveButtonText() }}
            </smart-button>
            <smart-button v-if="isEditing" @click.native="closeEditing">
              <span>Cancelar</span>
            </smart-button>
          </div>
        </form>
      </template>
    </transition>
  </div>
</template>

<script>
import { getToken, getErrors } from '../../../utils/utils';

export default {
  data() {
    return {
      inputValues: {
        tipoManutencao: '',
      },
      orderTypes: [],
      switchListRegister: 'list',
      isEditing: false,
    };
  },

  mounted() {
    this.getOrderType();
  },
  
  methods: {
    getSaveButtonText() {
      if (this.isEditing) return 'Alterar';
      return 'Cadastrar';
    },

    closeEditing() {
      this.switchListRegister = 'list';
      this.isEditing = false;
      this.resetModel();
    },

    resetModel() {
      this.inputValues = {};
    },

    startEdition(order) {
      this.inputValues = { ...order };
      console.log(this.inputValues);
      this.switchListRegister = 'register';
      this.isEditing = true;
    },

    async getOrderType() {
      try {
        const response = await this.$http.get('tipo-ordem/get', getToken());

        if (response.result.length === undefined)
          this.orderTypes.push(response.result);
        else this.orderTypes = [...response.result];
      } catch (err) {
        console.log('err getOrderType => :', err.response || err);

        return this.$swal({
          type: 'warning',
          text: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },

    async registerOrderType() {
      if (this.isEditing) return this.updateOrderType();

      try {
        const response = await this.$http.post('tipo-ordem', getToken(), this.inputValues);
        
        this.$swal({
          type: 'success',
          title: response.result,
          confirmButtonColor: '#F34336',
        }).then(() => {
          this.orderTypes.push(this.inputValues);

          this.resetModel();
        });
      } catch (err) {
        console.log('err registerOrderType => :', err.response || err);

        return this.$swal({
          type: 'warning',
          text: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },

    deleteOrderType(order, index) {
      this.$swal({
        type: 'question',
        title: `Deseja mesmo remover o tipo ${order.tipoManutencao}?`,
        showCancelButton: true,
        confirmButtonColor: '#F34336',
        preConfirm: async () => {
          try {
            const response = await this.$http.delete('tipo-ordem', getToken(), order.idtipoManutencao);
            
            return this.$swal({
              type: 'success',
              title: response.result,
              confirmButtonColor: '#F34336',
            }).then(() => {
              this.orderTypes.splice(index, 1);
            });
          } catch (err) {
            console.log('err deleteOrderType => :', err.response || err);

            return this.$swal({
              type: 'warning',
              text: getErrors(err),
              confirmButtonColor: '#F34336',
            });
          }
        },
      });
    },

    async updateOrderType() {
      try {
        const response = await this.$http.update(
          'tipo-ordem', getToken(), this.inputValues, this.inputValues.idtipoManutencao
        );

        this.$swal({
          type: 'success',
          title: response.result,
          confirmButtonColor: '#F34336',
        }).then(() => {
          const index = this.orderTypes.indexOf(
            this.orderTypes.find(i => i.idtipoManutencao === this.inputValues.idtipoManutencao)
          );

          this.orderTypes.splice(index, 1, this.inputValues);

          this.closeEditing();
        });
      } catch (err) {
        console.log('err updateorderType => :', err.response || err);

        return this.$swal({
          type: 'warning',
          text: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.root-tipo-ordem-view {
  width: 70%;
  .list-option {
    display: flex;
    justify-content: flex-start;
    .option {
      cursor: pointer;
      color: var(--duas-rodas-soft);
      transition: .2s;
      &:hover {
        transform: scale(1.2)
      }
      &:active {
        transform: scale(1)
      }
      i {
        
        cursor: pointer;
        font-size: 1.4rem;
        margin: 0 5px;
      }
    }
  }
  .formPosition{
    display: flex;
    flex-direction: column;
    align-items: center;
    .cadCard {
      width: 80%;
      padding: 20px;
      display: flex;
      flex-wrap: wrap;
      border-radius: 10px;
      background-color: #ffffff;
    }
  }
  .table-content {
    border-radius: 10px;
    table {
      overflow:hidden;
      border-collapse:separate;
      border-radius: 10px;
    }
    .table-head {
      background-color: var(--duas-rodas);
      color: white;
      th {
        padding: 20px;
      }
    }
    .table-body {
      td {
        padding: 20px;
      }
    }
    .table-action {
      i {
        margin: 0 10px;
        cursor: pointer;
        transition: .1s;
        &:hover {
          transform: scale(1.3);
        }
        &:active {
          transform: scale(1);
        }
      }
    }
  }

  .slide-fade-enter-active {
    transition: all 0.1s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
}
</style>
