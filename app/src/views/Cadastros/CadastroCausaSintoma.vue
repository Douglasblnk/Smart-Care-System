<template>
  <div class="root-cadastro-causa-view">
    <div class="d-flex align-items-center">
      <div class="back-button ml-3" @click="goBack">
        <i
          class="fa fa-arrow-left fa-fw"
          title="Retornar"
        />
        <span>Voltar</span>
      </div>
    </div>

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
            <template v-if="switchListRegister === 'list'">
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
            </template>

            <template v-if="switchListRegister === 'register'">
              <form @submit.prevent="registerCause">
                <div class="cadCard p-4 bg-white">
                  <simple-input
                    label="Digite aqui a causa do defeito: "
                    type="text"
                    v-model="inputValuesCause.descricaoCausa"
                  />
                </div>
                <div class="d-flex justify-content-center m-3">
                  <smart-button primary class="mr-2">
                    {{ getSaveButtonText()  }}
                  </smart-button>                    
                  <smart-button v-if="isEditing" @click.native="closeEditing">
                    <span>Cancelar</span>
                  </smart-button>
                </div>
              </form>
            </template>
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
            <template v-if="switchListRegister === 'list'">
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
            </template>

            <template v-if="switchListRegister === 'register'">
              <form @submit.prevent="registerSymptom">
                <div class="cadCard p-4 bg-white">
                  <simple-input
                    v-model="inputValuesSymptom.descricaoSintomas"
                    label="Digite aqui o sintoma do defeito: "
                    type="text"
                  />
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
      </transition>
    </div>
  </div>
</template>

<script>
import { getLocalStorageToken } from '../../utils/utils';

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
      } else {
        return this.$store.commit('addPageName', `${this.state.view} | Editar`);
      }
    },

    closeEditing() {
      this.switchLabelPage('list');
      this.switchListRegister = 'list'
      this.isEditing = false;
      this.resetModel();
    },

    resetModel() {
      this.inputValuesCause = {}
      this.inputValuesSymptom = {}
    },

    startEdition(value) {
      this.switchLabelPage('edit');
      this.inputValuesCause = { ...value }
      this.inputValuesSymptom = { ...value }
      this.switchListRegister = 'register'
      this.isEditing = true;
    },

    getCause() {
      this.$http.get('causa', getLocalStorageToken())
        .then(res => {
          if (res.status !== 200) return this.$swal({
            type: 'error',
            title: `Ops! ${res.err}`,
            confirmButtonColor: '#F34336',
          });
          if (res.result.length === undefined) 
            this.causes.push(res.result)
          else this.causes = [ ...res.result ]
          console.log(this.causes);
        })
    },

    getSymptom() {
      this.$http.get('sintoma', getLocalStorageToken())
        .then(res => {
          if (res.status !== 200) return this.$swal({
            type: 'error',
            title: `Ops! ${res.err}`,
            confirmButtonColor: '#F34336',
          });
          if (res.result.length === undefined) 
            this.symptons.push(res.result)
          else this.symptons = [ ...res.result ]
          console.log(this.symptons);
        })
    },

    registerCause() {
      if (this.isEditing) return this.updateCause();
      this.$http.post('causa', getLocalStorageToken(), this.inputValuesCause)
        .then(res => {
          if (res.status !== 200) return this.$swal({
            type: 'error',
            title: `Ops! ${res.err}`,
            confirmButtonColor: '#F34336',
          })
          this.$swal({
            type: 'success',
            title: res.result,
            confirmButtonColor: '#F34336',
          }).then(() => {
            this.causes.push(this.inputValuesCause);
            console.log(this.causes);
            this.resetModel();
            this.getCause();
          })
        })
    },

    registerSymptom() {
      if (this.isEditing) return this.updateSymptom();
      this.$http.post('sintoma', getLocalStorageToken(), this.inputValuesSymptom)
        .then(res => {
          if (res.status !== 200) return this.$swal({
            type: 'error',
            title: `Ops! ${res.err}`,
            confirmButtonColor: '#F34336',
          })
          this.$swal({
            type: 'success',
            title: res.result,
            confirmButtonColor: '#F34336',
          }).then(() => {
            this.symptons.push(this.inputValuesSymptom);
            console.log(this.symptons);
            this.resetModel();
            this.getSymptom();
          })
        })
    },

    deleteCause(cause, index) {
      console.log(cause);
      this.$swal({
        type: 'question',
        title: `Deseja mesmo remover o tipo ${cause.descricaoCausa}?`,
        showCancelButton: true,
        confirmButtonColor: '#F34336',
        preConfirm: () => {
          this.$http.delete('causa', getLocalStorageToken(), cause.idCausa)
            .then(res => {
              console.log(res);
              if (res.status !== 200) return this.$swal({
                type: 'warning',
                title: res.err,
                confirmButtonColor: '#F34336',
              })
              this.$swal({
                type: 'success',
                title: res.result,
                confirmButtonColor: '#F34336',
              }).then(() => {
                this.causes.splice(index, 1)
                console.log(this.causes);
              });
            });
        },
      });
    },

    deleteSymptom(symptom, index) {
      console.log(symptom);
      this.$swal({
        type: 'question',
        title: `Deseja mesmo remover o tipo ${symptom.descricaoSintomas}?`,
        showCancelButton: true,
        confirmButtonColor: '#F34336',
        preConfirm: () => {
          this.$http.delete('sintoma', getLocalStorageToken(), symptom.idSintomas)
            .then(res => {
              console.log(res);
              if (res.status !== 200) return this.$swal({
                type: 'warning',
                title: res.err,
                confirmButtonColor: '#F34336',
              })
              this.$swal({
                type: 'success',
                title: res.result,
                confirmButtonColor: '#F34336',
              }).then(() => {
                this.symptons.splice(index, 1)
                console.log(this.symptons);
              });
            });
        },
      });
    },

    updateCause() {
      this.$http.update('causa', getLocalStorageToken(), this.inputValuesCause, this.inputValuesCause.idCausa)
        .then(res => {
          if (res.status !== 200) return this.$swal({
            type: 'error',
            title: 'Ops! Ocorreu um erro com a solicitação.',
            text: res.err,
            confirmButtonColor: '#F34336',
          })
          this.$swal({
            type: 'success',
            title: res.result,
            confirmButtonColor: '#F34336',
          }).then(() => {
            const index = this.causes.indexOf(this.causes.find(i => i.idCausa === this.inputValuesCause.idCausa))
            this.causes.splice(index, 1, this.inputValuesCause)
            this.closeEditing()
          })
        })
    },

    updateSymptom() {
      this.$http.update('sintoma', getLocalStorageToken(), this.inputValuesSymptom, this.inputValuesSymptom.idSintomas)
        .then(res => {
          if (res.status !== 200) return this.$swal({
            type: 'error',
            title: 'Ops! Ocorreu um erro com a solicitação.',
            text: res.err,
            confirmButtonColor: '#F34336',
          })
          this.$swal({
            type: 'success',
            title: res.result,
            confirmButtonColor: '#F34336',
          }).then(() => {
            const index = this.symptons.indexOf(this.symptons.find(i => i.idSintomas === this.inputValuesSymptom.idSintomas))
            this.symptons.splice(index, 1, this.inputValuesSymptom)
            this.closeEditing()
          })
        })
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
