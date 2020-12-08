import React from 'react';

const FaceRecognition = ({ imageUrl, box}) => {
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='inputimage' alt='img' src={imageUrl} width='500' height='auto'/>
                {box.map(b => b)}
            </div>
        </div>
    )
}

export default FaceRecognition;