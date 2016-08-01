from django.db import models
from django.contrib.auth.models import User

class AccountBook(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    accountBookName = models.CharField(max_length=200)
    remark = models.TextField()

class Account(models.Model):
    accountBook = models.ForeignKey(AccountBook, on_delete=models.CASCADE)
    accountName = models.CharField(max_length=200)
    total = models.IntegerField(default=0)
    webUrl = models.URLField()
    remark = models.TextField()

class AccountType(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=20)
    remark = models.TextField()

class Currency(models.Model):
    code = models.CharField(max_length=20, unique=True)
    symbol = models.CharField(max_length=20)
    name_zh_cn = models.CharField(max_length=20)

class Income(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    type = models.ForeignKey(AccountType, on_delete=models.CASCADE)
    date = models.DateTimeField()
    value = models.IntegerField()
    currency = models.ForeignKey(Currency, on_delete=models.DO_NOTHING)
    remark = models.TextField()

class Outcome(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    type = models.ForeignKey(AccountType, on_delete=models.CASCADE)
    date = models.DateTimeField()
    value = models.IntegerField()
    currency = models.ForeignKey(Currency, on_delete=models.DO_NOTHING)
    remark = models.TextField()

class UserSetting(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    defaultAccountBook = models.OneToOneField(AccountBook, on_delete=models.DO_NOTHING)
    defaultCurrency = models.OneToOneField(AccountBook, on_delete=models.DO_NOTHING)