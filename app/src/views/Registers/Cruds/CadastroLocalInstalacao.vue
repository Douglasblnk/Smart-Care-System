<template>
  <div class="root-local-instalacao-view">
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
              <div class="register-localinstalacao-table">
                <v-client-table
                  ref="tableRegisterEpi"
                  v-model="instalationLocal"
                  :columns="columns"
                  :options="cadastroLocalInstalacaoTable.options"
                >
                  <div slot="actions" slot-scope="props">
                    <template>
                      <div class="icons-actions-wrapper">
                        <div class="icons-actions">
                          <i class="fas fa-edit text-muted" @click="editSector(props.row)"></i>
                        </div>
                        <div class="icons-actions">
                          <i class="fas fa-trash text-muted" @click="deleteSector(props.row, index)"></i>
                        </div>
                      </div>
                    </template>
                  </div>
                </v-client-table>
              </div>
            </card>
          </template>

          <template v-if="switchListRegister === 'register'">
            <form @submit.prevent="registerSector()">
              <div class="cadCard">
                <div class="inputs">
                  <simple-input v-model="inputValues.nome" :label="'Local Instalação:'" :type="'text'" />
                </div>
              </div>
              <div class="d-flex justify-content-center m-3">
                <smart-button primary class="mr-2">
                  {{getSaveButtonText()}}
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
  data() {
    return {
      inputValues: {
        idSetor: '',
        nome: '',
      },
      columns: ['nome', 'actions'],
      cadastroLocalInstalacaoTable: {
        options: {
          headings: {
            idSetor: create => create('span', {
              domProps: { innerHTML: 'Local Instalação <i class="fas fa-sort"></i>' },
            }),
            nome: 'Local Instalação',
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
          sortable: ['idSetor'],
        },
        
      },
      switchListRegister: 'list',
      isEditing: false,
      instalationLocal: [],
    };
  },

  mounted() {
    this.getSector();
    this.$store.commit('addPageName', 'Cadastro de Local Instalação ');
    this.switchLabelPage('list');
  },

  methods: {
    getSaveButtonText() {
      if (this.isEditing) return 'Alterar';
      return 'Cadastrar';
    },
    editSector(sector) {
      this.switchLabelPage('edit');
      this.inputValues = { ...sector };
      this.switchListRegister = 'register';
      this.isEditing = true;
    },
    switchLabelPage(labelPage) {
      if (labelPage === 'list') {
        this.switchListRegister = 'list';
        return this.$store.commit('addPageName', 'Cadastro de Local Instalação | Listagem');
      } else if (labelPage === 'register') {
        this.switchListRegister = 'register';
        return this.$store.commit('addPageName', 'Cadastro de Local Instalação | Cadastrar');
      }
      return this.$store.commit('addPageName', 'Cadastro de Local Instalação | Editar');
    },
    async getSector() {
      try {
        const response = await this.$http.get('local-instalacao/get', getLocalStorageToken());

        if (response.result.length === undefined)
          this.instalationLocal.push(response.result);
          
        else this.instalationLocal = [...response.result];
      } catch (err) {
        console.log('err getSector => :', err.response || err);

        return this.$swal({
          type: 'warning',
          text: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async registerSector() {
      if (this.isEditing) return this.updateSector();

      try {
        const response = await this.$http.post('local-instalacao', getLocalStorageToken(), this.inputValues);

        this.$swal({
          type: 'success',
          title: response.result,
          confirmButtonColor: '#F34336',
        }).then(() => {
          this.instalationLocal.push(this.inputValues);

          this.resetModel();
          this.getSector();
        });
      } catch (err) {
        console.log('err registerSector => :', err.response || err);

        return this.$swal({
          type: 'warning',
          text: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async updateSector() {
      try {
        console.log('INPUT VALUES: ', this.inputValues);
        const response = await this.$http.update(
          'local-instalacao', getLocalStorageToken(), this.inputValues, this.inputValues.idSetor,
        );

        this.$swal({
          type: 'success',
          title: response.result,
          confirmButtonColor: '#F34336',
        }).then(() => {
          const index = this.instalationLocal.indexOf(
            this.instalationLocal.find(i => i.idSetor === this.inputValues.idSetor)
          );

          this.instalationLocal.splice(index, 1, this.inputValues);

          this.closeEditing();
        });
      } catch (err) {
        console.log('err updateSector => :', err.response || err);

        return this.$swal({
          type: 'error',
          text: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    deleteSector(sector, index) {
      this.$swal({
        type: 'question',
        title: `Deseja mesmo remover o setor de ${sector.nome}?`,
        showCancelButton: true,
        confirmButtonColor: '#F34336',
        preConfirm: async () => {
          try {
            const response = await this.$http.delete('local-instalacao', getLocalStorageToken(), sector.idSetor);

            return this.$swal({
              type: 'success',
              title: response.result,
              confirmButtonColor: '#F34336',
            }).then(() => {
              this.instalationLocal.splice(index, 1);
            });
          } catch (err) {
            console.log('err deleteSector => :', err.response || err);

            return this.$swal({
              type: 'error',
              text: getErrors(err),
              confirmButtonColor: '#F34336',
            });
          }
        },
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
.root-local-instalacao-view {
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
.register-localinstalacao-table {
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
