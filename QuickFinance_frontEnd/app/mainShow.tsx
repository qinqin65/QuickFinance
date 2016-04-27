import * as React from 'react';
import * as lang from 'dojo/i18n!app/nls/langResource.js';
// import * as topic from 'dojo/topic';

export enum select{showItemConduct, showItemKeepAccount, showItemQuick}

class Items {
    static showItemConduct = 
        <div className="mainCarousel-caption">
            <h1>{ lang.conductFinance }</h1>
            <p>{ lang.conductFinanceTip1 }</p>
            <p>{ lang.conductFinanceTip2 }</p>
        </div>
    
    static showItemKeepAccount =
        <div className="mainCarousel-caption">
            <h1>{ lang.keepAccount }</h1>
            <p>{ lang.keepAccountTip1 }</p>
            <p>{ lang.keepAccountTip2 }</p>
        </div>
        
    static showItemQuick = 
        <div className="mainCarousel-caption">
            <h1>{ lang.quickFinance }</h1>
            <p>{ lang.quickFinanceTip1 }</p>
            <p>{ lang.quickFinanceTip2 }</p>
        </div>
}

class Indicator extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
  }
  
  render() {
    return (
        // <li data-target = { this.props.target } data-slide-to = { this.props.slideNum } className = { this.props.isSelect ? "active" : "" } onClick = { ()=>topic.publish('mainShow/idicatorClicked', this.props.itemName) }></li>
        <li data-target = { this.props.target } data-slide-to = { this.props.slideNum } className = { this.props.isSelect ? "active" : "" } ></li>
    );
  }
}

class ContentFrame extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
  }
  
  render() {
    return (
    <div className= { this.props.isSelect ? "mainCarousel-item active" : "mainCarousel-item" }>
        <div className="mainCarousel-container">
            <div className="carousel-caption">
                { this.props.child }
            </div>
        </div>
    </div>
    );
  }
}

export class MainShow extends React.Component<any, any> {
  carouselId = 'mainShowCarousel'

  constructor(props, context) {
    super(props, context);
    this.state = {select: select.showItemConduct};
  }

  render() {
    return (
      <div id= { this.carouselId } className="mainCarousel" data-ride="carousel">
        <ol className="mainCarousel-indicators">
            <Indicator target = { this.carouselId } slideNum = "0" itemName = { select.showItemConduct } isSelect = { this.state.select == select.showItemConduct } />
            <Indicator target = { this.carouselId } slideNum = "1" itemName = { select.showItemConduct } isSelect = { this.state.select == select.showItemKeepAccount } />
            <Indicator target = { this.carouselId } slideNum = "2" itemName = { select.showItemConduct } isSelect = { this.state.select == select.showItemQuick } />
        </ol>
        <div className="mainCarousel-inner" role="listbox">
            <ContentFrame child = { Items.showItemConduct } isSelect = { this.state.select == select.showItemConduct } />
            <ContentFrame child = { Items.showItemKeepAccount } isSelect = { this.state.select == select.showItemKeepAccount } />
            <ContentFrame child = { Items.showItemQuick } isSelect = { this.state.select == select.showItemQuick } />
        </div>
    </div>
    );
  }
}