import * as dom from 'dojo/dom';
import * as query from 'dojo/query';

/**
 * Carousel
 */
class Carousel {
    private carouselObj;
    
    constructor(nodeId: string) {
        this.carouselObj = dom.byId(nodeId);
    }
}