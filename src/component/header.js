import React, { Component } from 'react'
import styles from './header.module.less'


class commonHeader extends Component{

    state = {
        defaultTop:['首页','沸点','话题','小册','活动']
    }

    render(){
        const { defaultTop } = this.state
        return(
            <div className={styles.header}>
                
                <div className={styles.main}>
                    <h3>微客</h3>
                    <nav className={styles.navbar}>
                        <ul className={styles.left}>
                           {
                               defaultTop.map(item=>{
                                   return(
                                       <li>{item}</li>
                                   )
                               })
                           }
                        </ul>
                        <ul className={styles.right}>
                            <li>
                                <input type="text"/>
                            </li>
                            <li>登录</li>
                            <li>注册</li>
                        </ul>
                    </nav>
                </div>
            </div>
        )
    }
}

export default commonHeader