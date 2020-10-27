<template>
  <section class="root-invite-maintainer-modal">
    <b-modal
      ref="inviteMaintainerModal"
      size="lg"
      hide-header
      hide-footer
      :hide-header-close="false"
      centered
      @hide="resetModal()"
    >
      <div class="text-center text-muted">
        <div
          class="position-absolute cursor-pointer"
          style="right:5px; top: 5px"
          @click="resetModal()"
        >
          <i class="fa fa-times fa-fw fa-lg scale" />
        </div>
        <h3 class="no-margin">Convidar Técnicos</h3>
        <span>Convite outros técnicos para participar da ordem</span>
      </div>

      <div class="mt-4">
        <b-tabs content-class="mt-3">
          <b-tab title="Técnicos disponíveis">
            <template v-slot:title>
              <i class="fa fa-list fa-fw mr-1 fa-sm" aria-hidden="true" style="color:#555" />
              <span>Técnicos disponíveis</span>
            </template>
            
            <div class="custom-invite-maintainer-table">
              <v-client-table
                ref="availableMaintainers"
                v-model="availableMaintainers"
                :columns="inviteMaintainerConfig.fields"
                :options="inviteMaintainerConfig.options"
              >
                <template slot="actions">
                  <smart-button small primary>
                    <i class="fa fa-people-carry mr-2" />
                    <span>Convidar</span>
                  </smart-button>
                </template>
              </v-client-table>
            </div>
          </b-tab>

          <b-tab title="Técnicos convidados">
            <template v-slot:title>
              <i class="fa fa-users fa-fw mr-1 fa-sm" aria-hidden="true" style="color:#555" />
              <span>Técnicos convidados</span>
            </template>

            <div class="custom-invite-maintainer-table">
              <v-client-table
                ref="availableMaintainers"
                v-model="maintainersInOrder"
                :columns="inviteMaintainerConfig.fields"
                :options="inviteMaintainerConfig.options"
              >
                <template slot="actions">
                  <smart-button small primary>
                    <i class="fa fa-trash mr-2" />
                    <span>Remover</span>
                  </smart-button>
                </template>
              </v-client-table>
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </b-modal>
  </section>
</template>

<script>
import { inviteMaintainerConfig } from '../../utils/tableConfig';

export default {
  name: 'InviteMaintainerModal',
  props: {
    availableMaintainers: { type: Array, default: () => [] },
    maintainersInOrder: { type: Array, default: () => [] },
  },
  componentes: {
    // componentes usados
  },
  data() {
    return {
      inviteMaintainerConfig,
    };
  },
  mounted() {
    this.$refs['inviteMaintainerModal'].show();
  },
  beforeDestroy() {
    this.$refs['inviteMaintainerModal'].hide();
  },
  methods: {
    resetModal() {
      this.$refs['inviteMaintainerModal'].hide();
      this.$emit('update:resetModal');
    },
  },
};
</script>

<style lang="scss">
.custom-invite-maintainer-table {
  table {
    border-radius: 8px;
    thead {
      th {
        background-color: var(--duas-rodas-soft);
        span {
          color: white;
          cursor: pointer;
        }
        border: 0 !important;
        outline: none;
      }
    }
    tbody {
      tr {
        td {
          border: 0 !important;
          vertical-align: middle;
          outline: none;
        }
      }
    }
  }
  .order-type {
    background-color: #d9534f;
    padding: 0 10px;
    color: white !important;
    border-radius: 8px;
  }
  .col-md-12 {
    justify-content: space-between;
    display: flex !important;
    .VueTables__search {
      width: 100%;
      .VueTables__search-field {
        width: 100% !important;
        input {
          width: 100%;
        }
      }
    }
  }
  .VuePagination {
    display: flex;
    justify-content: center;
    margin: 0 !important;
    p {
      display: flex;
      justify-content: center;
    }
  }
  .page-item .active {
    color: white !important;
    border-color: #ddd !important;
    background-color: var(--duas-rodas-soft) !important;
    &:focus {
      box-shadow: none !important;
    }
  }
  .page-link {
    color: #555 !important;
    &:focus {
      box-shadow: none !important;
    }
  }
  .actions-class {
    width: 100px !important;
  }
}
</style>
