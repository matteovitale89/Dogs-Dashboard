import React, { Component } from 'react';
import ReactDom from 'react-dom';

export default class Breeds extends Component {
    state = {
        breeds: [],
        breedSelected: '',
        breedSelectedUrl: '',
        loading: true
    };

    componentDidMount() {
        fetch('https://dog.ceo/api/breeds/list/all')
            .then(response => response.json())
            .then(data => {
                let breeds = [];
                let dogs = Object.keys(data.message);
                for (let dog in data.message) {
                    if (data.message[dog].length < 1) {
                        breeds.push(dog);
                    }
                    if (data.message[dog].length >= 1) {
                        breeds.push(dog);
                        for (
                            let i = 0;
                            i < data.message[dog].length >= 1;
                            i++
                        ) {
                            breeds.push(dog + '-' + data.message[dog][i]);
                        }
                    }
                }
                this.setState({
                    breedSelected: breeds[0],
                    breeds
                });
                this.randomImage();
            });
    }

    randomImage = () => {
        this.setState({ loading: true });
        fetch(
            `https://dog.ceo/api/breed/${
                this.state.breedSelected
            }/images/random`
        )
            .then(response => response.json())
            .then(data => {
                let breedSelectedUrl = data.message;
                this.setState({
                    loading: false,
                    breedSelectedUrl
                });
            });
    };

    handleChange = event => {
        let breed = event.target.value;
        this.setState({ loading: true });
        fetch(`https://dog.ceo/api/breed/${event.target.value}/images/random`)
            .then(response => response.json())
            .then(data => {
                let breedSelectedUrl = data.message;
                this.setState({
                    loading: false,
                    breedSelectedUrl,
                    breedSelected: breed
                });
            });
    };

    render() {
        const breedsList = this.state.breeds.map((dog, i) => (
            <option className="option" key={i}>{dog}</option>
        ));

        return (
            <div className="dashboard">
                <h1>Show random images of dogs selected by breed.</h1>
                <label className="select-label">Select breed</label>
                <div className="select-wrapper">
                    <select
                        className="select"
                        value={this.state.breedSelected}
                        onChange={this.handleChange}
                    >
                        {breedsList}
                    </select>
                </div>
                <div className="main-content">
                    {this.state.loading && <div className="loading">loading...</div>}
                    {!this.state.loading && (
                        <div className="image-wrapper">
                            <img className="image" src={this.state.breedSelectedUrl} />
                        </div>
                    )}
                </div>
                <div className="button-wrapper">
                    <button className="button" onClick={this.randomImage}>More of this breed</button>
                </div>
            </div>
        );
    }
}

ReactDom.render(<Breeds />, document.getElementById('app'));