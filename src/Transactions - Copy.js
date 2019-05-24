import React, { Component } from 'react';
import { Table, Button, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Transactions.css';

  class Transactions extends Component{
    constructor(props, context){
      super(props, context);
      this.state={
        GenJournal:true, TBalance:false, TrialBalance:false,
        showPopup: false, err: '', chkbox:false,
        rows:[], date:'', d_desc:'', d_amount:'', d_type:'', c_desc:'', c_amount:'', c_type:'',
        debit:[], credit:[]
      };
    }
    handleClose=()=> {
      this.setState({ showPopup: false });
    }
    handleShow=()=> {
      this.setState({ showPopup: true });
    }
    toggleCheckox=()=> {
      this.setState({ chkbox: !this.state.chkbox });
    }

    displayGenJournal=() => {
      this.setState({
        GenJournal:true,
        TBalance:false,
        TrialBalance:false
      });
    };
    displayTBalance=() => {
      this.setState({
        GenJournal:false,
        TBalance:true,
        TrialBalance:false
      });
    };
    displayTrialBalance=() => {
      this.setState({
        GenJournal:false,
        TBalance:false,
        TrialBalance:true
      });
    };

    change = e => {
      this.setState({
        [e.target.name]: e.target.value
      });
    };
    add = states => {
      let row = this.state.rows;
      if(states.chkbox==true) states.date='Adj';
      if(states.date=='' || states.d_desc=='' || states.d_amount=='' || states.d_type=='' || states.c_desc=='' || states.c_amount=='' || states.c_type=='')
      {
        this.setState({
          err : 'empty field!'
        });
      }
      else if(states.c_amount!=states.d_amount)
      {
        this.setState({
          err : 'inequal credit and debit amount!'
        });
      }
      else{
        row.push([states.date, states.d_desc, states.d_amount, states.d_type, states.c_desc, states.c_amount,  states.c_type]);
        this.setState({
          rows : row,
          date : '',
          d_desc : '',
          d_amount : '',
          d_type : '',
          c_desc : '',
          c_amount : '',
          c_type : '',
          err : '',
          chkbox: false
        });
      }
    };
    delete = (index, rows) => {
      let row = rows;
      row.splice(index,1);
      rows=row;
    };

    addDC = (states, rows) => {
      
    };

    render(){
      return(
      <div className="transactions">
      {
        // ------------------------------------top menu--------------------------------------------------------
      }
        <div className="topmenu">
          <a onClick={()=> this.displayGenJournal()}>General Journal</a>
          <a onClick={()=> this.displayTBalance()}>T-Balance</a>
          <a onClick={()=> this.displayTrialBalance()}>Trial Balance</a>
        </div>

{
 //-----------------------------------------------------------------------------------------------------------
 //--------------------------------General Journal------------------------------------------------------------
 //-----------------------------------------------------------------------------------------------------------
}
{
  //------------------------------------------show table-------------------------------------------------
}
        {
          this.state.GenJournal &&
          <div id="GJ">
            <Button id="addBtn" onClick={this.handleShow}>Add</Button><br/>
            <Table bordered size="sm">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>General Journal</th>
                  <th>Amount</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.rows.map((item, i) => (
                  <tr key={i}>
                    <td>{this.state.rows[i][0]}</td>
                    <td>{this.state.rows[i][1]}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.rows[i][4]}</td>
                    <td>{this.state.rows[i][2]}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.rows[i][5]}</td>
                    <td><a href="#" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) this.delete(i, this.state.rows) } }>Delete</a></td>
                  </tr>
                  ))
                }
              </tbody>
            </Table>

{
  //----------------------------------------add button popup--------------------------------------------------
}
            <Modal size="lg" show={this.state.showPopup} onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Add Transaction</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Table bordered size="sm" style={{textAlign:"center"}}>
                  <thead  style={{color:"white", backgroundColor:"steelblue"}}>
                    <tr>
                      <th style={{backgroundColor:"white"}}></th>
                      <th>General Journal</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {
                        this.state.debit.map((item, i) => (
                        <tr key={i}>
                          <td>Debit</td>
                          <td>{this.state.debit[i][0]}</td>
                          <td>{this.state.debit[i][1]}</td>
                          <td>{this.state.debit[i][2]}</td>
                          <td><a href="#" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) this.delete(i, this.state.debit) } }>Delete</a></td>
                        </tr>
                        ))
                      }
                      <td style={{color:"white", backgroundColor:"steelblue"}}>Debit</td>
                      <td><input type="text" name="d_desc" value={this.state.d_desc} onChange={e => this.change(e)}/></td>
                      <td><input type="number" name="d_amount" value={this.state.d_amount} onChange={e => this.change(e)}/></td>
                      <select name="d_type" value={this.state.d_type} onChange={e => this.change(e)}>
                        <option>Select</option>
                        <option>Asset</option>
                        <option>Liability</option>
                        <option>Revenue</option>
                        <option>Expanse</option>
                        <option>Owner Capital</option>
                      </select>
                      <td><FontAwesomeIcon style={{color:"blue"}} onClick={this.addDC(this.state, this.state.debit)} icon="plus" /></td>
                    </tr>
                    <tr>
                      {
                        this.state.credit.map((item, i) => (
                        <tr key={i}>
                          <td>Credit</td>
                          <td>{this.state.credit[i][0]}</td>
                          <td>{this.state.credit[i][1]}</td>
                          <td>{this.state.credit[i][2]}</td>
                          <td><a href="#" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) this.delete(i, this.state.debit) } }>Delete</a></td>
                        </tr>
                        ))
                      }
                      <td style={{color:"white", backgroundColor:"steelblue"}}>Credit</td>
                      <td><input type="text" name="c_desc" value={this.state.c_desc} onChange={e => this.change(e)}/></td>
                      <td><input type="number" name="c_amount" value={this.state.c_amount} onChange={e => this.change(e)}/></td>
                      <select name="c_type" value={this.state.c_type} onChange={e => this.change(e)}>
                        <option>Select</option>
                        <option>Asset</option>
                        <option>Liability</option>
                        <option>Revenue</option>
                        <option>Expanse</option>
                        <option>Owner Capital</option>
                      </select>
                      <td><FontAwesomeIcon style={{color:"blue"}} onClick={this.addDC(this.state, this.state.credit)} icon="plus" /></td>
                    </tr>
                  </tbody>
                </Table>
                <label>Date:</label> &nbsp;
                <input type="date" name="date" value={this.state.date} onChange={e => this.change(e)}/>
                <span style={{color:"red"}}>{this.state.err}</span>
                <input style={{float:"right", margin:"7px 25px 0 0"}} type="checkbox" checked={this.state.chkbox} onChange={this.toggleCheckox} id="adj" />
                <label style={{float:"right", marginRight:"5px"}} for="adj">Adjustment</label>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                <Button variant="primary" onClick={()=> this.add(this.state)}>Add</Button>
              </Modal.Footer>
            </Modal>
          </div>
        }

{
 //-----------------------------------------------------------------------------------------------------------
 //--------------------------------T-Balance-----------------------------------------------------------------
 //-----------------------------------------------------------------------------------------------------------
}

        {
          this.state.TBalance &&
          <div id="tBalance">

          <Table bordered size="sm">
            <thead>
              <tr>
                <th>Trial Balance</th>
                <th>Debit</th>
                <th>Credit</th>
              </tr>
            </thead>
            <tbody>
              {
                // let trans_names=[];
                // this.state.rows.map((item, i) => (
                // <tr key={i}>
                //   <td>{this.state.rows[i][0]}</td>
                // </tr>
                // ))
              }
            </tbody>
          </Table>

          </div>
        }

{
 //-----------------------------------------------------------------------------------------------------------
 //--------------------------------Trial Balance--------------------------------------------------------------
 //-----------------------------------------------------------------------------------------------------------
}

        {
          this.state.TrialBalance &&
          <div id="trialBalance">
            TrialBalance
          </div>
        }
      </div>
    );
  }
}

export default Transactions;
