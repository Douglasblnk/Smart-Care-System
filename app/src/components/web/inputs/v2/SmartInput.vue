<template>
  <div class="smart-input-container">
    <div class="form-group field">
      <slot />
      <label :for="id" class="form-label" @click="toggleFocus">{{ label }}</label>
      <div class="position-absolute">
        <span class="text-danger ml-2">{{ errorLabel }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SimplificaInputText',
  props: {
    id: { type: String, default: '' },
    label: { type: String, default: '' },
    errorLabel: { type: String, default: '' },
  },
  methods: {
    toggleFocus() {
      document.querySelector(`#${this.id}`).focus();
    },
  },
};
</script>

<style scoped lang="scss">
.smart-input-container {
  .form-group {
    position: relative;
    padding: 15px 0 0;
    width: 100%;
    .form-field {
      font-family: inherit;
      width: 100%;
      border: 0;
      border-radius: 8px;
      background-color: #eee;
      outline: 0;
      font-size: 1.2rem;
      color: var(--primary-color);
      padding: 7px 10px;
      transition: border-color 0.2s;
      &::placeholder {
        color: transparent;
      }
      &:placeholder-shown ~ .form-label {
        font-size: 1.2rem;
        cursor: text;
        top: 20px;
        left: 10px
      }
    }
    .error-label {
      border-bottom: 2px solid rgb(209, 85, 85);
      &:placeholder-shown ~ .form-label {
        color: rgb(209, 85, 85);
      }
    }
    .disabled {
      cursor: not-allowed;
    }
    .form-label {
      position: absolute;
      top: -10px;
      display: block;
      transition: 0.2s;
      font-size: 1rem;
      color: #AAA;
    }
    .form-field:focus {
      ~ .form-label {
        position: absolute;
        top: -10px;
        left: 0;
        display: block;
        transition: 0.2s;
        font-size: 1rem;
        color: #AAA;
      }
    }
    /* reset input */
    .form-field{
      &:required,&:invalid { box-shadow:none; }
    }
  }
}
</style>
