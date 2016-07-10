"""
Definition of urls for QuickFinance.
"""
from django.conf.urls import url, include
import quick.views as quickView
from .settings import DEBUG

urlpatterns = [
    url(r'^$', quickView.home, name='home'),
    url(r'^quick/', include('quick.urls')),
]

if DEBUG:
    urlpatterns.append(url(r'test', quickView.test, name='home'))