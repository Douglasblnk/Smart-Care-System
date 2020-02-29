<template>
  <div class="root-error-view">
    <div class="erro-wrapper">
      <div class="p-4 d-flex justify-content-between">
        <div class="d-flex align-items-center m-5">
          <i class="far fa-frown" />
        </div>
        <div class="m-5">
          <h1>Error 404<h2>Página não encontrada!</h2></h1>
        </div>
      </div>
      <div class="options">
        <div class="button">
          <router-link to="/">
            <save-button label="Voltar para página inicial" :active="true"/>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import saveButton from '../components/button/save-button'

export default {
  components: {
    'save-button': saveButton
  }
}
</script>

<style lang="scss" scoped>
.root-error-view {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--gray);
  .erro-wrapper {
    i {
      font-size: 5rem;
    }
  }
  a {  text-decoration: none;}
}
</style>