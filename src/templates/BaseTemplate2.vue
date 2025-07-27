<template>
  <div
    :class="['bg-white rounded-lg shadow-lg mx-auto', className]"
    :style="printStyle"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BaseTemplate2',
  props: {
    width: {
      type: String,
      default: '794px'
    },
    height: {
      type: String,
      default: '1123px'
    },
    className: {
      type: String,
      default: ''
    },
    isPrint: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    printStyle() {
      return this.isPrint
        ? { width: this.width, height: this.height }
        : { width: '380px', height: 'auto', minHeight: '570px' };
    }
  }
};
</script>
