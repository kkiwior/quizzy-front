<template>
    <v-navigation-drawer
      dark
      permanent
      fixed
      width="256"
    >

    <template v-if="this.$store.getters.isLogged">
      <v-list-item class="px-2">
            <div id="uploadButton">
              <div class="icon"><span class="mdi mdi-camera" @click="prepareUpload"></span></div>
          </div>
          <v-list-item-avatar>
            <v-img :src="$store.getters.UserData.avatar"></v-img>
          </v-list-item-avatar>

          <v-list-item-title class="ml-2">{{this.$store.getters.UserData.name}}</v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>
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
        <div class="pa-2" @click="logout">
          <v-btn block>
            Wyloguj się
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
          { title: 'Stwórz quiz', icon: 'mdi-beaker-plus', route: '/create', logged: true }
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
        }).then(res => this.$store.commit('changeAvatar', res.data.avatar));
      }
    }
  }
</script>