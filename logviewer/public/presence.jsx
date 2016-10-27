import React from 'react';

// http://stackoverflow.com/questions/25646502/how-to-render-repeating-elements
class PresenceTimeline extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            {this.props.titles.map(title => {
              return <th key={title}>{title}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {this.props.rows.map((row, i) => {
            return (
              <tr key={i}>
                {row.map((col, j) => {
                  if (j === 0 || col === '')
                    return <td key={j}>{col}</td>;
                  else
                    // http://stackoverflow.com/questions/19266197/reactjs-convert-to-html
                    return <td key={j} dangerouslySetInnerHTML={{__html: col}} />
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default class PresencePage extends React.Component {
  constructor(props) {
    super(props);
  }

  onSelectSender(e) {
    let sender = e.target.childNodes[0].id;
    this.props.handleSelectSender(e, sender);
  }

  render() {
    return (
      <div>
        <h3>Presence</h3>
        <div id = "senderButtons" className="btn-group" data-toggle="buttons" onClick={e => this.onSelectSender(e)}>
          {
            this.props.senders.map((sender, i) => {
              return (
                <label className="btn btn-primary" key={i}>
                  <input type="radio" name="options" id={sender} autoComplete="off" /> {sender}
                </label>
              );
            })
          }
        </div>
        <div>
          <PresenceTimeline titles={this.props.titles} rows={this.props.rows} />
        </div>
      </div>
    );
  }
}
