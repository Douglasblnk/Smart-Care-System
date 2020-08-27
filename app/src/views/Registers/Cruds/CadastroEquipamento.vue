<template>
  <div class="equipment-wrapper">
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
              <div class="register-equipament-table">
                <v-client-table
                  ref="tableRegisterEpi"
                  v-model="equipments"
                  :columns="columns"
                  :options="registerequipamentTable.options"
                >
                  <div slot="actions" slot-scope="props">
                    <template>
                      <div class="icons-actions-wrapper">
                        <div class="icons-actions">
                          <i class="fas fa-edit text-muted" @click="editEquipment(props.row)"></i>
                        </div>
                        <div class="icons-actions">
                          <i class="fas fa-trash text-muted" @click="deleteEquipment(props.row, index)"></i>
                        </div>
                      </div>
                    </template>
                  </div>
                </v-client-table>
              </div>
            </card>
          </template>

          <template v-if="switchListRegister === 'register'">
            <form @submit.prevent="registerEquipment()">
              <div class="cadCard">
                <div class="input-card">
                  <custom-select
                    v-model="inputValues.Setor_idSetor"
                    label="Setor"
                    :options="getSectorOptions()"
                  />
                  <simple-input v-model="inputValues.equipamento" label="Equipamento:" type="text" />
                  <simple-input v-model="inputValues.equipamentoSuperior" label="Equipamento Superior:" type="text" />
                </div>
                <div class="input-card">
                  <description
                    v-model="inputValues.descricao"
                    cols="30"
                    rows="3"
                    label="Descrição: "
                  />
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
import { getLocalStorageToken, getErrors } from '../../../utils/utils';

export default {
  name: 'CadastroEquipamento',

  data() {
    return {
      inputValues: {
        Setor_idSetor: '',
        equipamento: '',
        equipamentoSuperior: '',
        descricao: '',
      },
      columns: ['equipamento', 'Setor_idSetor', 'descricao', 'actions'],
      registerequipamentTable: {
        options: {
          headings: {
            idEquipamento: create => create('span', {
              domProps: { innerHTML: 'Equipamento <i class="fas fa-sort"></i>' },
            }),
            Setor_idSetor:'Local de instalação',
            equipamento: 'Equipamento',
            descricao: 'Descrição',
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
          sortable: ['idEquipamento:'],
        },
        
      },
      equipments: [],
      selectsSector: [],
      switchListRegister: 'list',
      isEditing: false,
    };
  },

  mounted() {
    this.$store.commit('addPageName', 'Cadastro de Equipamento');
    this.getEquipment();
    this.getSector();
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
        return this.$store.commit('addPageName', 'Cadastro de Equipamento | Listagem');
      } else if (labelPage === 'register') {
        this.switchListRegister = 'register';
        return this.$store.commit('addPageName', 'Cadastro de Equipamento | Cadastrar');
      }
      return this.$store.commit('addPageName', 'Cadastro de Equipamento | Editar');
    },
    editEquipment(equipment) {
      this.switchLabelPage('edit');
      
      this.inputValues = { ...equipment };
      this.switchListRegister = 'register';
      this.isEditing = true;
    },

    closeEditing() {
      this.switchLabelPage('list');
      this.switchListRegister = 'list';
      this.isEditing = false;
      this.resetModel();
    },

    getEquipment() {
      this.$http.get('equipamento/get', getLocalStorageToken())
        .then(res => {
          if (res.result.length === 0) {
            this.$swal({
              type: 'warning',
              title: 'Não foi encontrado nenhum equipamento cadastrado!',
              confirmButtonColor: '#F34336',
            });
          }

          if (res.result.length === undefined)
            this.equipments.push(res.result);
          else this.equipments = [...res.result];
        });
    },
    async getSector() {
      try {
        const response = await this.$http.get('local-instalacao/get', getLocalStorageToken());

        if (response.result.length === undefined)
          this.selectsSector.push(response.result);

        else this.selectsSector = [...response.result];
      } catch (err) {
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    registerEquipment() {
      if (this.isEditing) return this.updateEquipment();
      this.$http.post('equipamento', getLocalStorageToken(), this.inputValues)
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
            this.equipments.push(this.inputValues);

            this.resetModel();
            this.getEquipment();
          });
        });
    },

    deleteEquipment(equipment, index) {
      this.$swal({
        type: 'question',
        title: `Deseja mesmo remover o equipamento ${equipment.descricao}?`,
        showCancelButton: true,
        confirmButtonColor: '#F34336',
        preConfirm: () => {
          this.$http.delete('equipamento', getLocalStorageToken(), equipment.idEquipamento)
            .then(res => {
              if (res.status !== 200) {
                return this.$swal({
                  type: 'warning',
                  title: res.err,
                  confirmButtonColor: '#F34336',
                });
              }

              this.$swal({
                type: 'success',
                title: res.result,
                confirmButtonColor: '#F34336',
              }).then(() => {
                this.equipments.splice(index, 1);
              });
            });
        },
      });
    },

    updateEquipment() {
      this.$http.update('equipamento', getLocalStorageToken(), this.inputValues, this.inputValues.idEquipamento)
        .then(res => {
          if (res.status !== 200) {
            return this.$swal({
              type: 'error',
              title: 'Ops! Ocorreu um erro com a solicitação.',
              text: res.err,
              confirmButtonColor: '#F34336',
            });
          }
          this.$swal({
            type: 'success',
            title: res.result,
            confirmButtonColor: '#F34336',
          }).then(() => {
            const index = this.equipments.indexOf(
              this.equipments.find(
                i => i.idEquipamento === this.inputValues.idEquipamento
              )
            );
            
            this.equipments.splice(index, 1, this.inputValues);
            this.closeEditing();
          });
        });
    },

    resetModel() {
      this.inputValues = {};
    },
    goBack() {
      this.$router.push('/cadastros');
    },
    getSectorOptions() {
      return this.selectsSector.map(i => ({ id: String(i.idSetor), description: i.nome }));
    },
  },
};
</script>

<style lang="scss" scoped>
.equipment-wrapper {
  width: 100%;
  .content-wrapper{
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
      border-radius: 10px;
      background-color: #ffffff;
      .input-card {
        display: flex;
        flex-wrap: wrap;
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

</style>
<style lang="scss">
.register-equipament-table {
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
