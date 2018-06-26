import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';


class App extends React.Component{
    constructor(props){
        super(props);
        this.state={};
        this.showUploader = this.showUploader.bind(this);
    }
    componentDidMount(){
        axios.get('/user').then(resp=>{
            this.setState({
                first: resp.data.first,
                profilePic: resp.data.profilePic,
            });
        });
    }
    showUploader(){
        this.setState({
             uploaderShouldBeVisible: true
        })
    }
    render(){
        if(!this.state.userId){
            return null;
        }
        return(
            <div>
                <header>
                    <Logo />
                     Hi, {this.state.first}
                     <ProfilePic id={this.state.id}
                                 profilePic = {this.state.profilePic}
                                 first = {this.state.first}
                                 last = {this.state.last}
                                 sex = {this.state.sex}
                                 makeUploaderVisible = {this.showUploader}
                     />
                     {this.state.uploaderShouldBeVisible && <Uploader changeImage = {img =>this.setState({
                         profilePic:img,
                         uploaderShouldBeVisible:false
                     })}/>}
                     // should be false in the beginning
                 </header>
            <div />
        )
    }
}
<Route>
    path="/"
    render={()=>{
        return(
            <ProfilePic id={this.state.id}
                        profilePic = {this.state.profilePic}
                        first = {this.state.first}
                        last = {this.state.last}
                        sex = {this.state.sex}
                        makeUploaderVisible = {this.showUploader}
            />

        )
    }}
</Route>

class Route extends React.component{
    render(){
        let elem
        if (this.props.elem){
            elem
        }
        else if (this.props.component){
            let Comp
            Comp = this.props.component

        }

    }
}


function profilePic(){
    if(!props.id){
        return null;
    }
    let pic=props.profilePic;
    if(!pic){
        pic = 'default.jpg'
    }
    return <img onClick={props.makeUploaderVisible} src={pic} />
}
