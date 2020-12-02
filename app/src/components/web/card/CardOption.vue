<template>
  <div class="root-card-option-component">
    <div class="card-option shadow-sm cursor-pointer" :class="size ? 'small' : ''" @click="$router.push(route)">
      <div class="card-wrapper">
        <div class="icon-card">
          <i :class="icon" class="fa-2x"></i>
        </div>
        <div>
          <span class="text-muted">{{ title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: '' },
    icon: { type: String, default: '' },
    route: { type: String, default: '' },
    size: { type: String, default: '' },
  },
};
</script>

<style lang="scss" scoped>
.root-card-option-component {
	.card-option {
		background-color: white;
		width: 250px;
		height: 200px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 25px;
		margin: 30px;
		transition: 0.2s;
		&:hover {
			transform: scale(1.09);
			box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
		}
		.card-wrapper {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding: 10px;
			div {
				margin: 10px;
				display: flex;
				span {
					text-align: center;
				}
			}
			i {
				color: #E66E6D;
			}
		}
	}
	.small {
		width: 120px !important;
		height: 100px !important;
	}

	@media screen and (max-width: 1366px) {
		.card-option {
			width: 200px;
			height: 150px;
			margin: 15px;
		}
	}
}
</style>
