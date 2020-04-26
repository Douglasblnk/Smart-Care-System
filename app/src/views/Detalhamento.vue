<template>
  <div class="root-detalhamento-view">
    <transition name="slide-side" mode="out-in">
    <div class="detail-content" v-if="state.view === 'detail'">
      <div class="my-3">
        <simple-button
          :no-margin="true"
          label="Voltar"
          prefix="fa-arrow-left"
          @click.native="() => $emit('state-list')"
        />
      </div>
      <div class="detail-container bg-white p-3 d-flex">
        <div class="col-md-7">
          <div class="order-title">
            <span>Resumo: {{ order.resumo }}</span>
          </div>
          <div class="my-3">
            <span>Descrição: {{ order.descricao }}</span>
          </div>
          <div class="my-3">
            <div class="my-3 d-flex align-items-center">
              <i class="fa fa-map-marker-alt mr-2" />
              <span>Setor: {{ order.setor }}</span>
            </div>
            <div class="my-3 d-flex align-items-center">
              <i class="fa fa-ban mr-2" />
              <span>Requer parada: {{ order.requerParada === 1 ? 'Sim' : 'Não' }}</span>
            </div>
            <div class="my-3 d-flex align-items-center">
              <i class="fa fa-exclamation-triangle mr-2" :class="getPriorityClass()" />
              <span>Prioridade: {{ order.prioridade }}</span>
            </div>
            <div class="my-3 d-flex align-items-center">
              <i class="fa fa-laptop mr-2" />
              <span>Equipamento: {{ order.equipamento }}</span>
            </div>
            <div class="my-3 d-flex align-items-center">
              <i class="fa fa-tools mr-2" />
              <span>Tipo de Manutenção: {{ order.tipo_manutencao }}</span>
            </div>
            <div class="my-3 d-flex align-items-center">
              <i class="fa fa-calendar-alt mr-2" />
              <div class="d-flex flex-column">
                <span>
                  Inicio planejado:
                  {{ this.$moment(order.inicioPlanejado).format('DD-MM-YYYY') }}
                </span>
                <span>
                  Fim planejado:
                  {{ this.$moment(order.fimPlanejado).format('DD-MM-YYYY') }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-5">
          <div class="col-md-12 text-center">
            <span style="font-size: 20px">Ações</span>
          </div>
          <div class="d-flex justify-content-center">
            <div class="options-wrapper">
              <div class="options">
                <i class="fa fa-play fa-lg mb-2" />
                <span>Iniciar</span>
              </div>

              <div class="options">
                <i class="fa fa-hand-point-right fa-lg mb-2" />
                <span>Delegar</span>
              </div>

              <div class="options" @click="dialogVisible = true">
                <i class="fa fa-users fa-lg mb-2" />
                <span>Convidar técnico</span>
              </div>

              <div class="options">
                <i class="fa fa-file-signature fa-lg mb-2" />
                <span>Assinatura</span>
              </div>

              <div class="options">
                <i class="fa fa-check-double fa-lg mb-2" />
                <span>Checklist</span>
              </div>
              <div class="options" @click="openOrder(order)">
                  <i class="fa fa-clipboard-check fa-lg mb-2" />
                  <span>Verificação</span>
                </div>
            </div>
          </div>
        </div>
        <el-dialog
          title="Convidar Técnico"
          :visible.sync="dialogVisible"
          width="40vw"
        >
          <p class="Span_lerta"
          v-show="visibleMessage">Usuario Já Está na ordem. Consulte lista dos usuarios da ordem</p>
            <el-tabs type="border-card" >
              <el-tab-pane label="Convidar">
                <span slot="label">Convidar </span>
                  <el-table
                    :data="manutentores.filter(
                      data => !search || data.nome.toLowerCase()
                        .includes(search.toLowerCase())
                      )"
                    style="width: 100%"
                  >
                    <el-table-column
                      label="Name"
                      prop="nome">
                    </el-table-column>

                    <el-table-column
                      label="Area"
                      prop="funcao">
                    </el-table-column>

                    <el-table-column
                      align="right"
                    >
                      <template slot="header" slot-scope="scope">
                        <el-input
                          v-model="search"
                          size="mini"
                          placeholder="Pesquise nome"/>
                      </template>
                      <template slot-scope="scope">
                        <el-popconfirm
                          confirmButtonText='Confirmar'
                          cancelButtonText='Cancelar'
                          icon="el-icon-info"
                          iconColor="red"
                          title="Você tem certeza?"
                          @onConfirm="addManutentor(scope.$index, scope.row)"
                        >
                          <el-button
                            slot="reference"
                            size="mini"
                          >
                            Adicionar
                          </el-button>
                        </el-popconfirm>
                      </template>
                    </el-table-column>
                  </el-table>
              </el-tab-pane>
              <el-tab-pane label="Listar" >
                <span slot="label">Listar </span>
                <el-table
                  :data="manutentorInOrdem"
                  style="width: 100%"
                >
                  <el-table-column
                    label="Name"
                    prop="nome">
                  </el-table-column>
                  <el-table-column
                    label="Area"
                    prop="funcao">
                  </el-table-column>
                  <el-table-column
                    align="right">
                    <template slot-scope="scope">
                      <el-popconfirm
                        confirmButtonText='Confirmar'
                        cancelButtonText='Cancelar'
                        icon="el-icon-info"
                        iconColor="red"
                        title="Você tem certeza?"
                        @onConfirm="RemoveManutentor(scope.$index, scope.row)"
                      >
                        <el-button
                          slot="reference"
                          size="mini"
                        >
                          Remove
                        </el-button>
                      </el-popconfirm>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          
          <span slot="footer" class="dialog-footer">
            <!-- <el-button @click="dialogVisible = false">Cancel</el-button> -->
            <el-button type="primary" class="Button_close" @click="dialogVisible = false">Fechar</el-button>
          </span>
        </el-dialog>
      </div>
      </div>
      <div v-if="state.view === 'Verification'" key="Verification">
        <Verificacao
          :order="order"
          @state-list="closeDetail"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import Verificacao from './Verificacao.vue';
import { getLocalStorageToken, getErrors} from '../utils/utils';

export default {
  name: 'Detalhamento',
  
  components: {
    Verificacao,
  },

  props: {
    order: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      state: {
        view: 'detail',
      },
      visibleMessage:false,
        valuesInput: {
          idOrdemServico:this.order.idOrdemServico,
          idUsuario:'',
          excluded: '',
        },
        opcao: '',
        manutentores: [],
        manutentorInOrdem: [],
        dialogVisible: false,
        search: '',
      
    };
  },
  mounted() {
    this.getManutentor();
    this.getManutentoresInOrdem();
  },

  methods: {
    getPriorityClass() {
      if (this.order.Prioridade_idPrioridade === 1) return 'low-priority';
      if (this.order.Prioridade_idPrioridade === 2) return 'medium-priority';
      if (this.order.Prioridade_idPrioridade === 3) return 'high-priority';
      if (this.order.Prioridade_idPrioridade === 4) return 'very-high-priority';
    },

    openOrder(order) {
      console.log(this.state.view)
      console.log("Super Teste")
      this.$set(this.state, 'view', 'Verification');
      console.log(this.state.view)
      //this.$set(this.detail, 'order', order);
    },
    closeDetail() {
      this.$set(this.state, 'view', 'detail');
    },
    async getManutentor() {
      try {
        const response = await this.$http.post('detalhamento/get-geral-user', getLocalStorageToken(), this.valuesInput);

        if(response.result.length === undefined)
          this.manutentores.push(response.result);
        else this.manutentores = [ ...response.result ];
      } catch (err) {
        this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    // manutentorInOrdem
    async getManutentoresInOrdem() {
      try {
        const response = await this.$http.post('detalhamento', getLocalStorageToken(), this.valuesInput);
        if(response.result.length === undefined)
          this.manutentorInOrdem.push(response.result);
        else this.manutentorInOrdem = [ ...response.result ];
      } catch (err) {
        return this.$swal({
          type:'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    validaAddManutentor(User) {
      const result = this.manutentorInOrdem.find(element => element.idUsuario === User.idUsuario);
      return result;
    },
    async addManutentor(index, row){
      try {
        const validManutentorAdd = this.validaAddManutentor(row);

        if(validManutentorAdd === undefined){
          this.dialogVisible = false;
          this.visibleMessage = false;
          this.valuesInput.excluded = 0;
          this.valuesInput.idUsuario = row.idUsuario;

          const response = await this.$http.post('detalhamento/register', getLocalStorageToken(), this.valuesInput);

          this.$swal({
            type: 'success',
            title:`${response.result}`,
            confirmButtonColor: '#F34336',
          }),

          this.getManutentoresInOrdem();

          this.$http.setActivity(
            'registerUser',
              {
                ...this.$store.state.user,
                date: this.$moment().format('DD-MM-YYYY HH-mm'),
                descricao: `${this.$store.state.user.nome} 
                registerUser o usuário ${row.nome} para ajudar na ordem serviço`,
              },
            getLocalStorageToken(),
          );
        }else {
          this.visibleMessage = true;
        }
      } catch (err) {
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async RemoveManutentor(index, row){
      try {
        this.valuesInput.idUsuario = row.idUsuario;
        this.valuesInput.excluded = 1;
        this.dialogVisible = false;
        const response = await this.$http.update('detalhamento', getLocalStorageToken(), this.valuesInput, this.valuesInput.idOrdemServico);
        this.$swal({
          type: 'success',
          title: `${response.result}`,
          confirmButtonColor: '#F34336',
        }),
        this.manutentorInOrdem = [],
        this.getManutentoresInOrdem(),
        this.$http.setActivity(
          'editUser',
            {
              ...this.$store.state.user,
              date: this.$moment().format('DD-MM-YYYY HH-mm'),
              descricao: `${this.$store.state.user.nome} 
              desabilitando o status excluded o usuário para ajudar na ordem serviço`,
            },
          getLocalStorageToken(),
          );
      } catch (err) {
        this.$swal({
          type: 'error',
          title:getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
      },
  },
};
</script>

<style lang="scss" scoped>
.root-detalhamento-view {
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  .detail-content {
    width: 60vw;
    .detail-container {
      border-radius: 10px;
      .order-title {
        span {
          font-size: 20px;
          color: var(--duas-rodas)
        }
      }
      i {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        color: var(--duas-rodas-soft)
      }
      .low-priority {
        color: #53c46d !important;
      }
      .medium-priority {
        color: #FFCC00 !important;
      }
      .high-priority {
        color: var(--duas-rodas-soft) !important;
      }
      .very-high-priority {
        color: var(--duas-rodas) !important;
      }
      .options-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        max-width: 290px;
        .options {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 10px 10px;
          width: 120px;
          height: 100px;
          padding: 20px;
          background-color: #eee;
          border-radius: 7px;
          transition: .1s;
          user-select: none;
          &:hover {
            background-color: #e2e2e2;
            transform: scale(1.1);
          }
          &:active {
            transform: scale(1);
          }
          span {
            text-align: center;
          }
        }
      }
    }
  }
  .Button_close{
    color:#030303;
  }
  @media screen and (max-width: 1366px) {
    .detail-content {
      width: 90vw;
    }
  }
}
.Span_lerta {
  color: #ff0303;
  font-family: 'Montserrat';
}
</style>