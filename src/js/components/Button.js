import React from 'react';

const Button = props => {
    return (
        <div className="button-wrapper">
            <button className="button" onClick={props.onClick}>Show an other of this breeds</button>
        </div>
    )
}

export default Button;