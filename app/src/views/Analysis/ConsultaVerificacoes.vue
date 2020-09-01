<template>
  <div v-if="dataVerification.verifications_list.length">
    <div v-if="!isMobile">
      <pending-verifications-web
        :verificationsData="dataVerification"
      />
    </div>
    <div v-if="isMobile">
      <pending-verifications-mobile
        :verificationsData="dataVerification"
      />
    </div>
  </div>
</template>

<script>
import { getErrors, getLocalStorageToken } from '../../utils/utils';
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
          perPageValues: [10, 25, 50],
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
    this.listVerifications();
    this.setActivity();
    this.$store.commit('addPageName', 'Verificações');
  },

  methods: {
    setActivity() {
      this.$http.setActivity(this.$activities.VERIFICATION_CONSULT_OPEN);
    },
    async listVerifications() {
      try {
        const { result } = await this.$http.get('verificacao/list-verification', getToken());
        if (result.length !== undefined)
          this.dataVerification.verifications_list = [...result];
        else this.verifications_list.push(result);
        this.mobileOptions();
        console.log('dataVerification: ', this.dataVerification);
      } catch (err) {
        console.log('err :>> ', err.response || err);
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
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
