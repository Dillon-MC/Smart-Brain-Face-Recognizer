import React from 'react';
import './Signin.css';

class SiginIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signInEmail: '',
            signInPassword: '',
            signInError: '',
            inputFieldColor: 'bg-transparent'
        }
    }
    onEmailChange = (event) => {
        this.setState({signInEmail: event.target.value});
    }

    onPasswordChange = (event) => {
        this.setState({signInPassword: event.target.value});
    }

    saveAuthTokenInSessions = (token) => {
        window.sessionStorage.setItem('token', token);
    }

    onSubmitSignIn = () => {
        fetch(`${process.env.REACT_APP_API_SERVER_URL}/signin`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.signInEmail.toLowerCase(),
                password: this.state.signInPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.userId && data.success === 'true') {
                this.saveAuthTokenInSessions(data.token);
                this.setState({signInError: '', inputFieldColor: 'bg-white'});
                fetch(`${process.env.REACT_APP_API_SERVER_URL}/profile/${data.userId}`, {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + data.token
                    }
                })
                .then(resp => resp.json())
                .then(user => {
                    if(user && user.email) {
                        this.props.loadUser(user);
                        this.props.onRouteChange('home');
                    }
                })
            } else {
                this.setState({signInError: 'Incorrect email or password!', inputFieldColor: 'bg-washed-red'});
            }
        }).catch(err => console.log('fetch failed in SignIn', err));
    }

    render() {
        const { onRouteChange } = this.props
        const { inputFieldColor } = this.state;
        return (
          <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
            <main className="pa4 black-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                        <h4 className='red width250'>{this.state.signInError}</h4>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input
                              className={`width250 b pa2 input-reset ba ${inputFieldColor} hover-bg-black hover-white w-100 hover-black`}
                              type="email" 
                              name="email-address"  
                              id="email-address"
                              onChange={this.onEmailChange}/>
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input 
                            className={`width250 b pa2 input-reset ba ${inputFieldColor} hover-bg-black hover-white w-100 hover-black`}
                            type="password" 
                            name="password"  
                            id="password"
                            onChange={this.onPasswordChange}
                            />
                        </div>
                    </fieldset>
                    <div className="">
                        <input 
                            onClick={this.onSubmitSignIn}
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib hover-black" 
                            type="submit"
                            value="Sign in"/>
                    </div>
                    <div className="lh-copy mt3">
                        <p onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
                    </div>
                </div>
            </main>
          </article>
            
       );
    }
}

export default SiginIn;