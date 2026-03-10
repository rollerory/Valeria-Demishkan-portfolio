<script setup lang="ts">
const props = defineProps({
  image: String,
});
const emit = defineEmits(["close"]);
</script>

<template>
  <teleport to="body">
    <div
      class="modal"
      role="dialog"
      aria-modal="true"
      @click.self="emit('close')"
      @pointerup.self="emit('close')"
    >
      <div class="modal__inner">
        <img :src="props.image" alt="image" />
      </div>
    </div>
  </teleport>
</template>

<style scoped lang="scss">
.modal {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  background: rgba(0, 0, 0, 0.6);
  display: grid;
  place-items: center;
  z-index: 1000;

  &__inner {
    background: #fff;
    border-radius: 20px;
    border: 2px solid $primary-color;
    max-width: 92vw;
    max-height: calc(100vh - 40px);
    width: fit-content;
    height: fit-content;
    padding: 8px;

    & img {
      max-width: calc(100vw - 120px);
        max-height: calc(100vh - 60px);
      width: auto;
      height: auto;
      border-radius: 12px;
      display: block;
    }
  }
}
</style>
