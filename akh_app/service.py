from django.shortcuts import render, HttpResponseRedirect, HttpResponse
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from wagtail.core.models import Page
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from .tokens import account_activation_token
from .api import execute_request
from .models import OwnerMenu, AuthMenu, AdminMenu, EmailSettings, PasswordResetEmail, AccountActivationPage
from akh_project.settings import base as settings
from wagtail.images.models import Image

import smtplib


def generate_email_message(current_site, user, mail_settings, subject, url_path):
    if url_path == 'changepassword':
        message = PasswordResetEmail.objects.first().email_message
    else:
        message = AccountActivationPage.objects.first().email_message
    reset_path = "http://{0}/{1}/{2}/{3}/".format(
        current_site,
        url_path,
        urlsafe_base64_encode(force_bytes(user.get('id'))),
        account_activation_token.make_token(user)
    )
    reset_message_array = message.split('|')
    reset_link = '<a href="{0}">{1}</a>'.format(reset_path, reset_message_array[1])
    reset_message_array[1] = reset_link
    message = "".join(reset_message_array)
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = mail_settings.email_host_user
    msg['To'] = user.get('email')
    part1 = MIMEText(message, 'plain')
    part2 = MIMEText(message, 'html')
    msg.attach(part1)
    msg.attach(part2)
    return msg


def send_email_message(request, user, subject, url_path, action_id):
    current_site = get_current_site(request)
    try:
        mail_settings = EmailSettings.objects.first()
        with smtplib.SMTP(mail_settings.email_host, settings.EMAIL_PORT) as server:
            server.login(mail_settings.email_host_user, mail_settings.email_host_password)
            message = generate_email_message(current_site, user, mail_settings, subject, url_path)
            server.sendmail(mail_settings.email_host_user, user.get('email'), message.as_string())
            request.session['action_id'] = action_id
    except smtplib.SMTPException as e:
        print(e)


def get_menus(menu_index, request):
    menus_list = list()
    if menu_index == 1:
        ordered_list = OwnerMenu.objects.all().order_by('priority')
    elif menu_index == 2:
        ordered_list = AuthMenu.objects.all().order_by('priority')
    elif menu_index == 3:
        ordered_list = AdminMenu.objects.all().order_by('priority')
    for menu_item in ordered_list:
        raw_item = menu_item.__dict__
        raw_item['is_show'] = 1
        if menu_index == 1:
            allowed_configs = [x.config_id for x in menu_item.configuration.all()]
            if request.session.get('config_id', None) is None:
                raw_item['is_show'] = 1 if len(allowed_configs) == 3 else 0
            elif request.session['config_id'] not in allowed_configs:
                raw_item['is_show'] = 0
        redirect_page = Page.objects.get(id=raw_item['related_page_id'])
        page_dict = redirect_page.__dict__
        del page_dict['_state']
        redirect_path = page_dict['url_path']
        new_redirect_path = '/'.join(redirect_path.split('/')[2:])
        raw_item['redirect_path'] = "/{0}".format(new_redirect_path)
        del raw_item['_state']
        raw_item['icon_path'] = str(Image.objects.get(id=raw_item['icon_id']))
        raw_item['icon_hover_path'] = str(Image.objects.get(id=raw_item['icon_hover_id']))
        menus_list.append(raw_item)
    return menus_list


def get_api_links(page):
    api_links = [dict(item.value) for item in page.api_links]
    return api_links
