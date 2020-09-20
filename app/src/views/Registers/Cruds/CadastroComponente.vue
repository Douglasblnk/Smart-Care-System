<template>
  <div class="root-cadastro-component-view">
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
              <div class="register-component-table">
                <v-client-table
                  ref="tableRegisterEpi"
                  v-model="workComponent"
                  :columns="columns"
                  :options="registerComponetTable.options"
                >
                  <div slot="actions" slot-scope="{row, index}">
                    <template>
                      <div class="icons-actions-wrapper">
                        <div class="icons-actions">
                          <i class="fas fa-edit text-muted" @click="editComponent(row)"></i>
                        </div>
                        <div class="icons-actions">
                          <i class="fas fa-trash text-muted" @click="deleteComponents(row, index - 1)"></i>
                        </div>
                      </div>
                    </template>
                  </div>
                </v-client-table>
              </div>
            </card>
          </div>

          <div v-if="switchListRegister === 'register'" key="register">
            <div class="formPosition">
              <div class="cadCard">
                <div class="inputs">
                  <custom-select v-model="selectEquipment" :options="getWorkEquipmentOptions()"></custom-select>
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
                <smart-button
                  primary
                  :loading="isLoading"
                  class="mr-2"
                  @click.native="registerComponent()"
                >
                  {{ getSaveButtonText() }}
                </smart-button>

                <smart-button
                  v-if="isEditing"
                  @click.native="closeEditing()"
                >
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
  components: {
    
  },
  data() {
    return {
      selectEquipment: '',
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
      workComponent: [],
      selectsComponentseEquipament: [],
      switchListRegister: 'list',
      isEditing: false,
      isLoading: false,
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
        return this.$store.commit('addPageName', 'Cadastro de Componentes | Listagem');
      } else if (labelPage === 'register') {
        this.switchListRegister = 'register';
        return this.$store.commit('addPageName', 'Cadastro de Componentes | Cadastrar');
      }
      return this.$store.commit('addPageName', 'Cadastro de Componentes | Editar');
    },
    async registerComponent() {
      if (this.isLoading) return;
      if (this.isEditing) return this.updateComponent();

      this.inputValues.Equipamento_idEquipamento = this.selectEquipment;

      try {
        this.isLoading = true;
        await this.$http.post('componente', this.inputValues);

        this.resetModel();
        this.getComponentes();

        await this.$swal({
          type: 'success',
          text: 'Componente registrado com sucesso!',
          confirmButtonColor: '#F34336',
        });
      } catch (err) {
        console.log('err registerComponent:>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.isLoading = false;
      }
    },

    async getEquipments() {
      try {
        const response = await this.$http.get('equipamento');

        if (response.length === undefined)
          this.workEquipment.push(response);
        else this.workEquipment = [...response];
      } catch (err) {
        console.log('err getEquipments :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },

    async getComponentes() {
      try {
        const response = await this.$http.get('componente');

        if (response.length === undefined)
          this.workComponent.push(response);
        else this.workComponent = [...response];
      } catch (err) {
        console.log('err getComponentes :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async deleteComponents(component, index) {
      this.$swal({
        type: 'question',
        title: `Deseja mesmo remover o Componente ${component.DescricaoComponente}`,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonColor: '#F34336',
        preConfirm: async () => {
          try {
            await this.$http.delete('componente', component.idComponente);

            this.workComponent.splice(index, 1);

            await this.$swal({
              type: 'success',
              text: 'Componente removido com sucesso!',
              confirmButtonColor: '#F34336',
            });
          } catch (err) {
            console.log('err deleteComponents :>> ', err.response || err);

            return this.$swal({
              type: 'warning',
              html: getErrors(err),
              confirmButtonColor: '#F34336',
            });
          }
        },
      });
    },
    editComponent(component) {
      this.switchLabelPage('edit');
      this.inputValues = { ...component };
      this.switchListRegister = 'register';
      this.isEditing = true;

      const equipamentName = this.workEquipment.find(equipament => equipament.idEquipamento === component.Equipamento_idEquipamento);

      this.selectEquipment = String(equipamentName.idEquipamento);
    },
    async updateComponent() {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        this.inputValues.Equipamento_idEquipamento = this.selectEquipment;
        
        await this.$http.update('componente', this.inputValues, this.inputValues.idComponente);

        this.getComponentes();
        this.closeEditing();
        
        await this.$swal({
          type: 'success',
          text: 'Alterado com Sucesso',
          confirmButtonColor: '#F34336',
        });
      } catch (err) {
        console.log('err updateComponent :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.isLoading = false;
      }
    },
    getWorkEquipmentOptions() {
      return this.workEquipment.map(i => ({ id: String(i.idEquipamento), description: i.equipamento }));
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
