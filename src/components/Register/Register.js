import React from 'react';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',
            errorEmail: '',
            errorPassword: '',
            errorName: '',
            passwordTextColor: 'red',
            inputFieldColor: {
                nameFieldColor: 'bg-transparent',
                emailFieldColor: 'bg-transparent',
                passwordFieldColor: 'bg-transparent'
            }
        }
    }

    onEmailChange = (event) => {
        this.setState({email: event.target.value});
    }

    onNameChange = (event) => {
        this.setState({name: event.target.value});
    }

    onPasswordChange = (event) => {
        this.setState({password: event.target.value.trim()});
    }

    saveAuthTokenInSessions = (token) => {
        window.sessionStorage.setItem('token', token);
    }

    onSubmitRegister = () => {
        const { password, email, name } = this.state;
        new Promise((resolve, reject) => {
            setTimeout(() => {        
                let result = {
                    password: {fail: false, color: 'bg-white'},
                    email: {fail: false, color: 'bg-white'},
                    name: {fail: false, color: 'bg-white'},
                }

                if (password.length < 10) {
                    result.password.fail = true;
                    result.password.color = 'bg-washed-red';
                    this.setState({errorPassword: 'Password must be at least 10 characters!', passwordTextColor: 'dark-red'});
                } else {
                    result.password.fail = false;
                    result.password.color = 'bg-white';
                    this.setState({errorPassword: '', passwordTextColor: 'dark-green'});
                }
                
                let emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if(!emailFormat.test(email)) {
                    result.email.fail= true;
                    result.email.color = 'bg-washed-red';
                    this.setState({
                        errorEmail: "invalid email!"});
                } else {
                    result.email.fail= false;
                    result.email.color = 'bg-white';
                    this.setState({errorEmail: ''});
                }
                
                if (name === '') {
                    result.name.fail = true;
                    result.name.color = 'bg-washed-red';
                    this.setState({errorName: 'Please enter a name!'});
                } else {
                    result.name.fail = false;
                    result.name.color = 'bg-white';
                    this.setState({errorName: ''});
                }

                this.setState({inputFieldColor: {
                    passwordFieldColor: result.password.color,
                    emailFieldColor: result.email.color,
                    nameFieldColor: result.name.color
                }});

                if(result.password.fail || result.email.fail || result.name.fail) {
                    return reject('Something went wrong. You may have entered invalid credentials.');
                } else {
                    return resolve('Valid');
                }
            },40);
        }).then(() => {
            // !!! USE FOR PRODUCTION https://rocky-coast-32021.herokuapp.com/register !!!
            fetch(`${process.env.REACT_APP_API_SERVER_URL}/register`, {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: this.state.email.toLowerCase(),
                    password: this.state.password,
                    name: this.state.name
                })
            })
            .then(response => response.json())
            .then(data => {
                if(data.user.id) {
                    this.saveAuthTokenInSessions(data.session.token);
                    this.props.loadUser(data.user);
                    this.props.onRouteChange('home');
                } else {
                    this.setState({errorName: 'Unable to register'});
                    throw 'Unable to register';
                }
            }).catch(error => console.log('error registering: ', error));
        }).catch(error => console.log(error));
    }

    render() {
        return (
          <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
            <main className="pa4 black-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Register</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                            <h5 className="ma0">{this.state.errorName}</h5>
                            <input 
                             className={`pa2 input-reset ba ${this.state.inputFieldColor.nameFieldColor} hover-bg-black hover-white w-100`}
                             type="text"
                             placeholder="John"
                             name="name"  
                             id="name"
                             onChange={this.onNameChange}
                             />
                        </div>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <h5 className="ma0">{this.state.errorEmail}</h5>
                            <input
                             className={`pa2 input-reset ba ${this.state.inputFieldColor.emailFieldColor} hover-bg-black hover-white w-100`}
                             type="email"
                             placeholder="john@gmail.com"
                             name="email-address"  
                             id="email-address"
                             onChange={this.onEmailChange}
                             />
                        </div>
                        <div className="mv3">
                            <label className={`db fw6 lh-copy f6 ${this.state.passwordTextColor}`} htmlFor="password">Password (10 characters minimum)</label>
                            <h5 className="ma0">{this.state.errorPassword}</h5>
                            <input
                             className={`pa2 input-reset ba ${this.state.inputFieldColor.passwordFieldColor} hover-bg-black hover-white w-100`}
                             type="password"
                             placeholder="@ThisIsA-Passw0rd"
                             maxLength="25"
                             name="password"
                             id="password"
                             onChange={this.onPasswordChange}
                             />
                        </div>
                        <h5>{this.state.passwordLength}</h5>
                    </fieldset>
                    <div className="">
                        <input 
                            onClick={this.onSubmitRegister}
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                            type="submit"
                            value="Register"/>
                    </div>
                </div>
            </main>
          </article>
        );
    }
}

export default Register;