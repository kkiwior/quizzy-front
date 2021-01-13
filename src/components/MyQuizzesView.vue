<template>
    <v-container fluid fill-height><v-row><v-col cols="12" md="10" offset-md="1" lg="10" offset-lg="1" xl="6" offset-xl="3">
        <v-card v-if="$store.getters.isLogged" dark class="pa-4 d-flex flex-column">


  <v-data-table
    :headers="headers"
    :items="quizzes"
    :page.sync="page"
    items-per-page="10"
    hide-default-footer
    class="elevation-1"
    @page-count="pageCount = $event"
  >
  <template #item.name="{ item }">
    <router-link :to="'/quiz/' + item.id">
      {{ item.name }}
    </router-link>
  </template>
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Twoje quizy</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
            <v-btn
              href
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
              to="/create"
            >
              Stwórz quiz
            </v-btn>
        <v-dialog v-model="dialogDelete" max-width="500px" dark>
          <v-card>
            <v-card-title class="headline">Czy na pewno chcesz usunąć ten quiz?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Anuluj</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      Nie stworzyłeś jeszcze żadnego quizu.
    </template>
  </v-data-table>
<div class="text-center pt-2">
      <v-pagination
        v-model="page"
        :length="pageCount"
      ></v-pagination>
    </div>

        </v-card>


    </v-col></v-row></v-container>
</template>

<script>
import axios from 'axios';

  export default {
    data: () => ({
      dialogDelete: false,
      headers: [
        {
          text: 'Nazwa',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { 
            text: 'Akcje', 
            value: 'actions', 
            sortable: false,
            align: 'end'
        },
      ],
      quizzes: [],
      editedIndex: -1,
      page: 1,
      editedItem: {
        name: '',
      },
      defaultItem: {
        name: '',
      },
    }),

    watch: {
      dialogDelete (val) {
        val || this.closeDelete()
      },
      page (){
        this.loadPage();
      }
    },

    created () {
      this.loadPage()
    },

    methods: {
      async loadPage () {
        this.$store.commit('progressbar', true);
        await axios.get("quizzes/my?page=" + this.page)
            .then(response => {
                this.quizzes = response.data.quizzes;
                this.pageCount = response.data.pages;
            })
            .catch(errors => {
                if(errors.response === undefined) return this.$store.commit('error', 'Network Error.');
                if(errors.response.status != 422) return this.$store.commit('error', errors.response.statusText);
            });
        this.$store.commit('progressbar', false);
      },

      deleteItem (item) {
        this.editedIndex = this.quizzes.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      async deleteItemConfirm () {
        await axios.delete("quiz?id=" + this.editedItem.id + "&page=" + this.page)
            .then(response => {
                this.quizzes = response.data.quizzes;
                this.pageCount = response.data.pages;
            })
            .catch(errors => {
                if(errors.response === undefined) return this.$store.commit('error', 'Network Error.');
                if(errors.response.status != 422) return this.$store.commit('error', errors.response.statusText);
            });
        this.$store.commit('progressbar', false);
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
    }
  }
</script>