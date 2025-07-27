<template>
  <div 
    class="bg-white rounded-lg shadow-lg mx-auto"
    :style="{ width: '794px', height: '1123px' }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BaseTemplate',
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>
