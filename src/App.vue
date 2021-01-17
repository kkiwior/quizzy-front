<template>
  <v-app id="body">
    <Drawer></Drawer>
    <Progressbar></Progressbar>
    <Snackbar :text="this.$store.getters.Error"></Snackbar>
    <v-main>
      <router-view id="router"></router-view>
    </v-main>
  </v-app>
</template>

<style lang="stylus" scoped>
#body {
  background-color: #272727;
}

#router {
  width: calc(100% - 50px);
  float: right;

  @media screen and (min-width: 960px) {
    width: calc(100% - 256px);
  }
}
</style>

<style lang="stylus">
.form {
  padding: 12px 24px;
}

input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active {
  -webkit-text-fill-color: #fff !important;
  -webkit-box-shadow: 0 0 0px 1000px #1e1e1e inset !important;
  -webkit-font-size: 13.33px;
}

.thumbnailQuiz {
  border: 1px solid black;
}
</style>

<script>
import axios from "axios";
import Drawer from "./components/UI/Drawer";
import Snackbar from "./components/UI/Snackbar";
import Progressbar from "./components/UI/Progressbar";

export default {
  name: "App",
  components: {
    Drawer,
    Snackbar,
    Progressbar,
  },

  data: () => ({
    //
  }),
  watch: {
    "$store.state.Token": function () {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + this.$store.getters.Token;
    },
  },
  beforeCreate() {
    if (this.$store.getters.Token) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + this.$store.getters.Token;
      axios
        .get("user/me")
        .then((userData) => this.$store.commit("loginUser", userData.data))
        .catch(() => {
          this.$store.commit("logoutUser");
        });
    }
  },
};
</script>
