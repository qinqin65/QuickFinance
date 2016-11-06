"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

import time
from django.utils import timezone
from django.test import TestCase
from django.contrib.auth.models import User
from .models import AccountBook, Account ,AccountType ,Income, Outcome, UserSetting, Currency, CurrencyRate
from .util import initAccount, createUserAndInit, getAccountType, Accounting, getAccountBook, getFinanceData, addAccountBookUtil, addAccountUtil
from . import stateCode
import random,datetime

# TODO: Configure your database in settings.py and sync before running tests.

class QuickTest(TestCase):
    fixtures = ['defaultDbData.json']

    def setUp(self):
        pass

    @staticmethod
    def genUserInfo(suffix=''):
        timeStamp = int(time.time())
        userName = 'test' + suffix + str(timeStamp)
        password = '123456'
        email = None

        return userName, password, email

    def test_initAccount(self):
        userName, password, email = self.genUserInfo()
        user = User.objects.create_user(userName, email, password)
        user.save()

        initAccount(user)

        accountBook = AccountBook.objects.filter(user=user).first()
        account = Account.objects.filter(accountBook=accountBook).first()
        userSetting = UserSetting.objects.get(user=user)

        self.assertEqual(userSetting.defaultAccountBook, accountBook, 'user default accountboot should inited correctly')
        self.assertEqual(userSetting.defaultAccount, account, 'user default account should inited correctly')

    def test_createUserAndInit(self):
        userName, password, email = self.genUserInfo()
        user = createUserAndInit(userName, email, password)
        self.assertEqual(userName, user.username, 'the name of created user must match the userName which is auto genereted by time string')

    def test_getAccountType(self):
        userName, password, email = self.genUserInfo()
        user = createUserAndInit(userName, email, password)
        accountType = getAccountType(user)

        self.assertEqual(len(accountType), 28, 'default count of account type is 28')

    def test_getAccountBook(self):
        userName, password, email = self.genUserInfo()
        user = createUserAndInit(userName, email, password)
        accountBook = user.usersetting.defaultAccountBook.accountBookName

        result = getAccountBook(user, accountBook)

        self.assertTrue(isinstance(result['accountBooks'], list), 'accountBooks must be a list')
        self.assertTrue(isinstance(result['accounts'], list), 'accounts must be a list')
        self.assertTrue(isinstance(result['accountBooks'][0], dict), 'accountBooks\' item must be a dict')
        self.assertTrue(isinstance(result['accounts'][0], dict), 'accounts\' item must be a dict')

    def test_Accounting(self):
        userName, password, email = self.genUserInfo()
        user = createUserAndInit(userName, email, password)

        value = 20
        currency = 'CNY'
        type = stateCode.INCOME
        date = timezone.now()
        remark = 'test'
        accountType = getAccountType(user)[0]
        accountBook = user.usersetting.defaultAccountBook.accountBookName
        accountName = user.usersetting.defaultAccount.accountName

        accounting = Accounting(user)
        accounting.accounting(value, currency, type, date, remark, accountType, accountBook, accountName)
        income = Income.objects.get(account=user.usersetting.defaultAccount, date=date)
        account = Account.objects.get(accountBook=user.usersetting.defaultAccountBook)

        self.assertEqual(income.value, 20, 'it should be 20 after accounting income for 20')
        self.assertEqual(user.usersetting.totalProperty, 20, 'user total property should be 20 after accounting income for 20')
        self.assertEqual(account.total, 20, 'account total should be 20 after accounting income for 20')

    def test_getFinanceData(self):
        userName, password, email = self.genUserInfo()
        userName2 , password2, email2 = self.genUserInfo('2')
        user = createUserAndInit(userName, email, password)
        user2 = createUserAndInit(userName2 , password2, email2)
        accounting = Accounting(user)
        accounting2 = Accounting(user2)
        currency = 'CNY'
        accountType = getAccountType(user)[0]
        accountBook = user.usersetting.defaultAccountBook.accountBookName
        accountName = user.usersetting.defaultAccount.accountName
        accountType2 = getAccountType(user2)[0]
        accountBook2 = user2.usersetting.defaultAccountBook.accountBookName
        accountName2 = user2.usersetting.defaultAccount.accountName
        accounting.accounting(20, currency, stateCode.OUTCOME, datetime.datetime(2014, 8, 1), None, accountType, accountBook, accountName)
        accounting.accounting(30, currency, stateCode.OUTCOME, datetime.datetime(2015, 9, 1), None, accountType, accountBook, accountName)
        accounting.accounting(40, currency, stateCode.OUTCOME, datetime.datetime(2016, 9, 5), None, accountType, accountBook, accountName)
        accounting.accounting(40, currency, stateCode.OUTCOME, datetime.datetime(2016, 8, 8, 1), None, accountType, accountBook, accountName)
        accounting.accounting(40, currency, stateCode.OUTCOME, datetime.datetime(2016, 8, 8, 2, 30), None, accountType, accountBook, accountName)
        accounting.accounting(40, currency, stateCode.OUTCOME, datetime.datetime(2016, 8, 8, 2, 45), None, accountType, accountBook, accountName)
        accounting.accounting(40, currency, stateCode.OUTCOME, datetime.datetime(2016, 8, 10), None, accountType, accountBook, accountName)
        accounting.accounting(50, currency, stateCode.INCOME, datetime.datetime(2016, 5, 10), None, accountType, accountBook, accountName)
        accounting2.accounting(60, currency, stateCode.OUTCOME, datetime.datetime(2016, 8, 10), None, accountType2, accountBook2, accountName2)

        testOutcomeDataYear = getFinanceData(user, '2016', '0', '0', stateCode.OUTCOME, accountBook, accountName)
        self.assertEqual(len(testOutcomeDataYear), 5, 'the count of outcome type of record of year must be 5')
        testOutcomeDataMonth = getFinanceData(user, '2016', '8', '0', stateCode.OUTCOME, None, None)
        self.assertEqual(len(testOutcomeDataMonth), 4, 'the count of outcome type of record of month must be 4')
        testOutcomeDataDay = getFinanceData(user, '2016', '8', '8', stateCode.OUTCOME, None, None)
        self.assertEqual(len(testOutcomeDataDay), 3, 'the count of outcome type of record of day must be 3')
        testIncomeDataYear = getFinanceData(user, '2016', '5', '0', stateCode.INCOME, None, None)
        self.assertEqual(len(testIncomeDataYear), 1, 'the count of income type of record of year must be 1')
        testOutcomeDataYear2 = getFinanceData(user2, '2016', '0', '0', stateCode.OUTCOME, None, None)
        self.assertEqual(len(testOutcomeDataYear2), 1, 'the count of outcome type of record of year of user2 must be 1')

    def test_addAccountBook(self):
        userName, password, email = self.genUserInfo()
        user = createUserAndInit(userName, email, password)

        testAccountBookName = 'testAccountBook'
        testRemark = 'test'
        addAccountBookUtil(user, testAccountBookName, testRemark)

        accountBook = AccountBook.objects.filter(user=user, accountBookName=testAccountBookName)
        self.assertEqual(len(accountBook), 1, 'the count of account book must be 1 if added successfully')

    def test_addAccount(self):
        userName, password, email = self.genUserInfo()
        user = createUserAndInit(userName, email, password)

        testAccountBook = user.usersetting.defaultAccountBook
        testAccountName = 'testAccount'
        testAccountName2 = 'testAccount2'
        currency = user.usersetting.defaultCurrency
        webUrl = 'www.test.com'
        testRemark = 'test'

        addAccountUtil(user, testAccountBook.accountBookName, testAccountName, currency.code, webUrl, testRemark)

        account = Account.objects.filter(accountBook=testAccountBook, accountName=testAccountName)
        self.assertEqual(len(account), 1, 'the count of account must be 1 if added successfully')

        addAccountUtil(user, '', testAccountName2, currency.code, webUrl, testRemark)

        account = Account.objects.filter(accountBook=user.usersetting.defaultAccountBook, accountName=testAccountName2)
        self.assertEqual(len(account), 1, 'the count of account must be 1 if added account with default account book successfully')