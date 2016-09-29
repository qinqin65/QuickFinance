from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.template import RequestContext
from django.views.decorators.http import require_POST
from django.contrib.auth import authenticate, login as djangoLogin, logout as djangoLogout
from django.db.utils import IntegrityError
from django.utils.translation import ugettext as _
from django.core import serializers
from django.views.decorators.csrf import ensure_csrf_cookie
from . import stateCode
from .util import debug, login_required, createUserAndInit, getAccountBook, currency, getAccountType, Accounting, getFinanceData, addAccountBookUtil, addAccountUtil

@ensure_csrf_cookie
def home(request):
    return render(request, 'quick/index.html')

@debug
def test(request):
    return render(request, 'quick/test.html')

@require_POST
def login(request):
    try:
        userName = request.POST['userName']
        password = request.POST['password']
        isRemenmber = request.POST['isRemenmber']
    except:
        return JsonResponse({'state': stateCode.ERROR, 'info': _('login failed')})
    else:
        user = authenticate(username=userName, password=password)
        if user is None:
            return JsonResponse({'state': stateCode.ERROR, 'info': _('user or password is invalid')})
        else:
            if user.is_active:
                djangoLogin(request, user)
                if isRemenmber == 'true':
                    # remember for a month 60 * 60 * 24 * 30
                    request.session.set_expiry(2592000)
                else:
                    # valid for 30 minutes
                    request.session.set_expiry(1800)
                return JsonResponse({'state': stateCode.SUCCESS, 'user': {'userName': user.username}})
            else:
                return JsonResponse({'state': stateCode.ERROR, 'info': _('user is not allowed to login')})

def logout(request):
    try:
        djangoLogout(request)
        request.session.clear()
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

@require_POST
def changingPassword(request):
    try:
        oldpassword = request.POST['oldPassword']
        newPassword = request.POST['newPassword']
        user = authenticate(username=request.user.username, password=oldpassword)
        if user is None:
            return JsonResponse({'state': stateCode.ERROR, 'info': _('user or password is invalid')})
        else:
            user.set_password(newPassword)
            user.save()
            return JsonResponse({'state': stateCode.SUCCESS})
    except Exception as e:
        return JsonResponse({'state': stateCode.ERROR, 'info': _('changing password failed')})


@login_required
def accountBookData(request):
    try:
        requestAccountBook = request.GET['accountBook']
        accountBook = getAccountBook(request.user, requestAccountBook)
        jsonResult = {'state': stateCode.SUCCESS}
        jsonResult.update(accountBook)
    except Exception as e:
        return JsonResponse({'state': stateCode.ERROR, 'info': _('error occured when processing account book')})
    else:
        return JsonResponse(jsonResult)

@login_required
def currencySelectStore(request):
    try:
        currencies = currency.allCurrency
        jsonResult = {'state': stateCode.SUCCESS}
        jsonResult['selectStore'] = list(currencies)
    except Exception as e:
        return JsonResponse({'state': stateCode.ERROR, 'info': _('error occured when get currency select store')})
    else:
        return JsonResponse(jsonResult)

@login_required
def accountTypeSelectStore(request):
    try:
        accountType = getAccountType(request.user)
        jsonResult = {'state': stateCode.SUCCESS}
        jsonResult['selectStore'] = list(accountType)
    except Exception as e:
        return JsonResponse({'state': stateCode.ERROR, 'info': _('error occured when get account type store')})
    else:
        return JsonResponse(jsonResult)

@login_required
@require_POST
def accounting(request):
    try:
        value = request.POST['value']
        currency = request.POST['currency']
        type = request.POST['type']
        date = request.POST['date']
        remark = request.POST['remark']
        accountType = request.POST['accountType']
        accountBook = request.POST['accountBook']
        account = request.POST['account']

        accounting = Accounting(request.user)
        accounting.accounting(value,currency,type,date,remark,accountType,accountBook,account)
        accountBookData = getAccountBook(request.user, accountBook)
        jsonResult = {'state': stateCode.SUCCESS}
        jsonResult.update(accountBookData)
    except Exception as e:
        return JsonResponse({'state': stateCode.ERROR, 'info': _('accounting failed')})
    else:
        return JsonResponse(jsonResult)

@login_required
def financePreviewData(request):
    try:
        year = request.GET['year']
        month = request.GET['month']
        day = request.GET['day']
        type = request.GET['type']
        accountBook = request.GET['accountBook']
        account = request.GET['account']

        financeData = getFinanceData(request.user, year, month, day, type, accountBook, account)

        jsonResult = {'state': stateCode.SUCCESS}
        jsonResult['financePreviewData'] = list(financeData)
    except Exception as e:
        return JsonResponse({'state': stateCode.ERROR, 'info': _('request finance data failed')})
    else:
        return JsonResponse(jsonResult)

@login_required
def addAccountBook(request):
    try:
        accountBook = request.GET['accountBook']
        remark = request.GET['remark']

        addAccountBookUtil(request.user, accountBook, remark)

        jsonResult = {'state': stateCode.SUCCESS}
    except Exception as e:
        return JsonResponse({'state': stateCode.ERROR, 'info': _('request finance data failed')})
    else:
        return JsonResponse(jsonResult)

@login_required
def addAccount(request):
    try:
        accountBook = request.GET['accountBook']
        account = request.GET['account']
        currency = request.GET['currency']
        webUrl = request.GET['webUrl']
        remark = request.GET['remark']

        addAccountUtil(request.user, accountBook, account, currency, webUrl, remark)

        jsonResult = {'state': stateCode.SUCCESS}
    except Exception as e:
        return JsonResponse({'state': stateCode.ERROR, 'info': _('request finance data failed')})
    else:
        return JsonResponse(jsonResult)