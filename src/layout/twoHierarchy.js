import React, { Component } from 'react';
import { Layout } from 'antd';
import Commonheard from '@/component/header.js'


const { Header, Content } = Layout;
class Two extends Component {
  

  render(){
    return(
      <div className="three">
        <Layout>
            <Header>
                <Commonheard></Commonheard>
            </Header>
            <Content>
              
            </Content>
        </Layout>
      </div>
    )
  }

}

export default Two;
