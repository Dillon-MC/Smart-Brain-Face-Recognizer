export const tryToSubmitImage = (url) => {
    // !!! USE FOR PRODUCTION https://rocky-coast-32021.herokuapp.com/imageurl !!!
    return fetch('http://localhost:3000/imageurl', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
        },
        body: JSON.stringify({
          input: url
        })
      })
      .then(response => response.json())
      .then (response => {
        if(response) {
            if(response === 'unable to work with api') {
                return Promise.reject("Please input a valid image URL");
            }
            return response;
        } else {
            return Promise.reject("Unable to submit image");
        }
      })
      .catch(err => Promise.reject(`${err}`));
}

export const updateUserEntries = (userId) => {
    // !!! USE FOR PRODUCTION https://rocky-coast-32021.herokuapp.com/image !!!
    return fetch('http://localhost:3000/image', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
        },
        body: JSON.stringify({
            id: userId
        })
    })
    .then(response => response.json())
    .then(count => {
        return count;
    }).catch(() => Promise.reject("Unable to update entries (400)"));
}