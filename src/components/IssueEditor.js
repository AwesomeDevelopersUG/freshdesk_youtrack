'use strict';
import React from 'react';

import Client from 'lib/client';


class IssueEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            busy: true,
            submitting: false,
            user: {fullName: null, login: null},
            project: null,
            summary: null,
            description: null,
            error: null
        }
    }

    componentDidMount() {
        this.props.client.getProjects().then((result) => {
            this.setState({projects: [{shortName: '--none--', name: ' -- None --'}].concat(result.data)});
            return this.props.client.getUser();
        }).then((result) => {
            this.setState({busy: false, user: {fullName: result.data.fullName, login: result.data.login}});
        });
    }

    render() {

        const style = {
            display: this.props.open ? 'block' : 'none'
        };

        const overlayStyle = {
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
        };

        const dialogStyle = {
            position: 'absolute',
            backgroundColor: '#fff',
            width: '800px',
            height: '400px',
            top: '50%',
            left: '50%',
            marginLeft: '-400px',
            marginTop: '-300px',
            padding: '20px'
        };

        return <div style={style}>
            <div style={overlayStyle} onClick={this.props.onRequestClose}>
                <div style={dialogStyle} onClick={(e) => {e.stopPropagation()}}>
                    <div>
                        <img style={{ height: '32px', width: '32px', display: 'inline-block'}} src={require('url?mimetype=image/png!img/yt.png')} />
                        <h3 style={{ lineHeight: '32px', display: 'inline-block', margin: '0 0 0 10px', verticalAlign: 'top'}}>Create a New YouTrack Issue</h3>
                    </div>
                    {this.state.busy ?
                        <h4>Loading...</h4>
                        :
                        <form onSubmit={this.onSubmitTicket.bind(this)}>
                            {this.state.error && <p style={{textAlign: 'center', color: '#b71c1c'}}>{this.state.error}</p>}
                            <div>
                                User: <strong>{this.state.user.fullName} ({this.state.user.login})</strong>
                            </div>

                            <div>
                                Link to Freshdesk issue: <strong>#{this.props.ticketId}</strong>
                            </div>
                            
                            <label for="project">Project</label>
                            <select name="project" onChange={(e) => {this.setState({project: e.target.value})}}>
                                {this.state.projects.map((el, idx) => (
                                    <option key={idx} value={el.shortName}>{el.name}</option>
                                ))}

                            </select>

                            <br />
                            <label for="summary">Summary</label>
                            <input type="text" name="summary" onChange={(e) => {this.setState({summary: e.target.value})}}/>

                            <br />
                            <label for="description">Description</label>
                            <textarea rows="10" type="text" name="description" onChange={(e) => {this.setState({description: e.target.value})}}></textarea>

                            <br />
                            <input className="button primary"
                                   type="submit"
                                   value={this.state.submitting ? "Submitting..." : "Submit New Ticket"}
                                   disabled={this.state.submitting}
                            />
                        </form>
                    }
                </div>
            </div>
        </div>
    }

    onSubmitTicket(event) {
        event.preventDefault();

        if (this.state.project == null || this.state.summary == null) {
            this.setState({error: "You must select a project and fill-in a summary"});
            return;
        }

        this.setState({submitting: true});

        this.props.client.createTicket(this.state.project, this.state.summary, this.state.description, this.props.ticketId).then((result) => {
            this.props.onSuccess();
        }).catch((err) => {
            this.setState({error: `Cannot Submit Ticket: ${err.data.value}`, submitting: false})
        });
        console.info(this.state.project);
    }
}


IssueEditor.defaultProps = {
    open: false
};

export default IssueEditor;