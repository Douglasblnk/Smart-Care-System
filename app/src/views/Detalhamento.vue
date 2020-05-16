<template>
  <div class="root-detalhamento-view">
    <transition name="slide-side" mode="out-in">
      <div class="detail-content" v-if="state.view === 'detail'">
        <div class="d-flex">
          <div>
            <simple-button
              :no-margin="true"
              label="Voltar"
              prefix="fa-arrow-left"
              @click.native="() => $emit('state-list')"
            />
          </div>
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
                <i class="fa mr-2" :class="getStatusIcon(order)" />
                <span>Status: {{ order.status }}</span>
              </div>
              <div
                v-if="isOrderAssumed"
                class="my-3 d-flex align-items-center"
              >
                <i class="fa fa-user mr-2" />
                <span>Manutentor: {{ getOrderManutentor }}</span>
              </div>
              <div class="my-3 d-flex align-items-center">
                <i class="fa fa-map-marker-alt mr-2" />
                <span>Setor: {{ order.local }}</span>
              </div>
              <div class="my-3 d-flex align-items-center">
                <i class="fa fa-ban mr-2" />
                <span>Requer parada: {{ order.requerParada === 1 ? 'Sim' : 'Não' }}</span>
              </div>
              <div class="my-3 d-flex align-items-center">
                <i class="fa fa-exclamation-triangle mr-2" :class="getPriorityClass()" />
                <span :class="getPriorityClass()">Prioridade: {{ order.prioridade }}</span>
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
                 <!-- // ? CARD PARA QUANDO A ORDEM ESTIVER COM STATUS ABERTA -->
                <div
                  v-if="verifyOrderStatus === 'open'"
                  class="options"
                  @click="orderMovimentations('assume')"
                >
                  <i class="fa fa-hard-hat fa-lg mb-2" />

                  <i v-if="isLoading.assume" class="fa fa-spinner fa-spin fa-lg m-2" />
                  <span v-else>Assumir</span>
                </div>

                <!-- // ? CARD PARA QUANDO A ORDEM FOR ASSUMIDA POR ALGUÉM -->
                <div
                  v-if="verifyOrderStatus === 'assumed'"
                  class="options"
                  :class="verifyUserAccess ? '' : 'disable'"
                  @click="orderMovimentations('assume')"
                >
                  <i class="fa fa-play fa-lg mb-2" />

                  <i v-if="isLoading.init" class="fa fa-spinner fa-spin fa-lg m-2" />
                  <span v-else>Iniciar</span>
                </div>

                <div
                  class="options"
                  :class="verifyUserAccess ? '' : 'disable'"
                >
                  <i class="fa fa-hand-point-right fa-lg mb-2" />
                  <span>Delegar</span>
                </div>

                <div
                  class="options"
                  :class="verifyUserAccess ? '' : 'disable'"
                  @click="openIntiveTechnician()"
                >
                  <i class="fa fa-users fa-lg mb-2" />
                  <i v-if="isLoading.convidar" class="fa fa-spinner fa-spin fa-lg m-3" />
                  <span v-else>Convidar técnico</span>
                </div>

                <div
                  class="options"
                  :class="verifyUserAccess ? '' : 'disable'"
                >
                  <i class="fa fa-file-signature fa-lg mb-2" />
                  <span>Assinatura</span>
                </div>

                <div
                  class="options"
                  :class="verifyUserAccess ? '' : 'disable'"
                >
                  <i class="fa fa-check-double fa-lg mb-2" />
                  <span>Checklist</span>
                </div>
                <div
                  class="options"
                  :class="verifyUserAccess ? '' : 'disable'"
                  @click="openOrderVerification()"
                >
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
            <p class="Span_lerta" v-show="visibleMessage">
              Usuario Já Está na ordem. Consulte lista dos usuarios da ordem
            </p>
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
                    prop="nome"
                  >
                  </el-table-column>

                  <el-table-column
                    label="Area"
                    prop="funcao"
                  >
                  </el-table-column>

                  <el-table-column
                    align="right"
                  >
                    <template slot="header" slot-scope="scope">
                      <el-input
                        v-model="search"
                        size="mini"
                        placeholder="Pesquise nome"
                      />
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
                    prop="nome"
                  >
                  </el-table-column>

                  <el-table-column
                    label="Area"
                    prop="funcao"
                  >
                  </el-table-column>

                  <el-table-column
                    align="right"
                  >
                    <template slot-scope="scope">
                      <el-popconfirm
                        confirmButtonText='Confirmar'
                        cancelButtonText='Cancelar'
                        icon="el-icon-info"
                        iconColor="red"
                        title="Você tem certeza?"
                        @onConfirm="removeManutentor(scope.$index, scope.row)"
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
              // ! TODO remove inline logic, reset modal properties
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
  import { getErrors, getLocalStorageToken } from '../utils/utils';

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
      visibleMessage: false,
      valuesInput: {
        idOrdemServico: this.order.idOrdemServico,
        idUsuario: '',
        excluded: '',
      },
      opcao: '',
      manutentores: [],
      manutentorInOrdem: [],
      dialogVisible: false,
      search: '',
      isLoading: {},
      priorityClass: {
        'Baixa': 'low-priority',
        'Media': 'medium-priority',
        'Alta': 'high-priority',
        'Muito Alta': 'very-high-priority',
      },
    };
  },

  computed: {
    verifyUserAccess() {
      const orderManutentor = this.manutentorInOrdem.find(i => i.is_master);
      const currentUser = this.$store.state.user;

      if (orderManutentor !== undefined && orderManutentor.numeroCracha === currentUser.cracha)
        return true;
      return false;
    },
    verifyOrderStatus() {
      return this.translateStatus(this.order.status);
    },
    getOrderManutentor() {
      const user = this.manutentorInOrdem.find(i => i.is_master);
      
      return user.nome;
    },
    isOrderAssumed() {
      return this.manutentorInOrdem.some(i => i.is_master);
    },
  },
  
  mounted() {
    console.log(this.order);
    console.log(this.manutentorInOrdem);
    this.setActivity();
    this.getManutentoresInOrdem();
  },


  methods: {
    setActivity() {
      this.$http.setActivity(
        'orderDetail',
        {
          ...this.$store.state.user,
          date: this.$moment().format('DD-MM-YYYY HH-mm'),
          descricao: JSON.stringify({ order: this.order.idOrdemServico })
        },
        getLocalStorageToken()
      );
    },
    getPriorityClass() {
      return this.priorityClass[this.order.prioridade];
    },
    translateStatus(status) {
      if (status === 'Aberto') return 'open';
      if (status === 'Assumida') return 'assumed';
      if (status === 'Em Andamento') return 'running';
      if (status === 'Encerrada') return 'closed';
      if (status === 'Pausada') return 'paused';
    },
    getStatusIcon(order) {
      if (order.status === 'Aberto') return 'fa-clock';
      if (order.status === 'Assumida') return 'fa-user-check';
      if (order.status === 'Em Andamento') return 'fa-tasks';
      if (order.status === 'Encerrada') return 'fa-check-circle';
      if (order.status === 'Pausada') return 'fa-pause-circle';
    },
    openOrderVerification() {
      if (!this.verifyUserAccess) return;

      this.$set(this.state, 'view', 'Verification');
    },
    closeDetail() {
      this.$set(this.state, 'view', 'detail');
    },
    async openIntiveTechnician() {
      if (!this.verifyUserAccess) return;

      try {
        if (this.isLoading.convidar) return;

        this.$set(this.isLoading, 'convidar', true);
        await this.getManutentor();

        this.dialogVisible = true;
      } catch (err) {
        console.log('err openIntiveTechnician :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.$set(this.isLoading, 'convidar', false);
      }
    },
    // busca todos os manutentores do sistema
    async getManutentor() {
      try {
        const response = await this.$http.post('detalhamento/get-geral-user', getLocalStorageToken(), this.valuesInput);

        if (response.result.length === undefined)
          this.manutentores.push(response.result);
        else this.manutentores = [...response.result];
      } catch (err) {
        throw err;
      }
    },
    // Busca os manutentores na ordem
    async getManutentoresInOrdem() {
      try {
        const response = await this.$http.post('detalhamento', getLocalStorageToken(), this.valuesInput);

        if (response.result.length === undefined)
          this.manutentorInOrdem.push(response.result);
        else this.manutentorInOrdem = [...response.result];
      } catch (err) {
        throw err;
      }
    },
    validaAddManutentor(User) {
      return this.manutentorInOrdem.find(element => element.idUsuario === User.idUsuario);
    },
    async addManutentor(index, row) {
      try {
        const validManutentorAdd = this.validaAddManutentor(row);

        if (validManutentorAdd === undefined) {
          this.dialogVisible = false;
          this.visibleMessage = false;
          this.valuesInput.excluded = 0;
          this.valuesInput.idUsuario = row.idUsuario;

          const response = await this.$http.post('detalhamento/register', getLocalStorageToken(), this.valuesInput);

          this.$swal({
            type: 'success',
            title: response.result,
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
        } else {
          this.visibleMessage = true;
        }
      } catch (err) {
        console.log('err addManutentor :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async removeManutentor(index, row) {
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
        console.log('err removeManutentor :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#f34336',
        });
      }
    },
    orderMovimentations(type) {
      switch (type) {
        case 'assume':
          this.assumeOrder();
          break;
        case 'init':
          this.initiateOrder();
          break;
      }
    },
    async assumeOrder() {
      // if (this.isOrderAssumed) return;

      try {
        if (this.isLoading.assume) return;
        this.$set(this.isLoading, 'assume', true);

        const response = await this.$http.post('initiate/assume', getLocalStorageToken(), {
          ...this.$store.state.user,
          order: this.order.idOrdemServico,
        });

      } catch (err) {
        console.log('err assumeOrder :>> ', err.response || err);

        this.$set(this.isLoading, 'assume', false);

        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#f34336',
        });
      }
    },
    async initiateOrder() {
      try {
        if (this.isLoading.init) return;
        this.$set(this.isLoading, 'init', true);

        const manutentor = await this.validateActualManutentor();

        if (manutentor !== undefined) {
          this.$set(this.isLoading, 'init', false);

          return this.$swal({
            type: 'warning',
            title: 'Parece que você já iniciou essa ordem!',
          });
        }

        const response = await this.$http.post('initiate', getLocalStorageToken(), { ...this.$store.state.user, isMaster: true, order: this.order.idOrdemServico });

        this.$set(this.isLoading, 'init', false);
      } catch (err) {
        console.log('initiateOrder :>> ', err);
        this.$set(this.isLoading, 'init', false);

        this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async validateActualManutentor() {
      try {
        await this.getManutentoresInOrdem();

        const user = this.$store.state.user;

        return this.manutentorInOrdem.find(i => i.numeroCracha === user.cracha);
      } catch (err) {
        throw err;
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
        .disable {
          opacity: 0.7;
          cursor: not-allowed;
          &:hover {
            background-color: #eee !important;
            transform: scale(1) !important;
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
