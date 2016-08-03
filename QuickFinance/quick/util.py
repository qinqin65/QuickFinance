from QuickFinance import settings
from django.contrib.auth.models import User
from .models import AccountBook, Account ,AccountType ,Income, Outcome, UserSetting, Currency
from django.utils.translation import ugettext as _, get_language
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
    currency = CurrencyHandler()

    user = User.objects.create_user(userName, email, password)
    user.save()

    accountBook = AccountBook(user=user, accountBookName=_('defaultAccountBook'))
    accountBook.save()

    userSetting = UserSetting(user=user)
    userSetting.defaultAccountBook = accountBook
    userSetting.defaultCurrency = currency.currency
    userSetting.save()

    account = Account(accountBook=accountBook, accountName=_('wallet'), currency=currency.currency)
    account.save()

    return user

def getAccountBook(user, requestAccountBook):
    accountBooks = AccountBook.objects.filter(user=user)
    userSetting = UserSetting.objects.get(user=user)

    if(requestAccountBook):
        currentAccountBook = AccountBook.objects.get(user=user, accountBookName=requestAccountBook)
    else:
        currentAccountBook = AccountBook.objects.get(user=user, pk=userSetting.defaultAccountBook.pk)

    result = {'accountBooks': [], 'accounts': [{'accountName': _('total property'), 'accountTotal': userSetting.totalProperty, 'symbol': '?' if userSetting.defaultCurrency is None else userSetting.defaultCurrency.symbol}], 'currentAccountBook': None}

    for book in accountBooks:
        result['accountBooks'].append(book.accountBookName)

    if(currentAccountBook):
        accounts = Account.objects.filter(accountBook=currentAccountBook)
        for account in accounts:
            result['accounts'].append({'accountName': account.accountName, 'accountTotal': account.total, 'symbol': '?' if account.currency is None else account.currency.symbol})
        result['currentAccountBook'] = currentAccountBook.accountBookName

    return result

class CurrencyHandler():
    currencyMap = {'zh-hans': 'CNY', 'en': 'USD'}
    defaultCurrencyMap = 'zh-hans'
    def __init__(self):
        lanCode = get_language()
        if lanCode not in self.currencyMap:
            lanCode = self.defaultCurrencyMap
        self.currency = Currency.objects.get(code=self.currencyMap[lanCode])