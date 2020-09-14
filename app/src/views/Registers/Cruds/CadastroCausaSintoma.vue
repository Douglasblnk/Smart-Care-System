<template>
  <div class="root-cadastro-causa-view">
    <back-button @goBack="goBack" />

    <div class="d-flex align-items-center flex-column">
      <div class="register-select">
        <span>Selecione um tipo de cadastro</span>
      </div>
      <div>
        <div class="options-wrapper">
          <div
            class="option-text"
            :class="registerType === 'cause' ? 'selected' : ''"
            @click="selectRegisterType('cause')"
          >
            <span>Causa</span>
          </div>

          <div
            class="option-text"
            :class="registerType === 'symptom' ? 'selected' : ''"
            @click="selectRegisterType('symptom')"
          >
            <span>Sintoma</span>
          </div>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <transition name="slide-fade" mode="out-in">
        <!--
          LISTA E CADASTRO DE CAUSA
        -->
        <div v-if="registerType === 'cause'" key="cause" class="items-wrapper">
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
              <div class="d-flex w-100 justify-content-center">
                <div class="table-content bg-white p-4 w-100">
                  <div class="table-responsive">
                    <table class="table table table-striped table-borderless table-hover" cellspacing="0">
                      <thead class="table-head">
                        <tr>
                          <th scope="col">Causa</th>
                          <th scope="col">Ações</th>
                        </tr>
                      </thead>
                      <tbody class="table-body">
                        <tr v-for="(cause, index) in causes" :key="`order-${index}`">
                          <td>{{ cause.descricaoCausa }}</td>
                          <td style="width: 50px">
                            <div class="d-flex table-action">
                              <i class="fas fa-edit text-muted" @click="startEdition(cause)"></i>
                              <i class="fas fa-trash text-muted" @click="deleteCause(cause, index)"></i>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="switchListRegister === 'register'" key="register">
              <div class="cadCard p-4 bg-white">
                <simple-input
                  v-model="inputValuesCause.descricaoCausa"
                  label="Digite aqui a causa do defeito: "
                  type="text"
                />
              </div>
              <div class="d-flex justify-content-center m-3">
                <smart-button
                  primary
                  :loading="isLoading"
                  class="mr-2"
                  @click.native="registerCause()"
                >
                  {{ getSaveButtonText()  }}
                </smart-button>
                <smart-button v-if="isEditing" @click.native="closeEditing()">
                  <span>Cancelar</span>
                </smart-button>
              </div>
            </div>
          </transition>
        </div>

        <!--
          LISTA E CADASTRO DE SINTOMA
        -->
        <div v-if="registerType === 'symptom'" key="symptom" class="items-wrapper">
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
              <div class="d-flex w-100 justify-content-center">
                <div class="table-content bg-white p-4 w-100">
                  <div class="table-responsive">
                    <table class="table table table-striped table-borderless table-hover" cellspacing="0">
                      <thead class="table-head">
                        <tr>
                          <th scope="col">Sintoma</th>
                          <th scope="col">Ações</th>
                        </tr>
                      </thead>
                      <tbody class="table-body">
                        <tr v-for="(symptom, index) in symptons" :key="`order-${index}`">
                          <td>{{ symptom.descricaoSintomas }}</td>
                          <td style="width: 50px">
                            <div class="d-flex table-action">
                              <i class="fas fa-edit text-muted" @click="startEdition(symptom)"></i>
                              <i class="fas fa-trash text-muted" @click="deleteSymptom(symptom, index)"></i>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="switchListRegister === 'register'" key="register">
              <div class="cadCard p-4 bg-white">
                <simple-input
                  v-model="inputValuesSymptom.descricaoSintomas"
                  label="Digite aqui o sintoma do defeito: "
                  type="text"
                />
              </div>
              <div class="d-flex justify-content-center m-3">
                <smart-button
                  primary
                  :loading="isLoading"
                  class="mr-2"
                  @click.native="registerSymptom()"
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
      </transition>
    </div>
  </div>
</template>

<script>
import { getErrors } from '../../../utils/utils';

export default {

  data() {
    return {
      registerType: '',
      inputValuesCause: {
        descricaoCausa: '',
      },
      inputValuesSymptom: {
        descricaoSintomas: '',
      },
      state: {
        view: '',
      },
      causes: [],
      symptons: [],
      switchListRegister: 'list',
      isEditing: false,
      isLoading: false,
    };
  },
  mounted() {
    this.$store.commit('addPageName', 'Cadastro de Causa e Sintoma ');
  },

  methods: {
    selectRegisterType(type) {
      if (this.registerType === type) return;

      this.registerType = type;
      if (type === 'cause') return this.getCause();
      return this.getSymptom();
    },
    getSaveButtonText() {
      if (this.isEditing) return 'Alterar';
      return 'Cadastrar';
    },
    switchLabelPage(labelPage) {
      if (labelPage === 'list') {
        this.switchListRegister = 'list';
        return this.$store.commit('addPageName', `${this.state.view} | Listagem`);
      } else if (labelPage === 'register') {
        this.switchListRegister = 'register';
        return this.$store.commit('addPageName', `${this.state.view} | Cadastrar`);
      }
      return this.$store.commit('addPageName', `${this.state.view} | Editar`);
    },

    closeEditing() {
      this.switchLabelPage('list');
      this.switchListRegister = 'list';
      this.isEditing = false;
      this.resetModel();
    },

    resetModel() {
      this.inputValuesCause = {};
      this.inputValuesSymptom = {};
    },

    startEdition(value) {
      this.switchLabelPage('edit');
      this.inputValuesCause = { ...value };
      this.inputValuesSymptom = { ...value };
      this.switchListRegister = 'register';
      this.isEditing = true;
    },

    async getCause() {
      try {
        const response = await this.$http.get('causa');

        if (response.length === undefined)
          this.causes.push(response);
        else this.causes = [...response];
      } catch (err) {
        console.log('error getCause =>', err.response || err);

        this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },

    async getSymptom() {
      try {
        const response = await this.$http.get('sintoma');

        if (response.length === undefined)
          this.symptons.push(response);
        else this.symptons = [...response];
      } catch (err) {
        console.log('error getSymptom =>', err.response || err);

        this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },

    async registerCause() {
      if (this.isLoading) return;
      if (this.isEditing) return this.updateCause();
      
      try {
        this.isLoading = true;
        await this.$http.post('causa', this.inputValuesCause);

        this.resetModel();
        this.getCause();

        await this.$swal({
          type: 'success',
          html: 'Causa registrada com sucesso!',
          confirmButtonColor: '#F34336',
        });
      } catch (err) {
        console.log('error registerCause =>', err.response || err);

        this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.isLoading = false;
      }
    },

    async registerSymptom() {
      if (this.isLoading) return;
      if (this.isEditing) return this.updateSymptom();

      try {
        this.isLoading = true;
        await this.$http.post('sintoma', this.inputValuesSymptom);

        this.resetModel();
        this.getSymptom();

        await this.$swal({
          type: 'success',
          html: 'Sintoma registrado com sucesso!',
          confirmButtonColor: '#F34336',
        });
      } catch (err) {
        console.log('error registerSymptom =>', err.response || err);

        this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.isLoading = false;
      }
    },

    deleteCause(cause, index) {
      this.$swal({
        type: 'question',
        title: `Deseja mesmo remover o tipo ${cause.descricaoCausa}?`,
        loadOnConfirm: true,
        showLoaderOnConfirm: true,
        confirmButtonColor: '#F34336',
        preConfirm: async () => {
          try {
            await this.$http.delete('causa', cause.idCausa);

            this.causes.splice(index, 1);

            await this.$swal({
              type: 'success',
              html: 'Causa removida com sucesso!',
              confirmButtonColor: '#F34336',
            });
          } catch (err) {
            console.log('error deleteCause =>', err.response || err);

            this.$swal({
              type: 'warning',
              html: getErrors(err),
              confirmButtonColor: '#F34336',
            });
          }
        },
      });
    },

    deleteSymptom(symptom, index) {
      this.$swal({
        type: 'question',
        title: `Deseja mesmo remover o tipo ${symptom.descricaoSintomas}?`,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonColor: '#F34336',
        preConfirm: async () => {
          try {
            await this.$http.delete('sintoma', symptom.idSintomas);

            this.symptons.splice(index, 1);

            await this.$swal({
              type: 'success',
              html: 'Sintoma removido com sucesso!',
              confirmButtonColor: '#F34336',
            });
          } catch (err) {
            console.log('error deleteSymptom =>', err.response || err);

            this.$swal({
              type: 'warning',
              html: getErrors(err),
              confirmButtonColor: '#F34336',
            });
          }
        },
      });
    },

    async updateCause() {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        await this.$http.update('causa', this.inputValuesCause, this.inputValuesCause.idCausa);

        this.closeEditing();
        this.getCause();

        await this.$swal({
          type: 'success',
          html: 'Causa alterada com sucesso!',
          confirmButtonColor: '#F34336',
        });
      } catch (err) {
        console.log('error updateCause =>', err.response || err);

        this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.isLoading = false;
      }
    },

    async updateSymptom() {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        await this.$http.update('sintoma', this.inputValuesSymptom, this.inputValuesSymptom.idSintomas);

        this.closeEditing();
        this.getSymptom();

        await this.$swal({
          type: 'success',
          html: 'Sintoma alterado com sucesso!',
          confirmButtonColor: '#F34336',
        });
      } catch (err) {
        console.log('error updateSymptom =>', err.response || err);

        this.$swal({
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
.root-cadastro-causa-view {
  width: 100%;
  .register-select {
    span {
      font-size: 24px;
      color: var(--duas-rodas-soft);
      font-family: 'roboto'
    }
  }
  .options-wrapper {
    display: flex;
    justify-content: space-around;
    margin: 5px 0;
    .option-text {
      padding: 15px 20px;
      margin: 0 5px;
      background-color: #ddd;
      border-radius: 8px;
      cursor: pointer;
      user-select: none;
      transition: .2s;
      &:hover {
        background-color: #ddd;
        transform: scale(1.1);
      }
      &:active {
        transform: scale(1);
      }
    }
    .selected {
      background-color: var(--duas-rodas-soft) !important;
      span {
        color: white !important;
      }
    }
  }
  .content-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .items-wrapper {
    .cadCard {
      border-radius: 10px;
    }
  }
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
