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
        date:'', d_desc:'', d_amount:0, d_type:'', c_desc:'', c_amount:0, c_type:'',
        rows:[], grouped_rows:[], debit:[], credit:[],
        tBalCol1:[], tBalCol2:[], trialBalance:[]
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
      let creditAmount=0, debitAmount=0;
      for(let i=0; i<states.debit.length; i++){
        debitAmount+=parseInt(states.debit[i][1]);
      }
      for(let i=0; i<states.credit.length; i++){
        creditAmount+=parseInt(states.credit[i][1]);
      }
      if(states.date=='' || states.debit.length==0 || states.credit.length==0){
        this.setState({
          err : 'empty field!'
        });
      }
      else if(debitAmount!=creditAmount){
        this.setState({
          err : 'inequal debit and credit amount!'
        });
      }
      else{
        row.push([states.date, states.debit, states.credit]);
        this.setState({
          rows : row,
          date : '',
          debit : [],
          credit : [],
          err : '',
          chkbox: false
        });
      }
    };

    //rows: array from which element is to be deleted
    delete = (index, rows) => {
      rows.splice(index,1);
    };

    //works inside 'add' popup
    addDebit = () => {
      if(this.state.d_desc=='' || this.state.d_amount==0 || this.state.d_type==''){
        this.setState({
          err : 'empty field!'
        });
      }
      else{
        this.state.debit.push([this.state.d_desc, this.state.d_amount, this.state.d_type]);
        this.setState({
          d_desc : '',
          d_amount : 0,
          d_type : '',
          err : ''
        });
      }
    };

    addCredit = () => {
      if(this.state.c_desc=='' || this.state.c_amount==0 || this.state.c_type==''){
        this.setState({
          err : 'empty field!'
        });
      }
      else{
        this.state.credit.push([this.state.c_desc, this.state.c_amount, this.state.c_type]);
        this.setState({
          c_desc : '',
          c_amount : 0,
          c_type : '',
          err : ''
        });
      }
    };

    //groupData function groups data in 2D array w.r.t description
    groupData = () =>{
      let data=[], row=[];
      {
        //make 2D array for data | array_name: grouped_rows[]
      }
      for (let i=0; i<this.state.rows.length; i++){
        for(let j=0; j<this.state.rows[i][1].length; j++){
          data.push([this.state.rows[i][0], this.state.rows[i][1][j][0], this.state.rows[i][1][j][1], this.state.rows[i][1][j][2], 'debit']);
          {
            //data.push([date, desc, amount, type, debit/credit])
          }
        }
        for(let j=0; j<this.state.rows[i][2].length; j++){
          data.push([this.state.rows[i][0], this.state.rows[i][2][j][0], this.state.rows[i][2][j][1], this.state.rows[i][2][j][2], 'credit']);
        }
      }
      this.state.grouped_rows=data;
      {
        //grouping data w.r.t description
      }
      data=[];
      let index=0, key='';
      while(this.state.grouped_rows.length!=0)
      {
        row=[];
        index=0;
        key=this.state.grouped_rows[0][1];
        while(index<this.state.grouped_rows.length){
          if(this.state.grouped_rows[index][1]==key){
            row.push(this.state.grouped_rows[index]);
            this.delete(index, this.state.grouped_rows);
          }
          index++;
        }
        data.push(row);
      }
      this.state.grouped_rows=data;
    }

    separateDebitAndCredit = data =>{
      let TDebit=0, TCredit=0;
      this.state.tBalCol1=[];
      this.state.tBalCol2=[];
      for(let j=0; j<data.length; j++){
        if(data[j][4]=="debit")  {
          TDebit+=parseInt(data[j][2]);
          this.state.tBalCol1.push([data[j][0],data[j][2]]);
          {
            //this.state.tBalCol1.push([date, amount])
          }
        }
        else{
          TCredit+=parseInt(data[j][2]);
          this.state.tBalCol2.push([data[j][0],data[j][2]]);
        }
      }
      while(this.state.tBalCol1.length<this.state.tBalCol2.length){
        this.state.tBalCol1.push(['','']);
      }
      while(this.state.tBalCol1.length>this.state.tBalCol2.length){
        this.state.tBalCol2.push(['','']);
      }
      if(TDebit-TCredit>0){
        this.state.tBalCol1.push([TDebit-TCredit,'']);
        this.state.tBalCol2.push(['','']);
      }
      if(TCredit-TDebit>0){
        this.state.tBalCol1.push(['','']);
        this.state.tBalCol2.push(['',TCredit-TDebit]);
      }
    }

    //returns 2D array of trial balance table
    makeTrialBalance=()=>{
      this.groupData();
      this.state.trialBalance=[];
      for(let i=0; i<this.state.grouped_rows.length; i++)
      {
        if(this.state.grouped_rows[i][0][3]=="Asset"){
          this.separateDebitAndCredit(this.state.grouped_rows[i]);
          this.state.trialBalance.push([this.state.grouped_rows[i][0][1], this.state.tBalCol1[this.state.tBalCol1.length-1], this.state.tBalCol2[this.state.tBalCol2.length-1]]);
        }
      }
      for(let i=0; i<this.state.grouped_rows.length; i++)
      {
        if(this.state.grouped_rows[i][0][3]=="Liability"){
          this.separateDebitAndCredit(this.state.grouped_rows[i]);
          this.state.trialBalance.push([this.state.grouped_rows[i][0][1], this.state.tBalCol1[this.state.tBalCol1.length-1], this.state.tBalCol2[this.state.tBalCol2.length-1]]);
        }
      }
      for(let i=0; i<this.state.grouped_rows.length; i++)
      {
        if(this.state.grouped_rows[i][0][3]=="Revenue"){
          this.separateDebitAndCredit(this.state.grouped_rows[i]);
          this.state.trialBalance.push([this.state.grouped_rows[i][0][1], this.state.tBalCol1[this.state.tBalCol1.length-1], this.state.tBalCol2[this.state.tBalCol2.length-1]]);
        }
      }
      for(let i=0; i<this.state.grouped_rows.length; i++)
      {
        if(this.state.grouped_rows[i][0][3]=="Expanse"){
          this.separateDebitAndCredit(this.state.grouped_rows[i]);
          this.state.trialBalance.push([this.state.grouped_rows[i][0][1], this.state.tBalCol1[this.state.tBalCol1.length-1], this.state.tBalCol2[this.state.tBalCol2.length-1]]);
        }
      }
      for(let i=0; i<this.state.grouped_rows.length; i++)
      {
        if(this.state.grouped_rows[i][0][3]=="Owner Capital"){
          this.separateDebitAndCredit(this.state.grouped_rows[i]);
          this.state.trialBalance.push([this.state.grouped_rows[i][0][1], this.state.tBalCol1[this.state.tBalCol1.length-1], this.state.tBalCol2[this.state.tBalCol2.length-1]]);
        }
      }
    }

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
  //------------------------------------------display table-------------------------------------------------
}
        {
          this.state.GenJournal &&
          <div id="GJ">
            <Button id="addBtn" onClick={this.handleShow}>Add</Button><br/>
            <Table bordered size="sm"  style={{textAlign:"left"}}>
              <thead style={{backgroundColor:"white", borderBottom:"3px solid #ec9841"}}>
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
                    <td>
                    {
                      this.state.rows[i][1].map((item, j) => (
                        <div>{this.state.rows[i][1][j][0]}</div>
                      ))
                    }
                    {
                      this.state.rows[i][2].map((item, j) => (
                        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.rows[i][2][j][0]}</div>
                      ))
                    }
                    </td>
                    <td>
                    {
                      this.state.rows[i][1].map((item, j) => (
                        <div>{this.state.rows[i][1][j][1]}</div>
                      ))
                    }
                    {
                      this.state.rows[i][2].map((item, j) => (
                        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.rows[i][2][j][1]}</div>
                      ))
                    }
                    </td>
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
                <Table bordered size="sm">
                  <thead  style={{color:"white", backgroundColor:"#ec9841"}}>
                    <tr>
                      <th style={{backgroundColor:"white"}}></th>
                      <th>General Journal</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    //----------------display debit fields---------------------------
                  }
                    {
                      this.state.debit.map((item, i) => (
                      <tr key={i}>
                        <td style={{color:"white", backgroundColor:"#ec9841"}}>Debit</td>
                        <td>{this.state.debit[i][0]}</td>
                        <td>{this.state.debit[i][1]}</td>
                        <td>{this.state.debit[i][2]}</td>
                        <td><a href="#" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) this.delete(i, this.state.debit) } }>Delete</a></td>
                      </tr>
                      ))
                    }
                    {
                      //----------------input debit fields---------------------------
                    }
                    <tr>
                      <td style={{color:"white", backgroundColor:"#ec9841"}}>Debit</td>
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
                      <td><FontAwesomeIcon style={{color:"blue"}} onClick={()=> this.addDebit()} icon="plus" /></td>
                    </tr>
                    {
                      //----------------display credit fields---------------------------
                    }
                    {
                      this.state.credit.map((item, i) => (
                      <tr key={i}>
                        <td style={{color:"white", backgroundColor:"#ec9841"}}>Credit</td>
                        <td>{this.state.credit[i][0]}</td>
                        <td>{this.state.credit[i][1]}</td>
                        <td>{this.state.credit[i][2]}</td>
                        <td><a href="#" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) this.delete(i, this.state.credit) } }>Delete</a></td>
                      </tr>
                      ))
                    }
                    {
                      //----------------input credit fields---------------------------
                    }
                    <tr>
                      <td style={{color:"white", backgroundColor:"#ec9841"}}>Credit</td>
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
                      <td><FontAwesomeIcon style={{color:"blue"}} onClick={()=> this.addCredit()} icon="plus" /></td>
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
            {
              //groupData function groups data in 2D array w.r.t description
            }
            {this.groupData()}
            {
              // this.state.grouped_rows.map((item, i) => (
              //   this.state.grouped_rows[i].map((item, j) => (
              //   <tr key={i}>
              //     <td>{this.state.grouped_rows[i][j][0]}</td>
              //     <td>{this.state.grouped_rows[i][j][1]}</td>
              //     <td>{this.state.grouped_rows[i][j][2]}</td>
              //     <td>{this.state.grouped_rows[i][j][3]}</td>
              //     <td>{this.state.grouped_rows[i][j][4]+i}</td>
              //   </tr>
              //   ))
              // ))
            }
            {
              this.state.grouped_rows.map((item, i) => (
                <Table bordered size="sm" style={{width:"500px", tableLayout:"fixed"}}>
                  <thead style={{textAlign:"center"}}>
                    <tr style={{backgroundColor:"#ec9841", color:"white"}}>
                      <th colspan="2">{this.state.grouped_rows[i][0][1]}</th>
                    </tr>
                    <tr style={{backgroundColor:"white"}}>
                      <th>Debit</th>
                      <th>Credit</th>
                    </tr>
                  </thead>
                    {this.separateDebitAndCredit(this.state.grouped_rows[i])}
                  <tbody>
                    {
                      this.state.tBalCol1.map((item, j) => (
                      <tr>
                        <td>{this.state.tBalCol1[j][0]}&nbsp;&nbsp;&nbsp;&nbsp;{this.state.tBalCol1[j][1]}</td>
                        <td>{this.state.tBalCol2[j][0]}&nbsp;&nbsp;&nbsp;&nbsp;{this.state.tBalCol2[j][1]}</td>
                      </tr>
                      ))
                    }
                    {
                      //tBalCol1: list of debits for each table in t-balance
                      //tBalCol2: list of credits for each table in t-balance
                    }
                  </tbody>
                </Table>
              ))
            }

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
            <Table bordered size="sm">
              <thead>
                <tr style={{backgroundColor:"white", borderBottom:"3px solid #ec9841", textAlign:"center"}}>
                  <th>Trial Balance</th>
                  <th>Debit</th>
                  <th>Credit</th>
                </tr>
              </thead>
              {this.makeTrialBalance()}
              <tbody>
              {
                this.state.trialBalance.map((item, i) => (
                <tr key={i}>
                  <td>{this.state.trialBalance[i][0]}</td>
                  <td>{this.state.trialBalance[i][1]}</td>
                  <td>{this.state.trialBalance[i][2]}</td>
                </tr>
                ))
              }
              </tbody>
            </Table>
          </div>
        }
      </div>
    );
  }
}

export default Transactions;
