import Vue from 'vue'
import Router from 'vue-router'
import Hello from './components/HelloWorld'
import RegisterForm from './components/RegisterForm'
import LoginForm from './components/LoginForm'
import CreateQuizForm from './components/CreateQuizForm'
import QuizView from './components/QuizView'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'Hello',
        component: Hello
      },
      {
          path: '/register',
          name: 'Register',
          component: RegisterForm
      },
      {
          path: '/login',
          name: 'Login',
          component: LoginForm
      },
      {
          path: '/create',
          name: 'Create Quiz',
          component: CreateQuizForm
      },
      {
          path: '/quiz/:id',
          name: 'Quiz',
          component: QuizView
      }
    ]
  })