<template>
  <section class="root-invite-maintainer-modal">
    <b-modal
      ref="inviteMaintainerModal"
      size="lg"
      hide-header
      hide-footer
      centered
      class="d-block text-center"
      @hide="resetModal()"
    >
      <div>
        <h3 class="text-center">Convidar Tecnico</h3>
        <b-tabs content-class="mt-3">
          <b-tab title="First" active>
            <template v-slot:title>
              <i class="fa fa-list fa-fw mr-1 fa-sm" aria-hidden="true" style="color:#555" />
              <span>Listagem dos técnicos</span>
            </template>

            <b-container fluid>
              <!-- User Interface controls -->
              <b-row class="filter-mecanic">
                <b-col lg="6" class="my-1">
                  <b-form-group
                    label="Usuario"
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="sm"
                    label-for="filterInput"
                    class="mb-0"
                  >
                    <b-input-group size="sm" class="filter-mecanic-add-in-order">
                      <b-form-input
                        id="filterInput"
                        v-model="filterUserModel"
                        type="search"
                        placeholder="Pesquisar mecânico"
                      ></b-form-input>
                      <b-input-group-append>
                        <b-button :disabled="!filter" @click="filter = ''">Limpar</b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-col>
              </b-row>

              <!-- Main table element -->
              <b-table
                id="my-table"
                show-empty
                small
                fixed
                stacked="md"
                responsive
                :items="maintainers"
                :fields="inviteMaintainersTableFields"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :filter-included-fields="filterOn"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                @filtered="onFiltered"
              >
                <p v-show="visibleMessage" class="Span_lerta">
                  O manutentor já está presente na ordem, verifique a listagem dos manutentores
                </p>
                <template v-slot:cell(name)="row">
                  {{ row.item.nome }}
                </template>

                <template v-if="showAddButton" v-slot:cell(actions)="row">
                  <smart-button @click.native="addMaintainer(row.item, row.index, $event.target)">
                    Adicionar
                  </smart-button>
                </template>
                <template v-slot:row-details="row">
                  <b-card>
                    <ul>
                      <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                    </ul>
                  </b-card>
                </template>
              </b-table>
              <div class="overflow-auto">
                <div>
                  <b-pagination
                    v-model="currentPage"
                    :total-rows="rows"
                    :per-page="perPage"
                    align="center"
                    pills
                    class="my-0 "
                    aria-controls="my-table"
                  ></b-pagination>
                </div>
              </div>
              <!-- Info modal -->
            </b-container>
          </b-tab>
          <b-tab title="Second">
            <template v-slot:title>
              <i class="fa fa-users fa-fw mr-1" aria-hidden="true" style="color:#555" />
              <span>Técnicos convidados</span>
            </template>
            <template v-slot:title>
              <i class="fa fa-list fa-fw mr-1 fa-sm" aria-hidden="true" style="color:#555" />
              <span>Listagem dos técnicos</span>
            </template>

            <b-container fluid>
              <!-- User Interface controls -->
              <b-row class="filter-mecanic">
                <b-col lg="6" class="my-1">
                  <b-form-group
                    label="Usuario"
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="sm"
                    label-for="filterInput"
                    class="mb-0"
                  >
                    <b-input-group size="sm" class="filter-mecanic-add-in-order">
                      <b-form-input
                        id="filterInput"
                        v-model="filterUserModel"
                        type="search"
                        placeholder="Pesquisar mecânico"
                      ></b-form-input>
                      <b-input-group-append>
                        <b-button :disabled="!filter" @click="filter = ''">Limpar</b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-col>
              </b-row>

              <!-- Main table element -->
              <b-table
                id="my-table"
                show-empty
                small
                fixed
                stacked="md"
                responsive
                :items="listManutentorInOrdem"
                :fields="inviteMaintainersTableFields"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :filter-included-fields="filterOn"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                @filtered="onFiltered"
              >
                <template v-slot:cell(name)="row">
                  {{ row.item.nome }}
                  <!-- {{ row }} -->
                </template>

                <template v-if="showAddButton" v-slot:cell(actions)="row">
                  <smart-button @click.native="removeMaintainer(row.item, row.index, $event.target)">
                    Remover
                  </smart-button>
                </template>

                <template v-slot:row-details="row">
                  <b-card>
                    <ul>
                      <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                    </ul>
                  </b-card>
                </template>
              </b-table>
              <div class="overflow-auto">
                <div>
                  <b-pagination
                    v-model="currentPage"
                    :total-rows="rowsManutentorInOrder"
                    :per-page="perPage"
                    align="center"
                    pills
                    class="my-0 "
                    aria-controls="my-table"
                  ></b-pagination>
                </div>
              </div>
              <!-- Info modal -->
            </b-container>
          </b-tab>
        </b-tabs>
      </div>
      <div class="container-button-modal">
        <smart-button primary @click.native="resetModal()">Ok</smart-button>
      </div>
    </b-modal>
  </section>
</template>

<script>
export default {
  name: 'InviteMaintainerModal',
  props: {
    filterUser: { type: Array, default: () => [] },
    maintainers: { type: Array, default: () => [] },
    filterOn: { type: Array, default: () => [] },
    inviteMaintainersTableFields: { type: Array, default: () => [] },
    listManutentorInOrdem: { type: Array, default: () => [] },
    filter: { type: String, default: '' },
    sortBy: { type: String, default: '' },
    sortDirection: { type: String, default: 'asc' },
    currentPage: { type: Number, default: 1 },
    perPage: { type: Number, default: 5 },
    rows: { type: Number, default: 0 },
    rowsManutentorInOrder: { type: Number, default: 0 },
    sortDesc: { type: Boolean, default: false },
    showAddButton: { type: Boolean, default: false },
    visibleMessage: { type: Boolean, default: false },
  },
  data() {
    return {

    };
  },
  computed: {
    filterUserModel: {
      get() {
        return this.filterUser;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  mounted() {
    this.$refs['inviteMaintainerModal'].show();
  },
  beforeDestroy() {
    this.$refs['inviteMaintainerModal'].hide();
  },
  methods: {
    onFiltered() {
      this.$emit('update:onFiltered');
    },
    addMaintainer(row, index) {
      this.$emit('update:addMaintainer', { row, index });
    },
    removeMaintainer(row, index) {
      this.$emit('update:removeMaintainer', { row, index });
    },
    resetModal() {
      this.$refs['inviteMaintainerModal'].hide();
      this.$emit('update:resetModal');
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
