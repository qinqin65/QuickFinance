from QuickFinance import settings
from django.contrib.auth.models import User
from .models import AccountBook, Account ,AccountType ,Income, Outcome, UserSetting, Currency, CurrencyRate
from django.utils.translation import ugettext as _, get_language
from django.http import HttpRequest, HttpResponse, JsonResponse
from functools import wraps
from . import stateCode
from django.db.models import F, Q
from django.db.models import Count, Min, Sum, Avg
from . import stateCode
import datetime

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

def initAccount(user):
    accountBook = AccountBook(user=user, accountBookName=_('default Account Book'))
    accountBook.save()

    account = Account(accountBook=accountBook, accountName=_('wallet'), currency=currency.defaultCurrency)
    account.save()

    userSetting = UserSetting(user=user)
    userSetting.defaultAccountBook = accountBook
    userSetting.defaultAccount = account
    userSetting.defaultCurrency = currency.defaultCurrency
    userSetting.save()

def createUserAndInit(userName, email, password):
    user = User.objects.create_user(userName, email, password)
    user.save()
    initAccount(user)
    return user

def getAccountBook(user, requestAccountBook):
    accountBooks = AccountBook.objects.filter(user=user)
    userSetting = UserSetting.objects.get(user=user)

    if(requestAccountBook):
        currentAccountBook = AccountBook.objects.get(user=user, accountBookName=requestAccountBook)
    else:
        currentAccountBook = AccountBook.objects.get(user=user, pk=userSetting.defaultAccountBook.pk)

    result = {
        'accountBooks': [],
        'accounts': [{
            'accountName': _('total property'),
            'accountTotal': userSetting.totalProperty,
            'currency': {
                'symbol': '?' if userSetting.defaultCurrency is None else userSetting.defaultCurrency.symbol,
                'name': '' if userSetting.defaultCurrency is None else getattr(userSetting.defaultCurrency, currency.currencyNameMap[currency.lanCode], None)
            },
            'webUrl': '',
            'remark': ''
        }],
        'currentAccountBook': None
    }

    for book in accountBooks:
        result['accountBooks'].append({'name': book.accountBookName, 'remark': book.remark})

    if(currentAccountBook):
        accounts = Account.objects.filter(accountBook=currentAccountBook)
        for account in accounts:
            result['accounts'].append({
                'accountName': account.accountName,
                'accountTotal': account.total,
                'currency': {
                    'symbol': '?' if account.currency is None else account.currency.symbol,
                    'name': '' if account.currency is None else getattr(account.currency, currency.currencyNameMap[currency.lanCode], None)
                },
                'webUrl': account.webUrl,
                'remark': account.remark
            })
        result['currentAccountBook'] = currentAccountBook.accountBookName

    return result

def getAccountType(user):
    return AccountType.objects.filter(Q(user=None) | Q(user=user)).values_list('name', flat=True)

class Accounting():
    def __init__(self, user):
        self.user = user
        self.userSetting = user.usersetting
        self.accountBook = self.getAccountBook(None)
        self.account = self.getAccount(None)

    def getAccountBook(self, accountBookName):
        if accountBookName:
            return AccountBook.objects.get(user=self.user, accountBookName=accountBookName)
        else:
            return AccountBook.objects.get(user=self.user, pk=self.userSetting.defaultAccountBook.pk)

    def getAccount(self, accountName):
        if accountName:
            return Account.objects.get(accountBook=self.accountBook, accountName=accountName)
        else:
            return Account.objects.get(accountBook=self.accountBook, pk=self.userSetting.defaultAccount.pk)

    def accounting(self, value, currency, type, date, remark, accountingType, accountBook, account):
        if accountBook != self.accountBook.accountBookName:
            self.accountBook = self.getAccountBook(accountBook)

        if account == _('total property'):
            if self.userSetting.defaultAccount != self.account:
                self.account = self.getAccount(None)
        elif account != self.account.accountName:
            self.account = self.getAccount(account)

        accountType = AccountType.objects.get(Q(user=None) | Q(user=self.user), name=accountingType)
        currentCurrency = Currency.objects.get(code=currency)
        if type == stateCode.INCOME:
            income = Income(account=self.account, type=accountType, date=date, value=value, currency=currentCurrency, remark=remark)
            income.save()
        elif type == stateCode.OUTCOME:
            outcome = Outcome(account=self.account, type=accountType, date=date, value=value, currency=currentCurrency, remark=remark)
            outcome.save()

        self.accountSync()
        self.accountTotalSync()

    def accountSync(self):
        incomeCurrencies = Income.objects.filter(account=self.account).distinct('currency').values_list('currency', flat=True)
        outcomeCurrencies = Outcome.objects.filter(account=self.account).distinct('currency').values_list('currency', flat=True)
        total = 0
        for currencyId in incomeCurrencies:
            currency = Currency.objects.get(pk=currencyId)
            income = Income.objects.filter(account=self.account, currency=currency)
            if currency == self.account.currency:
                total += income.aggregate(totalValue=Sum('value'))['totalValue']
            else:
                rate = CurrencyRate.objects.get(currency=currency.pk, toCurrency=self.account.currency.pk).rate
                total += income.aggregate(totalValue=Sum('value'))['totalValue'] * rate

        for currencyId in outcomeCurrencies:
            currency = Currency.objects.get(pk=currencyId)
            outcome = Outcome.objects.filter(account=self.account, currency=currency)
            if currency == self.account.currency:
                total -= outcome.aggregate(totalValue=Sum('value'))['totalValue']
            else:
                rate = CurrencyRate.objects.get(currency=currency.pk, toCurrency=self.account.currency.pk).rate
                total -= outcome.aggregate(totalValue=Sum('value'))['totalValue'] * rate

        self.account.total = total
        self.account.save()

    def accountTotalSync(self):
        accounts = Account.objects.filter(accountBook=self.accountBook)
        total = 0
        for account in accounts:
            if account.currency == self.userSetting.defaultCurrency:
                total += account.total
            else:
                rate = CurrencyRate.objects.get(currency=account.currency, toCurrency=self.userSetting.defaultCurrency).rate
                total += account.total * rate

        self.userSetting.totalProperty = total
        self.userSetting.save()

class CurrencyHandler():
    def __init__(self):
        self.currencyMap = {'zh-hans': 'CNY', 'en': 'USD'}
        self.currencyNameMap = {'zh-hans': 'name_zh_cn', 'en': 'name_en'}
        self.defaultCurrencyMap = 'zh-hans'

    @property
    def lanCode(self):
        code = get_language()
        if code not in self.currencyMap:
            code = self.defaultCurrencyMap
        return code

    @property
    def defaultCurrency(self):
        return Currency.objects.get(code=self.currencyMap[self.lanCode])

    @property
    def allCurrency(self):
        return Currency.objects.annotate(name=F(self.currencyNameMap[self.lanCode])).values('name', 'code')

def getFinanceData(user, year, month, day, type, accountBookName, accountName):
    if year == '0':
        return []

    if type == stateCode.INCOME:
        accountingModel = Income
    elif type == stateCode.OUTCOME:
        accountingModel = Outcome
    else:
        return  []

    if not user or not user.usersetting or not user.usersetting.defaultAccount:
        return []

    if accountBookName and accountName:
        accountBook = AccountBook.objects.get(user=user, accountBookName=accountBookName)
        account = Account.objects.get(accountBook=accountBook, accountName=accountName)
    else:
        account = user.usersetting.defaultAccount
    if month == '0':
        return accountingModel.objects.filter(account = account, date__year = year).values('date', 'value')
    elif day == '0':
        return accountingModel.objects.filter(account = account, date__year = year, date__month = month).values('date', 'value')
    else:
        return accountingModel.objects.filter(account = account, date__year = year, date__month = month, date__day = day).values('date', 'value')

def addAccountBook(user, accountBookName, remark):
    accountBook = AccountBook(user=user, accountBookName=accountBookName, remark=remark)
    accountBook.save()

def addAccount(user, accountBookName, accountName, currency, webUrl, remark):
    accountBook = AccountBook.objects.get(user=user, accountBookName=accountBookName)
    currentCurrency = Currency.objects.get(code=currency)
    account = Account(accountBook=accountBook, accountName=accountName, currency=currentCurrency, webUrl=webUrl, remark=remark)
    account.save()

currency = CurrencyHandler()