from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.template import Template, Context
from django.urls import reverse

plain_text_template = Template(
    '''
    Welcome, {{username}}. Please use the following link to activate your account.
    {{link_url}}
    '''
)

def send_magic_link(magic_link, request):
    context = magic_link_to_context(magic_link, request)
    text_content = plain_text_template.render(context)
    send_mail('Welcome.',
        text_content,
        'donotreply@bidsoup.com',
        (magic_link.user.email,))

def magic_link_to_context(magic, request):
    url = request.build_absolute_uri(reverse('bids:confirm', args=(magic.link,)))
    return Context({'username': magic.user.username, 'link_url': url})
