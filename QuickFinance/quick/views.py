from django.shortcuts import render
from django.http import HttpRequest
from django.template import RequestContext

def home(request):
    #assert isinstance(request, HttpRequest)
    return render(
        request,
        'quick/index.html',
        context_instance = RequestContext(request,
        {
            'title':'Home Page',
            # 'year':datetime.now().year,
        })
    )