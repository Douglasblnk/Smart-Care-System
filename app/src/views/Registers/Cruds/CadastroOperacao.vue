<template>
  <div class="root-cadastro-operacao-view">
    <back-button @goBack="goBack" />

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
          <div v-if="switchListRegister === 'list'" key="list">
            <card full-width>
              <div class="register-operacao-table">
                <v-client-table
                  ref="tableRegisterEpi"
                  v-model="workOperations"
                  :columns="columns"
                  :options="registerOperationTable.options"
                >
                  <div slot="actions" slot-scope="{row, index}">
                    <template>
                      <div class="icons-actions-wrapper">
                        <div class="icons-actions">
                          <i class="fas fa-edit text-muted" @click="editOperations(row)"></i>
                        </div>
                        <div class="icons-actions">
                          <i class="fas fa-trash text-muted" @click="deleteOperations(row, index - 1)"></i>
                        </div>
                      </div>
                    </template>
                  </div>
                </v-client-table>
              </div>
            </card>
          </div>

          <div v-if="switchListRegister === 'register'" key="register">
            <div class="form-position">
              <div class="cadCard">
                <div class="inputs">
                  <simple-input v-model="inputValues.descricao_operacao" label="Descrição Operaçao:" type="text" />
                  <simple-input v-model="inputValues.material" label="Material:" type="text" />
                  <simple-input v-model="inputValues.quantidade_material" label="Quantidade:" type="number" />
                  <simple-input v-model="inputValues.unidade_material" label="Unidade:" type="text " />
                  <simple-input v-model="inputValues.tempo_planejado" label="Tempo Planejado:" type="time" />
                </div>
              </div>

              <div class="d-flex justify-content-center m-3">
                <smart-button
                  primary
                  :loading="isLoading"
                  class="mr-2"
                  @click.native="registerOperations()"
                >
                  {{ getSaveButtonText() }}
                </smart-button>

                <smart-button v-if="isEditing" @click.native="closeEditing()">
                  <span>Cancelar</span>
                </smart-button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import { getErrors } from '../../../utils/utils';

export default {
  name: 'CadastroOperacao',
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
      isLoading: false,
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
      if (this.isLoading) return;
      if (this.isEditing) return this.updateOperations();

      try {
        this.isLoading = true;
        await this.$http.post('operacoes', this.inputValues);

        this.resetModel();
        this.getOperations();

        await this.$swal({
          type: 'success',
          text: 'Operação registrada com sucesso!',
          confirmButtonColor: '#F34336',
        });
      } catch (err) {
        console.log('err registerOperations :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.isLoading = false;
      }
    },
    async getOperations() {
      try {
        const response = await this.$http.get('operacoes');

        if (response.length === undefined)
          this.workOperations.push(response);
        else this.workOperations = [...response];
      } catch (err) {
        console.log('err getOperations :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    resetModel() {
      this.inputValues = {};
    },
    deleteOperations(component, index) {
      this.$swal({
        type: 'question',
        title: `Deseja mesmo remover o Componente ${component.descricao_operacao}`,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonColor: '#F34336',
        preConfirm: async () => {
          try {
            await this.$http.delete('operacoes', component.idoperacao);

            await this.$swal({
              type: 'success',
              text: 'Operação removida com sucesso',
              confirmButtonColor: '#F34336',
            });

            this.workOperations.splice(index, 1);
          } catch (err) {
            console.log('err deleteOperations :>> ', err.response || err);

            return this.$swal({
              type: 'warning',
              html: getErrors(err),
              confirmButtonColor: '#F34336',
            });
          }
        },
      });
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
      if (this.isLoading) return;
      try {
        this.isLoading = true;
        await this.$http.update('operacoes', this.inputValues, this.inputValues.idoperacao);
      
        this.closeEditing();
        this.getOperations();

        await this.$swal({
          type: 'success',
          text: 'Editado com Sucesso',
          confirmButtonColor: '#F34336',
        });
      } catch (err) {
        console.log('err updateOperations :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.isLoading = false;
      }
    },
    goBack() {
      this.$router.push('/cadastros');
    },
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
    .form-position{
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

