<template>
  <div class="root-detalhamento-view">
    <div class="detail-content">
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
          <!-- <button @click="abrirModal">teste</button> -->
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
              <div class="options">
                <i class="fa fa-clipboard-check fa-lg mb-2" />
                <span>Assinatura</span>
              </div>
            </div>
          </div>
        </div>
        <el-dialog
          title="Convidar Técnico"
          :visible.sync="dialogVisible"
          width="40vw"
          :before-close="handleClose">
          <p class="Span_lerta" v-show="visibleMessage">Usuario Já Está na ordem. Consulte lista dos usuarios da ordem</p>
            <el-tabs type="border-card" >
              <el-tab-pane label="Convidar">
                <span slot="label">Convidar </span>
                  <el-table
                    :data="manutentores.filter(data => !search || data.nome.toLowerCase().includes(search.toLowerCase()))"
                    style="width: 100%" >
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
                      <template slot="header" slot-scope="scope">
                        <el-input
                          @click="valorPropriedade(scope)"
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
                          @onCancel="testeValidacao()">
                          <el-button
                          slot="reference"
                          size="mini">Add</el-button>
                        </el-popconfirm>
                      </template>
                    </el-table-column>
                  </el-table>
              </el-tab-pane>
              <el-tab-pane label="Listar" >
                <span slot="label">Listar </span>
                <el-table
                    :data="manutentorInOrdem"
                    style="width: 100%" >
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
                          @onCancel="testeValidacao()">
                          <el-button
                          slot="reference"
                          size="mini">Remove</el-button>
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
  </div>
</template>

<script>
import { getLocalStorageToken } from '../utils/utils';

export default {
  name: 'Detalhamento',
  
  props: {
    order: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      visible: false,
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
    testeValidacao() {
      this.visible = false;
      // console.log("cancelando");

    },
    getManutentor() {
      console.log('Entrando');
      this.$http.methodPostNotVerified('detalhamento/getgeraluser', getLocalStorageToken(), this.valuesInput)
      .then(res => {
        if(res.result.length === 0)  return this.$swal({
          type: 'warning',
          title: 'Não foi posivel encontrar manutentores',
          confirmButtonColor: '#F34336',
        });
        if(res.result.length === undefined)
          this.manutentores.push(res.result);
        else this.manutentores = [ ...res.result ];
        console.log(this.manutentores);
        });
        
    },
    // manutentorInOrdem
    getManutentoresInOrdem() {
  
      return this.$http.methodPostNotVerified('detalhamento', getLocalStorageToken(), this.valuesInput)
      .then( res => {
        console.log('hahahahahHAHAHAHAHAHAHAHAHAHAHAHAH');
        console.log(res);
        if(res.result.length === 0) return this.$swal({
          type:'warning',
          title: 'Nenhum manutentor encontrado',
          confirmButtonColor: '#F34336',
        });
        console.log('EnTRA A3');
        if(res.result.length === undefined)
         console.log('EnTRA A1'),
          this.manutentorInOrdem.push(res.result);
          else this.manutentorInOrdem = [ ...res.result ],
          console.log('eNTRA A2');
      });
    },
    valorPropriedade(scope) {
      console.log(scope);
    },
    validaAddManutentor(User) {
      const result = this.manutentorInOrdem.find(element => element.idUsuario === User.idUsuario);
      return result;
    },
    addManutentor(index, row){
      console.log('bla bla BLA BLA');
      // console.log(index);
      const validManutentorAdd = this.validaAddManutentor(row);
      if(validManutentorAdd === undefined){
      this.dialogVisible = false;
      this.visibleMessage = false;
      this.valuesInput.excluded = 0;
      // console.log(this.order.idOrdemServico);
      this.valuesInput.idUsuario = row.idUsuario;

            // console.log(this.valuesInput);
      this.$http.methodPost('detalhamento/register', getLocalStorageToken(), this.valuesInput)
      .then(res => {
        if(res.status !== 200) return this.$swal({
          type: 'error',
          title: `Ops! ${res.err}`,
          confirmButtonColor: '#F34336',
        });
        this.$swal({
          type: 'success',
          title:`${res.result}`,
          confirmButtonColor: '#F34336',
        }).then(() => {
          this.manutentores.splice(row.idUsuario, 1);
          this.getManutentoresInOrdem();
          this.$setActivity(
            'registerUser',
              {
                  ...this.$store.state.user,
                  date: this.$moment().format('DD-MM-YYYY HH-mm'),
                  descricao: `${this.$store.state.user.nome} registerUser o usuário para ajudar na ordem serviço`,
              },
            getLocalStorageToken(),
            );
          
        });

      });
     }else {
       this.visibleMessage = true;
     }
    },
    RemoveManutentor(index, row){
      console.log('entrou BuaHAHAHAHAHAHAHA');
      this.valuesInput.idUsuario = row.idUsuario;
      this.valuesInput.excluded = 1;
      this.dialogVisible = false;
      this.$http.methodUpdate('detalhamento', getLocalStorageToken(), this.valuesInput, this.valuesInput.idOrdemServico)
      .then(res => {
        if(res.status !== 200) return this.$swal({
          type: 'error',
          title:`Ops! ${res.err}`,
          confirmButtonColor: '#F34336',

        })
        this.$swal({
          type: 'success',
          title: `${res.result}`,
          confirmButtonColor: '#F34336',
        })
        .then(() => {
          // const index = this.manutentores.indexOf(this.manutentores.find(i => i.idUsuario = this.manutentorInOrdem.idUsuario));
          this.manutentores.splice(row.idUsuario, 1);
          this.getManutentoresInOrdem();
          this.$setActivity(
            'registerUser',
              {
                ...this.$store.state.user,
                date: this.$moment().format('DD-MM-YYYY HH-mm'),
                descricao: `${this.$store.state.user.nome} Removendo status excluded o usuário para ajudar na ordem serviço`,
              },
            getLocalStorageToken(),
            );
        });
      });
      // this.$setActivity(
      //   'editUser',
      //     {
      //         ...this.$store.state.user,
      //         date: this.$moment().format('DD-MM-YYYY HH-mm'),
      //         descricao: `${this.$store.state.user.nome} editou o usuário 
      //         ${this.userInputValues.numeroCracha} - ${this.userInputValues.nome}`,
      //     },
      //   getLocalStorageToken(),
      //   );

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