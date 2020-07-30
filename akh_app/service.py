from django.shortcuts import render, HttpResponseRedirect, HttpResponse
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.template.loader import render_to_string


from .tokens import account_activation_token
from .models import LeftMenu, EmailSettings
from akh_project.settings import base as settings

import smtplib


def send_email_message(request, user, template, action_id):
    current_site = get_current_site(request)

    message = render_to_string(template, {
        'username': user['firstName'] if action_id == 1 else "",
        'domain': current_site.domain,
        'uid': urlsafe_base64_encode(force_bytes(user.get('id'))),
        'token': account_activation_token.make_token(user),
    })

    try:
        mail_settings = EmailSettings.objects.first()
        with smtplib.SMTP(mail_settings.email_host, settings.EMAIL_PORT) as server:
            server.login(mail_settings.email_host_user, mail_settings.email_host_password)
            server.sendmail(mail_settings.email_host_user, user.get('email'), message)
            request.session['action_id'] = action_id
    except smtplib.SMTPException as e:
        print(e)


def get_menus(is_auth=False):
    auth_menus = ['Регистрация', 'Вход на сайт']
    if is_auth:
        menus_queryset = list(LeftMenu.objects.filter(menu_label__in=auth_menus))
    else:
        menus_queryset = list(LeftMenu.objects.all().exclude(menu_label__in=auth_menus))
    json_menus = []
    for menu in menus_queryset:
        values = [menu.menu_label, str(menu.menu_icon)]
        json_menus.append(values)
    return json_menus


def get_api_links(page):
    api_links = [dict(item.value) for item in page.api_links]
    return api_links
