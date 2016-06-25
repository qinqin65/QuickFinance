from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.template import RequestContext
from django.views.decorators.http import require_POST
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import ensure_csrf_cookie

# @ensure_csrf_cookie
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

@require_POST
def login(request):
    user = authenticate(username="test", password="test")
    result = "no user"
    if user is not None:
        result = "user exist"
    return JsonResponse({'result': result})