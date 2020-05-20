from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'login', views.login, name='login'),
    url(r'logout', views.logout, name='logout'),
    url(r'register', views.register, name='register'),
    url(r'changingPassword', views.changingPassword, name='changingPassword'),
    url(r'accountBookData', views.accountBookData, name='accountBookData'),
    url(r'currencySelectStore', views.currencySelectStore, name='currencySelectStore'),
    url(r'accountTypeSelectStore', views.accountTypeSelectStore, name='accountTypeSelectStore'),
    url(r'accounting', views.accounting, name='accounting'),
    url(r'financePreviewData', views.financePreviewData, name='financePreviewData'),
    url(r'addAccountBook', views.addAccountBook, name='addAccountBook'),
    url(r'addAccount', views.addAccount, name='addAccount'),
]