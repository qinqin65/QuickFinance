import * as React from 'react';
import * as topic from 'dojo/topic';
import * as Chart from 'dojox/charting/Chart';
import * as theme from 'dojox/charting/themes/MiamiNice';
import * as ColumnsPlot from 'dojox/charting/plot2d/Columns';
import * as Highlight from 'dojox/charting/action2d/Highlight';
import * as Legend from 'dojox/charting/widget/Legend';
import * as Tooltip from 'dojox/charting/action2d/Tooltip';
import * as Magnify from 'dojox/charting/action2d/Magnify';
import 'dojox/charting/plot2d/Markers';
import 'dojox/charting/axis2d/Default';
import 'xstyle/css!ref/css/dijit.css';
import {accountToolSelect} from 'accountDetail';
import {financePreviewStore} from 'store';

export class FinancePreview extends React.Component<any, any> {
  private chart: any;
  private topicHandler: Array<any>

  constructor(props, context) {
    super(props, context);
    this.topicHandler = [];
    this.topicHandler.push(topic.subscribe('finance/financeDataChanged', this.onChartDataUpdate.bind(this)));
  }

  componentDidMount() {
    this.chart = new Chart("financeChartNode");
    this.chart.setTheme(theme);

    // Add the only/default plot
    this.chart.addPlot("default", {
        type: ColumnsPlot,
        markers: true,
        gap: 5
    });

    // Add axes
    this.chart.addAxis("x");
    this.chart.addAxis("y", { vertical: true, fixLower: "major", fixUpper: "major" });

    // Add the series of data
    this.chart.addSeries("financePreviewData", financePreviewStore.getStore());
    // chart.addSeries("Monthly Sales - 2009",chartData2);

    // Create the tooltip
    new Tooltip(this.chart,"default");

    // Highlight!
    new Highlight(this.chart,"default");

    // Render the chart!
    this.chart.render();
  }

  componentWillUnmount() {
    this.chart.destroy();
    this.topicHandler.forEach((topicItem)=>topicItem.remove());
  }

  onChartDataUpdate() {
    financePreviewStore.clearStore();
    this.chart.updateSeries("financePreviewData", financePreviewStore.getStore());
  }

  render() {
    return (
        <div id="financeChartNode" style={{ width: '800px', height: '400px' }}></div>
    )
  }
}