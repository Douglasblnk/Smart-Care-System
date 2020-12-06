<template>
  <div v-if="verifications.length">
    <div v-if="!isMobile">
      <pending-verifications-web
        :verifications="verifications"
        :table-config="tableConfig"
      />
    </div>
    <div v-if="isMobile">
      <pending-verifications-mobile
        :verifications="verifications"
        :table-config="tableConfig"
      />
    </div>
  </div>
</template>

<script>
import { getErrors, isObjectEmpty } from '../../utils/utils';
import { mapGetters } from 'vuex';

export default {
  components: {
    pendingVerificationsWeb: () => import('./components/pending-verifications-web/PendingVerificationsWeb.vue'),
    pendingVerificationsMobile: () => import('./components/pending-verifications-mobile/PendingVerificationsMobile.vue'),
  },
  data() {
    return {
      state: {
        view: 'verifications',
      },
      verifications: [],
      tableConfig: {
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
  },

  methods: {
    async listVerificationsType() {
      setTimeout(() => {
        const user = this.$store.state.user;

        if (isObjectEmpty(user))
          return this.listVerificationsType();

        this.$http.setActivity(this.$activities.VERIFICATION_CONSULT_OPEN);

        if (user.nivelAcesso === 2)
          return this.listVerificationsMaintainer(user.nivelAcesso);

        if (user.nivelAcesso === 1)
          return this.listVerificationsReport(user.nivelAcesso);

        return this.listVerificationsRequester(user.nivelAcesso);
      }, 20);
    },
    async listVerificationsMaintainer(user) {
      try {
        const orders = await this.$http.microserviceAnalisis('analysis/verifications-orders', {
          headers: { user },
        });
        if (orders.length !== undefined)
          this.verifications = [...orders];
        else this.verifications.push(orders);

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
    async listVerificationsReport(user) {
      try {
        const orders = await this.$http.microserviceAnalisis('analysis/verifications-orders-report', {
          headers: { user },
        });
        if (orders.length !== undefined)
          this.verifications = [...orders];
        else this.verifications.push(orders);
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
    async listVerificationsRequester(user) {
      try {
        const orders = await this.$http.microserviceAnalisis('analysis/verifications-orders-requester', {
          headers: { user },
        });
        if (orders.length !== undefined)
          this.verifications = [...orders];
        else this.verifications.push(orders);
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
