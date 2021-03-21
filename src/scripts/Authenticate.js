export const tryToAuthenticateUser = (loadUser, onRouteChange) => {
    const token = window.sessionStorage.getItem('token');
    if(token) {
      fetch('http://localhost:3000/signin', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      })
      .then(resp => resp.json())
      .then(data => {
        if(data && data.id) {
          fetch(`http://localhost:3000/profile/${data.id}`, {
            method: 'get',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            }
          })
          .then(resp => resp.json())
          .then(user => {
            if(user && user.email) {
              loadUser(user);
              onRouteChange('home');
            }
          })
        }
      }).catch(console.log);
    }
}