<template>
    <v-container v-if="!$store.getters.isLogged" fluid fill-height><v-row><v-col cols="12" md="10" offset-md="1" lg="8" offset-lg="2" xl="6" offset-xl="3">
        <v-card dark>
            <v-form
                class="form"
                ref="form"
                v-model="valid"
                @submit.prevent="submitForm"
            >
            <v-card-text>
                <v-text-field
                v-model="form.name.value"
                :error-messages="form.name.error"
                :counter="32"
                :rules="nameRules"
                prepend-icon="mdi-login"
                label="Nazwa użytkownika"
                required
                ></v-text-field>

                <v-text-field
                v-model="form.email.value"
                :error-messages="form.email.error"
                :rules="emailRules"
                prepend-icon="mdi-email"
                label="Email"
                required
                ></v-text-field>

                <v-text-field
                v-model="form.password.value"
                type="password"
                :error-messages="form.password.error"
                :rules="passwordRules"
                prepend-icon="mdi-lock"
                label="Hasło"
                required
                ></v-text-field>

                <v-text-field
                v-model="form.passwordrepeat.value"
                :error-messages="form.passwordrepeat.error"
                type="password"
                :rules="[(form.password.value == form.passwordrepeat.value) || 'Hasła się nie zgadzają.']"
                prepend-icon="mdi-lock"
                label="Powtórz hasło"
                required
                ></v-text-field>
            </v-card-text>

            <v-card-actions class="justify-center">
                <v-btn :disabled="!valid"
                type="submit"
                class="mr-4"
                >
                Rejestracja
                </v-btn>
            </v-card-actions>
            </v-form>
        </v-card>
    </v-col></v-row></v-container>
</template>


<script>
import axios from 'axios';

  export default {
    data: () => ({
      valid: false,
    
      form: {
        name: {
            value: '',
            error: ''
        },
        email: {
            value: '',
            error: ''
        },
        password: {
            value: '',
            error: ''
        },
        passwordrepeat: {
            value: '',
            error: ''
        }
      },

      nameRules: [
        v => !!v || 'Nazwa użytkownika jest wymagana.',
        v => (v && v.length <= 32) || 'Nazwa użytkownika musi być krótsza (max. 32 znaki).',
        v => (v && v.length >= 3) || 'Nazwa użytkownika musi być dłuższa (min. 3 znaki).',
      ],
      emailRules: [
        v => !!v || 'Email jest wymagany.',
        v => /.+@.+\..+/.test(v) || 'E-mail musi być poprawnym adresem.',
      ],
      passwordRules: [
          v => !!v || 'Hasło jest wymagane.',
          v => (v && v.length <= 32) || 'Hasło musi być krótsze (max. 32 znaki).',
          v => (v && v.length >= 6) || 'Hasło musi być dłuższe (min. 6 znaków).',
      ]

    }),

    watch: {
        'form.name.value': function (n, o){
            if(n !== o && this.form.name.error == "Nazwa użytkownika jest zajęta.") this.form.name.error = '';
        },
        'form.email.value': function (n, o){
            if(n !== o && this.form.email.error == "Email jest zajęty.") this.form.email.error = '';
        }
    },

    methods: {
      async submitForm () {
        let request = { name: this.form.name.value, email: this.form.email.value, password: this.form.password.value, password_confirmation: this.form.passwordrepeat.value }
        this.$store.commit('progressbar', true);
        await axios.post("user/register", request)
            .then(response => {
                this.$store.commit('loginUser', response.data.user)
                this.$store.commit('token', response.data.access_token);   
            })
            .catch(errors => {
                if(errors.response === undefined) return this.$store.commit('error', 'Network Error.');
                if(errors.response.status != 422) return this.$store.commit('error', errors.response.statusText);
                Object.keys(errors.response.data).forEach(key => {
                    this.form[key].error = errors.response.data[key][0];
                });
            });
        this.$store.commit('progressbar', false);
      },
    },
  }
</script>