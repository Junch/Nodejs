import React from 'react';
import { Table } from 'react-bootstrap';

class TableDemo extends React.Component {
  constructor(props){
    super(props);
    this.state = {data: [
      {
        firstName: 'Mark',
        lastName: 'Otto',
        userName: '@mdo'
      },
      {
        firstName: 'Jacob',
        lastName: 'Thornton',
        userName: '@fat'
      },
      {
        firstName: 'Larry the Bird',
        lastName: 'Hello',
        userName: '@twitter'
      }
    ]}
  }

  render() {
      var rows = this.state.data.map(function(user, index){
        return (
          <tr>
            <td>{index}</td>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>{user.userName}</td>
          </tr>
        );
      });

      return <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
  }
};

export default TableDemo;
