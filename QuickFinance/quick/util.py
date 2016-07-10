from QuickFinance import settings

def debug(func):
    if settings.DEBUG:
        return func