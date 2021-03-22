export const signOut = (onRouteChange) => {
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/signout`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
        }
    })
    .then((response) => {
        if(response.statusText === 'OK') {
            window.sessionStorage.removeItem('token');
            onRouteChange('signout');
        }
    })
    .catch(err => console.log(err));
}