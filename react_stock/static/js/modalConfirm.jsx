import React from 'react'
import {Button, Modal} from 'react-bootstrap';
import '../css/modal-dialog.css'

export default class ModalConfirm extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <Modal show={this.props.showModal} bsSize="small" container={this.props.container} onHide={e => this.props.closeModal(false)}>
        <Modal.Header>
          <Modal.Title>提醒</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          确定删除这个交易?
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="small" bsStyle="primary" onClick={e => this.props.closeModal(true)}>确定</Button>
          <Button bsSize="small" onClick={e => this.props.closeModal(false)}>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}