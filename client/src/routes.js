import Base from './components/Base.js';
import Timer from './components/Timer.js';
import SignUp from './components/SignUp.js';
import LogIn from './components/LogIn.js'
import AllSolves from './components/AllSolves.js';

const routes = {
  component: Base,
  childRoutes: [
    {
      path:'/',
      component: Timer
    },
    {
      path:'/s',
      component: SignUp
    },
    {
      path:'/l',
      component: LogIn
    },
    {
      path:'/a',
      component: AllSolves
    }
  ]

};

export default routes;