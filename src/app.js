import React ,{ Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import routeConfig from './routerconfig';
import Header from '@/component/header'

class App extends Component {
  _renderRoutes(){
      let _result = [];
      let _loop = function(routes,fatherPath){
          fatherPath = !fatherPath ? "" : fatherPath;
          routes.map((r) => {
              if(r.component){
                  _result.push({
                      path:fatherPath + r.path,
                      exact:r.exact,
                      component:r.component
                  });
              }
              if(r.children){
                  return _loop(r.children, fatherPath + r.path);
              }
          });
      }
      _loop(routeConfig);
      return _result.map((r)=>{
          return (
              <Route
                  key={r.path}
                  exact={r.exact}
                  path={r.path}
                  component={r.component}
              />
          )
      });
  }
  render(){
      return (
          <Router basename={process.env.PUBLIC_URL}>
              <Header></Header>
              <Switch>
                  {this._renderRoutes(routeConfig)}
              </Switch>
          </Router>
      )
  }
}
export default App;
