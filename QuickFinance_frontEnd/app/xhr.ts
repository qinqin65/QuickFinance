import * as xhr from 'dojo/request/xhr';
import * as cookie from 'dojo/cookie';

export let post = function(url: string, option: any) {
    if(option.data && typeof option.data == 'object') {
        option.data.csrfmiddlewaretoken = cookie('csrftoken');
    }
    return xhr.post(url, option);
}

export let get = xhr.get;