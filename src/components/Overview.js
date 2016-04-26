'use strict';
import React from 'react';

import Client from 'lib/client';
import IssueEditor from './IssueEditor';

class IssueList extends React.Component {

    render() {

        if (this.props.issues.length == 0) {
            return <div>
                <p style={{ textAlign: 'center', fontStyle: 'italic', 'color': '#ababab'}}>No Linked Issues</p>
            </div>
        }

        return <ul style={{ paddingLeft: 0, listStyleType: 'none' }}>
            {this.props.issues.map((el, idx) => (
                <li key={idx}>
                    <a target='_blank' href={this.props.client.getUrlForIssue(el.id)}>{el.id}: {el.summary}</a>
                    <span style={{ float: 'right'}}>{el.spent !== null ? el.spent : '0m'}</span>
                </li>
            ))}
        </ul>
    }
}


class CreateIssueButton extends React.Component {

    render() {
        return <button
            style={this.props.style}
            className="button primary"
            onClick={this.props.onCreateIssue}>Create New Issue
        </button>
    }
}


class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state =  {
            name: null,
            pass: null,
            fail: false
        }
    }

    render() {
        return <form onSubmit={this.onSubmit.bind(this)}>
            <h4>Login</h4>
            {this.state.fail && <p style={{color: '#b71c1c'}}>Invalid Credentials</p>}
            <label for="login">User:</label><input type="text" name="login" onChange={(e) => {this.setState({name: e.target.value})}}/><br />
            <label for="password">Password:</label><input type="password" name="password" onChange={(e) => {this.setState({pass: e.target.value})}}/><br />
            <input className="button primary" type="submit" value="Login"/>
        </form>
    }

    onSubmit(event) {
        event.preventDefault();

        this.props.client.login(this.state.name, this.state.pass).then((result) => {
            console.info(result);
            this.setState({fail: false, name: null, pass: null});
            this.props.onLoggedIn();
        }).catch((err) => {
            this.setState({fail: true});
            console.warn(err);
        })
    }
}

export default class IssueOverview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            loggedIn: false,
            issues: [],
            client: new Client(this.props.rootUrl, this.props.fdeskField)
        }
    }

    _findField(raw, name, get='value') {
        let val = null;
        raw.field.map((el) => {
            if (el.name == name) {
                val = el[get];
                return false;
            }
        });
        return val;
    }

    _parseIssues(raw) {
        let data = [];

        raw.map((el) => {
            data.push({
                id: el.id,
                summary: this._findField(el, 'summary'),
                spent: this._findField(el, 'Spent time', 'valueId') && this._findField(el, 'Spent time', 'valueId')[0]
            })
        });
        return data;
    }

    componentDidMount() {

        this.state.client.getTickets(this.props.ticketId).then((result) => {
            this.setState({
                loading: false,
                loggedIn: true,
                editOpen: false,
                issues: this._parseIssues(result.data.issue)
            });
        }).catch((err) => {
            let newState = {
                loading: false,
                error: null,
                loggedIn: true
            };
            if (err.status == 401) {
                // user needs to login
                newState.loggedIn = false
            } else {
                try {
                    newState.error = err.data.value
                } catch(next) {
                    console.warn(err);
                }
            }

            this.setState(newState);
        });
    }

    render() {
        return <div style={{ fontFamily: 'sans-serif'}}>
            <div style={{ marginBottom: '10px' }}>
                <img style={{ height: '32px', width: '32px', display: 'inline-block'}} src={require('url?mimetype=image/png!img/yt.png')} />
                <h3 style={{ lineHeight: '32px', display: 'inline-block', margin: '0 0 0 10px', verticalAlign: 'top'}}>YouTrack</h3>
            </div>
            {this.state.loading ?
                <div>
                    <p>Loading...</p>
                </div>
                :

                this.state.loggedIn ?
                    <div>
                        <IssueList issues={this.state.issues} client={this.state.client}/>
                        <CreateIssueButton style={{ marginTop: '10px'}} onCreateIssue={() => {this.setState({editOpen: true})}} />
                        <IssueEditor
                            open={this.state.editOpen}
                            client={this.state.client}
                            ticketId={this.props.ticketId}
                            onRequestClose={() => {this.setState({editOpen: false})}}
                            onSuccess={this.onTicketSubmitSuccess.bind(this)}/>
                    </div>
                :
                    <LoginForm client={this.state.client} onLoggedIn={this.onLoggedIn.bind(this)}/>
            }
        </div>

    }

    onLoggedIn() {
        this.setState({
            loggedIn: true,
            loading: true
        });
        this.state.client.getTickets(this.props.ticketId).then((result) => {
            this.setState({
                loading: false,
                issues: this._parseIssues(result.data.issue)
            });
        })
    }

    onTicketSubmitSuccess() {
        this.setState({
            editOpen: false,
            loading: true
        });

        this.state.client.getTickets(this.props.ticketId).then((result) => {
            this.setState({
                loading: false,
                issues: this._parseIssues(result.data.issue)
            });
        })
    }
}
