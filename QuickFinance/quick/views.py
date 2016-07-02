from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.template import RequestContext
from django.views.decorators.http import require_POST
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.utils.translation import ugettext as _
from . import stateCode
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
            return JsonResponse({'state': stateCode.SUCCESS, 'user': user})

@require_POST
def register(requset):

    user = User.objects.create_user('john', 'lennon@thebeatles.com', 'johnpassword')
    user.save()