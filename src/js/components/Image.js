import React from 'react';

const Image = props => {
    return (
        <div className="image-wrapper">
            <img className="image" src={props.breedSelectedUrl} />
        </div>
    )
}

export default Image;