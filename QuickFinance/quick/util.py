from QuickFinance import settings
from django.contrib.auth.models import User
from .models import AccountBook, Account ,AccountType ,Income, Outcome
from django.utils.translation import ugettext as _

def debug(func):
    if settings.DEBUG:
        return func

def createUserAndInit(userName, email, password):
    user = User.objects.create_user(userName, email, password)
    user.save()

    accountBook = AccountBook(user=user, accountBookName=_('defaultAccountBook'))
    accountBook.save()

    account = Account(accountBook=accountBook, accountName=_('wallet'))
    account.save()

    return user