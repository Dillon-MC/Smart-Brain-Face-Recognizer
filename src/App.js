import React, { Component } from 'react'; 
import { tryToAuthenticateUser } from './scripts/Authenticate';
import { tryToSubmitImage, updateUserEntries } from './scripts/SubmitImage';
import Navigation from './components/Navigation/Navigation.js';
import SignIn from './components/SignIn/SignIn.js';
import Register from './components/Register/Register.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Box from './components/Box/Box.js';
import Particles from 'react-particles-js';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';
import { signOut } from './scripts/SignOut';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 90,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  boxes: {},
  boxesToRender: [],
  route: 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
    pet: '',
    age: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
    this.wrapper = React.createRef();
  }

  componentDidMount() {
    // Try to authenticate the user using a stored JWT 
    // before proceeding to the sign in page
    tryToAuthenticateUser(this.loadUser, this.onRouteChange);
  }

  loadUser = (data) => {
    this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      entries: data.entries,
      joined: data.joined,
      error: ''
    }})
}

  calculateFaceLocations = (data) => {
    if(data && data.outputs) {
      let clarifaiFaces = [];
      const image = document.getElementById('inputimage');
      clarifaiFaces = data.outputs[0].data.regions.map(bounds => bounds.region_info.bounding_box);
      const faces = [];
      for(var face of clarifaiFaces) {
        faces.push (
          {
            leftCol: face.left_col * image.width,
            topRow: face.top_row * image.height,
            rightCol: image.width - (face.right_col * image.width),
            bottomRow: image.height - ( face.bottom_row * image.height)
          }
        )
      }
      return faces;
    }
  }

  displayFaceBox = (boxes) => {
    this.setState({boxes: boxes});
    this.createBoxComponents();
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onImageSubmit = () => {
    if (this.state.input !== '') {
      this.setState({ imageUrl: this.state.input });
      tryToSubmitImage(this.state.input, this.state.user)
      .then(response => {
        this.displayFaceBox(this.calculateFaceLocations(response));

        updateUserEntries(this.state.user.id)
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count }));
        })
        .catch(err => this.setState({ error: err }));    
      })
      .catch(err => this.setState({ error: err }));
    } else {
      this.setState({error: "No link provided!"});
    }
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      return this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }
  
  createBoxComponents() {
    if(this.state.boxes && this.state.boxes.length) {
      this.setState({boxesToRender: this.state.boxes.map((face, i) => <Box key={i} box={face} />)});
    }
  }

  toggleModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }));
  }

  render() {
    const { isSignedIn, imageUrl, route, boxesToRender, isProfileOpen, user } = this.state;

    return (
      <div className='App' ref={this.wrapper}>
        {this.props.children}
        <Particles params={particlesOptions} className='particles'/>
        <Navigation 
          isSignedIn={isSignedIn} 
          onRouteChange={this.onRouteChange}
          toggleModal={this.toggleModal}
          signOut={() => signOut(this.onRouteChange)}/>
        { isProfileOpen && 
          <Modal>
            <Profile isProfileOpen={isProfileOpen} toggleModal={this.toggleModal} user={user} loadUser={this.loadUser}/>
          </Modal>
        }
        { route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <h3>{this.state.error}</h3>
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onImageSubmit={this.onImageSubmit} />
                <FaceRecognition imageUrl={imageUrl} faceBoxes={boxesToRender} />
            </div>
            : (
              route === 'signin'
              ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
              : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            )
        }
      </div>
    );
  }
}

export default App;