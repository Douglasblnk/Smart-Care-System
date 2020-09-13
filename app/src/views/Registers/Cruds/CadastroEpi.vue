<template>
  <div class="root-epi-view">
    <back-button @goBack="goBack" />

    <div class="content-wrapper">
      <div>
        <div class="list-option">
          <div class="d-flex justify-content-between">
            <div class="option d-flex align-items-center m-4" @click="() => switchListRegister = 'list'">
              <i class="fas fa-list-alt" />
              <span>Listar</span>
            </div>
            <div class="option d-flex align-items-center m-4" @click="() => switchListRegister = 'register'">
              <i class="fas fa-edit" />
              <span>Cadastrar</span>
            </div>
          </div>
        </div>

        <transition name="slide-fade" mode="out-in">
          <div v-if="switchListRegister === 'list'" key="list">
            <card full-width>
              <div class="register-epi-table">
                <v-client-table
                  ref="tableRegisterEpi"
                  v-model="Epis"
                  :columns="columns"
                  :options="cadastroEpiTable.options"
                >
                  <div slot="actions" slot-scope="{row, index}">
                    <template>
                      <div class="icons-actions-wrapper">
                        <div class="icons-actions">
                          <i class="fas fa-edit text-muted" @click="editEpi(row)"></i>
                        </div>
                        <div class="icons-actions">
                          <i class="fas fa-trash text-muted" @click="deleteEpi(row, index - 1)"></i>
                        </div>
                      </div>
                    </template>
                  </div>
                </v-client-table>
              </div>
            </card>
          </div>

          <div v-if="switchListRegister === 'register'" key="register">
            <div>
              <div class="cadCard">
                <simple-input v-model="inputValues.descricaoEpi" :label="'Epi:'" :type="'text'" />
              </div>

              <div class="d-flex justify-content-center m-3">
                <smart-button
                  primary
                  :loading="isLoading"
                  class="mr-2"
                  @click.native="registerEpi()"
                >
                  {{ getSaveButtonText() }}
                </smart-button>
                <smart-button v-if="isEditing" @click.native="closeEditing">
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
  name: 'CadastroEpi',

  data() {
    return {
      inputValues: {
        descricaoEpi: '',
      },
      switchListRegister: 'list',
      isEditing: false,
      isLoading: false,
      Epis: [],
      columns: ['descricaoEpi', 'actions'],
      cadastroEpiTable: {
        options: {
          headings: {
            idEpi: create => create('span', {
              domProps: { innerHTML: 'Epi <i class="fas fa-sort"></i>' },
            }),
            descricaoEpi: 'Epi',
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
          sortable: ['idEpi'],
        },
        
      },
    };
  },
  mounted() {
    this.getEpi();
    this.$store.commit('addPageName', 'Cadastro de EPI');
    this.switchLabelPage('list');
  },

  methods: {
    getSaveButtonText() {
      if (this.isEditing) return 'Alterar';
      return 'Cadastro';
    },
    switchLabelPage(labelPage) {
      if (labelPage === 'list') {
        this.switchListRegister = 'list';
        return this.$store.commit('addPageName', 'Cadastro de EPI | Listagem');
      } else if (labelPage === 'register') {
        this.switchListRegister = 'register';
        return this.$store.commit('addPageName', 'Cadastro de EPI | Cadastrar');
      }
      return this.$store.commit('addPageName', 'Cadastro de EPI | Editar');
    },
    async getEpi() {
      try {
        const response = await this.$http.get('epi');

        if (response.length === undefined)
          this.Epis.push(response);
        else this.Epis = [...response];
      } catch (err) {
        console.log('err getEpi :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async registerEpi() {
      if (this.isLoading) return;
      if (this.isEditing) return this.updateEpi();

      try {
        this.isLoading = true;

        await this.$http.post('epi', this.inputValues);

        this.resetModel();
        this.getEpi();

        await this.$swal({
          type: 'success',
          text: 'Epi registrado com sucesso!',
          confirmButtonColor: '#F34336',
        });
      } catch (err) {
        console.log('err registerEpi :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.isLoading = false;
      }
    },
    async updateEpi() {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        await this.$http.update('epi', this.inputValues, this.inputValues.idEpi);

        this.closeEditing();
        this.getEpi();

        this.$swal({
          type: 'success',
          text: 'Epi alterado com sucesso!',
          confirmButtonColor: '#F34336',
        });
      } catch (err) {
        console.log('err updateEpi :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.isLoading = false;
      }
    },
    deleteEpi(epi, index) {
      this.$swal({
        type: 'question',
        title: `Deseja mesmo remover o Epi ${epi.descricaoEpi}`,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonColor: '#F34336',
        preConfirm: async () => {
          try {
            await this.$http.delete('epi', epi.idEpi);

            await this.$swal({
              type: 'success',
              text: 'Epi removido com sucesso!',
              confirmButtonColor: '#F34336',
            }),

            this.Epis.splice(index, 1);
          } catch (err) {
            console.log('err deleteEpi :>> ', err.response || err);

            return this.$swal({
              type: 'warning',
              html: getErrors(err),
              confirmButtonColor: '#F34336',
            });
          }
        },
      });
    },
    editEpi(epi) {
      this.switchLabelPage('edit');
      this.inputValues = { ...epi };
      this.switchListRegister = 'register';
      this.isEditing = true;
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
.root-epi-view {
  width: 100%;
  .content-wrapper {
    display: flex;
    flex-direction: column;
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
      padding: 20px;
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

}
</style>
<style lang="scss">
.register-epi-table {
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
