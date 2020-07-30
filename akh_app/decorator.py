from functools import wraps
import requests


def check_authorized(view):
    @wraps(view)
    def wrapper(request, *args, **kwargs):
        url = "http://www.terminalsserver.somee.com/api/getUsers/?pageNumber=1&pageLength=50"

        payload = {}
        headers = {
            'Content-Type': 'application/json',
            'Token': '264ab6cf-2738-4736-89f6-b19c8c5888e2'
        }

        response = requests.request("GET", url, headers=headers, data=payload)

        print(response.text.encode('utf8'))
        return view(request, *args, **kwargs)
    return wrapper
