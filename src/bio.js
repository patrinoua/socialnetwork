
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { Logo , Login} from './welcome'
import { ProfilePage } from './profile';

export class ExistingBio extends React.Component{

    constructor(props){
        super(props);
        this.state={};
        this.bio = this.props.bio;
        this.toggleBioEditor = this.toggleBioEditor.bind(this);
    }
    toggleBioEditor(){
        this.props.toggleBioEditor();
    }
    render(){
        let bio = this.props.bio;
        if(!this.props.bio){
            bio='Tell us something about urself!'
        }
        return(
            <div className = "bioContainer">
            <div className="bioDisplayTextArea" onClick={this.toggleBioEditor}> {bio} </div>
            <button type="button" onClick={this.toggleBioEditor}> Edit bio </button>
            </div>
        )
    }
}

export class EditBio extends React.Component{
    constructor(props){
        super(props);
        this.state={};
        this.handleChange = this.handleChange.bind(this);
        this.saveNewBio = this.saveNewBio.bind(this);
        this.changeBio = this.changeBio.bind(this);
        this.toggleBioEditor = this.toggleBioEditor.bind(this);
    }
    toggleBioEditor(){
        this.props.toggleBioEditor();
    }
    handleChange(e){
        this[e.target.name]=e.target.value;
    }
    changeBio(bio){
        this.props.changeBio(bio);
    }
    saveNewBio(){
        axios.post('/editBio',{
            bio: this.bio,
        })
        .then(response=>{
            if(response.data.success){
                this.props.changeBio(response.data.bio)
                setTimeout(this.toggleBioEditor,300);
            }else{
                console.log('response.data in register error ',response.data.errorMsg);
            }
        }).catch(err=>{console.log('PROBLEM :(',err);})
    }
    render(){
        return(
            <div className="bioContainer">
                <textarea name="bio" onChange={this.handleChange} autoFocus className="bioDisplayTextArea" defaultValue={this.props.bio}></textarea>
                <button type="button" onClick={this.saveNewBio}> Save </button>
                <button type="button" onClick={this.toggleBioEditor}> Cancel</button>
            </div>
        )
    }

}
