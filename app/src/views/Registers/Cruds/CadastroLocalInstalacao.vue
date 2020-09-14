<template>
  <div class="root-local-instalacao-view">
    <back-button @goBack="goBack" />

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
          <div v-if="switchListRegister === 'list'" key="list">
            <card full-width>
              <div class="register-localinstalacao-table">
                <v-client-table
                  ref="tableRegisterEpi"
                  v-model="instalationLocal"
                  :columns="columns"
                  :options="cadastroLocalInstalacaoTable.options"
                >
                  <div slot="actions" slot-scope="{row, index}">
                    <template>
                      <div class="icons-actions-wrapper">
                        <div class="icons-actions">
                          <i class="fas fa-edit text-muted" @click="editSector(row)"></i>
                        </div>
                        <div class="icons-actions">
                          <i class="fas fa-trash text-muted" @click="deleteSector(row, index - 1)"></i>
                        </div>
                      </div>
                    </template>
                  </div>
                </v-client-table>
              </div>
            </card>
          </div>

          <div v-if="switchListRegister === 'register'" key="register">
            <div class="cadCard">
              <div class="inputs">
                <simple-input v-model="inputValues.nome" :label="'Local Instalação:'" :type="'text'" />
              </div>
            </div>
            <div class="d-flex justify-content-center m-3">
              <smart-button
                primary
                :loading="isLoading"
                class="mr-2"
                @click.native="registerSector()"
              >
                {{ getSaveButtonText() }}
              </smart-button>
              <smart-button v-if="isEditing" @click.native="closeEditing()">
                <span>Cancelar</span>
              </smart-button>
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
      isLoading: false,
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
        const response = await this.$http.get('local-instalacao');

        if (response.length === undefined)
          this.instalationLocal.push(response);
        else this.instalationLocal = [...response];
      } catch (err) {
        console.log('err getSector => :', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async registerSector() {
      if (this.isLoading) return;
      if (this.isEditing) return this.updateSector();

      try {
        this.isLoading = true;
        await this.$http.post('local-instalacao', this.inputValues);

        this.resetModel();
        this.getSector();

        this.$swal({
          type: 'success',
          text: 'Local de instalação registrado com sucesso!',
          confirmButtonColor: '#F34336',
        });
      } catch (err) {
        console.log('err registerSector => :', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.isLoading = false;
      }
    },
    async updateSector() {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        await this.$http.update('local-instalacao', this.inputValues, this.inputValues.idSetor);

        this.getSector();
        this.closeEditing();

        await this.$swal({
          type: 'success',
          text: 'Local de instalação alterado com sucesso!',
          confirmButtonColor: '#F34336',
        });
      } catch (err) {
        console.log('err updateSector => :', err.response || err);

        return this.$swal({
          type: 'error',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.isLoading = false;
      }
    },
    deleteSector(sector, index) {
      this.$swal({
        type: 'question',
        title: `Deseja mesmo remover o setor de ${sector.nome}?`,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonColor: '#F34336',
        preConfirm: async () => {
          try {
            await this.$http.delete('local-instalacao', sector.idSetor);

            await this.$swal({
              type: 'success',
              text: 'Local de instalação removido com sucesso!',
              confirmButtonColor: '#F34336',
            });

            this.instalationLocal.splice(index, 1);
          } catch (err) {
            console.log('err deleteSector => :', err.response || err);

            return this.$swal({
              type: 'error',
              html: getErrors(err),
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
