<template>
  <div class="root-centro-trabalho-view">
    <div class="d-flex align-items-center">
      <div class="back-button ml-3" @click="goBack">
        <i
          class="fa fa-arrow-left fa-fw"
          title="Retornar"
        />
        <span>Voltar</span>
      </div>
    </div>

    <div class="content-wrapper">
      <div>
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
            <card fullWidth>
              <div class="register-centrotrabalho-table">
                <v-client-table
                  ref="tableRegisterEpi"
                  v-model="workCenters"
                  :columns="columns"
                  :options="cadastroCentroTrabalhoTable.options"
                >
                  <div slot="actions" slot-scope="props">
                    <template>
                      <div class="icons-actions-wrapper">
                        <div class="icons-actions">
                          <i class="fas fa-edit text-muted" @click="editWorkCenter(props.row)"></i>
                        </div>
                        <div class="icons-actions">
                          <i class="fas fa-trash text-muted" @click="deleteWorkCenter(props.row, index)"></i>
                        </div>
                      </div>
                    </template>
                  </div>
                </v-client-table>
              </div>
            </card>
          </template>

          <template v-if="switchListRegister === 'register'">
            <form @submit.prevent="registerWorkCenter()">
              <div class="cadCard">
                <div class="inputs">
                  <simple-input v-model="inputValues.descricao" :label="'Centro de Trabalho:'" :type="'text'" />
                </div>
              </div>
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
import { getLocalStorageToken } from '../../../utils/utils';

export default {
  name: 'CadastroCentroTrabalho',

  data() {
    return {
      inputValues: {
        descricao: '',
      },
      switchListRegister: 'list',
      isEditing: false,
      workCenters: [],
      columns: ['descricao', 'actions'],
      cadastroCentroTrabalhoTable: {
        options: {
          headings: {
            id_centro_trabalho: create => create('span', {
              domProps: { innerHTML: 'Centro de Trabalho <i class="fas fa-sort"></i>' },
            }),
            descricao: 'Centro de Trabalho',
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
          sortable: ['id_centro_trabalho'],
        },
        
      },
    };
  },

  mounted() {
    this.getWorkCenter();
    this.$store.commit('addPageName', 'Cadastro de Centro de Trabalho ');
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
        return this.$store.commit('addPageName', `Cadastro de Centro de Trabalho | Listagem`);
      } else if (labelPage === 'register') {
        this.switchListRegister = 'register';
        return this.$store.commit('addPageName', `Cadastro de Centro de Trabalho | Cadastrar`);
      } else {
        return this.$store.commit('addPageName', `Cadastro de Centro de Trabalho | Editar`);}
    },
    getWorkCenter() {
      this.$http.get('centro-trabalho/get', getLocalStorageToken())
        .then(res => {
          if (res.result.length === 0) {
            this.$swal({
              type: 'warning',
              title: 'Não foi encontrado nenhum centro de trabalho!',
              confirmButtonColor: '#F34336',
            });
          }

          if (res.result.length === undefined)
            this.workCenters.push(res.result);
          else this.workCenters = [...res.result];
          console.log(this.workCenters);
        });
    },

    registerWorkCenter() {
      if (this.isEditing) return this.updateWorkCenter();
      this.$http.post('centro-trabalho', getLocalStorageToken(), this.inputValues)
        .then(res => {
          if (res.status !== 200) {
            return this.$swal({
              type: 'error',
              title: `Ops! ${res.err}`,
              confirmButtonColor: '#F34336',
            });
          }
          this.$swal({
            type: 'success',
            title: `${res.result}`,
            confirmButtonColor: '#F34336',
          }).then(() => {
            this.workCenters.push(this.inputValues);

            this.resetModel();
            this.getWorkCenter();
          });
        });
    },

    deleteWorkCenter(workCenter, index) {
      this.$swal({
        type: 'question',
        title: `Deseja mesmo remover o centro de trabalho ${workCenter.descricao}?`,
        showCancelButton: true,
        confirmButtonColor: '#F34336',
        preConfirm: () => {
          this.$http.delete('centro-trabalho', getLocalStorageToken(), workCenter.id_centro_trabalho)
            .then(res => {
              if (res.status !== 200) {
                return this.$swal({
                  type: 'error',
                  title: `Ops! ${res.err}`,
                  text: res.detailErr || '',
                  confirmButtonColor: '#F34336',
                });
              }
              this.$swal({
                type: 'success',
                title: `${res.result}`,
                confirmButtonColor: '#F34336',
              }).then(() => {
                this.workCenters.splice(index, 1);
              });
            });
        },
      });
    },

    editWorkCenter(workCenter) {
      this.switchLabelPage('edit');
      this.inputValues = { ...workCenter };
      console.log(this.inputValues);
      this.switchListRegister = 'register';
      this.isEditing = true;
    },

    updateWorkCenter() {
      this.$http.update('centro-trabalho', getLocalStorageToken(), this.inputValues, this.inputValues.idCentro_Trabalho)
        .then(res => {
          if (res.status !== 200) {
            return this.$swal({
              type: 'error',
              title: `Ops! ${res.err}`,
              confirmButtonColor: '#F34336',
            });
          }
          this.$swal({
            type: 'success',
            title: `${res.result}`,
            confirmButtonColor: '#F34336',
          }).then(() => {
            const index = this.workCenters.indexOf(
              this.workCenters.find(
                i => i.idCentro_Trabalho === this.inputValues.id_centro_trabalho
              )
            );
            
            this.workCenters.splice(index, 1, this.inputValues);
            this.closeEditing();
          });
        });
    },

    closeEditing() {
      this.switchLabelPage('list');
      this.switchListRegister = 'list';
      this.isEditing = false;
      this.resetModel();
    },

    resetModel() {
      this.inputValues = {};
    },
    goBack() {
      this.$router.push('/cadastros');
    },
  },
};
</script>

<style lang="scss" scoped>
.root-centro-trabalho-view {
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
    .cadCard {
      width: 50vw;
      padding: 20px;
      display: flex;
      flex-direction: column;
      border-radius: 10px;
      background-color: #ffffff;
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
.register-centrotrabalho-table {
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
