<template>
  <div class="root-cadastro-component-view">
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
              <div class="register-component-table">
                <v-client-table
                  ref="tableRegisterEpi"
                  v-model="workComponent"
                  :columns="columns"
                  :options="registerComponetTable.options"
                >
                  <div slot="actions" slot-scope="props">
                    <template>
                      <div class="icons-actions-wrapper">
                        <div class="icons-actions">
                          <i class="fas fa-edit text-muted" @click="editComponent(props.row)"></i>
                        </div>
                        <div class="icons-actions">
                          <i class="fas fa-trash text-muted" @click="deleteComponents(props.row, index)"></i>
                        </div>
                      </div>
                    </template>
                  </div>
                </v-client-table>
              </div>
            </card>
          </template>

          <template v-if="switchListRegister === 'register'">
            <form class="formPosition" @submit.prevent="registerEquipment()">
              <div class="cadCard">
                <div class="inputs">
                  <custom-select v-model="selectValue" :options="getWorkEquipmentOptions()"></custom-select>
                </div>
                <div class="sideInput">
                  <div class="inputsSidePosition">
                    <description
                      v-model="inputValues.DescricaoComponente"
                      :label="'Descrição Componente:'"
                      :type="'text'"
                    />
                  </div>
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
import { getToken, getErrors } from '../../../utils/utils';


export default {
  components: {
    
  },
  data() {
    return {
      selectValue: '',
      inputValues: {
        DescricaoComponente: '',
        Equipamento_idEquipamento: 0,

      },
      columns: ['DescricaoComponente', 'actions'],
      registerComponetTable: {
        options: {
          headings: {
            idComponente: create => create('span', {
              domProps: { innerHTML: 'Componente <i class="fas fa-sort"></i>' },
            }),
            DescricaoComponente: 'Componente',
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
          sortable: ['idComponente'],
        },
        
      },
      workEquipment: [],
      workEquipmentEdit: [],
      workComponent: [],
      selectsComponentseEquipament: [],
      switchListRegister: 'list',
      isEditing: false,
      equipamentos: [],
    };
  },
  mounted() {
    this.getEquipments();
    this.getComponentes();
    this.$store.commit('addPageName', 'Cadastro de Componentes');
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
        this.workEquipment = this.workEquipmentEdit;
        return this.$store.commit('addPageName', 'Cadastro de Componentes | Listagem');
      } else if (labelPage === 'register') {
        this.workEquipment = this.workEquipmentEdit;
        this.switchListRegister = 'register';
        return this.$store.commit('addPageName', 'Cadastro de Componentes | Cadastrar');
      }
      return this.$store.commit('addPageName', 'Cadastro de Componentes | Editar');
    },
    async registerEquipment() {
      if (this.isEditing) return this.updateComponent();
      this.inputValues.Equipamento_idEquipamento = this.selectValue;
      try {
        const response = await this.$http.post('componente', getToken(), this.inputValues);
        this.$swal({
          type: 'success',
          title: 'Cadastrado com sucesso',
          confirmButtonColor: '#F34336',
        }),
        this.DescricaoComponente = '';
        this.getComponentes();
      } catch (err) {
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },

    async getEquipments() {
      try {
        const response = await this.$http.get('equipamento/get', getToken());
        if (response.result.length === undefined)
          this.workEquipment.push(response.result);
        else this.workEquipment = [...response.result];
      } catch (err) {
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },

    async getComponentes() {
      try {
        const response = await this.$http.get('componente/get', getToken());
        if (response.result.length === undefined)
          this.workComponent.push(response.result);
        else this.workComponent = [...response.result];
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
  
    async deleteComponents(component, index) {
      try {
        this.$swal({
          type: 'question',
          title: `Deseja mesmo remover o Componente ${component.DescricaoComponente}`,
          showCancelButton: true,
          confirmButtonColor: '#F34336',
          preConfirm: async () => {
            const response = await this.$http.delete('componente', getToken(), component.idComponente);
            return this.$swal({
              type: 'success',
              title: 'Removido com Sucesso',
              text: response.detailErr || '',
              confirmButtonColor: '#F34336',
            });
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
    editComponent(component) {
      this.switchLabelPage('edit');
      this.inputValues = { ...component };
      this.switchListRegister = 'register';
      this.isEditing = true;

      this.workEquipmentEdit = this.workEquipment;

      const equipamentName = this.workEquipment.find(equipament => equipament.idEquipamento === component.Equipamento_idEquipamento);

      if (equipamentName !== undefined) {
        this.workEquipment = [];
        this.workEquipment.push(equipamentName);
        this.getWorkEquipmentOptions();
      } else { return this.workEquipment= this.workEquipment; }
    },
  
    closeEditing() {
      this.switchLabelPage('list');
      this.switchListRegister = 'list';
      this.isEditing = false;
      this.workEquipment = this.workEquipmentEdit;
      this.resetModel();
    },
    async updateComponent() {
      try {
        const response = await this.$http.update('componente', getToken(), this.inputValues, this.inputValues.idComponente);
        this.$swal({
          type: 'success',
          title: 'Alterado com Sucesso',
          confirmButtonColor: '#F34336',
        });
        const index = this.workComponent.indexOf(this.workComponent.find(i => i.idComponente === this.inputValues.idComponente));
        this.workComponent.splice(index, 1, this.inputValues);
        this.workEquipment = this.workEquipmentEdit;
        this.closeEditing();
      } catch (err) {
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    getWorkEquipmentOptions() {
      return this.workEquipment.map(i => ({ id: String(i.idEquipamento), description: i.equipamento }));
    },
  },
};
</script>

<style lang="scss" scoped>
.root-cadastro-component-view {
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
.register-component-table {
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
