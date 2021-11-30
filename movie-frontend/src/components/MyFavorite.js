import React, { useState } from 'react';
import {Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress} from "shards-react";
import styled from 'styled-components';
import { Link } from 'react-router-dom';
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
import {RadarChart} from 'react-vis';
import {format} from 'd3-format';
import fav from '../assets/images/fav.png'
import nofav from '../assets/images/nofav.png'

import AuthService from '../services/auth.service';
import {getIdSearch} from '../fetcher'
import UserService from '../services/user.service'


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
        render: (text, row) => <a href={`/myFavorite?id=${row.movie_id}`}>{text}</a>
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


export default class MyFavorite extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            keywordQuery: '',
            typeQuery: '',
            similarTypeQuery: '',
            selectedMovieId: window.location.search ? window.location.search.substring(1).split('=')[1] : null,
            selectedMovieDetails: null,
            movieResults: [],
            similarMovieResults: [],
            isFav: false,
        }
        this.user = AuthService.getCurrentUser();

    }

    componentDidMount() {
        const user = this.user
        if (user) {
            UserService.getUserAllFavoriteMovies(user.userId).then(res => {
                this.setState({ movieResults: res.results })
                if (res.results.length > 0 && !this.state.selectedMovieId) {
                    this.setState({ selectedMovieId: res.results[0].movie_id})
                }
                if (this.state.selectedMovieId) {
                    getIdSearch(this.state.selectedMovieId).then(res => {
                        this.setState({selectedMovieDetails: res.results[0]})
                    })
                    UserService.getIsMovieUserFavorite(this.state.selectedMovieId, user.userId).then(res => {
                        this.setState({isFav: res.result})
                    })
                 }
            })
        }
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
                <div style={{width: '70vw', margin: '0 auto', marginTop: '2vh'}}>
                    <h3>Movies</h3>
                    <Table dataSource={this.state.movieResults} columns={movieColumns}
                           pagination={{pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true}}/>
                </div>

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
                                <h6> Basic Info </h6>
                                </Col>
                                </Row>

                                <Row gutter='30' align='middle' justify='left'>
                                <Col>
                                Status: {this.state.selectedMovieDetails.status}
                                </Col>
                                </Row>

                                <Row gutter='30' align='middle' justify='left'>
                                <Col>
                                Movie Length:   {this.state.selectedMovieDetails.runtime} min
                                </Col>
                                </Row>

                                <Row gutter='30' align='middle' justify='left'>
                                <Col>
                                Status: {this.state.selectedMovieDetails.status}
                                </Col>
                                </Row>

                                <Row>
                                <Col>
                                Release Date: {this.state.selectedMovieDetails.release_date}
                                </Col>
                                </Row>

                                <Row>
                                <Col>
                                Production Companies: {this.state.selectedMovieDetails.production_companies}
                                </Col>
                                </Row>

                                <br>
                                </br>
                                <Row>
                                <Col flex={2} style={{textAlign: 'left'}}>
                                    <h6>Rating</h6>
                                    <Rate disabled defaultValue={this.state.selectedMovieDetails.vote_average / 2}/>
                                </Col>
                                </Row>
                            </Col>

                            <Col style={{ textAlign: 'right' }}>
                                <div>
                                    <img src={this.state.selectedMovieDetails.poster_link} style={{height:'515px', position: 'relative'}}/>
                                    <img onClick={this.toggleFav} src={this.state.isFav ? fav : nofav } style={{position: 'absolute', top:0, right: '15px', width: '50px', cursor: 'pointer'}}></img>
                                </div>
                                
                            </Col>
                        </Row>

                        <Row>
                                <Col>
                                <h6>Overview</h6>
                                {this.state.selectedMovieDetails.overview}
                                </Col>
                        </Row>

                        </CardBody>

                    </Card>

                </div> : null}


            </div>

        )

        
    }
}