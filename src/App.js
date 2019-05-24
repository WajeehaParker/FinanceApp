import React from 'react';
import './App.css';
import Transactions from './Transactions'
import {BrowserRouter as Router} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Route from 'react-router-dom/Route';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCopy, faStore, faCashRegister, faChartBar, faMoneyCheckAlt, faPlus  } from '@fortawesome/free-solid-svg-icons';
library.add(faHome, faCopy, faStore, faCashRegister, faChartBar, faMoneyCheckAlt, faPlus );


function App() {
  return (
    <Router>
      <div className="App">
        <div id="navbar">
          {
            window.innerWidth>600 && <div className="navbar-max nav">
              <a href="/"><FontAwesomeIcon className="icon" icon="home" />Home</a><br/>
              <a href="/transactions"><FontAwesomeIcon className="icon" icon="copy" />&nbsp;Transactions</a><br/>
              <a href="/assets"><FontAwesomeIcon className="icon" icon="money-check-alt" />Assets</a><br/>
              <a href="/reports"><FontAwesomeIcon className="icon" icon="chart-bar" />&nbsp;Reports</a><br/>
              <a href="/inventory"><FontAwesomeIcon className="icon" icon="store" />Inventory</a><br/>
              <a href="/sell"><FontAwesomeIcon className="icon" icon="cash-register" />&nbsp;Shop</a>
              <div style={{padding:"100px"}}></div>
            </div>
          }
          {
            window.innerWidth<600 && <div className="navbar-min nav">
              <a href="/"><FontAwesomeIcon className="icon" icon="home" /></a><br/>
              <a href="/transactions"><FontAwesomeIcon className="icon" icon="copy" /></a><br/>
              <a href="/assets"><FontAwesomeIcon className="icon" icon="money-check-alt" /></a><br/>
              <a href="/reports"><FontAwesomeIcon className="icon" icon="chart-bar" /></a><br/>
              <a href="/inventory"><FontAwesomeIcon className="icon" icon="store" /></a><br/>
              <a href="/sell"><FontAwesomeIcon className="icon" icon="cash-register" /></a>
              <div style={{padding:"100px"}}></div>
            </div>
          }
        </div>
        <Route path="/" exact strict render={()=>{return(<h1>Home</h1>)}} />
        <Route path="/transactions" exact strict component={Transactions} />

      </div>
    </Router>
  );
}

export default App;
