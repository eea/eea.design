""" EEA Design
"""
from zope.i18nmessageid.message import MessageFactory

EEAMessageFactory = MessageFactory('eea')
EEANOTRANSLATIONMessageFactory = MessageFactory('eea.notranslation')

def initialize(context):
    """Initializer called when used as a Zope 2 product."""
