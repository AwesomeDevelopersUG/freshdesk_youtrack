'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import Overview from 'components/Overview';


let root = document.getElementById('youtrack-widget-container');

ReactDOM.render(
    <Overview rootUrl={root.dataset.ytUrl} ticketId={root.dataset.fdeskTicket} fdeskField={root.dataset.fdeskField}/>,
    document.getElementById('youtrack-widget-container')
);