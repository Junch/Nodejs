import React from 'react';
import { Table } from 'react-bootstrap';

class TableDemo extends React.Component {
  constructor(props){
    super(props);
    this.state = {data: []}
  }

  componentDidMount(){
      axios.get(this.props.url)
          .then(function(data){
              this.setState({data: data.data})
          }.bind(this))
          .catch(function(response){
              console.log(response);
          });
  }

  render() {
      var rows = this.state.data.map(function(user, index){
        return (
          <tr key={index}>
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
