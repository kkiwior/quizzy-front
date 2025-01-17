<template>
  <v-container fluid fill-height
    ><v-row
      ><v-col cols="12" xl="10" offset-xl="1">
        <v-container>
          <v-row>
            <v-col cols="12" md="6" class="pb-0 pt-0">
              <v-text-field
                v-model="searchQuery"
                placeholder="Szukaj"
                dark
                prepend-inner-icon="mdi-magnify"
                single-line
                hide-details
                append-icon="mdi-close"
                @click:append="deleteQuery"
                @change="change"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pt-0">
              <v-select
                v-model="sortQuery"
                :items="sortQueries"
                menu-props="auto"
                label="Select"
                hide-details
                single-line
                dark
                @change="change"
              >
                <template slot="append-outer">
                  <v-icon
                    @click="order('ASC')"
                    color="success"
                    :size="orderQuery == 'ASC' ? 35 : 25"
                    >mdi-arrow-up</v-icon
                  >
                  <v-icon
                    @click="order('DESC')"
                    color="error"
                    :size="orderQuery == 'DESC' ? 35 : 25"
                    >mdi-arrow-down</v-icon
                  >
                </template>
              </v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="6"
              lg="4"
              xl="3"
              class="quiz"
              v-for="(quiz, qid) in quizzes"
              :key="qid"
              @click="$router.push('/quiz/' + quiz.id)"
            >
              <v-card
                class="d-flex flex-column elevation-8"
                style="width: 100%"
                dark
                large
              >
                <v-img
                  v-if="quiz.thumbnail === null"
                  height="150"
                  width="100%"
                  src="/images/quizthumbnail.jpg"
                  eager
                >
                  <div class="fill-height bottom-gradient"></div>
                </v-img>
                <v-img
                  v-else
                  height="150"
                  width="100%"
                  :src="quiz.thumbnail"
                  eager
                >
                  <div class="fill-height bottom-gradient"></div>
                </v-img>
                <span class="align-self-center pl-2 pr-2 quizText">{{
                  quiz.name
                }}</span>
              </v-card>
              <div class="text-center pt-2"></div>
            </v-col>
          </v-row>
        </v-container>
        <v-pagination
          dark
          v-if="totalPages > 1"
          v-model="page"
          :length="totalPages"
        ></v-pagination> </v-col
    ></v-row>
  </v-container>
</template>

<style lang="stylus" scoped>
.quiz {
  cursor: pointer;
}

.quizText {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-shadow: 1px 1px 3px #000;
}

.bottom-gradient {
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 65%, rgba(0, 0, 0, 0.4) 75%, rgba(0, 0, 0, 0.7) 82%, rgba(0, 0, 0, 0.9) 90%, rgba(0, 0, 0, 1) 100%);
}
</style>

<script>
import axios from "axios";

export default {
  data: () => ({
    searchQuery: "",
    sortQuery: "popular",
    sortQueries: [
      { text: "Popularne", value: "popular" },
      { text: "Najnowsze", value: "recent", default: true },
    ],
    orderQuery: "DESC",
    page: 1,
    totalPages: 1,
    quizzes: {
      name: "",
      thumbnail: "",
    },
  }),
  created() {
    this.getQuizList();
  },
  watch: {
    page() {
      this.getQuizList();
    },
  },
  methods: {
    async getQuizList() {
      this.$store.commit("progressbar", true);
      await axios
        .get(
          "quizzes?page=" +
            this.page +
            "&sort=" +
            this.sortQuery +
            "&order=" +
            this.orderQuery +
            (this.searchQuery != "" ? "&search=" + this.searchQuery : "")
        )
        .then((response) => {
          this.quizzes = response.data.quizzes;
          this.totalPages = response.data.pages;
        })
        .catch((errors) => {
          if (errors.response === undefined)
            return this.$store.commit("error", "Network Error.");
          switch (errors.response.status) {
            case 500:
              this.$store.commit("error", "Błąd serwera.");
              break;
            case 422:
              Object.keys(errors.response.data).forEach((key) => {
                this.form[key].error = errors.response.data[key];
              });
              break;
            case 400:
              this.$store.commit("error", "Wystąpił problem w żądaniu.");
              break;
            case 401:
              this.$store.commit("error", "Brak dostępu.");
              break;
            default:
              this.$store.commit("error", "Wystąpił nieznany błąd.");
              break;
          }
        });
      this.$store.commit("progressbar", false);
    },
    async order(m) {
      this.orderQuery = m;
      this.page = 1;
      await this.getQuizList();
    },
    async change() {
      this.page = 1;
      await this.getQuizList();
    },
    async deleteQuery() {
      this.searchQuery = "";
      this.page = 1;
      await this.getQuizList();
    },
  },
};
</script>