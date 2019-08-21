import React ,{ Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import {renderRoutes} from 'react-router-config';
import routeConfig from './routerconfig.js';

class App extends Component {
  render(){
      return (
        <Router>
            {renderRoutes(routeConfig)}
        </Router>   
      )
  }
}
export default App;
