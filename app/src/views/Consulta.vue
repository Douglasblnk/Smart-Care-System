<template>
  <div class="root-consulta-view">
    <transition name="slide-fade" mode="out-in">
      <template v-if="$route.path === '/consultas'">
        <div class="consulta-wrapper">
          <!-- <div class="search-box">
            Campo de busca
          </div> -->

          <div class="order-consult mt-5">
            <div class="d-flex w-100 justify-content-center">
              <div class="table-content bg-white p-4 w-100">
                <div class="table-responsive">
                  <table class="table table table-striped table-borderless table-hover" cellspacing="0">
                    <thead class="table-head">
                      <tr>
                        <th scope="col">Ordem</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Titulo</th>
                        <th scope="col">Ações</th>
                      </tr>
                    </thead>
                    <tbody class="table-body">
                      <tr v-for="(order, index) in maintenainceOrders" :key="`order-${index}`">
                        <td>{{ order.titulo }}</td>
                        <td>{{ order.tipoManutencao_idtipoManutencao }}</td>
                        <td>{{ order.resumo }}</td>
                        <td style="width: 50px">
                          <div class="d-flex table-action">
                            <div class="d-flex align-items-center" @click="openOrder(order)"><i class="fas fa-file-alt fa-fw text-muted"></i>Abrir</div>
                            <div class="d-flex align-items-center" @click="summaryOrder(order)"><i class="fas fa-eye fa-fw text-muted"></i>Resumo</div>
                          </div> 
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { getLocalStorageToken } from '../utils/utils'

export default {
  data() {
    return {
      maintenainceOrders: []
    };
  },

  mounted() {
    this.getOrderMaintence();
  },

  methods: {
    openOrder(order) {
      console.log('order', order);
      localStorage.setItem('ordem', JSON.stringify(order))
      this.$router.push({ path: 'consultas/detalhamento'})
    },

    getOrderMaintence() {
      this.$http.methodGet('ordem-manutencao', getLocalStorageToken())
        .then(res => {
          if (res.result.length === 0) this.$swal({
            type: 'warning',
            title: 'Não foi encontrado nenhuma ordem de manutenção!',
            confirmButtonColor: '#F34336',
          })
          if (res.result.length === undefined) 
            this.maintenainceOrders.push(res.result)
          else this.maintenainceOrders = [ ...res.result ]
          console.log('im the maintenainceOrders', this.maintenainceOrders);
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.root-consulta-view {
  display: flex;
  justify-content: center;
  align-items: center;
  .consulta-wrapper {
    width: 80vw;
    .search-box {
      padding: 20px;
    }
    .order-consult {
      background-color: white;
      padding: 20px;
      border-radius: 10px;
      .table-content {
        border-radius: 10px;
        table {
          overflow:hidden;
          border-collapse:separate;
          border-radius: 10px;
        }
        .table-head {
          background-color: var(--duas-rodas);
          color: white;
          th {
            padding: 20px;
          }
        }
        .table-body {
          td {
            padding: 20px;
          }
        }
        .table-action {
          div {
            margin: 0 10px;
            cursor: pointer;
            transition: .1s;
            &:hover {
              transform: scale(1.2);
            }
            &:active {
              transform: scale(1);
            }
          }
        }
      }
    }
  }
}
</style>