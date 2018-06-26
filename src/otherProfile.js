import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { Logo , Login} from './welcome'
import {FriendButton} from './friendButton'


export class OtherProfilePage extends React.Component{
    constructor(props){
        super(props);
        this.state={};
    }
    componentDidMount(){
        // console.log('loggint routerProps',this.props.routerProps.match.params.id);
        axios.get(`/getUser/${this.props.match.params.id}`)
        .then(response=>{
            if(response.data){
                // console.log("response.data.user",response.data.user);
                this.setState(
                    response.data.user
                )
            }else{
                console.log('response.data in getUser had an error ',response.data);
            }
        })
        .catch(err=>{
            console.log('oh no!!!');
        })
    }

    render(){
        // console.log("otherProfilePage - props : ", this.props);
        // console.log("otherProfilePage - STATE (the user's page we're visiting) : ", this.state);
        let pic = this.state.profilepic;
        if(!pic){
            pic='/neo.png'
        }
        return(
            <div className="profileContainer">
            <div className = "pictureContainer" >
                {this.state.first }       {this.state.last}
                <div className="profilePic"><img src={pic} /> </div>
                <div className = "bioContainer">
                    {this.state.bio }
                </div>

                <FriendButton otherId = {this.props.match.params.id}/>

            </div>
            </div>
        )
    }
}
