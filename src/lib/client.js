import axios from 'axios';
import querystring from 'querystring';

export default class Client {

    constructor(rootUrl) {
        this.root = rootUrl;
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
        return axios.get(`/rest/issue?filter=Freshdesk: ${fdeskId}`);
    }

    getUrlForIssue(id) {
        return `${this.root}/issue/${id}`;
    }
}