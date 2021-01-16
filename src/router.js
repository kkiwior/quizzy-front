import Vue from 'vue'
import Router from 'vue-router'
import Quizzes from './components/Views/Quizzes'
import MyQuizzesView from './components/Views/MyQuizzes'
import QuizView from './components/Views/Quiz'


import RegisterForm from './components/RegisterForm'
import LoginForm from './components/LoginForm'
import CreateQuizForm from './components/CreateQuizForm'
import NotFoundView from './components/Views/NotFound'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'Quizzes',
        component: Quizzes
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
        path: '/quiz/:id/edit',
        name: 'Edit Quiz',
        component: CreateQuizForm
      },
      {
          path: '/quiz/:id',
          name: 'Quiz',
          component: QuizView
      },
      {
          path: '/quizzes/my',
          name: 'My Quizzes',
          component: MyQuizzesView
      },
      {
          path: '*',
          component: NotFoundView
      }
    ]
  })