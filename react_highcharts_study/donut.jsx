import React from 'react';
import {render} from 'react-dom';
import ReactDOM from 'react-dom';
import Highcharts from 'highcharts';
import addExporting from "highcharts/modules/exporting";
addExporting(Highcharts);

// http://jsfiddle.net/anshul24mehta/pywn6wwz/
// https://www.highcharts.com/blog/post/192-use-highcharts-to-create-charts-in-react/
// https://stackoverflow.com/questions/33241358/how-to-import-highcharts-with-webpack-and-babel

class App extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {pieData: [{name: "Firefox",y: 6},
                                {name: "MSIE",y: 4},
                                {name: "Safari",y: 4},
                                {name: "Opera",y: 1},
                                {name: "Chrome",y: 7}]}
    }

    render() {
        return <DonutChart data = {this.state.pieData}/>
    }
 }

class DonutChart extends React.Component {
    constructor(props) {
        super(props);
        this.chart = undefined;
    }
  
    componentDidMount() {
        this.chart = Highcharts.chart(this.refs.chart, {
            chart: {
                type: 'pie'
            },
            title: 'Browser Market sahre',
            yAxis: {
                title: {
                    text: 'Total percent market share'
                }
            },
            plotOptions: {
                pie: {
                    shadow: false
                }
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.point.name +'</b>: '+ this.y +' %';
                }
            },
            series: [{
                name: 'Browsers',
                data: this.props.data,
                size: '100%',
                innerSize: '85%',
                showInLegend:true,
                dataLabels: {
                    enabled: true
                }
            }]
        });
    }

    componentWillUnmount() {
        this.chart.destroy();
    }
  
    componentWillReceiveProps(props) {
        this.chart.highcharts().series[0].setData(props.data);
    }
  
    render() {
        return (
            <div ref='chart'>
            </div>
        )
    }
}

render(<App/>, document.getElementById('donut'));
