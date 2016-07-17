import * as xhr from 'dojo/request/xhr';
import Config from 'config';

export let post = function(url: string, option: any) {
    if(option.data && typeof option.data == 'object') {
        option.data.csrfmiddlewaretoken = Config.csrf;
    }
    return xhr.post(url, option);
}

export let get = xhr.get;