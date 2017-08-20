import React, { Component } from 'react'
import { ref } from '../config/constants'
import firebase from 'firebase'
import { storageRef } from '../config/constants.js';
import { router } from 'react-router';

export default class detail extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <h1> Detail page for bookmarks.</h1>
        )
    }
}