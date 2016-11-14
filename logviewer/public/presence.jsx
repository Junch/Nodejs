import React from 'react';
import style from './app.css';

// http://stackoverflow.com/questions/25646502/how-to-render-repeating-elements
class PresenceTimeline extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <table className="table table-bordered table-striped table-condensed table-hover" style={{marginTop: "15px"}}>
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
                  return <td key={j}><p className={style.xmp}>{col}</p></td>;
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
      <div style={{marginTop: "15px"}}>
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
