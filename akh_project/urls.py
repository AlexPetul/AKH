from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin
from akh_app.views import (login_view, reset_password_view, send_confirmation_mail, change_password_view, activate_account,
                           registration_view, save_inactive_user, index_view, owner_profile_view, configuration_view,
                           owner_terminals_view, dictionaries_view, owner_employees_view, administrator_main_view,
                           administrator_profile_view, administrator_employees_view, administrator_terminalgroups_view,
                           administrator_terminals_view, base_page_view, change_language_view, logout_view, save_configuration_view,
                           save_context_id, super_admin_logout, owner_payments_view, owner_collections_view, owner_storages_view,
                           owner_tariffs_view, owner_clients_view, owner_receivers_view, owner_accesses_view,
                           owner_stowage_view)

from wagtail.admin import urls as wagtailadmin_urls
from wagtail.core import urls as wagtail_urls
from wagtail.documents import urls as wagtaildocs_urls

from search import views as search_views

urlpatterns = [
    url(r'^django-admin/', admin.site.urls),
    url(r'^admin/', include(wagtailadmin_urls)),

    url(r'^login/$', login_view, name='login_view'),
    url(r'^logout/$', logout_view, name='logout_view'),
    url(r'^save-configuration/$', save_configuration_view, name='save_configuration_view'),
    url(r'^save-context/$', save_context_id, name='save_context_id'),
    url(r'^delete-context/$', super_admin_logout, name='super_admin_logout'),
    url(r'^forgotpassword/$', reset_password_view, name='reset_password_view'),
    url(r'^send-reset-mail/$', send_confirmation_mail, name='send_confirmation_mail'),
    url(r'^changepassword/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', change_password_view, name='change_password_view'),
    url(r'^activate-account/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', activate_account, name='activate_account'),
    url(r'^registration/$', registration_view, name='register_view'),
    url(r'^save-inactive-user/$', save_inactive_user, name='save_inactive_user'),
    url(r'^change-language/$', change_language_view, name='change_language_view'),

    url(r'^owner/$', index_view, name='index_view'),
    url(r'^owner/profile/$', owner_profile_view, name='owner_profile_view'),
    url(r'^owner/configuration/$', configuration_view, name='configuration_view'),
    url(r'^owner/terminals/$', owner_terminals_view, name='owner_terminals_view'),
    url(r'^owner/dictionaries/$', dictionaries_view, name='dictionaries_view'),
    url(r'^owner/employees/$', owner_employees_view, name='owner_employees_view'),
    url(r'^owner/clients/$', owner_clients_view, name='owner_clients_view'),
    url(r'^owner/receivers/$', owner_receivers_view, name='owner_receivers_view'),
    url(r'^owner/accesses/$', owner_accesses_view, name='owner_accesses_view'),
    url(r'^owner/payments/$', owner_payments_view, name='owner_payments_view'),
    url(r'^owner/collections/$', owner_collections_view, name='owner_collections_view'),
    url(r'^owner/storages/$', owner_storages_view, name='owner_storages_view'),
    url(r'^owner/stowage/$', owner_stowage_view, name='owner_stowage_view'),
    url(r'^owner/tariffs/$', owner_tariffs_view, name='owner_tariffs_view'),

    url(r'^administrator/$', administrator_main_view, name='administrator_main_view'),
    url(r'^administrator/profile/$', administrator_profile_view, name='administrator_profile_view'),
    url(r'^administrator/employees/$', administrator_employees_view, name='administrator_employees_view'),
    url(r'^administrator/terminalgroups/$', administrator_terminalgroups_view, name='administrator_terminalgroups_view'),
    url(r'^administrator/terminals/$', administrator_terminals_view, name='administrator_terminals_view'),
    url(r'^$', base_page_view, name='base_page_view'),

    url(r'^documents/', include(wagtaildocs_urls)),
    url(r'^search/$', search_views.search, name='search'),

]


if settings.DEBUG:
    from django.conf.urls.static import static
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns

    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns = urlpatterns + [
    url(r"", include(wagtail_urls)),
]
