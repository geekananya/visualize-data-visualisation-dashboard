import React, {Component} from 'react'

export default class Card extends Component{
    render(){
        // console.log(this.props.robots[0]);      //this.props is an object of properites containing all properties passed in the component
        return( 
            <div className='tc dib ba br3 ml2 mr2 mb2 mt2 pa3 b--gold'>
                {this.props.children}
            </div>
        )
    }
};