import React from 'react'
import {Button, Modal} from 'react-bootstrap'
import '../css/modal-dialog.css'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import '../../node_modules/react-datepicker/dist/react-datepicker.css'
import axios from 'axios'

export default class ModalCash extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      volume:0,
      startDate:moment()
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    let cash = {
      volume: Number(this.state.volume),
      date:   this.state.startDate,
    }
    
    let url = '/api/cash';
    axios.post(url, cash).then(response => {
      this.props.onClose(true);
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    return (
      <Modal show={this.props.showModal} bsSize="small" container={this.props.container} onHide={e => this.props.onClose(false)}>
        <Modal.Header>
          <Modal.Title>银证转账</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form-horizontal">
            <div className="form-group row">
              <label htmlFor="date" className="col-sm-3 form-control-label">日期</label>
              <div className="col-sm-9" style={{paddingLeft: "0"}}>
                <DatePicker selected={this.state.startDate} onChange={ date => this.setState({startDate: date})} />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="volume" className="col-sm-3 form-control-label">金额</label>
              <div className="col-sm-9" style={{paddingLeft: "0"}}>
                <input type="number" className="form-control" id="volume" min="0" step="0.01" value={this.state.volume} onChange={e=>this.setState({volume: e.target.value})} />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="small" bsStyle="primary" onClick={e => this.handleSubmit(e)} >确定</Button>
          <Button bsSize="small" onClick={e => this.props.onClose(false)}>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
