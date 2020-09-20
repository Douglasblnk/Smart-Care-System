<template>
  <div v-if="dataVerification.verifications_list.length">
    <div v-if="!isMobile">
      <pending-verifications-web
        :verifications-data="dataVerification"
      />
    </div>
    <div v-if="isMobile">
      <pending-verifications-mobile
        :verifications-data="dataVerification"
      />
    </div>
  </div>
</template>

<script>
import { getErrors, isObjectEmpty } from '../../utils/utils';
import { mapGetters } from 'vuex';

export default {
  components: {
    pendingVerificationsWeb: () => import('../Core/components/pending-verifications-web/PendingVerificationsWeb.vue'),
    pendingVerificationsMobile: () => import('../Core/components/pending-verifications-mobile/PendingVerificationsMobile.vue'),
  },
  data() {
    return {
      state: {
        view: 'verifications',
      },
      dataVerification: {
        columns: ['ordemServico_idOrdemServico', 'Solicitante', 'Reporte', 'Manutentor', 'actions'],
        columnsMobile: ['ordemServico_idOrdemServico'],
        options: {
          headings: {
            ordemServico_idOrdemServico: create => create('span', {
              domProps: { innerHTML: 'Ordem <i class="fas fa-sort"></i>' },
            }),
            Solicitante: 'Solicitante',
            Reporte: 'Reporte',
            Manutentor: 'Manutentor',
            actions: 'Ações',
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
          perPageValues: [],
          sortable: ['ordemServico_idOrdemServico'],
        },
        verifications_list: [],
      },
    };
  },

  computed: {
    ...mapGetters({
      isMobile: 'getIsMobile',
    }),
  },

  mounted() {
    this.$store.commit('addPageName', 'Verificações');
    
    this.listVerificationsType();
    //this.setActivity();
  },

  methods: {
    // setActivity() {
    //   this.$http.setActivity(this.$activities.VERIFICATION_CONSULT_OPEN);
    // },
    async listVerificationsType() {
      setTimeout(() => {
        const user = this.$store.state.user;
        if (isObjectEmpty(user))
          return this.listVerificationsType();
      }, 20);
      //console.log('user: ', user);
      if (user.nivelAcesso === 2)
        this.listVerificationsMaintainer();
      else if (user.nivelAcesso === 1)
        this.listVerificationsReport();
    },
    async listVerificationsMaintainer() {
      try {
        //const { result } = await this.$http.get('verificacao/list-verification', getToken());
        const orders = await this.$http.microserviceAnalisis('analysis/verifications-orders');
        if (orders.length !== undefined)
          this.dataVerification.verifications_list = [...orders];
        else this.verifications_list.push(orders);

        this.mobileOptions();
      } catch (err) {
        console.log('err :>> ', err.response || err);
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async listVerificationsReport() {
      try {
        const orders = await this.$http.microserviceAnalisis('analysis/verifications-orders-report');
        if (orders.length !== undefined)
          this.dataVerification.verifications_list = [...orders];
        else this.verifications_list.push(orders);
        this.mobileOptions();
      } catch (err) {
        console.log('err :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    mobileOptions() {
      if (this.isMobile) {
        this.dataVerification.options.headings = {
          ordemServico_idOrdemServico: create => create('span', {
            domProps: { innerHTML: 'Ordem <i class="fas fa-sort"></i>' },
          }),
        };
      }
    },
  },
};
</script>

<style lang="scss">
</style>
