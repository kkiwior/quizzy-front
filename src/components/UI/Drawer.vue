<template>
    <v-navigation-drawer
      dark
      permanent
      fixed
      width="256"
      :mini-variant="resolution"
    >

    <template v-if="this.$store.getters.isLogged">
      <v-list>
        <v-list-item class="px-2">

          <v-hover v-slot="{ hover }">
          <v-list-item-avatar>
            <v-avatar v-if="$store.getters.UserData.avatar === null" size="40" rounded="circle" class="elevation-3" color="secondary">
              <div>
              {{$store.getters.UserData.name[0]}}
                <v-expand-transition>
                          <div v-if="hover" class="d-flex justify-center" style="height: 100%; cursor: pointer; width: 100%;" @click="prepareUpload">
                              <v-icon style="text-align: center;">mdi-camera</v-icon>
                          </div>
                </v-expand-transition>
                </div>
            </v-avatar>
            <v-avatar v-else size="40" rounded="circle" class="elevation-3">
              <v-img :src="$store.getters.UserData.avatar" :alt="$store.getters.UserData.name">
                <v-expand-transition>
                          <div v-if="hover" class="d-flex justify-center" style="height: 100%; cursor: pointer; width: 100%;" @click="prepareUpload">
                              <v-icon style="text-align: center;">mdi-camera</v-icon>
                          </div>
                </v-expand-transition>
              </v-img>
            </v-avatar>
          </v-list-item-avatar>
          </v-hover>

          <v-list-item-title class="ml-2">{{this.$store.getters.UserData.name}}</v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>
      </v-list>
      </template>

      <v-list>
        <v-list-item
          v-for="item in itemsList"
          :key="item.title"
          link
          :to="item.route"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append v-if="this.$store.getters.isLogged">
        <div @click="logout">
          <v-btn block v-if="!resolution">
            Wyloguj się
          </v-btn>
          <v-btn block v-else>
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
</template>


<style lang="stylus" scoped>
#uploadButton 
  opacity 0.8
  display inline-block
  position absolute
  text-align center
  font-size 8px
  width 40px
  line-height 10px
  vertical-align bottom
  padding-top 30px
  border-radius 40px
  z-index 3
  overflow hidden

  .icon 
    visibility hidden
    background-color #000
    cursor pointer

#uploadButton:hover .icon 
  visibility visible

</style>

<script>
import axios from 'axios'

  export default {
    data () {
      return {
        items: [
          { title: 'Quizzy', icon: 'mdi-view-dashboard', route: '/' },
          { title: 'Zaloguj się', icon: 'mdi-login', route: '/login', logged: false },
          { title: 'Zarejestruj się', icon: 'mdi-account-plus', route: '/register', logged: false },
          { title: 'Moje quizy', icon: 'mdi-view-list-outline', route: '/quizzes/my', logged: true }
        ],
      }
    },
    computed: {
        itemsList(){
            return this.items.filter((i) => {
                if(i.logged === undefined) return true;
                if(i.logged !== undefined && (!this.$store.getters.isLogged && this.$store.getters.Token)) return false;
                if(i.logged !== undefined && (i.logged == this.$store.getters.isLogged)) return true;
                return false;
            });
        },
        resolution() {
          if(this.$vuetify.breakpoint.name == 'md' || this.$vuetify.breakpoint.name == 'lg' || this.$vuetify.breakpoint.name == 'xl') return false;
          return true;
        }
    },
    methods: {
      logout(){
        this.$store.commit('logoutUser');
      },
      prepareUpload(){
        let input = document.createElement('input');
        input.type = 'file';
        input.accept ='image/*';
        input.onchange = () => this.uploadAvatar(input.files[0]);
        input.click();
      },
      uploadAvatar: function(img){
        let formData = new FormData();
        formData.append("image", img);
        axios.post('user/upload_avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => this.$store.commit('changeAvatar', res.data.avatar))
          .catch(() => this.$store.commit('error', 'Wystąpił błąd podczas wgrywania obrazka.'))
      }
    }
  }
</script>