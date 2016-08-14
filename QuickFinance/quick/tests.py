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

    def createUserAndInitTest(self):
        timeStamp = int(time.time())
        userName = 'test' + str(timeStamp)
        password = '123456'
        email = None
        user = createUserAndInit(userName, email, password)
        self.assertEqual(userName, user.username, 'the name of created user must match the userName which is auto genereted by time string')
