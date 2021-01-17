<template>
  <v-container fluid fill-height
    ><v-row
      ><v-col
        cols="12"
        md="10"
        offset-md="1"
        lg="10"
        offset-lg="1"
        xl="6"
        offset-xl="3"
      >
        <v-card
          v-if="quiz.id && game.uid == 0"
          dark
          class="pa-4 d-flex flex-column"
        >
          <v-card flat>
            <v-card
              class="d-flex flex-wrap flex-row mt-2 flex-align-center justify-center"
              flat
            >
              <v-card class="align-self-center text-center" flat>
                <v-img
                  v-if="quiz.thumbnail == null"
                  class="mt-2 elevation-4"
                  height="128"
                  width="256"
                  src="/images/quizthumbnail.jpg"
                  eager
                ></v-img>
                <v-img
                  v-else
                  class="mt-2 elevation-4"
                  height="128"
                  width="256"
                  :src="quiz.thumbnail"
                  eager
                ></v-img>
              </v-card>
              <v-card class="align-self-center ml-4" flat>
                <v-card class="d-flex flex-column" flat>
                  <v-card class="text-h6" flat>{{ quiz.name }}</v-card>
                  <v-card flat
                    >{{ quiz.questions_count }}
                    {{
                      ["2", "3", "4"].includes(
                        quiz.questions_count.toString().substr(-1, 1)
                      )
                        ? "pytania"
                        : quiz.questions_count == 1
                        ? "pytanie"
                        : "pytań"
                    }}</v-card
                  >
                  <v-card flat v-if="this.quiz.reentry"
                    >Dozwolone 1 podejście</v-card
                  >
                  <v-card-actions class="ma-0 pa-0 mt-2">
                    <v-btn
                      color="success"
                      :disabled="
                        (this.quiz.anonymous &&
                          !this.$store.getters.isLogged) == 1
                      "
                      @click="startQuiz"
                      >{{
                        this.quiz.anonymous && !this.$store.getters.isLogged
                          ? "Quiz dostępny tylko dla zalogowanych"
                          : "Rozpocznij quiz"
                      }}</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-card>
            </v-card>

            <v-card
              style="min-width: 80% flex-align-center justify-center"
              flat
            >
              <v-data-table
                dark
                disable-pagination
                disable-sort
                disable-filtering
                hide-default-footer
                :headers="ranking.headers"
                :items="ranking.people"
                class="elevation-1 mt-4"
              >
                <template v-slot:no-data>
                  Nikt jeszcze nie rozwiązał tego quizu.
                </template>
                <template v-slot:item.user="{ item }">
                  <v-avatar
                    v-if="item.user.avatar === null"
                    size="40"
                    rounded="circle"
                    class="mr-2 elevation-3"
                    color="secondary"
                    >{{ item.user.name[0] }}</v-avatar
                  >
                  <v-avatar
                    v-else
                    size="40"
                    rounded="circle"
                    class="mr-2 elevation-3"
                    ><v-img
                      :src="item.user.avatar"
                      :alt="item.user.name"
                    ></v-img></v-avatar
                  >{{ item.user.name }}
                </template>
              </v-data-table>
            </v-card>

            <v-card flat>
              <v-card
                class="d-flex flex-row mt-4 flex-align-center justify-center"
                flat
              >
                <v-card class="align-self-center" flat>Stworzony przez:</v-card>
                <v-card class="ml-2 mr-2" flat>
                  <v-avatar
                    v-if="quiz.creator.avatar === null"
                    size="40"
                    rounded="circle"
                    class="elevation-3"
                    color="secondary"
                    >{{ quiz.creator.name[0] }}</v-avatar
                  >
                  <v-avatar
                    v-else
                    size="40"
                    rounded="circle"
                    class="elevation-3"
                    ><v-img
                      :src="quiz.creator.avatar"
                      :alt="quiz.creator.name"
                    ></v-img
                  ></v-avatar>
                </v-card>
                <v-card class="align-self-center" flat>{{
                  quiz.creator.name
                }}</v-card>
              </v-card>
            </v-card>
          </v-card>
        </v-card>

        <v-container v-else>
          <v-row>
            <v-col cols="12">
              <v-card class="text-h5 pa-4" dark>{{ question.question }}</v-card>
            </v-col>
          </v-row>

          <v-progress-linear
            v-if="quiz.time"
            v-model="timer"
            height="25"
            class="mt-2 mb-2"
            ><strong>{{
              Math.ceil((timer / 100) * this.quiz.time)
            }}</strong></v-progress-linear
          >

          <v-row id="questions">
            <v-col
              cols="12"
              md="6"
              v-for="(answer, aid) in question.answers"
              :key="aid"
              class="pb-1 pt-1"
            >
              <v-btn
                class="pa-4 text-none"
                style="width: 100%; height: 100%"
                dark
                :disabled="button"
                @click="sendAnswer(answer.id)"
                large
              >
                {{ answer.text }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>

        <v-dialog
          transition="dialog-bottom-transition"
          max-width="600"
          v-model="game.finish"
          dark
        >
          <v-card>
            <v-card-text class="pa-4">
              Rozwiązałeś quiz! Udało ci się odpowiedzieć na
              {{ this.game.points }} z {{ this.quiz.questions_count }} pytań.
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn @click="game.finish = false">Zamknij</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col></v-row
    >
  </v-container>
</template>

<style lang="stylus">
.v-btn__content {
  flex: 0 1 auto !important;
  white-space: normal !important;
}
</style>

<script>
import axios from "axios";

export default {
  data: () => ({
    quiz: {
      questions_count: 0,
    },
    ranking: {
      headers: [
        { text: "#", value: "place" },
        { text: "Użytkownik", value: "user" },
        { text: "Punktów", value: "score" },
      ],
      people: [{ place: "1.", user: { name: "User", avatar: "" }, score: "0" }],
    },
    game: {
      uid: 0,
      finish: false,
    },
    button: false,
    questionTime: 0,
    question: [],
    timer: 100,
  }),
  created() {
    this.$store.commit("progressbar", true);
    axios
      .get("quiz/" + this.$route.params.id)
      .then((response) => {
        this.quiz = response.data.quiz;
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
          case 404:
            this.$router.push("/NotFound");
            break;
          default:
            this.$store.commit("error", "Wystąpił nieznany błąd.");
            break;
        }
      });
    this.$store.commit("progressbar", false);
    this.getRanking();
  },
  watch: {
    question: {
      deep: true,
      handler() {
        if (this.quiz.time == 0) return;
        this.questionTime = Date.now() + this.quiz.time * 1000;
        clearInterval(this.interval);
        this.interval = setInterval(() => {
          this.timer = (this.questionTime - Date.now()) / this.quiz.time / 10;
          if (this.timer <= 0) {
            clearInterval(this.interval);
            this.sendAnswer(0);
          }
        }, 200);
      },
    },
  },
  methods: {
    async startQuiz() {
      this.$store.commit("progressbar", true);
      await axios
        .post("game/start/" + this.$route.params.id)
        .then((response) => {
          response.data.game.finish = false;
          this.game = response.data.game;
          this.question = response.data.question;
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
              this.$store.commit("error", errors.response.data[0]);
              break;
            case 404:
              this.$router.push("/NotFound");
              break;
            default:
              this.$store.commit("error", "Wystąpił nieznany błąd.");
              break;
          }
        });
      this.$store.commit("progressbar", false);
    },
    async sendAnswer(id) {
      this.button = true;
      clearInterval(this.interval);
      await axios
        .post("game/" + this.game.uid, { answer: id })
        .then((response) => {
          if (id != 0 && !response.data.correct.includes(id))
            document
              .querySelector("#questions div:nth-child(" + id + ") button")
              .classList.add("error");
          response.data.correct.forEach((c) => {
            document
              .querySelector("#questions div:nth-child(" + c + ") button")
              .classList.add("success");
          });

          if (response.data.finish === undefined)
            setTimeout(() => {
              document
                .querySelectorAll("#questions div button")
                .forEach((el) => {
                  el.classList.remove("success");
                  el.classList.remove("error");
                });
              this.question = response.data.question;
              this.button = false;
            }, 1500);
          else
            setTimeout(() => {
              this.button = false;
              this.game.uid = 0;
              this.game.points = response.data.finish;
              this.game.finish = true;
              this.getRanking();
            }, 1500);
        })
        .catch((errors) => {
          console.log(errors);
          if (errors.response === undefined)
            return this.$store.commit("error", "Network Error.");
          if (errors.response.status)
            return this.$store.commit("error", errors.response.statusText);
        });
    },
    async getRanking() {
      this.$store.commit("progressbar", true);
      await axios
        .get("quiz/ranking/" + this.$route.params.id)
        .then((response) => {
          let ranking = [];
          let place = 0;
          response.data.ranking.forEach((el) => {
            ranking.push({
              place: ++place + ".",
              user: el.user ?? { name: "Anonymous", avatar: null },
              score: el.correctAnswers,
            });
          });
          this.ranking.people = ranking;
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
            case 404:
              this.$router.push("/NotFound");
              break;
            default:
              this.$store.commit("error", "Wystąpił nieznany błąd.");
              break;
          }
        });
      this.$store.commit("progressbar", false);
    },
  },
};
</script>