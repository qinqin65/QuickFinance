from django.db import models
from django.contrib.auth.models import User

class AccountBook(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    accountBookName = models.CharField(max_length=200)
    remark = models.TextField()

class Currency(models.Model):
    code = models.CharField(max_length=20, unique=True)
    symbol = models.CharField(max_length=20)
    name_zh_cn = models.CharField(max_length=20)
    name_en = models.CharField(max_length=20)

class Account(models.Model):
    accountBook = models.ForeignKey(AccountBook, on_delete=models.CASCADE)
    accountName = models.CharField(max_length=200)
    currency = models.ForeignKey(Currency, null=True, on_delete=models.SET_NULL)
    total = models.FloatField(default=0)
    webUrl = models.URLField()
    remark = models.TextField()

class AccountType(models.Model):
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    name = models.CharField(max_length=20)
    remark = models.TextField()

class Income(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    type = models.ForeignKey(AccountType, on_delete=models.CASCADE)
    date = models.DateTimeField()
    value = models.FloatField()
    currency = models.ForeignKey(Currency, null=True, on_delete=models.SET_NULL)
    remark = models.TextField()

class Outcome(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    type = models.ForeignKey(AccountType, on_delete=models.CASCADE)
    date = models.DateTimeField()
    value = models.FloatField()
    currency = models.ForeignKey(Currency, null=True, on_delete=models.SET_NULL)
    remark = models.TextField()

class UserSetting(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    totalProperty = models.FloatField(default=0)
    defaultAccountBook = models.ForeignKey(AccountBook, null=True, on_delete=models.SET_NULL)
    defaultAccount = models.ForeignKey(Account, null=True, on_delete=models.SET_NULL)
    defaultCurrency = models.ForeignKey(Currency, null=True, on_delete=models.SET_NULL)

class CurrencyRate(models.Model):
    currency = models.IntegerField()
    toCurrency = models.IntegerField()
    rate = models.FloatField()