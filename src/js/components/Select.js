import React from 'react';

const Select = props => {
    const breedsList = (
        props.breeds.map((dog, i) => (
            <option className="option" key={i}>
                {dog}
            </option>
        ))
    );
    return ( 
        <div>
            <label className="select-label">Select breed</label>
            <div className="select-wrapper">
                <select className="select" value={props.breedSelected} onChange={props.onChange}>
                    {breedsList}
                </select>
            </div>
        </div>
    )
}

export default Select;