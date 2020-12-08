import React, { Component } from 'react'; 
import Navigation from './components/Navigation/Navigation.js';
import SignIn from './components/SignIn/SignIn.js';
import Register from './components/Register/Register.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Box from './components/Box/Box.js';
import Particles from 'react-particles-js';
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
  box: {},
  boxesToRender: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
    this.wrapper = React.createRef();
  }

  loadUser = (data) => {
    this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      entries: data.entries,
      joined: data.joined
    }})
}

  calculateFaceLocation = (data) => {
    let clarifaiFaces = [];
    const image = document.getElementById('inputimage');
    for (let i = 0; i < data.outputs.length; i++) {
        clarifaiFaces = data.outputs[i].data.regions.map(bounds => bounds.region_info.bounding_box);
    }

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

  displayFaceBox = (box) => {
    this.setState({box: box});
    this.createBoxComponents();
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onImageSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('https://rocky-coast-32021.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then (response => {
        if(response) {
          fetch('https://rocky-coast-32021.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}));
          })
        }
         return this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log('uhoh', err));
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }
  
  createBoxComponents() {
    if(this.state.box.length) {
      this.setState({boxesToRender: this.state.box.map((face, i) => <Box key={i} box={face} />)});
    }
  }

  render() {
    const { isSignedIn, imageUrl, route, boxesToRender } = this.state;

    return (
      <div className='App' ref={this.wrapper}>{this.props.children}
        <Particles params={particlesOptions} className='particles'/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onImageSubmit={this.onImageSubmit} />
                <FaceRecognition imageUrl={imageUrl} box={boxesToRender} />
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