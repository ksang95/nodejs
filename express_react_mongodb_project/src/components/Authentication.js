import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Authentication extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    //화살표 함수가 babel 버전 때문에(낮아서) 에러 나는 듯하다.
    //여기선 그냥 함수로 만들고 bind시키자
    handleChange(e) {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    handleLogin() {
        let id = this.state.username;
        let pw = this.state.password;
        this.props.onLogin(id, pw).then(
            (success) => {
                if (!success) {//실패시
                    this.setState({
                        password: ''
                    });
                }
            }
        )
    }

    handleRegister() {
        let id = this.state.username;
        let pw = this.state.password;
        this.props.onRegister(id, pw).then(
            (result) => {
                if (!result) {//실패시
                    this.setState({
                        username: '',
                        password: ''
                    })
                }
            }
        )
    }

    handleKeyPress(e){
        if(e.charCode==13){ //엔터누르면
            if(this.props.mode){
                this.handleLogin();
            } else {
                this.handleRegister();
            }
        }
    }

    render() {
        const inputBoxes = (
            <div>
                <div className="input-field col s12 username">
                    <label for="username">Username</label>
                    <input id="username" name="username" type="text" className="validate"
                        onChange={this.handleChange} value={this.state.username} />
                </div>
                <div className="input-field col s12">
                    <label for="password">Password</label>
                    <input id="password" name="password" type="password" className="validate"
                        onChange={this.handleChange} value={this.state.password} 
                        onKeyPress={this.handleKeyPress} />
                </div>
            </div>
        );
        const loginView = (
            <div>
                <div className="card-content">
                    <div className="row ">
                        {inputBoxes}
                        <a className="waves-effect waves-light btn"
                            onClick={this.handleLogin}>SUBMIT</a>
                    </div>
                </div>
                <div className="footer">
                    <div className="card-content">
                        <div className="right">
                            New Here? <Link to="/register">Create an account</Link>
                        </div>
                    </div>
                </div>
            </div>
        );

        const registerView = (
            <div>
                <div className="card-content">
                    <div className="row ">
                        {inputBoxes}
                        <a className="waves-effect waves-light btn"
                            onClick={this.handleRegister}>CREATE</a>
                    </div>
                </div>
            </div >
        );

        return (
            <div className="container auth">
                <Link className="logo" to="/">MEMOPAD</Link>
                <div className="card">
                    <div className="header blue white-text center">
                        <div className="card-content">{this.props.mode ? "LOGIN" : "REGISTER"}</div>
                    </div>
                    {this.props.mode ? loginView : registerView}
                </div>
            </div>
        );
    }
}

Authentication.propTypes = {
    mode: PropTypes.bool,
    onLogin: PropTypes.func,
    onRegister: PropTypes.func
};

Authentication.defaultProps = {
    mode: true,
    onLogin: (id, pw) => { console.error("login function not defined"); },
    onRegister: (id, pw) => { console.error("register function not defined"); }
}

export default Authentication;