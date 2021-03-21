import React from 'react';

const FaceRecognition = ({ imageUrl, faceBoxes}) => {
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='inputimage' alt='img' src={imageUrl} width='500' height='auto'/>
                {faceBoxes.map(box => box)}
            </div>
        </div>
    )
}

export default FaceRecognition;