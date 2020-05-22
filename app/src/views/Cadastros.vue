<template>
  <div class="root-cadastro-view">
    <transition name="slide-fade" mode="out-in">
      <div
        v-if="$route.path === '/cadastros'"
        class="card-container d-flex justify-content-center align-items-center flex-column"
      >
        <div class="card-title d-flex justify-content-center align-items-center">
          <p>Escolha o tipo de cadastro</p>
        </div>
        <div class="card-wrapper d-flex justify-content-center align-items-center flex-wrap">
          <div v-for="(card, index) in cards" :key="`card-${index}`">
            <card-option :title="card.title" :icon="card.icon" :route="card.route" />
          </div>
        </div>
      </div>
      
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cards: [
        {
          title: 'Ordem de Manutenção',
          icon: 'fas fa-file-signature',
          route: 'cadastros/cadastro-ordem-manutencao',
        },
        {
          title: 'Equipamento',
          icon: 'fas fa-tools',
          route: 'cadastros/cadastro-equipamento',
        },
        {
          title: 'Local de instalção',
          icon: 'fas fa-map-marker-alt',
          route: 'cadastros/cadastro-local-instalacao',
        },
        {
          title: 'Centro de Trabalho',
          icon: 'fas fa-map-pin',
          route: 'cadastros/cadastro-centro-trabalho',
        },
        // {
        //   title: 'Tipo de Ordem',
        //   icon: 'fas fa-file',
        //   route: 'cadastros/cadastro-tipo-ordem',
        // },
        {
          title: 'Causa e sintoma',
          icon: 'fas fa-exclamation-triangle',
          route: 'cadastros/cadastro-causa-sintoma',
        },
        {
          title: 'EPI',
          icon: 'fas fa-hard-hat',
          route: 'cadastros/cadastro-epi',
        },
        {
          title: 'Componente',
          icon: 'fas fa-puzzle-piece',
          route: 'cadastros/cadastro-componente',
        },
        {
          title: 'Operações',
          icon: 'fas fa-cogs',
          route: 'cadastros/cadastro-operations',
        },
      ],
    };
  },

  created() {
    if (window.innerWidth <= '600') this.$router.replace('/dashboard');
    return;
  },

  mounted () {
    this.$store.commit('addPageName', 'Cadastros');
  },
};
</script>

<style lang="scss" scoped>
.root-cadastro-view {
  display: flex;
  justify-content: center;
  align-items: center;
  .card-container {
    .card-title{
      p {
        font-family: 'roboto';
        font-size: 23px;
        color: #E66E6D;
      }
    }
    .card-wrapper {
      width: 80%;
    }

    @media screen and (max-width: 1660px) {
      .card-wrapper {
        width: 80%;
      }
    }

    @media screen and (max-width: 1090px) {
      .card-wrapper {
        width: 100%;
      }
    }
  }

  .slide-fade-enter-active {
    transition: all 0.2s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
}
</style>
