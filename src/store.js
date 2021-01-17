import Vue from 'vue'
import Vuex from 'vuex'
import VueCookies from 'vue-cookies'

Vue.use(Vuex)
Vue.use(VueCookies)

export const store = new Vuex.Store({
    state: {
        isLogged: false,
        UserData: new Object(),
        Token: Vue.$cookies.get('token') || '',
        Progressbar: false,
        Error: ''
    },
    mutations: {
        loginUser(state, UserData) {
            state.isLogged = true;
            state.UserData = UserData;
        },
        logoutUser(state) {
            state.isLogged = false;
            state.UserData = new Object();
            state.Token = '';
            Vue.$cookies.remove('token');
        },
        token(state, token) {
            state.Token = token;
            Vue.$cookies.set('token', token)
        },
        changeAvatar(state, avatar) {
            state.UserData.avatar = avatar;
        },
        error(state, method) {
            state.Error = method;
        },
        errorClose(state) {
            state.Error = '';
        },
        progressbar(state, method) {
            state.Progressbar = method;
        }
    },
    getters: {
        isLogged: state => state.isLogged,
        UserData: state => state.UserData,
        Progressbar: state => state.Progressbar,
        Token: state => state.Token,
        Error: state => state.Error
    }
})