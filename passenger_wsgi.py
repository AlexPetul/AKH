import sys, os
cwd = os.getcwd()
sys.path.append(cwd)
sys.path.append(cwd + '/akh_project')
os.environ['DJANGO_SETTINGS_MODULE'] = "akh_project.settings.dev"
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()