"""
Definition of urls for QuickFinance.
"""

from datetime import datetime
from django.conf.urls import patterns, url

import django.contrib.auth.views as djangoAuthView
import quick.views as quickView
#from app.forms import BootstrapAuthenticationForm

# Uncomment the next lines to enable the admin:
# from django.conf.urls import include
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^$', quickView.home, name='home'),
    # Examples:
    #url(r'^$', 'app.views.home', name='home'),
    url(r'^contact$', 'app.views.contact', name='contact'),
    url(r'^about', 'app.views.about', name='about'),
    url(r'^login/$',
        djangoAuthView.login,
        {
            'template_name': 'app/login.html',
            # 'authentication_form': BootstrapAuthenticationForm,
            'extra_context':
            {
                'title':'Log in',
                'year':datetime.now().year,
            }
        },
        name='login'),
    url(r'^logout$',
        djangoAuthView.logout,
        {
            'next_page': '/',
        },
        name='logout'),

   # Uncomment the admin/doc line below to enable admin documentation:
   # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

   # Uncomment the next line to enable the admin:
   # url(r'^admin/', include(admin.site.urls)),
)
