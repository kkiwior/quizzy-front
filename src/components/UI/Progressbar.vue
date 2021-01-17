<template>
  <div style="height: 4px">
    <v-progress-linear
      v-if="this.$store.getters.Progressbar"
      indeterminate
      color="primary"
    ></v-progress-linear>
  </div>
</template>

<script>
export default {
  data: () => ({}),
};
</script>