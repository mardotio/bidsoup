from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from django.contrib.auth.models import AnonymousUser
from django.utils.functional import SimpleLazyObject
from rest_framework import exceptions

def get_user_from_jwt(request):
    if not hasattr(request, '_cached_user'):
        user = None
        try:
            authenticated = JSONWebTokenAuthentication().authenticate(request)
            if authenticated:
                user = authenticated[0]
        except exceptions.AuthenticationFailed as err:
            print(err)

        request._cached_user = user or AnonymousUser()

    return request._cached_user

def jwt_auth_middleware(get_response):
    """Sets the user object from a JWT header"""
    def middleware(request):
        request.user = SimpleLazyObject(lambda: get_user_from_jwt(request))

        response = get_response(request)

        return response

    return middleware

def fake_session(get_response):
    """Adds a session key to pass some django assertions"""
    def middleware(request):
        if not hasattr(request, 'session'):
            request.session = None

        return get_response(request)

    return middleware
