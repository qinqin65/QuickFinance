import * as dom from 'dojo/dom';
import * as query from 'dojo/query';
import * as on from 'dojo/on';

/**
 * Carousel
 */
export default class Carousel {
    private transitionDuration;
    private carouselObj;
    private indicators;
    private carouselItems;
    
    constructor(nodeId: string) {
        this.transitionDuration = 600;
        this.carouselObj = dom.byId(nodeId);
        this.indicators = this.carouselObj.children[0];
        this.carouselItems = this.carouselObj.children[1];
        
        on(this.indicators, 'click', this.indicatorHandle.bind(this));
    }
    
    indicatorHandle(evt) {
        if(evt.srcElement.nodeName == 'OL') {
            return;
        }
        
        let actIndicator = query('.carousel-indicators .active')[0];
        let curIndicator = evt.srcElement;
        let actItem = query('.carousel-item.active')[0];
        let curNum = curIndicator.dataset.slideTo;
        let curItem = this.carouselItems.childNodes[curNum];
        
        actIndicator.classList.remove('active');
        curIndicator.classList.add('active');
        
        curItem.classList.add('next');
        actItem.classList.add('left');
        curItem.classList.add('left');
        // curItem.style.left = '100%';
        // actItem.style.left = '100%';
        setTimeout(()=> {
            curItem.classList.remove('next', 'left');
            curItem.classList.add('active');
            actItem.classList.remove('active', 'left');
        }, this.transitionDuration);
    }
}