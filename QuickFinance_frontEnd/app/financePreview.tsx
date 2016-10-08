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
import {financePreviewStore, AccountingType, accountInfoStore} from 'store';
import * as lang from 'dojo/i18n!app/nls/langResource.js';
import {getCountDays} from 'util';
import * as stateCode from 'stateCode';

export class DatePick extends React.Component<any, any> {
  private curDate: Date;
  private yearRange: number;
  private currentYear: number;
  private currentMonth: number;

  constructor(props, context) {
    super(props, context);
    this.curDate = new Date();
    this.yearRange = 50;
    this.state = {
      currentYear: financePreviewStore.getyear() || this.curDate.getFullYear(),
      currentMonth: financePreviewStore.getMonth() || this.curDate.getMonth() + 1,
      currentDay: financePreviewStore.getDay() || '0',
      currentType: financePreviewStore.getType() || AccountingType.outcome
    };
  }

  getYearRange() {
    let results: Array<JSX.Element> = [];
    let length = this.yearRange * 2 + 1;
    let startYear = this.state.currentYear - this.yearRange;
    for(let i = 0;i < length;i++) {
      let year = startYear + i;
      results.push(<option key={year} value={year}>{year}</option>);
    }
    return results;
  }

  getMonthRange() {
    let results: Array<JSX.Element> = [];
    let length = 12;
    results.push(<option key={lang.noSelection} value='0'>{lang.noSelection}</option>);
    for(let i = 0;i < length;i++) {
      let month = i + 1;
      results.push(<option key={month} value={month}>{month}</option>);
    }
    return results;
  }

  getDayRange() {
    let results: Array<JSX.Element> = [];
    let length = getCountDays(`${this.state.currentYear}/${this.state.currentMonth}/1`);
    results.push(<option key={lang.noSelection} value='0'>{lang.noSelection}</option>);
    for(let i = 0;i < length;i++) {
      let day = i + 1;
      results.push(<option key={day} value={day}>{day}</option>);
    }
    return results;
  }

  performFilter() {
    let year: string = this.refs.previewDateYear.value;
    let month: string = this.refs.previewDateMonth.value;
    let day: string = this.refs.previewDateDay.value;
    let type: AccountingType = this.refs.previewAccountType.value;
    let accountBook: string = accountInfoStore.currentAccountBook;
    let account: string = accountInfoStore.currentAccount;
    financePreviewStore.setParam(year, month, day, type, accountBook, account);
    financePreviewStore.requestStore();
  }

  componentDidMount() {
    if(financePreviewStore.isStoreEmpty()) {
      this.performFilter();
    }
  }

  render() {
    return (
      <div className='previewDatePick'>
        <label htmlFor="previewDateYear">{ lang.dateYear }</label>
        <select className="accounting-block-select" ref="previewDateYear" id="previewDateYear" onChange={ (event: any)=>this.setState({currentYear: event.target.value}) } value={ this.state.currentYear }>
          {
            this.getYearRange()
          }
        </select>

        <label htmlFor="previewDateMonth">{ lang.dateMonth }</label>
        <select className="accounting-block-select" ref="previewDateMonth" id="previewDateMonth" onChange={ (event: any)=>this.setState({currentMonth: event.target.value}) } value={ this.state.currentMonth }>
          {
            this.getMonthRange()
          }
        </select>

        <label htmlFor="previewDateDay">{ lang.dateDay }</label>
        <select className="accounting-block-select" ref="previewDateDay" id="previewDateDay" onChange={ (event: any)=>this.setState({currentDay: event.target.value}) } value={this.state.currentDay}>
          {
            this.getDayRange()
          }
        </select>

        <label htmlFor="previewAccountType">{ lang.accountType }</label>
        <select className="accounting-block-select" ref="previewAccountType" id="previewAccountType" onChange={ (event: any)=>this.setState({currentType: event.target.value}) } value={this.state.currentType}>
          <option key={stateCode.INCOME} value={stateCode.INCOME}>{lang.income}</option>
          <option key={stateCode.OUTCOME} value={stateCode.OUTCOME}>{lang.outcome}</option>
        </select>

        <button className="bt-comfirm" style={{ marginRight: '1rem' }} onClick = { this.performFilter.bind(this) }>{ lang.filter }</button>
      </div>
    );
  }
}

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

  onChartDataUpdate(shouldClearStore) {
    if(shouldClearStore) {
      financePreviewStore.clearStore();
      financePreviewStore.clearParam();
    }
    this.chart.updateSeries("financePreviewData", financePreviewStore.getStore());
    this.chart.render();
  }

  render() {
    return (
        <div className='financeChartContainer'>
          <div id="financeChartNode"></div>
        </div>
    )
  }
}