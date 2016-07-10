from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.template import RequestContext
from django.views.decorators.http import require_POST
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.utils.translation import ugettext as _
from django.core import serializers
from . import stateCode
from .util import debug
# from django.views.decorators.csrf import ensure_csrf_cookie

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

@debug
def test(request):
    return render(
        request,
        'quick/test.html',
        context_instance=RequestContext(request,
        {
        })
    )

@require_POST
def login(request):
    try:
        userName = request.POST['userName']
        passWord = request.POST['password']
    except:
        return JsonResponse({'state': stateCode.ERROR, 'info': _('normal error')})
    else:
        user = authenticate(username=userName, password=passWord)
        if user is None:
            return JsonResponse({'state': stateCode.ERROR, 'info': _('user or password is invalid')})
        else:
            if user.is_active:
                login(request, user)
                return JsonResponse({'state': stateCode.SUCCESS, 'user': user})
            else:
                return JsonResponse({'state': stateCode.ERROR, 'info': _('user is not allowed to login')})

@require_POST
def register(request):
    try:
        userName = request.POST['userName']
        passWord = request.POST['password']
        email = request.POST['email']
        user = User.objects.create_user(userName, email, passWord)
        user.save()
    except Exception as e:
        print(e)
        return JsonResponse({'state': stateCode.ERROR, 'info': _('normal error')})
    else:
        return JsonResponse({'state': stateCode.SUCCESS, 'user': serializers.serialize('json', user)})

