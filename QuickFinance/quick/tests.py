"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

import time
import django
from django.test import TestCase
from .util import createUserAndInit

# TODO: Configure your database in settings.py and sync before running tests.

class QuickTest(TestCase):
    """Tests for the application views."""

    if django.VERSION[:2] >= (1, 7):
        # Django 1.7 requires an explicit setup() when running tests in PTVS
        @classmethod
        def setUpClass(cls):
            django.setup()

    def createUserAndInitTest(self):
        timeStamp = int(time.time())
        userName = 'test' + str(timeStamp)
        password = '123456'
        email = None
        createUserAndInit(userName, email, password)
        # self.assertEqual(1 + 1, 2)
