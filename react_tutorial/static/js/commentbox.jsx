import React from 'react';
import {render} from 'react-dom';

class Comment extends React.Component {

    rawMarkup () {
        var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
        return { __html: rawMarkup };
    }

    render () {
        return (
            <div>
                <h2>
                    {this.props.author}
                </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    }
}

class CommentList extends React.Component {
    render() {
        var commentNodes = this.props.data.map(function(comment){
            return (
                <Comment author={comment.author} key={comment.id}>
                    {comment.text}
                </Comment>
            )
        });

        return (
            <div>
                {commentNodes}
            </div>
        );
    }
}

class CommentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {author: '', text: ''};
    }

    handleAuthorChange(e) {
        this.setState({author: e.target.value});
    }

    handleTextChange(e) {
        this.setState({text: e.target.value});
    }

    render() {
        return (
            <form className="form-inline">
                <input className="form-control" type="text" placeholder="Your name" value={this.state.author} onChange={this.handleAuthorChange.bind(this)} />
                <input className="form-control" type="text" placeholder="Say something..." value={this.state.text} onChange={this.handleTextChange.bind(this)} />
                <input className="btn btn-default" type="submit" value="Post" />
            </form>
        );
    }
}

class CommentBox extends React.Component {
    constructor(props) {
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
        return(
            <div>
                <h1>Comments</h1>
                <CommentList data={this.state.data}/>
                <CommentForm />
            </div>
        );
    }
}

render(
    <CommentBox url="comments.json" />,
    document.getElementById('content')
);
