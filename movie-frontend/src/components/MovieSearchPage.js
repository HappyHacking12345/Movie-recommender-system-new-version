import React, { useState } from 'react';
import {Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress} from "shards-react";
import AuthService from "../services/auth.service";
import styled from 'styled-components';
import {
    Table,
    Pagination,
    Select,
    Row,
    Col,
    Divider,
    Slider,
    Rate
} from 'antd'
import {format} from 'd3-format';
import fav from '../assets/images/fav.png'
import nofav from '../assets/images/nofav.png'
import UserService from '../services/user.service'
import {getKeywordSearch, getSimilarTypeSearch, getTypeSearch, getIdSearch} from '../fetcher'
const wideFormat = format('.3r');

const ButtonToggle = styled(Button)`
  opacity: 0.6;
  ${({ active }) =>
    active &&
    `
    opacity: 1;
  `}
`;

const ButtonGroup = styled.div`
  display: flex;
`;



const movieColumns = [
    {
        title: 'Name',
        dataIndex: 'title',
        key: 'title',
        sorter: (a, b) => a.title.localeCompare(b.title),
        render: (text, row) => <a href={`/movieSearchPage?id=${row.movie_id}`}>{text}</a>
    },
    {
        title: 'Release date',
        dataIndex: 'release_date',
        key: 'release_date',
        sorter: (a, b) => a.release_date.localeCompare(b.release_date)
    },
    {
        title: 'Movie Length (min)',
        dataIndex: 'runtime',
        key: 'runtime',
        sorter: (a, b) => a.runtime - b.runtime
    },


    {
        title: 'Rating',
        dataIndex: 'vote_average',
        key: 'vote_average',
        sorter: (a, b) => a.vote_average - b.vote_average
    },

    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
    }

];


class MovieSearchPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            addButtonText: 'Add to Favorite',
            keywordQuery: '',
            typeQuery: '',
            similarTypeQuery: '',
            selectedMovieId: window.location.search ? window.location.search.substring(1).split('=')[1] : 97593,
            selectedMovieDetails: null,
            movieResults: [],
            similarMovieResults1: [],
            similarMovieResults2: [],
            similarMovieResults3: [],
            similarMovieResults4: [],
            similarMovieResults5: [],
            similarMovieResults6: [],
            isFav: false
        }
        this.updateKeywordSearchResults = this.updateKeywordSearchResults.bind(this)
        this.handleKeywordQueryChange = this.handleKeywordQueryChange.bind(this)
        this.handleTypeQueryChange = this.handleTypeQueryChange.bind(this)
        this.handleSimilarTypeQueryChange = this.handleSimilarTypeQueryChange.bind(this)
        this.getHistoryMovies = this.getHistoryMovies.bind(this)
        this.getActionMovies = this.getActionMovies.bind(this)
        this.getFamilyMovies = this.getFamilyMovies.bind(this)
        this.getComedyMovies = this.getComedyMovies.bind(this)
        this.getCrimeMovies = this.getCrimeMovies.bind(this)
        this.getScienceMovies = this.getScienceMovies.bind(this)
        this.getThrillerMovies = this.getThrillerMovies.bind(this)
        this.getWesternMovies = this.getWesternMovies.bind(this)
        this.getDocumentaryMovies = this.getDocumentaryMovies.bind(this)
        this.getMusicMovies = this.getMusicMovies.bind(this)
        this.user = AuthService.getCurrentUser();

    }

    updateTypeSearchResults(type) {
        getTypeSearch(type.name).then(res => {
            this.setState({movieResults: res['results']})
        })
    }


    handleKeywordQueryChange(event) {
        this.setState({keywordQuery: event.target.value})
    }

    handleTypeQueryChange(event) {
        this.setState({typeQuery: event.target.value})
    }

    updateKeywordSearchResults() {
        getKeywordSearch(this.state.keywordQuery).then(res => {
            this.setState({movieResults: res['results']})
        })
    }

    getActionMovies() {
        this.updateTypeSearchResults({'name': 'Action'})
    }

    getComedyMovies() {
        this.updateTypeSearchResults({'name': 'Comedy'})
    }

    getHistoryMovies() {
        this.updateTypeSearchResults({'name': 'History'})
    }

    getThrillerMovies() {
        this.updateTypeSearchResults({'name': 'Thriller'})
    }

    getCrimeMovies() {
        this.updateTypeSearchResults({'name': 'Crime'})
    }


    getWesternMovies() {
        this.updateTypeSearchResults({'name': 'Western'})
    }

    getDocumentaryMovies() {
        this.updateTypeSearchResults({'name': 'Documentary'})
    }

    getScienceMovies() {
        this.updateTypeSearchResults({'name': 'Science Fiction'})
    }

    getMusicMovies() {
        this.updateTypeSearchResults({'name': 'Music'})
    }

    getFamilyMovies() {
        this.updateTypeSearchResults({'name':'Family'})
    }




    handleSimilarTypeQueryChange() {
        getSimilarTypeSearch(this.state.keywordQuery).then(res => {
            this.setState({
                similarMovieResults1: res.results[0],
                similarMovieResults2: res.results[1],
                similarMovieResults3: res.results[2],
                similarMovieResults4: res.results[3],
                similarMovieResults5: res.results[4],
                similarMovieResults6: res.results[5]
                })
        })
    }


    componentDidMount() {
        getKeywordSearch(this.state.keywordQuery).then(res => {
            this.setState({ movieResults: res.results })
        })

        getIdSearch(this.state.selectedMovieId).then(res => {
            this.setState({selectedMovieDetails: res.results[0]})
        })

        getSimilarTypeSearch(this.state.selectedMovieId).then(res => {
            this.setState({
                        similarMovieResults1: res.results[0],
                        similarMovieResults2: res.results[1],
                        similarMovieResults3: res.results[2],
                        similarMovieResults4: res.results[3],
                        similarMovieResults5: res.results[4],
                        similarMovieResults6: res.results[5]
                        })
        })
    }

    toggleFav = () => {
        const user = this.user
        if (user) {
            UserService.setFavorite(this.state.selectedMovieId, user.userId, !this.state.isFav).then(res => {
                this.setState({isFav: res.result})
            })
        }
    }


    render() {
        return (
            <div>
                <Form style={{width: '80vw', margin: '0 auto', marginTop: '5vh'}}>
                    <Row>
                        <Col flex={2}><FormGroup style={{width: '55vw', margin: '0 auto'}}>
                            <FormInput placeholder="Type a keyword to search" value={this.state.keywordQuery}
                                       onChange={this.handleKeywordQueryChange}/>
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{width: '10vw'}}>
                            <Button style={{marginTop: '0vh'}} onClick={this.updateKeywordSearchResults}>Search</Button>
                        </FormGroup></Col>
                    </Row>
                    <br>
                    </br>
                </Form>

                {
                    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                        Search By Type
                    </div>
                }

                {
                    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                        <ButtonGroup>
                            <Button  onClick={this.getActionMovies} theme="secondary" outline theme="success" style={{ margin: "auto" }}> Action </Button>
                            <Button onClick={this.getComedyMovies} theme="secondary" outline theme="success"> Comedy </Button>
                            <Button onClick={this.getHistoryMovies} theme="secondary" outline theme="success"> History </Button>
                            <Button onClick={this.getThrillerMovies} theme="secondary" outline theme="success"> Thriller </Button>
                        </ButtonGroup>
                    </div>
                }

                {<div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                    <ButtonGroup>
                        <Button onClick={this.getCrimeMovies} theme="secondary" outline theme="success"> Crime </Button>
                        <Button onClick={this.getWesternMovies} theme="secondary" outline theme="success"> Western </Button>
                        <Button onClick={this.getDocumentaryMovies} theme="secondary" outline theme="success"> Documentary </Button>
                        <Button onClick={this.getScienceMovies} theme="secondary" outline theme="success"> Science </Button>
                        <Button onClick={this.getFamilyMovies} theme="secondary" outline theme="success"> Family </Button>
                        <Button onClick={this.getMusicMovies} theme="secondary" outline theme="success"> Music </Button>
                    </ButtonGroup>
                </div>
                }


                <Divider/>
                <div style={{width: '70vw', margin: '0 auto', marginTop: '2vh'}}>
                    <h3>Movies</h3>
                    <Table dataSource={this.state.movieResults} columns={movieColumns}
                           pagination={{pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true}}/>
                </div>
                <Divider/>

                {this.state.selectedMovieDetails ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <Card>

                        <CardBody>

                            <Row gutter='30' align='middle' justify='center'>
                                <Col flex={2} style={{ textAlign: 'left' }}>
                                    <Row gutter='30' align='middle' justify='left'>
                                        <Col flex={2} style={{textAlign: 'left'}}>
                                            <h3>{this.state.selectedMovieDetails.title}</h3>

                                        </Col>
                                    </Row>
                                    <Row gutter='30' align='middle' justify='left'>
                                        <Col>
                                            <h5> Basic Info </h5>
                                        </Col>
                                    </Row>

                                    <Row gutter='30' align='middle' justify='left'>
                                        <Col>
                                            <b>Status</b>: {this.state.selectedMovieDetails.status}
                                        </Col>
                                    </Row>

                                    <Row gutter='30' align='middle' justify='left'>
                                        <Col>
                                            <b>Movie Length</b>:   {this.state.selectedMovieDetails.runtime} min
                                        </Col>
                                    </Row>

                                    <Row gutter='30' align='middle' justify='left'>
                                        <Col>
                                            <b>Status</b>: {this.state.selectedMovieDetails.status}
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col>
                                            <b>Release Date</b>: {this.state.selectedMovieDetails.release_date}
                                        </Col>
                                    </Row>

                                    <Row>
                                        <b>Production Companies</b>: 
                                    </Row>

                                    <Row>
                                    <Col  style={{overflow: 'wrap', width: 400}}>
                                    {this.state.selectedMovieDetails.production_companies_name}
                                    </Col>
                                    </Row>

                                    <br>
                                    </br>
                                    <Row>
                                        <Col flex={2} style={{textAlign: 'left'}}>
                                            <h5>Rating</h5>
                                            <Rate disabled defaultValue={this.state.selectedMovieDetails.vote_average / 2}/>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col flex={2} style={{ textAlign: 'right' }}>
                                    <div>
                                    <img src={this.state.selectedMovieDetails.poster_link} style={{height:'45vh', width: '35vh'}}/>
                                    <img onClick={this.toggleFav} src={this.state.isFav ? fav : nofav } style={{position: 'absolute', top:0, right: '15px', width: '50px', cursor: 'pointer'}}></img>
                                    </div>
                                </Col>
                            </Row>
                            <br>
                            </br>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col flex={2} style={{ textAlign: 'left' }}>
                                    <Row gutter='30' align='middle' justify='left'>
                                        <Col flex={2} style={{textAlign: 'left'}}>
                                        <h5>Overview</h5>
                                        <text>{this.state.selectedMovieDetails.overview}</text>
                                        </Col>
                                    </Row>
                                    <br>
                                    </br>
                                    <Row gutter='30' align='middle' justify='left'>
                                        <Col flex={2} style={{textAlign: 'left'}}>
                                        <h5>Similar Movies</h5>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>


                            <Row>
                                 <div class="col-md-2">
                                 
                                    <a href={`/movieSearchPage?id=${this.state.similarMovieResults1.movie_id}`}>
                                    <img src={this.state.similarMovieResults1.poster_link} style={{height:'20vh', width: '15vh'}}/> 
                                    <figcaption>{this.state.similarMovieResults1.title} </figcaption>
                                    </a>
                                </div> 

                                <div class="col-md-2 col-md-offset-1">
                                    <a href={`/movieSearchPage?id=${this.state.similarMovieResults2.movie_id}`}>
                                    <img src={this.state.similarMovieResults2.poster_link} style={{height:'20vh', width: '15vh'}}/> 
                                    <figcaption>{this.state.similarMovieResults2.title} </figcaption>
                                    </a>
                                </div>

                                <div class="col-md-2 col-md-offset-1">
                                    <a href={`/movieSearchPage?id=${this.state.similarMovieResults3.movie_id}`}>
                                    <img src={this.state.similarMovieResults3.poster_link} style={{height:'20vh', width: '15vh'}}/> 
                                    <figcaption>{this.state.similarMovieResults3.title} </figcaption>
                                    </a>
                                </div>

                                <div class="col-md-2 col-md-offset-1">
                                    <a href={`/movieSearchPage?id=${this.state.similarMovieResults4.movie_id}`}>
                                    <img src={this.state.similarMovieResults4.poster_link} style={{height:'20vh', width: '15vh'}}/> 
                                    <figcaption>{this.state.similarMovieResults4.title} </figcaption>
                                    </a>
                                </div>

                                <div class="col-md-2 col-md-offset-1">
                                    <a href={`/movieSearchPage?id=${this.state.similarMovieResults5.movie_id}`}>
                                    <img src={this.state.similarMovieResults5.poster_link} style={{height:'20vh', width: '15vh'}}/> 
                                    <figcaption>{this.state.similarMovieResults5.title} </figcaption>
                                    </a>
                                </div>

                                <div class="col-md-2 col-md-offset-1">
                                    <a href={`/movieSearchPage?id=${this.state.similarMovieResults6.movie_id}`}>
                                    <img src={this.state.similarMovieResults6.poster_link} style={{height:'20vh', width: '15vh'}}/> 
                                    <figcaption>{this.state.similarMovieResults6.title} </figcaption>
                                    </a>
                                </div>
                            </Row>

                        </CardBody>

                    </Card>

                </div> : null}


            </div>

        )


    }
}

export default MovieSearchPage