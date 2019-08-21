import React, { Component } from 'react';
import './header.less'

class Header extends Component{
    render(){
        return(
            <div className="header">
                <div className="main">
                    <h3>微客</h3>
                    <nav className="navbar">
                        <li>首页</li>
                        <li>心事</li>
                        <li>小册</li>
                        <li>活动</li>
                        <li>
                            <input type="text"/>
                        </li>
                        <li>登录</li>
                        <li>注册</li>
                    </nav>
                </div>
            </div>
        )
    }
}

export default Header