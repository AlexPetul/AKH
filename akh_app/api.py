from django.http import HttpResponseRedirect

import requests
import json
import datetime

session = requests.Session()


def is_configuration_chosen(func):
    def call(request, *args, **kwargs):
        response = execute_request(url='getTerminalGroups', token=request.session['token'], method="GET", context_id=request.session.get('context_id', None))
        config_id = response['data']['list'][0]['configurationId']
        if config_id == 0:
            return HttpResponseRedirect('/owner/configuration')
        else:
            return func(request, *args, **kwargs)
    return call


def check_token(func):
    def call(request, *args, **kwargs):
        response = execute_request('checkToken', 'GET', request.session.get('token'))
        if response['errorCode'] != 0:
            request.session.clear()
            return HttpResponseRedirect('/login/')
        else:
            response = execute_request('getUsers', 'GET', request.session.get('token'))
            role_id = response['data']['list'][0]['roleId']
            if request.path.startswith('/administrator/') and role_id == 104:
                return HttpResponseRedirect("/owner/")
            elif request.path.startswith('/owner/') and role_id != 104:
                if not request.session.get('context_id', None):
                    return HttpResponseRedirect("/administrator/")
            return func(request, *args, **kwargs)
    return call


def execute_request(url, method, token, context_id=None):
    url = "http://www.terminalsserver.somee.com/api/portal/" + url + "/"
    headers = {
        'token': token
    }
    if context_id is not None:
        headers['contextId'] = str(context_id)
    response = session.request(method, url, headers=headers, data={})
    response_json = json.loads(response.text)
    return response_json
