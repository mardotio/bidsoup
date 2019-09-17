from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.template import Template, Context
from django.urls import reverse
from textwrap import dedent
import os
import requests

DISCORD_HOOK_URL = os.environ.get('DISCORD_HOOK_URL')

plain_text_template = Template(
    '''
    Welcome, {{username}}. Please use the following link to activate your account.
    {{link_url}}
    '''
)

discord_template = Template(
    '''
    Account created for user: `{{username}}`.
    **Send email:** {{link_url}}?send
    **Delete:** {{link_url}}?delete
    '''
)

def send_magic_link_email(magic_link, request):
    context = magic_link_to_context(magic_link, request)
    text_content = dedent(plain_text_template.render(context))
    send_mail('Welcome.',
        text_content,
        'donotreply@bidsoup.com',
        (magic_link.user.email,))

def send_magic_link_discord(magic_link, request):
    context = magic_link_to_context(magic_link, request)
    content = dedent(discord_template.render(context))
    if DISCORD_HOOK_URL:
        requests.post(DISCORD_HOOK_URL, json={'content': content})
    else:
        print(content)

def magic_link_to_context(magic, request):
    url = request.build_absolute_uri(reverse('confirm', args=(magic.link,)))
    return Context({'username': magic.user.username, 'link_url': url})
