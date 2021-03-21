import React, { Component } from 'react';
import './ProfileIcon.css';

class ProfileIcon extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
        }
    }

    toggle = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    render() {
        return (
            <div className="tc t">
                <div onClick={this.toggle}>
                    <img
                        src="http://tachyons.io/img/logo.jpg"
                        className="br-100 ba h3 w3 dib" alt="avatar" />
                </div>
                { this.state.dropdownOpen ? 
                <div className="shadow-5 dropdown">
                    <div className="dropdownItem" onClick={this.props.toggleModal}>View Profile</div>
                    <div className="dropdownItem" onClick={this.props.signOut}>Sign Out</div>
                </div> : null }
            </div>
        );
    }
}

export default ProfileIcon;