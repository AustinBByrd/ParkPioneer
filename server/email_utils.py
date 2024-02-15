# email_utils.py

from flask import current_app
from flask_mail import Message

def send_email(subject, recipients, body):
    with current_app.app_context():
        msg = Message(subject, recipients=recipients, body=body)
        current_app.mail.send(msg)
