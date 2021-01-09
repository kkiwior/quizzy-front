<template>
  <div class="text-center">
    <v-snackbar
      v-model="isVisible"
      timeout="3000"
      multi-line
      color="secondary"
      dark
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="primary"
          text
          v-bind="attrs"
          @click="$store.commit('errorClose')"
        >
          Zamknij
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
  export default {
      props: {
          text: String
      },
      computed: {
          isVisible: {
              get: function() {
                return (this.text === '' ? false : true);
              },
              set: function() {
                  this.$store.commit('errorClose')
              }
          }
      }
  }
</script>