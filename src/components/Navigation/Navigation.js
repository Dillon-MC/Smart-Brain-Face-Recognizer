import React from 'react';
import ProfileIcon from '../Profile/ProfileIcon';
import './Navigation.css';

const Navigation = ({ onRouteChange, signOut, isSignedIn, toggleModal }) => {
    if(isSignedIn) {
        return (
            <nav className="navBar">
                <ProfileIcon signOut={signOut} toggleModal={toggleModal}/>
            </nav>
        );
    } else {
        return (
            <nav className="navBar">
                <p onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer'>Sign In</p>
                <p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'>Register</p>
            </nav>
        );
    }
}

export default Navigation;