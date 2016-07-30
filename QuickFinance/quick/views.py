from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.template import RequestContext
from django.views.decorators.http import require_POST
from django.contrib.auth import authenticate, login as djangoLogin, logout as djangoLogout
from django.db.utils import IntegrityError
from django.utils.translation import ugettext as _
# from django.core import serializers
from django.views.decorators.csrf import ensure_csrf_cookie
from . import stateCode
from .util import debug, createUserAndInit

@ensure_csrf_cookie
def home(request):
    return render(
        request,
        'quick/index.html',
        context_instance = RequestContext(request,{})
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
        password = request.POST['password']
    except:
        return JsonResponse({'state': stateCode.ERROR, 'info': _('login failed')})
    else:
        user = authenticate(username=userName, password=password)
        if user is None:
            return JsonResponse({'state': stateCode.ERROR, 'info': _('user or password is invalid')})
        else:
            if user.is_active:
                djangoLogin(request, user)
                return JsonResponse({'state': stateCode.SUCCESS, 'user': {'userName': user.username}})
            else:
                return JsonResponse({'state': stateCode.ERROR, 'info': _('user is not allowed to login')})

def logout(request):
    try:
        djangoLogout(request)
    except:
        return JsonResponse({'state': stateCode.ERROR, 'info': _('logout failed')})
    else:
        return JsonResponse({'state': stateCode.SUCCESS, 'info': _('logout success')})

@require_POST
def register(request):
    try:
        userName = request.POST['userName']
        password = request.POST['password']
        email = request.POST['email']

        user = createUserAndInit(userName, email, password)

    except IntegrityError as e:
        return JsonResponse({'state': stateCode.ERROR, 'info': _('user already exist')})
    except Exception as e:
        return JsonResponse({'state': stateCode.ERROR, 'info': _('register failed')})
    else:
        return JsonResponse({'state': stateCode.SUCCESS, 'user': {'userName': user.username}})

