import * as React from 'react';
import * as Chart from 'dojox/charting/Chart';
import * as theme from 'dojox/charting/themes/MiamiNice';
import * as ColumnsPlot from 'dojox/charting/plot2d/Columns';
import * as Highlight from 'dojox/charting/action2d/Highlight';
import * as Legend from 'dojox/charting/widget/Legend';
import * as Tooltip from 'dojox/charting/action2d/Tooltip';
import * as Magnify from 'dojox/charting/action2d/Magnify';
import 'dojox/charting/plot2d/Markers';
import 'dojox/charting/axis2d/Default';

export class FinancePreview extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    var chartData = [10000,9200,11811,12000,7662,13887,14200,12222,12000,10009,11288,12099];
    var chartData2 = [3000,12000,17733,9876,12783,12899,13888,13277,14299,12345,12345,15763];

    // Create the chart within it&#x27;s "holding" node
    var chart = new Chart("financeChartNode");

    // Set the theme
    chart.setTheme(theme);

    // Add the only/default plot
    chart.addPlot("default", {
        type: ColumnsPlot,
        markers: true,
        gap: 5
    });

    // Add axes
    chart.addAxis("x");
    chart.addAxis("y", { vertical: true, fixLower: "major", fixUpper: "major" });

    // Add the series of data
    chart.addSeries("Monthly Sales - 2008",chartData);
    chart.addSeries("Monthly Sales - 2009",chartData2);

    // Create the tooltip
    var tip = new Tooltip(chart,"default");

    // Create the magnifier
    var mag = new Magnify(chart,"default");

    // Highlight!
    new Highlight(chart,"default");

    // Render the chart!
    chart.render();

    // Create the legend
    var legend = new Legend({ chart: chart }, "legend");
  }

  render() {
    return (
        <div id="financeChartNode" style={{ width: '800px', height: '400px' }}></div>
    )
  }
}