<template>
  <div class="content-verifications">
    <div class="card-title d-flex justify-content-center align-items-center">
      <span>Análise de Verificações</span>
    </div>
    <div class="table-verifications">
      <v-client-table v-model="tableData" :columns="columns" :options="options">
        <span slot="Solicitante" slot-scope="{row}">
          <i :class="row.icon_requester"></i>
        </span>
        <span slot="Reporte" slot-scope="{row}">
          <i :class="row.icon_report"></i>
        </span>
        <span slot="Manutentor" slot-scope="{row}">
          <i :class="row.icon_maintainer"></i>
        </span>
        
        <div slot="actions" slot-scope="props">
          <a target="_blank" :href="props.row.link" class="fas fa-eye fa-lg mb-2 eye"></a>
          <i class="fas fa-edit fa-lg mb-2" @click="openModalDetailVerifications(props.row)"></i>
        </div>
      </v-client-table>
    </div>
    
    <b-modal ref="my-modal" centered
             hide-footer hide-header title="Verificação de EPIs" @hide="resetModal()"
    >
      <div class="d-block text">
        <div class="text-center">
          <h3>Detalhes</h3>
        </div>
        <h4>
          Solicitante:
        </h4>
        <div class="my-3 d-flex flex-column">
          <span>
            Data Verificação:
            {{ this.$moment().format('DD-MM-YYYY') }}
          </span>
          <span>
            Problema Resolvido: Sim
          </span>
          <div class="pt-2">
            <h4>
              Administrador:
            </h4>
          </div>
          <div class="my-3 d-flex flex-column">
            <span>
              Data Verificação:
              {{ this.$moment().format('DD-MM-YYYY') }}
            </span>
            <span>
              Problema Resolvido: Sim
            </span>
          </div>
          <div class="pt-2">
            <h4>
              Manutentor:
            </h4>
          </div>
          <div class="my-3 d-flex flex-column">
            <span>
              Data Verificação:
              {{ this.$moment().format('DD-MM-YYYY') }}
            </span>
            <span>
              Problema Resolvido: Sim
            </span>
          </div>
        </div>
        <div v-if="modalHasError">
          <div class="d-flex justify-content-center w-100 p-2 rounded"
               style="background-color: #ff4a4a5c; border: 1px solid #ff4a4aa6"
          >
            <span style="color: black">{{ modalErrorMessage }}</span>
          </div>
        </div>
        <div class="d-flex justify-content-center">
          <cancel-button label="Fechar" @click.native="closeModal()" />
          <save-button label="Enviar" @click.native="alterEpiCheck()" />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import { getErrors, getLocalStorageToken } from '../utils/utils';

  export default {
    data() {
      return {
          columns: ['Ordem', 'Solicitante', 'Reporte', 'Manutentor','actions'],
          tableData: [
              { Ordem: 1, Solicitante: 'Pedro', Reporte: 'Fernando Marques',
                Manutentor: 'Marcos', link: 'https://www.google.com.br/',
                icon_requester: 'fas fa-check', icon_report: 'fas fa-check',
                icon_maintainer: 'fas fa-times',
              },
              { Ordem: 2, Solicitante: 'Joana', Reporte: 'Fernando Marques',
                Manutentor: 'Marcos', link: 'https://www.google.com.br/',
                icon_requester: 'fas fa-times', icon_report: 'fas fa-check',
                icon_maintainer: 'fas fa-check',
              },
              { Ordem: 3, Solicitante: 'Bruno', Reporte: 'Fernando Marques',
                Manutentor: 'Marcos', link: 'https://www.google.com.br/',
                icon_requester: 'fas fa-check', icon_report: 'fas fa-times',
                icon_maintainer: 'fas fa-times',
              },
              { Ordem: 4, Solicitante: 'Joice', Reporte: 'Fernando Marques',
                Manutentor: 'Marcos', link: 'https://www.google.com.br/',
                icon_requester: 'fas fa-times', icon_report: 'fas fa-check',
                icon_maintainer: 'fas fa-check',
              },
              { Ordem: 5, Solicitante: 'Johnatan', Reporte: 'Fernando Marques',
                Manutentor: 'Marcos', link: 'https://www.google.com.br/',
                icon_requester: 'fas fa-check', icon_report: 'fas fa-times',
                icon_maintainer: 'fas fa-times',
              },
          ],
          verifications_list: [],
          options: {
              headings: {
                  Ordem: create => create('span', {
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
                  limit: 'Registros:',
                  page: 'Páginas:',
                  noResults: 'Nenhum registro encontrado',
                  loading: 'Carregando...',
              },
              sortable: ['Ordem'],
          },
          modalHasError: false,
      };
    },

    mounted() {
      this.listVerifications();
    },

    methods: {
      async listVerifications() {
        try {
          const result = await this.$http.get('verificacao/list-verification', getLocalStorageToken());
          console.log('RESULT', result);
          if (result.length !== undefined)
            this.verifications_list = [...result];
          else this.verifications_list = [result];
        } catch (err) {
          console.log('err :>> ', err.response || err);

          return this.$swal({
            type: 'warning',
            title: getErrors(err),
            confirmButtonColor: '#F34336',
          });
        }
      },
      openModalDetailVerifications(props) {
          console.log('Props: ', props);
          this.showVerificationModal();
      },
      getVerificationOption() {
        return [
              { text: 'Pedro', value: 1 },
              { text: 'Joana', value: 2 },
          ];
      },
      async showVerificationModal() {
        this.$refs['my-modal'].show();
      },
      resetModal() {
        this.modalHasError = false;
      },
    },
  };
</script>

<style lang="scss">
    .content-verifications {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        text-align: center;
        color: #2c3e50;
        .card-title{
          span {
            font-family: 'roboto';
            font-size: 23px;
            color: #E66E6D;
          }
        }
        .eye{
            padding-left: 20px;
            padding-right: 20px;
        }
        .fa-check {
          font-size: 20px;
          color: rgb(174, 214, 183)
        }
        .fa-times {
          font-size: 20px;
          color: var(--duas-rodas)
        }
    }
</style>
