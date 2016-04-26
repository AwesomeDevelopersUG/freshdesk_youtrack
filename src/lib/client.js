/**
 * © Awesome Developers UG, 2016
 *
 * You may use this software for your own purposes, as you wish. You may not use it directly for any commercial purpose,
 * that is, you are not allowed to distribute this code in any direct for-profit manner.
 */

import axios from 'axios';
import querystring from 'querystring';

export default class Client {

    constructor(rootUrl, field) {
        this.root = rootUrl;
        this.field = field;
        axios.defaults.withCredentials = true;
        axios.defaults.baseURL = this.root;
    }

    login(user, pass) {
        return axios.post('/rest/user/login', querystring.stringify({
            login: user,
            password: pass
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    getTickets(fdeskId) {
        return axios.get(`/rest/issue?filter=${this.field}: ${fdeskId}`);
    }

    getUrlForIssue(id) {
        return `${this.root}/issue/${id}`;
    }

    getProjects() {
        return axios.get('/rest/project/all');
    }

    getUser() {
        return axios.get('/rest/user/current');
    }

    createTicket(project, summary, description, fdeskId) {
        // Create the issue first
        return axios.put('/rest/issue', querystring.stringify({
            project: project,
            summary: summary,
            description: description
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((result) => {
            let split = result.headers.location.split('/');
            let issueId = split[split.length-1];

            // Apply command to link to freshdesk
            return axios.post(`/rest/issue/${issueId}/execute`, querystring.stringify({
                command: `${this.field} ${fdeskId}`
            }))
        })
    }
}