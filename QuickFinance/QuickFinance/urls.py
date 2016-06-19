"""
Definition of urls for QuickFinance.
"""
from django.conf.urls import url, include
import quick.views as quickView

urlpatterns = [
    url(r'^$', quickView.home, name='home'),
    url(r'^quick/', include('quick.urls')),
]