import React from 'react';

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

    onSubmitSignIn = () => {
        fetch('https://rocky-coast-32021.herokuapp.com/signin', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.signInEmail.toLowerCase(),
                password: this.state.signInPassword
            })
        })
        .then(response => response.json())
        .then(user => {
            if(user.id) {
                this.setState({signInError: '', inputFieldColor: 'bg-white'});
                this.props.loadUser(user);
                this.props.onRouteChange('home');
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
                        <h4 className='red'>{this.state.signInError}</h4>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input
                             className={`b pa2 input-reset ba ${inputFieldColor} hover-bg-black hover-white w-100`}
                              type="email" 
                              name="email-address"  
                              id="email-address"
                              onChange={this.onEmailChange}/>
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input 
                            className={`b pa2 input-reset ba ${inputFieldColor} hover-bg-black hover-white w-100`}
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
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
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