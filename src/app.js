import React ,{ Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Three from '@/layout/threeHierarchy'
import Two from '@/layout/twoHierarchy'

class App extends Component {
  render(){
      return (
        <Router>
          <Switch>
            <Route exact path="/" component={Three}/> 
            <Route exact path="/two" component={Two}/> 
          </Switch>
        </Router>   
      )
  }
}
export default App;
