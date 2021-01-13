<template>
    <v-container fluid fill-height><v-row><v-col cols="12" md="10" offset-md="1" lg="10" offset-lg="1" xl="6" offset-xl="3">
        <v-card v-if="quiz.id" dark class="pa-4 d-flex flex-column">
            <v-card flat>
            <v-card class="d-flex flex-wrap flex-row mt-2 flex-align-center justify-center" flat>
                <v-card class="align-self-center text-center" flat>
                    <v-img class="mt-2 thumbnailQuiz" lazy-src="https://picsum.photos/id/11/10/6" height="128" width="256" src="https://picsum.photos/id/11/500/300" eager></v-img>
                </v-card>
                <v-card class="align-self-center ml-4" flat>
                    <v-card class="d-flex flex-column" flat>
                        <v-card class="text-h6" flat>{{quiz.name}}</v-card>
                        <v-card flat>{{quiz.questions_count}} {{['2', '3', '4'].includes(quiz.questions_count.toString().substr(-1, 1)) ? 'pytania' : quiz.questions_count == 1 ? 'pytanie' : 'pytań'}}</v-card>
                        <v-card flat v-if="this.quiz.reentry">Dozwolone 1 podejście</v-card>
                        <v-card-actions class="ma-0 pa-0 mt-2">
                            <v-btn color="success" :disabled="(this.quiz.anonymous && !this.$store.getters.isLogged) == 1" @click="startQuiz">{{(this.quiz.anonymous && !this.$store.getters.isLogged) ? 'Quiz dostępny tylko dla zalogowanych' : 'Rozpocznij quiz'}}</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-card>
            </v-card>

            <v-card style="min-width:80% flex-align-center justify-center" flat>
                <v-data-table
                    dark
                    disable-pagination
                    disable-sort
                    disable-filtering
                    hide-default-footer
                    :headers="ranking.headers"
                    :items="ranking.persons"
                    class="elevation-1 mt-4"
                ></v-data-table>
            </v-card>

            <v-card flat>
            <v-card class="d-flex flex-row mt-4 flex-align-center justify-center" flat>
                    <v-card class="align-self-center" flat>Stworzony przez:</v-card>
                    <v-card class="ml-2 mr-2" flat><v-avatar size="40" rounded="circle"><img :src="quiz.creator.avatar" :alt="quiz.creator.name"></v-avatar></v-card>
                    <v-card class="align-self-center" flat>{{quiz.creator.name}}</v-card>
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

            <v-progress-linear v-if="quiz.time" v-model="timer" height="25" class="mt-2 mb-2"><strong>{{ Math.ceil(quiz.time) }}</strong></v-progress-linear>

            <v-row>
                <v-col cols="6" v-for="(answer, aid) in question.answers" :key="aid">
                    <v-card class="pa-4" dark tile @click="sendAnswer(aid)">{{answer.text}}</v-card>    
                </v-col>
            </v-row>

                

        </v-container>

    </v-col></v-row></v-container>
</template>


<script>
import axios from 'axios';

  export default {
    data: () => ({
        quiz: {
            questions_count: 0
        },
        ranking: {
            headers: [ { text: '#', value:'place' }, { text: 'Użytkownik', value:'user' }, { text: 'Punktów', value:"score"}],
            persons: [ { place: '1.', user: 'Szymon Dolny', score: '20' }, 
            { place: '2.', user: 'Bartosz Kochany', score: '19'},
            { place: '3.', user: 'Adam Małysz', score: '19'},
            { place: '4.', user: 'Marcin Krasucki', score: '18'},
            { place: '5.', user: 'Twój Stary', score: '17'},
            { place: '6.', user: 'Dawid Czerwiak', score: '17'},
            { place: '7.', user: 'Kuba Grabowski', score: '16'},
            { place: '8.', user: 'Kamil Kalafior', score: '3'},
            { place: '9.', user: 'Andrzej Dupa', score: '0'},
            { place: '10.', user: 'Vateusz Cukrowy', score: '0'}]
        },
        game: {
            id: 0
        },
        questionTime: 0,
        question: [],
        timer: 100
    }),
    created(){
        this.$store.commit('progressbar', true);
        axios.get("quiz/" + this.$route.params.id)
            .then(response => {
                this.quiz = response.data.quiz;
            })
            .catch(errors => {
                if(errors.response === undefined) return this.$store.commit('error', 'Network Error.');
                if(errors.response.status) return this.$store.commit('error', errors.response.statusText);
            });
        this.$store.commit('progressbar', false);
    },
    watch: {
        question: {
            deep: true,
            handler(){
                this.questionTime = Date.now() + (this.quiz.time * 1000);
                clearInterval(this.interval);
                this.interval = setInterval(()=>{
                    this.timer = (this.questionTime - Date.now()) / this.quiz.time / 10;
                }, 200);
            }
        }
    },
    methods: {
        async startQuiz(){
            this.$store.commit('progressbar', true);
            await axios.post("game/start/" + this.$route.params.id)
                .then(response => {
                    this.game = response.data.game;
                    this.question = response.data.question;
                })
                .catch(errors => {
                    if(errors.response === undefined) return this.$store.commit('error', 'Network Error.');
                    if(errors.response.status) return this.$store.commit('error', errors.response.statusText);
                });
            this.$store.commit('progressbar', false);
        },
        async sendAnswer(e){
            console.log(e);
        }
    }
  }
</script>