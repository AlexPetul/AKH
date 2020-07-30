from django.apps import AppConfig


class AkhAppConfig(AppConfig):
    name = 'akh_app'

    def ready(self):
        from .views import generate_public_token
        generate_public_token()
