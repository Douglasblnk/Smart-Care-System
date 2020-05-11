<template>
  <div class="ordem-manutencao-wrapper-root">
    <!-- <span>hello world</span>
    <span @click="() => orderType = 'lista'">lista</span>
    <span @click="() => orderType = 'rota'">Rota</span>
    <span @click="() => orderType = 'corretiva'">Corretiva</span>
    <span @click="() => orderType = 'corretiva'">Preventiva</span> -->
    <div class="cardMenu">
      <div class="containerMenu">
        <label class="span_question">Escolha o tipo de ordem que deseja cadastrar:</label>
        <div class="maintanceMenu">
          <!-- <button v-for="item in listateste" :key="item.idtipoManutencao"> {{ item.tipoManutencao }}</button> -->
          <menu-button v-for="item in selectsTypeMaintenance.selects" :key="item.value" :label="item.label" @click.native="metodoTeste(item)"></menu-button>
        </div>
      </div>
    </div>
    <transition name="slide-fade" mode="out-in">
      <template v-if="maintanceState.view === 'Lista'">
        <ordem-lista />
      </template>

      <template v-if="maintanceState.view === 'Rota'">
        <ordem-rota />
      </template>

      <template v-if="maintanceState.view === 'Corretiva'">
        <ordem-corretiva />
      </template>
      <template v-if="maintanceState.view === 'Preventiva'">
        <ordem-preventiva />
      </template>
    </transition>
  </div>
</template>

<script>
// import OrdemManutencaoLista from './OrdemManutencaoLista.vue';
// import OrdemManutencaoRota from './OrdemManutencaoRota.vue';
// import OrdemManutencaoCorretiva from './OrdemManutencaoCorretiva.vue';
// import OrdemManutencaoPreventiva from './OrdemManutencaoPreventiva';
const OrdemManutencaoLista = () => import('./OrdemManutencaoLista.vue');
const OrdemManutencaoRota = () => import('./OrdemManutencaoRota.vue');
const OrdemManutencaoCorretiva = () => import('./OrdemManutencaoCorretiva.vue');
const OrdemManutencaoPreventiva = () => import('./OrdemManutencaoPreventiva');
import { getLocalStorageToken } from '../../../utils/utils';


export default {
	name: 'OrdemManutencaoWrapper',

	components: {
		'ordem-lista': OrdemManutencaoLista,
		'ordem-rota': OrdemManutencaoRota,
    'ordem-corretiva': OrdemManutencaoCorretiva,
    'ordem-preventiva': OrdemManutencaoPreventiva,
	},

	data() {
		return {
      orderType: '',
      maintanceState: {
        view:'',
      },
      selectsTypeMaintenance: {
        select: '',
        selects: [],
      },
		};
  },
  mounted() {
    this.getTypeMaintenance();
    this.$store.commit('addPageName', 'Cadastro de Ordem ');
  },

	methods: {
    getTypeMaintenance() {
      this.$http
        .get("tipo-manutencao/get", getLocalStorageToken())
        .then(res => {
          if (res.status !== 200)
            return this.$swal({
              type: "error",
              title: `Ops! ${res.err}`,
              confirmButtonColor: "#F34336"
            });
          console.log("-------");
          console.log(res.result);
          if (res.result.length === undefined) {
            this.listateste.push(res.result),
            this.selects.selects.map(select => {
              Object.entries(select).forEach(([key, value]) => {
                console.log(key, value);
              });
            });
          } // this.selects.selects.push(res.result)
          else {
            for (let index = 0; index < res.result.length; index++) {
              this.selectsTypeMaintenance.selects.push(res.result[index]);
              this.selectsTypeMaintenance.selects[index].value =
                res.result[index].idtipoManutencao;
              this.selectsTypeMaintenance.selects[index].label =
                res.result[index].tipoManutencao;
            }
            this.listateste.push(res.result)
          }
        });
    },
    metodoTeste(manutencao) {
      this.$set(this.maintanceState, 'view', manutencao.label);
      this.$store.commit('addPageName', `Cadastro de Ordem | ${this.maintanceState.view}`);
      // this.maintanceState = teste.label;
      console.log(manutencao);
      console.log(manutencao.label);
    },

	},
}
</script>

<style lang="scss" scoped>
.ordem-manutencao-wrapper-root {
  width: 100vw;
  height: 100%;
  display: grid;

  // .typeOrdensContainers {
  //   width:75%;
  //   background-color: #ffffff;
  //   border-radius: 10px;
  //   padding: 2px;
  //   margin-top:6%;
  // }
  .cardMenu {
   grid-template-columns: 1fr 2fr 1fr;
    width:100%;
    background-color: #ffffff;
    border-radius: 10px;
    padding: 25px;
    margin-top:6%;
    .containerMenu{
      display: grid;
      width:100%;
      .maintanceMenu {
        width: 90%;
        display: flex;
        justify-content: center;
        align-items: center;
        grid-template-columns: 1fr 2fr 1fr;
      }
      .span_question {
        grid-template-columns: 1fr 2fr 1fr;
        width: 90%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ff0303;
        font-family: 'Montserrat';
      }
    }
  }
}
@media (max-width: 1250px) {
  .ordem-manutencao-wrapper-root  {
    width: 100vw;
    height: 100vh;
    padding: 20px;
  }

}
</style>