<template>
  <v-container fluid fill-height id="router"
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
        <v-form
          v-if="$store.getters.isLogged && url === ''"
          v-model="valid"
          @submit.prevent="submitForm"
        >
          <v-card class="pa-4 d-flex flex-column" dark>
            <v-card-text>
              <v-text-field
                v-model="name"
                :counter="128"
                prepend-icon="mdi-rename-box"
                label="Nazwa quizu"
                :rules="[
                  (v) => !!v || 'Nazwa quizu jest wymagana.',
                  (v) => v.length >= 5 || 'Nazwa quizu za krótka.',
                  (v) => v.length <= 128 || 'Nazwa quizu za długa',
                ]"
              ></v-text-field>

              <v-card class="d-flex flex-wrap flex-row mt-2" flat>
                <v-card flat>
                  Ustawienia:
                  <v-switch
                    v-model="options.shuffle"
                    label="Losowa kolejność pytań."
                    hide-details
                  ></v-switch>
                  <v-switch
                    v-model="options.public"
                    label="Quiz dostępny tylko dla osób z linkiem."
                    hide-details
                  ></v-switch>
                  <v-switch
                    v-model="options.anonymous"
                    label="Dostęp dla tylko dla zalogowanych użytkowników."
                    hide-details
                    :disabled="options.reentry ? true : false"
                  ></v-switch>
                  <v-switch
                    v-model="options.reentry"
                    label="Pozwalaj tylko na jedno rozwiązanie quizu."
                    hide-details
                  ></v-switch>
                </v-card>
                <v-card
                  class="align-self-center ml-auto mr-auto mr-lg-0 grow-1 text-center"
                  flat
                >
                  <v-hover v-slot="{ hover }">
                    <v-img
                      class="mt-2 thumbnailQuiz"
                      height="128"
                      width="256"
                      :src="
                        thumbnail === '' || thumbnail === null
                          ? '/images/quizthumbnail.jpg'
                          : thumbnail
                      "
                      eager
                    >
                      <v-expand-transition>
                        <div
                          v-if="hover"
                          class="d-flex justify-center"
                          style="height: 100%; cursor: pointer"
                          @click="prepareUpload"
                        >
                          <v-icon>mdi-camera</v-icon>
                        </div>
                      </v-expand-transition>
                    </v-img>
                  </v-hover>
                  <v-card flat>
                    <v-card-text class="text-center">
                      <v-text-field
                        style="width: 220px"
                        @click:append-outer="options.time += 5"
                        @click:prepend="
                          options.time =
                            options.time >= 5 ? options.time - 5 : 0
                        "
                        append-outer-icon="mdi-plus"
                        prepend-icon="mdi-minus"
                        label="Czas na udzielenie odpowiedzi"
                        v-model="options.time"
                        hide-details
                        :rules="[(v) => v !== '' || '']"
                        @keypress="numberInput"
                        @change="
                          options.time =
                            options.time !== '' ? parseInt(options.time) : 0
                        "
                      />
                    </v-card-text>
                  </v-card>
                </v-card>
              </v-card>
            </v-card-text>
          </v-card>

          <draggable
            v-model="questions"
            group="questions"
            @start="drag = true"
            @end="drag = false"
            handle=".handleQuestion"
          >
            <v-card
              dark
              class="mt-4 pb-6"
              v-for="(question, questionIndex) in questions"
              :key="questionIndex"
              @mouseover="m_index.question = questionIndex"
              @mouseleave="m_index.question = -1"
            >
              <div
                class="questionValidation"
                :class="question.valid ? '' : 'error'"
              >
                <div
                  class="controls"
                  :style="
                    'visibility: ' +
                    (m_index.question == questionIndex ? 'visible;' : 'hidden;')
                  "
                >
                  <v-card-actions
                    class="justify-center handleQuestion ma-0 pa-0"
                  >
                    <v-icon>mdi-drag-horizontal</v-icon>
                  </v-card-actions>

                  <v-col class="text-right pa-0" style="margin-top: -24px">
                    <v-icon @click="questions.splice(questionIndex, 1)"
                      >mdi-close</v-icon
                    >
                  </v-col>
                </div>
              </div>

              <v-card-text class="pt-0">
                <v-text-field
                  v-model="question.text"
                  :label="'Pytanie ' + (questionIndex + 1)"
                  required
                  hide-details
                  :rules="[
                    (v) => v.length >= 3 || 'Pytanie za krótkie.',
                    (v) =>
                      v.length <= 200 || 'Pytanie za długie. Max. 200 znaków.',
                  ]"
                >
                </v-text-field>

                <draggable
                  v-model="question.answers"
                  group="answers"
                  @start="drag = true"
                  @end="drag = false"
                  handle=".handleAnswers"
                >
                  <v-flex
                    @mouseover="m_index.answer = answerIndex"
                    @mouseleave="m_index.answer = -1"
                    v-for="(answer, answerIndex) in question.answers"
                    :key="answerIndex"
                  >
                    <v-text-field
                      v-model="answer.text"
                      label="Odpowiedź"
                      :value="answer.text"
                      required
                      single-line
                      class="ml-8"
                      hide-details
                      @change="
                        answer.text == ''
                          ? questions[questionIndex].answers.splice(
                              answerIndex,
                              1
                            )
                          : 'none'
                      "
                      :rules="[
                        (v) =>
                          v.length <= 100 ||
                          'Odpowiedź za długa. Max. 100 znaków.',
                      ]"
                    >
                      <template v-slot:prepend>
                        <v-icon
                          class="handleAnswers"
                          @click="() => (answer.correct = !answer.correct)"
                          :color="answer.correct ? 'success' : 'error'"
                          >{{
                            answer.correct
                              ? "mdi-checkbox-marked-circle-outline"
                              : "mdi-checkbox-blank-circle-outline"
                          }}</v-icon
                        >
                      </template>
                      <template v-slot:append-outer>
                        <v-icon
                          v-if="
                            m_index.answer == answerIndex &&
                            m_index.question == questionIndex
                          "
                          @click="
                            questions[questionIndex].answers.splice(
                              answerIndex,
                              1
                            )
                          "
                          >mdi-close</v-icon
                        >
                        <v-icon v-else style="width: 24px"></v-icon>
                      </template>
                    </v-text-field>
                  </v-flex>
                </draggable>
              </v-card-text>
            </v-card>
            <v-col
              ><v-btn
                class="secondary"
                @click="
                  questions.push({
                    text: '',
                    answers: [{ text: '', correct: false }],
                    valid: true,
                  })
                "
                ><v-icon>mdi-plus</v-icon></v-btn
              ></v-col
            >
          </draggable>

          <v-col class="text-center">
            <v-btn :disabled="!valid" type="submit" class="mr-4">
              {{ this.editId ? "Edytuj quiz" : "Dodaj quiz" }}
            </v-btn>
          </v-col>
        </v-form>

        <v-dialog
          v-if="url !== ''"
          transition="dialog-bottom-transition"
          max-width="600"
          v-model="url"
          dark
          @click:outside="$router.push('/quizzes/my')"
        >
          <template>
            <v-card>
              <v-toolbar color="primary" dark
                >Quiz został
                {{ this.editId ? "edytowany" : "dodany" }}!</v-toolbar
              >
              <v-card-text>
                <div class="mt-4">Link:</div>
                <v-text-field
                  readonly
                  v-model="fullUrl"
                  append-outer-icon="mdi-content-copy"
                  @click:append-outer="copyUrl"
                ></v-text-field>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn href :to="this.url">Przejdź do quizu</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-col></v-row
    >
  </v-container>
</template>

<style lang="stylus">
.mdi-plus::before {
  color: #4caf50 !important;
}

.mdi-minus {
  color: #ff5252 !important;
}

.mdi-close {
  opacity: 0.5;
}

.mdi-drag-horizontal {
  cursor: move;
}

.controls {
  display: block;
  opacity: 0.5;
}

input[type='number'] {
  -moz-appearance: textfield;
}

input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>

<script>
import axios from "axios";
import draggable from "vuedraggable";

export default {
  components: {
    draggable,
  },
  props: ["id"],
  data: () => ({
    valid: false,
    name: "",
    thumbnail: "",
    options: {
      shuffle: false,
      public: false,
      anonymous: false,
      reentry: false,
      time: parseInt(0),
    },
    questions: new Array({
      text: "",
      answers: [{ text: "", correct: false }],
      valid: true,
    }),
    m_index: { question: -1, answer: -1 },
    url: "",
  }),
  created() {
    if (!this.editId) return false;
    this.$store.commit("progressbar", true);
    axios
      .get("quiz/" + this.editId + "?edit=true")
      .then((response) => {
        let q = response.data.quiz;
        this.name = q.name;
        this.options = {
          shuffle: q.shuffle,
          public: q.public,
          anonymous: q.anonymous,
          reentry: q.reentry,
          time: parseInt(q.time),
        };
        q.questions.forEach((e) => {
          e.answers = JSON.parse(e.answers);
          e.text = e.question;
          delete e.question;
          e.valid = true;
        });
        this.questions = q.questions;
        this.thumbnail = q.thumbnail;
      })
      .catch((errors) => {
        if (errors.response === undefined)
          return this.$store.commit("error", "Network Error.");
        switch (errors.response.status) {
          case 500:
            this.$store.commit("error", "Błąd serwera.");
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
  watch: {
    questions: {
      deep: true,
      handler() {
        this.questions.forEach((q) => {
          if (
            q.answers.length == 0 ||
            q.answers[q.answers.length - 1].text !== ""
          )
            q.answers.push({ text: "", correct: false });
        });

        return true;
      },
    },
    "options.reentry": function (val) {
      if (val == true) this.options.anonymous = true;
    },
  },
  computed: {
    fullUrl() {
      return process.env.VUE_APP_URL + this.url;
    },
    editId() {
      return this.$route.params?.id === undefined
        ? false
        : this.$route.params?.id;
    },
  },
  methods: {
    async submitForm() {
      let wrong = new Array();
      this.questions.forEach((q, id) => {
        let hasGood = false;
        q.answers.forEach((a) => {
          if (a.correct) hasGood = true;
        });
        q.valid = hasGood;
        if (!q.valid) wrong.push(id + 1);
      });

      if (wrong.length !== 0) {
        this.$store.commit(
          "error",
          wrong.length > 1
            ? "Pytania " +
                wrong.join(", ") +
                " nie zawierają poprawnej odpowiedzi."
            : "Pytanie " + wrong[0] + " nie zawiera poprawnej odpowiedzi."
        );
        return false;
      }

      let questionsRequest = this.questions.map((q) => {
        return { ...q, answers: q.answers.filter((a) => a.text) };
      });

      questionsRequest.forEach((q) => {
        delete q.valid;
        delete q.order;
      });

      let request = {
        name: this.name,
        thumbnail: this.thumbnail,
        shuffle: this.options.shuffle,
        public: this.options.public,
        anonymous: this.options.anonymous,
        reentry: this.options.reentry,
        time: this.options.time,
        questions: questionsRequest,
      };
      this.$store.commit("progressbar", true);
      if (!this.editId)
        await axios
          .post("quiz/create", request)
          .then((response) => {
            this.url = "/quiz/" + response.data.quiz_id;
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
                  this.$store.commit("error", errors.response.data[key][0]);
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
      else
        await axios
          .put("quiz/" + this.editId, request)
          .then((response) => {
            this.url = "/quiz/" + response.data.quiz_id;
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
                  this.$store.commit("error", errors.response.data[key][0]);
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
    numberInput(e) {
      if (isNaN(e.key) || e.key == " ") e.preventDefault();
      return true;
    },
    copyUrl() {
      window.navigator.clipboard.writeText(this.fullUrl);
    },
    prepareUpload() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => this.uploadThumbnail(input.files[0]);
      input.click();
    },
    uploadThumbnail: function (img) {
      let formData = new FormData();
      formData.append("image", img);
      axios
        .post("quiz/thumbnail", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => (this.thumbnail = res.data.thumbnail));
    },
  },
};
</script>