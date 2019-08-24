import React, { Component } from 'react';
import { queryCurrent } from '@/server/user.js'

class App extends Component {
  state = {
  };

  componentDidMount(){
    queryCurrent();
  }

  render(){
    return(
      <div className="App">
        首页
      </div>
    )
  }


}

export default App;
