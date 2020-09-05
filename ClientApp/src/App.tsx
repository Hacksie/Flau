import * as React from 'react';
import { Route, Redirect } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Counter from './components/Counter';
import FetchData from './components/FetchData';

import './custom.css'

export default () => (
    <Layout>
        
        <Route path='/counter' component={Counter} />
        <Route path='/:startDateIndex?' component={FetchData} />
        
    </Layout>
);
