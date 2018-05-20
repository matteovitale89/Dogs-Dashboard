import React, { Component } from 'react';
import ReactDom from 'react-dom';
import Select from './components/Select';
import Image from './components/Image';
import Button from './components/Button';
import Loading from './components/Loading';
import Error from './components/Error';

export default class Breeds extends Component {
    state = {
        breeds: [],
        breedSelected: '',
        breedSelectedUrl: '',
        loading: true,
        error: false
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
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    loading: false,
                    error: true
                });
            });
    }

    startFetch = () => {
        this.setState({
            error: false,
            loading: true
        });
    }

    randomImage = () => {
        this.startFetch();
        fetch(`https://dog.ceo/api/breed/${this.state.breedSelected}/images/random`)
            .then(response => response.json())
            .then(data => {
                let breedSelectedUrl = data.message;
                this.setState({ loading: false, breedSelectedUrl });
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    loading: false,
                    error: true
                });
            });
    };

    handleChange = event => {
        this.startFetch();
        let breed = event.target.value;
        fetch(`https://dog.ceo/api/breed/${event.target.value}/images/random`)
            .then(response => response.json())
            .then(data => {
                let breedSelectedUrl = data.message;
                this.setState({
                    loading: false,
                    breedSelectedUrl,
                    breedSelected: breed
                });
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    loading: false,
                    error: true
                });
            });
    };

    render() {
        return (
            <div className="dashboard">
                <h1>Show random images of dogs selected by breed.</h1>
                <Select 
                    breedSelected={this.state.breedSelected} 
                    onChange={this.handleChange}
                    breeds={this.state.breeds}
                />
                <div className="main-content">
                    {this.state.error && <Error />}
                    {this.state.loading && <Loading />}
                    {!this.state.loading && <Image breedSelectedUrl={this.state.breedSelectedUrl} />}
                </div>
                <Button onClick={this.randomImage} />
            </div>
        );
    }
}

ReactDom.render(<Breeds />, document.getElementById('app'));