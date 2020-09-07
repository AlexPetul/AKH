from django.http import JsonResponse
from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode
from django.core.exceptions import ObjectDoesNotExist
from wagtail.core.blocks.stream_block import StreamValue


from akh_project.settings import base as settings
from home import models as HomePageModels
from .models import *
from .service import *
from .api import *

import json
import requests


def generate_public_token():
    api_settings = SettingsPage.objects.first()
    url = "{0}login".format(api_settings.api_path)
    payload = '{"login": "portal@portal.ru","password": "portal"}'
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.request("POST", url, headers=headers, data=payload)
    response_json = json.loads(response.text)
    token = response_json['data']['token']

    portal_user = PortalCredentials.objects.first()
    portal_user.portal_token = token
    portal_user.save()


def create_page_content(page):
    new_page = {}
    for key, value in page.__dict__.items():
        if isinstance(value, StreamValue) and str(key) != 'api_links':
            new_pair = {int(dict(item.value).get('lang_id', None)): dict(item.value).get('content', None) for item in
                        value}
            new_page[key] = new_pair
        elif isinstance(value, bool) and value is not None:
            new_page[key] = int(value)
        elif not isinstance(value, datetime.datetime) and value is not None:
            new_page[key] = value
    del new_page['_state']
    del new_page['api_links']
    return new_page


def get_default_context(page, request, menu_index):
    context = {
        'page': page,
        'page_content': create_page_content(page),
        'menus': get_menus(menu_index, request),
        'api_links': get_api_links(page),
        'portal_token': PortalCredentials.objects.first().portal_token,
        'language_id': request.session.get('language_id', None) if request.session.get('language_id', None) else 1,
        'api_path': SettingsPage.objects.first().api_path
    }
    return context


def login_view(request):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body_data = json.loads(body_unicode)
        request.session['role_id'] = body_data['role_id']
        request.session['token'] = body_data['token']

        users = UsersWaitingForActivation.objects.filter(user_id=int(body_data['user_id']))
        if len(users) == 0:
            return HttpResponse(json.dumps({'user_activated': True}), content_type="application/json")
        else:
            return HttpResponse(json.dumps({'user_activated': False}), content_type="application/json")
    context = get_default_context(LoginPage.objects.first(), request, 2)
    return render(request, 'akh_app/auth/login.html', context)


@check_token
def owner_profile_view(request):
    context = get_default_context(OwnerProfile.objects.first(), request, 1)
    return render(request, 'akh_app/owner/owner_profile.html', context)


@check_token
@is_configuration_currency_chosen
def owner_storages_view(request):
    context = get_default_context(StoragesPage.objects.first(), request, 1)
    return render(request, 'akh_app/owner/owner_storages.html', context)


@check_token
@is_configuration_currency_chosen
def owner_stowage_view(request):
    context = get_default_context(StowagePage.objects.first(), request, 1)
    return render(request, 'akh_app/owner/owner_stowage.html', context)


@check_token
@is_configuration_currency_chosen
def owner_tariffs_view(request):
    context = get_default_context(TariffsPage.objects.first(), request, 1)
    context['languages_icons'] = {x.language_id: str(x.language_icon) for x in LanguageIcons.objects.all()}
    return render(request, 'akh_app/owner/owner_tariffs.html', context)


@check_token
def base_page_view(request):
    return HttpResponseRedirect('/owner/')


def reset_password_view(request):
    context = get_default_context(PasswordReset.objects.first(), request, 2)
    return render(request, 'akh_app/auth/password_reset.html', context)


def send_confirmation_mail(request):
    body_unicode = request.body.decode('utf-8')
    body_data = json.loads(body_unicode)
    user = body_data.get('user')[0]
    send_email_message(
        request=request,
        user=user,
        subject='Восстановление пароля',
        url_path='changepassword',
        action_id=1
    )
    return JsonResponse({})


def save_inactive_user(request):
    body_unicode = request.body.decode('utf-8')
    body_data = json.loads(body_unicode)
    new_user_id = body_data['newUserId']
    user_email = body_data['email']
    user = {'id': new_user_id, 'roleId': 104, 'email': user_email}
    if not UsersWaitingForActivation.objects.exists():
        UsersWaitingForActivation.objects.create(user_id=new_user_id)
    send_email_message(
        request=request,
        user=user,
        subject='Активация аккаунта',
        url_path='activate-account',
        action_id=2
    )
    return JsonResponse({})


def registration_view(request):
    context = get_default_context(RegistrationPage.objects.first(), request, 2)
    return render(request, 'akh_app/auth/registration.html', context)


@check_token
def configuration_view(request):
    response = execute_request(url='getTerminalGroups', token=request.session['token'], method="GET", context_id=request.session.get('context_id', None))
    terminals_count = response['data']['list'][0]['terminalsCount']
    if terminals_count != 0:
        return HttpResponseRedirect("/owner/")

    config_page = SelectConfigurationPage.objects.first()
    config_dict = dict()
    config_dict[config_page.akh_id] = str(config_page.akh_icon)
    config_dict[config_page.e_safe_id] = str(config_page.e_safe_icon)
    config_dict[config_page.concierge_id] = str(config_page.concierge_icon)
    context = get_default_context(SelectConfigurationPage.objects.first(), request, 1)
    context['config_icons'] = config_dict
    return render(request, 'akh_app/owner/owner_select_configuration.html', context)


@check_token
@is_configuration_currency_chosen
def owner_collections_view(request):
    context = get_default_context(OwnerCollectionsPage.objects.first(), request, 1)
    return render(request, 'akh_app/owner/owner_collections.html', context)


@check_token
@is_configuration_currency_chosen
def owner_payments_view(request):
    context = get_default_context(OwnerPaymentsPage.objects.first(), request, 1)
    return render(request, 'akh_app/owner/owner_payments.html', context)


@check_token
@is_configuration_currency_chosen
def owner_accesses_view(request):
    context = get_default_context(AccessesPage.objects.first(), request, 1)
    return render(request, 'akh_app/owner/owner_accesses.html', context)


@check_token
@is_configuration_currency_chosen
def owner_terminals_view(request):
    context = get_default_context(OwnerTerminalsPage.objects.first(), request, 1)

    context['status_colors'] = {status.status_id: status.color_code for status in TerminalStatusesColors.objects.all()}
    context['message_types'] = {mes_type.message_id: [str(mes_type.message_icon), mes_type.message_name]
                                for mes_type in TerminalMessagesType.objects.all()}
    return render(request, 'akh_app/owner/owner_terminals.html', context)


@check_token
def administrator_main_view(request):
    context = get_default_context(AdministratorMainPage.objects.first(), request, 3)
    context['message_types'] = {mes_type.message_id: [str(mes_type.message_icon), mes_type.message_name]
                                for mes_type in TerminalMessagesType.objects.all()}
    return render(request, 'akh_app/administrator/administrator_main.html', context)


@check_token
def administrator_terminals_view(request):
    context = get_default_context(AdministratorTerminals.objects.first(), request, 3)
    context['key_activation_time'] = SettingsPage.objects.first().key_activation_time
    context['status_colors'] = {status.status_id: status.color_code for status in TerminalStatusesColors.objects.all()}
    return render(request, 'akh_app/administrator/administrator_terminals.html', context)


@check_token
@is_configuration_currency_chosen
def dictionaries_view(request):
    context = get_default_context(DictionaryPage.objects.first(), request, 1)
    context['languages_icons'] = {x.language_id: str(x.language_icon) for x in LanguageIcons.objects.all()}
    return render(request, 'akh_app/owner/owner_dictionary.html', context)


@check_token
def administrator_profile_view(request):
    context = get_default_context(AdministratorProfile.objects.first(), request, 3)
    return render(request, 'akh_app/administrator/administrator_profile.html', context)


@check_token
def administrator_terminalgroups_view(request):
    context = get_default_context(TerminalGroupsPage.objects.first(), request, 3)
    return render(request, 'akh_app/administrator/administrator_groups.html', context)


@check_token
def administrator_employees_view(request):
    context = get_default_context(AdminEmployeesPage.objects.first(), request, 3)
    context['is_admin'] = 1 if request.session.get('role_id') != 104 else 0
    context['is_superadmin'] = 1 if request.session.get('role_id') == 102 else 0
    return render(request, 'akh_app/administrator/administrator_employees.html', context)


@check_token
@is_configuration_currency_chosen
def owner_employees_view(request):
    context = get_default_context(OwnerEmpoloyeesPage.objects.first(), request, 1)
    return render(request, 'akh_app/owner/owner_employees.html', context)


@check_token
@is_configuration_currency_chosen
def owner_clients_view(request):
    context = get_default_context(OwnerClients.objects.first(), request, 1)
    return render(request, 'akh_app/owner/owner_clients.html', context)


@check_token
@is_configuration_currency_chosen
def owner_receivers_view(request):
    context = get_default_context(OwnerReceivers.objects.first(), request, 1)
    return render(request, 'akh_app/owner/owner_clients.html', context)


@check_token
@is_configuration_currency_chosen
def index_view(request):
    context = get_default_context(HomePageModels.HomePage.objects.first(), request, 1)
    context['message_types'] = {mes_type.message_id: [str(mes_type.message_icon), mes_type.message_name] for mes_type in TerminalMessagesType.objects.all()}
    return render(request, 'akh_app/owner/owner_main.html', context)


def logout_view(request):
    request.session.clear()
    return JsonResponse({})


def save_configuration_view(request):
    request.session['config_chosen'] = True
    return JsonResponse({})


def activate_account(request, uidb64, token):
    user, uid = get_inactive_user(uidb64)

    try:
        if user is not None and account_activation_token.check_token(user, token):
            UsersWaitingForActivation.objects.get(user_id=int(uid)).delete()
            return HttpResponseRedirect('/login/')
    except ObjectDoesNotExist:
        return HttpResponse("<h1>Invalid token, please try again</h1>")
    else:
        return HttpResponse("<h1>Invalid token, please try again</h1>")


def change_password_view(request, uidb64, token):
    user, uid = get_inactive_user(uidb64)

    if user is not None and account_activation_token.check_token(user, token):
        context = get_default_context(ChangePassword.objects.first(), request, 2)
        context['user_id'] = uid
        return render(request, 'akh_app/auth/change_password.html', context)
    else:
        return HttpResponse("<h1>Invalid token, please try again</h1>")


def super_admin_logout(request):
    del request.session['context_id']
    return JsonResponse({})


def save_context_id(request):
    body_unicode = request.body.decode('utf-8')
    body_data = json.loads(body_unicode)
    request.session['context_id'] = body_data['context_id']
    return JsonResponse({})


def change_language_view(request):
    body_unicode = request.body.decode('utf-8')
    body_data = json.loads(body_unicode)
    language_id = body_data['languageId']
    request.session['language_id'] = language_id

    return JsonResponse({})
