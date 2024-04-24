<script setup lang="ts">
  import { ref } from 'vue';
  const count = ref(1);
</script>

<template>
  <div>
    <button @click="count++">Increment</button>
    <button @click="count--">Decrement</button>
    <p>Count: {{ count }}</p>
  </div>
</template>
