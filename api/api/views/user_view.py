from django.conf.urls import url
from django.http import (
    HttpResponseForbidden
)
from django.http.request import HttpRequest
from django.middleware.csrf import get_token
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models.user import User
from core.auth import build_get_user_object
from urllib.parse import urlparse


class UserView(APIView):
    def put(self, request):
        if (not isinstance(request.user, User)):
            return HttpResponseForbidden()
        location = request.data.get("location")
        request.user.location = location
        request.user.save()
        return Response(status=204)

    def get(self, request: Request):
        http_host = request.META.get('HTTP_REFERER')
        parsed_url = urlparse(http_host)
        logged_in = isinstance(request.user, User)
        info = build_get_user_object(logged_in, parsed_url, request)
        info["location"] = logged_in and request.user.location
        ret = Response(info)
        ret.set_cookie("csrftoken", get_token(request))
        return ret
