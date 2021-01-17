<template>
  <v-container fluid fill-height
    ><v-row
      ><v-col
        cols="12"
        md="10"
        offset-md="1"
        lg="8"
        offset-lg="2"
        xl="6"
        offset-xl="3"
      >
        <v-card class="pa-8" flat dark>
          <div class="display-3 mt-5">404</div>
          <div class="paragraph-text mt-2">
            <br />
            Strona której szukasz nie istnieje.
            <br /><br />
            <router-link to="/">Wróć na stronę główną. </router-link>
          </div>
        </v-card>
      </v-col></v-row
    ></v-container
  >
</template>

<style lang="stylus" scoped>
.paragraph-text 
  font-size 18px
</style>