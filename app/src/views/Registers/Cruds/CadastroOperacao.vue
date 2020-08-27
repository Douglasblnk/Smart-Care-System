<template>
  <div class="root-cadastro-operacao-view">
    <div class="content-wrapper">
      <div>
        <div class="list-option">
          <div class="d-flex justify-content-between">
            <div class="option d-flex align-items-center m-4" @click="switchLabelPage('list')">
              <i class="fas fa-list-alt" />
              <span>Listar</span>
            </div>
            <div class="option d-flex align-items-center m-4" @click="switchLabelPage('register')">
              <i class="fas fa-edit" />
              <span>Cadastrar</span>
            </div>
          </div>
        </div>

        <transition name="slide-fade" mode="out-in">
          <template v-if="switchListRegister === 'list'">
            <card fullWidth>
              <div class="register-operacao-table">
                <v-client-table
                  ref="tableRegisterEpi"
                  v-model="workOperations"
                  :columns="columns"
                  :options="registerOperationTable.options"
                >
                  <div slot="actions" slot-scope="props">
                    <template>
                      <div class="icons-actions-wrapper">
                        <div class="icons-actions">
                          <i class="fas fa-edit text-muted" @click="editOperations(props.row)"></i>
                        </div>
                        <div class="icons-actions">
                          <i class="fas fa-trash text-muted" @click="deleteOperations(props.row, index)"></i>
                        </div>
                      </div>
                    </template>
                  </div>
                </v-client-table>
              </div>
            </card>
          </template>

          <template v-if="switchListRegister === 'register'">
            <form class="formPosition" @submit.prevent="registerOperations()">
              <div class="cadCard">
                <div class="inputs">
                  <simple-input v-model="inputValues.descricao_operacao" label="Descrição Operaçao:" type="text">
                  </simple-input>
                  <simple-input v-model="inputValues.material" label="Material:" type="text">
                  </simple-input>
                  <simple-input v-model="inputValues.quantidade_material" label="Quantidade:" type="number">
                  </simple-input>
                  <simple-input v-model="inputValues.unidade_material" label="Unidade:" type="text ">
                  </simple-input>
                  <simple-input v-model="inputValues.tempo_planejado" label="Tempo Planejado:" type="time">
                  </simple-input>
                </div>
              </div>
              <!-- <div class="d-flex justify-content-center m-3">
                <b-button type="submit" value="send" variant="danger">Cadastrar</b-button>
              </div> -->
              <div class="d-flex justify-content-center m-3">
                <smart-button primary class="mr-2">
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
    </div>
  </div>
</template>
<script>
import { getLocalStorageToken, getErrors } from '../../../utils/utils';


export default {
  components: {
    
  },
  data() {
    return {
      inputValues: {
        excluded: 1,
        idoperacao: 0,
        descricao_operacao: '',
        material: '',
        quantidade_material: 0,
        unidade_material: '',
        tempo_planejado: 0,
      },
      columns: ['descricao_operacao', 'actions'],
      registerOperationTable: {
        options: {
          headings: {
            idoperacao: create => create('span', {
              domProps: { innerHTML: 'Operação <i class="fas fa-sort"></i>' },
            }),
            descricao_operacao: 'Operação',
            actions: 'Ações',
          },
          columnsClasses: {
            actions: 'actions-class',
          },
          texts: {
            filter: '',
            filterPlaceholder: 'Buscar',
            count: 'Mostrando {from} até {to} de {count} registros|{count} Registros|Um Registro',
            limit: '',
            page: 'Páginas:',
            noResults: 'Nenhum registro encontrado',
            loading: 'Carregando...',
          },
          perPage: 10,
          perPageValues: [10, 25, 50],
          sortable: ['idoperacao'],
        },
        
      },
      workOperations: [],
      switchListRegister: 'list',
      isEditing: false,
    };
  },
  mounted() {
    this.getOperations();
    this.$store.commit('addPageName', 'Cadastro de Operações');
    this.switchLabelPage('list');
  },
  methods: {
    getSaveButtonText() {
      if (this.isEditing) return 'Alterar';
      return 'Cadastrar';
    },
    switchLabelPage(labelPage) {
      if (labelPage === 'list') {
        this.switchListRegister = 'list';
        return this.$store.commit('addPageName', 'Cadastro de Operações | Listagem');
      } else if (labelPage === 'register') {
        this.switchListRegister = 'register';
        return this.$store.commit('addPageName', 'Cadastro de Operações | Cadastrar');
      }
      return this.$store.commit('addPageName', 'Cadastro de Operações | Editar');
    },
    async registerOperations() {
      if (this.isEditing) return this.updateOperations();
      try {
        const response = await this.$http.post('operacoes', getLocalStorageToken(), this.inputValues);
        this.$swal({
          type: 'success',
          title: 'Cadastrado',
          confirmButtonColor: '#F34336',
        }),
        this.resetModel();
        this.getOperations();
      } catch (err) {
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async getOperations() {
      // const token = localStorage.getItem('token')
      try {
        const response = await this.$http.get('operacoes/get', getLocalStorageToken());
        if (response.result.length === undefined)
          this.workOperations.push(response.result);

        else this.workOperations = [...response.result];
      } catch (err) {
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },

    resetModel() {
      this.inputValues = {};
    },
  
    deleteOperations(component, index) {
      try {
        this.$swal({
          type: 'question',
          title: `Deseja mesmo remover o Componente ${component.descricao_operacao}`,
          showCancelButton: true,
          confirmButtonColor: '#F34336',
          preConfirm: async () => {
            const response = await this.$http.delete('operacoes', getLocalStorageToken(), component.idoperacao);
            this.$swal({
              type: 'success',
              title: 'Removido com sucesso',
              confirmButtonColor: '#F34336',
            }),
            this.workOperations.splice(index, 1);
          },
        });
      } catch (err) {
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    editOperations(component) {
      this.switchLabelPage('edit');
      this.inputValues = { ...component };
      this.switchListRegister = 'register';
      this.isEditing = true;
    },
    closeEditing() {
      this.switchLabelPage('list');
      this.switchListRegister = 'list';
      this.isEditing = false;
      this.resetModel();
    },
    async updateOperations() {
      try {
        const response = await this.$http.update('operacoes', getLocalStorageToken(), this.inputValues, this.inputValues.idoperacao);
      
        const index = this.workOperations.indexOf(this.workOperations.find(i => i.idoperacao === this.inputValues.idoperacao));
        this.workOperations.splice(index, 1, this.inputValues);

        this.$swal({
          type: 'success',
          title: 'Editado com Sucesso',
          confirmButtonColor: '#F34336',
        });
        this.closeEditing();
      } catch (err) {
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },

  },
  resetModel() {
    this.inputValues = {};
  },
};
</script>

<style lang="scss" scoped>
.root-cadastro-operacao-view {
  width: 100%;
  .content-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    .list-option {
      width: 50vw;
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
        flex-direction: column;
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
  }
  .icons-actions-wrapper{
    display: flex;
    justify-content: space-around;
    align-items: center;
    
    .icons-actions {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      user-select: none;
      &:hover {
        span {
          color: var(--duas-rodas-soft)
        }
      }
      i {
        transition: .2s;
      }
      &:hover {
        i {
          transform: scale(1.18);
        }
      }
      &:active {
        i {
          transform: scale(1);
        }
      }
      // padding: 2%;
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
<style lang="scss">
.register-operacao-table {
  table {
    border-radius: 8px;
    thead {
      th {
        background-color: var(--duas-rodas-soft);
        span {
          cursor: pointer;
          color: white !important;
        }
        border: 0 !important;
        outline: none;
      }
    }
    tbody {
      tr {
        td {
          border: 0 !important;
          vertical-align: middle;
          outline: none;
        }
      }
    }
  }
  .col-md-12 {
    justify-content: space-between;
    display: flex !important;
    .VueTables__search-field {
      width: 30vw !important;
      input {
        width: 100%;
      }
    }
  }

  .VuePagination {
    display: flex;
    justify-content: center;

    p {
      display: flex;
      justify-content: center;
    }
  }
  .page-item .active {
    color: white !important;
    border-color: #ddd !important;
    background-color: var(--duas-rodas-soft) !important;
    &:focus {
      box-shadow: none !important;
    }
  }
  .page-link {
    color: #555 !important;
    &:focus {
      box-shadow: none !important;
    }
  }
  .actions-class {
    width: 100px !important;
  }

}

</style>

