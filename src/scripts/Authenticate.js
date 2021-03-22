export const tryToAuthenticateUser = (loadUser, onRouteChange) => {
    const token = window.sessionStorage.getItem('token');
    if(token) {
      fetch(`${process.env.REACT_APP_API_SERVER_URL}/signin`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      })
      .then(resp => resp.json())
      .then(data => {
        if(data && data.id) {
          fetch(`${process.env.REACT_APP_API_SERVER_URL}/profile/${data.id}`, {
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