import React from 'react';
import Greetee from './greetee';
import axios from 'axios';

export default class Hello extends React.Component {
    constructor(props){
        super(props);
        this.state={
            name: this.props.name
        };
        this.changeName=this.changeName.bind(this);
        setTimeout(()=>{
            this.setState({
                name:'World'
            })
        },2000)
    }
    changeName(name){
        this.setState({
            name:name
        });
    }
    render(){
        return (
            <div id="app">
                Hello, <Greetee name={this.state.name} />
                <div>
                    <GreeteeEditor changeName={this.Changename} />
                </div>
            </div>
        )
    }
}

function GreeteeEditor(props){
    function change(e){
        console.log(e.target.value);
        props.changeName(e.target.value)
    }
    return <input type="text" onChange={change} />
}
