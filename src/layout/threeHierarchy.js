import React, { Component } from 'react';
import { Layout } from 'antd';
import Commonheard from '@/component/header.js'
import { BrowserRouter as Switch, Route } from 'react-router-dom'
import home from '@/page/home'
import heart from '@/page/heart'

const { Header, Content } = Layout;
class Three extends Component {
  

  render(){
    return(
      <div className="three">
        <Layout>
            <Header>
                <Commonheard></Commonheard>
            </Header>
            <Content>
                <Switch>
                    <Route exact path="/" component={home}/> 
                    <Route exact path="/heart" component={heart}/> 
                </Switch>
            </Content>
        </Layout>
      </div>
    )
  }

}

export default Three;
