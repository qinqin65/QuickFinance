from QuickFinance import settings
from django.contrib.auth.models import User
from .models import AccountBook, Account ,AccountType ,Income, Outcome, UserSetting
from django.utils.translation import ugettext as _
from django.http import HttpRequest, HttpResponse, JsonResponse
from functools import wraps
from . import stateCode

def debug(func):
    if settings.DEBUG:
        return func

def login_required(func):
    @wraps(func)
    def _wrapped_func(request, *args, **kwargs):
        if(request.user.is_authenticated()):
            return func(request, *args, **kwargs)
        else:
            return JsonResponse({'state': stateCode.NOTLOGGIN, 'info': _('user does not login')})

    return _wrapped_func

def createUserAndInit(userName, email, password):
    user = User.objects.create_user(userName, email, password)
    user.save()

    accountBook = AccountBook(user=user, accountBookName=_('defaultAccountBook'))
    accountBook.save()

    userSetting = UserSetting(user=user)
    userSetting.defaultAccountBook = accountBook
    userSetting.save()

    account = Account(accountBook=accountBook, accountName=_('wallet'))
    account.save()

    return user

def getAccountBook(user, requestAccountBook):
    result = {'accountBooks': [], 'accounts': [], 'currentAccountBook': None}
    accountBooks = AccountBook.objects.filter(user=user)
    userSetting = UserSetting.objects.get(user=user)
    currentAccountBook = None
    if(requestAccountBook):
        currentAccountBook = AccountBook.objects.get(user=user, accountBookName=requestAccountBook)
    else:
        currentAccountBook = AccountBook.objects.get(user=user, pk=userSetting.defaultAccountBook.pk)

    for book in accountBooks:
        result['accountBooks'].append(book.accountBookName)

    if(currentAccountBook):
        accounts = Account.objects.filter(accountBook=currentAccountBook)
        for account in accounts:
            result['accounts'].append({'accountName': account.accountName, 'accountTotal': account.total})
        result['currentAccountBook'] = currentAccountBook.accountBookName

    return result