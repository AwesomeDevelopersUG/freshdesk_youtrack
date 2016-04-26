/**
 * © Awesome Developers UG, 2016
 *
 * You may use this software for your own purposes, as you wish. You may not use it directly for any commercial purpose,
 * that is, you are not allowed to distribute this code in any direct for-profit manner.
 */

'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import Overview from 'components/Overview';


let root = document.getElementById('youtrack-widget-container');

ReactDOM.render(
    <Overview rootUrl={root.dataset.ytUrl} ticketId={root.dataset.fdeskTicket} fdeskField={root.dataset.fdeskField}/>,
    document.getElementById('youtrack-widget-container')
);