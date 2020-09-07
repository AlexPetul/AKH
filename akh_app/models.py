from django import forms
from django.db import models
from django.contrib.auth.models import User

from wagtail.snippets.models import register_snippet
from wagtail.admin.edit_handlers import FieldPanel, MultiFieldPanel, StreamFieldPanel, FieldRowPanel, PageChooserPanel
from wagtail.images.edit_handlers import ImageChooserPanel
from wagtail.contrib.routable_page.models import Page
from wagtail.core.models import Page
from wagtail.core.fields import RichTextField, StreamField

from .blocks import *


@register_snippet
class EmailSettings(models.Model):
    email_host = models.CharField(
        max_length=100,
        null=True,
        blank=False,
        default='smtp-pulse.com',
        verbose_name='Название почтового сервера'
    )
    email_host_user = models.CharField(
        max_length=100,
        null=True,
        blank=False,
        default='info@my-violanta.com',
        verbose_name='Логин'
    )
    email_host_password = models.CharField(
        max_length=100,
        null=True,
        blank=False,
        default='ND3YitgJ2JcTq',
        verbose_name='Пароль'
    )

    def __str__(self):
        return self.email_host

    class Meta:
        verbose_name_plural = 'Настройки почтового сервера'
        verbose_name = 'Настройки почтового сервера'


@register_snippet
class LanguageIcons(models.Model):
    language_id = models.PositiveSmallIntegerField(null=True, verbose_name='ID языка')
    language_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )

    panels = [
        FieldPanel('language_id'),
        ImageChooserPanel('language_icon')
    ]

    def __str__(self):
        return str(self.language_id)

    class Meta:
        verbose_name_plural = 'Иконки для языков'
        verbose_name = 'Иконки для языков'


@register_snippet
class TerminalStatusesColors(models.Model):
    status_id = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    color_code = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    def __str__(self):
        return str(self.status_id)

    class Meta:
        verbose_name = 'Цвета статусов терминалов'
        verbose_name_plural = 'Цвета статусов терминалов'


@register_snippet
class UsersWaitingForActivation(models.Model):
    user_id = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    def __str__(self):
        return str(self.user_id)

    class Meta:
        verbose_name_plural = 'Пользователи ожидающие активации'
        verbose_name = 'Пользователи ожидающие активации'


@register_snippet
class PortalCredentials(models.Model):
    portal_name = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        default="portal@portal.ru"
    )

    portal_password = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        default="portal"
    )

    portal_token = models.CharField(
        max_length=400,
        null=True,
        blank=True
    )

    def __str__(self):
        return self.portal_name

    class Meta:
        verbose_name_plural = 'Данные портала для входа'


@register_snippet
class TerminalMessagesType(models.Model):
    message_icon = models.ImageField(null=True)
    message_id = models.PositiveSmallIntegerField(null=True)
    message_name = models.CharField(max_length=200, null=True)

    def __str__(self):
        return self.message_name

    class Meta:
        verbose_name_plural = 'Сообщения терминалов'
        verbose_name = 'Сообщенее терминала'


@register_snippet
class Configuration(models.Model):
    config_id = models.PositiveSmallIntegerField(null=True, verbose_name='ID')
    config_name = models.CharField(max_length=30, null=True, verbose_name='Название')

    def __str__(self):
        return self.config_name

    class Meta:
        verbose_name_plural = 'Список конфигураций'
        verbose_name = 'Список конфигураций'


@register_snippet
class OwnerMenu(models.Model):
    menu_label = models.CharField(max_length=20, verbose_name='Название (ru)', null=True)
    menu_label_en = models.CharField(max_length=20, verbose_name='Название (en)', null=True)
    icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )
    icon_hover = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка при наведении',
        related_name='+'
    )
    related_page = models.ForeignKey('wagtailcore.Page', null=True, on_delete=models.CASCADE, related_name='+')
    redirect_path = models.CharField(max_length=100, null=True, blank=True)
    priority = models.PositiveIntegerField(null=True, blank=False, verbose_name='Порядковый номер')
    configuration = models.ManyToManyField(Configuration)

    def __str__(self):
        return self.menu_label

    panels = [
        MultiFieldPanel([
            FieldRowPanel([
                FieldPanel('menu_label'),
                FieldPanel('menu_label_en')
            ]),
        ], heading='Название'),
        ImageChooserPanel('icon'),
        ImageChooserPanel('icon_hover'),
        PageChooserPanel('related_page'),
        FieldPanel('priority'),
        FieldPanel('configuration', widget=forms.CheckboxSelectMultiple)
    ]

    class Meta:
        verbose_name_plural = 'Боковое меню владельца терминалов'
        verbose_name = 'Боковое меню владельца терминалов'


@register_snippet
class AuthMenu(models.Model):
    menu_label = models.CharField(max_length=20, verbose_name='Название (ru)', null=True)
    menu_label_en = models.CharField(max_length=20, verbose_name='Название (en)', null=True)
    icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )
    icon_hover = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка при наведении',
        related_name='+'
    )
    related_page = models.ForeignKey('wagtailcore.Page', null=True, on_delete=models.CASCADE, related_name='+')
    redirect_path = models.CharField(max_length=100, null=True, blank=True)
    priority = models.PositiveIntegerField(null=True, blank=False, verbose_name='Порядковый номер')

    def __str__(self):
        return self.menu_label

    panels = [
        MultiFieldPanel([
            FieldRowPanel([
                FieldPanel('menu_label'),
                FieldPanel('menu_label_en')
            ]),
        ], heading='Название'),
        ImageChooserPanel('icon'),
        ImageChooserPanel('icon_hover'),
        PageChooserPanel('related_page'),
        FieldPanel('priority')
    ]

    class Meta:
        verbose_name_plural = 'Боковое меню авторизации'
        verbose_name = 'Боковое меню авторизации'


@register_snippet
class AdminMenu(models.Model):
    menu_label = models.CharField(max_length=20, verbose_name='Название (ru)', null=True)
    menu_label_en = models.CharField(max_length=20, verbose_name='Название (en)', null=True)
    icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )
    icon_hover = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка при наведении',
        related_name='+'
    )
    related_page = models.ForeignKey('wagtailcore.Page', null=True, on_delete=models.CASCADE, related_name='+')
    redirect_path = models.CharField(max_length=100, null=True, blank=True)
    priority = models.PositiveIntegerField(null=True, blank=False, verbose_name='Порядковый номер')

    def __str__(self):
        return self.menu_label

    panels = [
        MultiFieldPanel([
            FieldRowPanel([
                FieldPanel('menu_label'),
                FieldPanel('menu_label_en')
            ]),
        ], heading='Название'),
        ImageChooserPanel('icon'),
        ImageChooserPanel('icon_hover'),
        PageChooserPanel('related_page'),
        FieldPanel('priority')
    ]

    class Meta:
        verbose_name_plural = 'Боковое меню администратора'
        verbose_name = 'Боковое меню администратора'


class CommonRoutes:
    pass


class LoginPage(Page):
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    password_field = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пароль')

    email_field = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Email')

    forgot_password = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Забыли пароль')

    sign_in = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Кнопка войти')

    invalid_email = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверный email')

    invalid_password = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверный пароль')

    modal_user_blocked = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пользователь заблокирован')

    modal_user_not_exists = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пользователь не существует')

    modal_confirm_email = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Подтвердить email')

    modal_send_again = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отправить повторно')

    modal_mail_sent = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Письмо отправлено')

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header')
        ], heading='Заголовок'),
        MultiFieldPanel([
            StreamFieldPanel('password_field'),
            StreamFieldPanel('email_field')
        ], heading='Надписи над полями'),
        MultiFieldPanel([
            StreamFieldPanel('forgot_password')
        ], heading='Ссылка "забыли пароль"'),
        MultiFieldPanel([
            StreamFieldPanel('sign_in')
        ], heading='Кнопка входа'),
        MultiFieldPanel([
            StreamFieldPanel('invalid_email'),
            StreamFieldPanel('invalid_password')
        ], heading='Сообщения ошибок валидации'),
        MultiFieldPanel([
            StreamFieldPanel('modal_user_blocked'),
            StreamFieldPanel('modal_user_not_exists'),
            StreamFieldPanel('modal_confirm_email'),
            StreamFieldPanel('modal_send_again'),
            StreamFieldPanel('modal_mail_sent'),
        ], heading='Модальные окна'),
        StreamFieldPanel('api_links')]

    class Meta:
        verbose_name = 'Страница авторизации'
        verbose_name_plural = 'Страницы авторизации'


class OwnerCollectionsPage(Page):
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    page_subheader = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Подзаголовок')

    filter_before = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фильтр - от')

    filter_after = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фильтр - до')

    filter_terminal = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фильтр - по номеру терминала')

    send_report_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отправить отчет')

    filter_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Кнопка отфильтровать')

    table_number = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Идентификатор')

    table_count_payments = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Кол-во платежей')

    table_sum_payments = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сумма платежей')

    table_bills_count = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Кол-во купюр')

    table_sum_bills = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Общая сумма купюр')

    table_coins_count = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Кол-во монет')

    table_coins_sum = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Общая сумма монет')

    table_collections_sum = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Общая сумма инкассаций')

    table_bills = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Купюры')

    table_coins = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Монеты')

    invalid_date = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверная дата')

    invalid_terminal = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверный номер терминала')

    invalid_email = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверный email')

    modal_send_report = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отправить отчет')

    modal_success = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отчет отправлен')

    collections_per_page = models.PositiveSmallIntegerField(
        default=5,
        null=True,
        verbose_name='Количество записей на странице'
    )

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
            StreamFieldPanel('page_subheader'),
        ], heading='Заголовки'),
        MultiFieldPanel([
            StreamFieldPanel('send_report_text'),
            StreamFieldPanel('filter_button')
        ], heading='Кнопки'),
        MultiFieldPanel([
            StreamFieldPanel('filter_before'),
            StreamFieldPanel('filter_after'),
            StreamFieldPanel('filter_terminal')
        ], heading='Параметры фильтров'),
        MultiFieldPanel([
            StreamFieldPanel('invalid_date'),
            StreamFieldPanel('invalid_terminal'),
            StreamFieldPanel('invalid_email')
        ], heading='Ошибки валидации'),
        MultiFieldPanel([
            StreamFieldPanel('modal_send_report'),
            StreamFieldPanel('modal_success')
        ], heading='Модальные окна'),
        MultiFieldPanel([
            StreamFieldPanel('table_number'),
            StreamFieldPanel('table_count_payments'),
            StreamFieldPanel('table_sum_payments'),
            StreamFieldPanel('table_bills_count'),
            StreamFieldPanel('table_sum_bills'),
            StreamFieldPanel('table_coins_count'),
            StreamFieldPanel('table_coins_sum'),
            StreamFieldPanel('table_collections_sum'),
            StreamFieldPanel('table_bills'),
            StreamFieldPanel('table_coins')
        ], heading='Таблица'),
        FieldPanel('collections_per_page'),
        StreamFieldPanel('api_links')
    ]

    class Meta:
        verbose_name = 'Страница инкассаций'
        verbose_name_plural = 'Страницы инкассаций'


class OwnerReceivers(Page):
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    page_subheader = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Подзаголовок')

    filter_full_name = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фильтр по ФИО')

    import_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Импортировать')

    table_surname = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фамилия')

    table_name = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Имя')

    table_patronymic = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отчество')

    table_identity = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Идентификатор')

    table_phone = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Телефон')

    table_cells = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Ячейки')

    file_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Ошибка при чтении файла')

    clients_per_page = models.PositiveSmallIntegerField(
        default=5,
        null=True,
        verbose_name='Количество записей на странице'
    )

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
            StreamFieldPanel('page_subheader')
        ], heading='Заголовок на странице'),
        MultiFieldPanel([
            StreamFieldPanel('filter_full_name')
        ], heading='Фильтр'),
        MultiFieldPanel([
            StreamFieldPanel('import_button')
        ], heading='Кнопки'),
        MultiFieldPanel([
            StreamFieldPanel('file_error')
        ], heading='Модальные окна'),
        MultiFieldPanel([
            StreamFieldPanel('table_surname'),
            StreamFieldPanel('table_name'),
            StreamFieldPanel('table_patronymic'),
            StreamFieldPanel('table_identity'),
            StreamFieldPanel('table_phone'),
            StreamFieldPanel('table_cells')
        ], heading='Таблица'),
        FieldPanel('clients_per_page'),
    ]

    class Meta:
        verbose_name_plural = 'Страница получателей'
        verbose_name = 'Страница получателей'


class OwnerClients(Page):
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    page_subheader = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Подзаголовок')

    filter_full_name = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фильтр по ФИО')

    import_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Импортировать')

    table_surname = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фамилия')

    table_name = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Имя')

    table_patronymic = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отчество')

    table_identity = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Идентификатор')

    table_phone = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Телефон')

    table_cells = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Ячейки')

    file_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Ошибка при чтении файла')

    clients_per_page = models.PositiveSmallIntegerField(
        default=5,
        null=True,
        verbose_name='Количество записей на странице'
    )

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
            StreamFieldPanel('page_subheader')
        ], heading='Заголовок на странице'),
        MultiFieldPanel([
            StreamFieldPanel('filter_full_name')
        ], heading='Фильтр'),
        MultiFieldPanel([
            StreamFieldPanel('import_button')
        ], heading='Кнопки'),
        MultiFieldPanel([
            StreamFieldPanel('file_error')
        ], heading='Модальные окна'),
        MultiFieldPanel([
            StreamFieldPanel('table_surname'),
            StreamFieldPanel('table_name'),
            StreamFieldPanel('table_patronymic'),
            StreamFieldPanel('table_identity'),
            StreamFieldPanel('table_phone'),
            StreamFieldPanel('table_cells')
        ], heading='Таблица'),
        FieldPanel('clients_per_page'),
    ]

    class Meta:
        verbose_name_plural = 'Страница клиентов'
        verbose_name = 'Страница клиентов'


class OwnerPaymentsPage(Page):
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    page_subheader = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Подзаголовок')

    filter_before = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фильтр - от')

    filter_after = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фильтр - до')

    filter_terminal = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фильтр - по номеру терминала')

    send_report_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отправить отчет')

    filter_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Кнопка отфильтровать')

    table_number = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Номер')

    table_id = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Идентификатор платежа')

    table_service = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Услуга')

    table_sum = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сумма')

    table_type = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Тип оплаты')

    table_date = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Дата')

    table_parameter = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Параметры')

    invalid_date = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверная дата')

    invalid_terminal = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверный номер терминала')

    invalid_email = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверный email')

    modal_send_report = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отправить отчет')

    modal_success = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отчет отправлен')

    payments_per_page = models.PositiveSmallIntegerField(
        default=5,
        null=True,
        verbose_name='Количество записей на одной странице'
    )

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
            StreamFieldPanel('page_subheader'),
        ], heading='Заголовки'),
        MultiFieldPanel([
            StreamFieldPanel('send_report_text'),
            StreamFieldPanel('filter_button')
        ], heading='Кнопки'),
        MultiFieldPanel([
            StreamFieldPanel('filter_before'),
            StreamFieldPanel('filter_after'),
            StreamFieldPanel('filter_terminal')
        ], heading='Параметры фильтров'),
        MultiFieldPanel([
            StreamFieldPanel('invalid_date'),
            StreamFieldPanel('invalid_terminal'),
            StreamFieldPanel('invalid_email')
        ], heading='Ошибки валидации'),
        MultiFieldPanel([
            StreamFieldPanel('modal_send_report'),
            StreamFieldPanel('modal_success')
        ], heading='Модальные окна'),
        MultiFieldPanel([
            StreamFieldPanel('table_number'),
            StreamFieldPanel('table_id'),
            StreamFieldPanel('table_service'),
            StreamFieldPanel('table_sum'),
            StreamFieldPanel('table_type'),
            StreamFieldPanel('table_date'),
            StreamFieldPanel('table_parameter')
        ], heading='Таблица'),
        FieldPanel('payments_per_page'),
        StreamFieldPanel('api_links')
    ]

    class Meta:
        verbose_name = 'Страница платежей'
        verbose_name_plural = 'Страницы платежей'


class AccessesPage(Page):
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    page_subheader = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Подзаголовок')

    filter_before = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фильтр - от')

    filter_after = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фильтр - до')

    filter_terminal = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фильтр - по номеру терминала')

    send_report_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отправить отчет')

    filter_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Кнопка отфильтровать')

    table_surname = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фамилия')

    table_name = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Имя')

    table_patronymic = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отчество')

    table_phone = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Телефон')

    table_cell = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Номер ячейки')

    table_status = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Статус')

    table_status_datetime = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Дата установки статуса')

    invalid_date = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверная дата')

    invalid_terminal = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверный номер терминала')

    invalid_email = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверный email')

    modal_send_report = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отправить отчет')

    modal_success = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отчет отправлен')

    accesses_per_page = models.PositiveSmallIntegerField(
        default=5,
        null=True,
        verbose_name='Количество записей на одной странице'
    )

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
            StreamFieldPanel('page_subheader'),
        ], heading='Заголовки'),
        MultiFieldPanel([
            StreamFieldPanel('send_report_text'),
            StreamFieldPanel('filter_button')
        ], heading='Кнопки'),
        MultiFieldPanel([
            StreamFieldPanel('filter_before'),
            StreamFieldPanel('filter_after'),
            StreamFieldPanel('filter_terminal')
        ], heading='Параметры фильтров'),
        MultiFieldPanel([
            StreamFieldPanel('invalid_date'),
            StreamFieldPanel('invalid_terminal'),
            StreamFieldPanel('invalid_email')
        ], heading='Ошибки валидации'),
        MultiFieldPanel([
            StreamFieldPanel('modal_send_report'),
            StreamFieldPanel('modal_success')
        ], heading='Модальные окна'),
        MultiFieldPanel([
            StreamFieldPanel('table_surname'),
            StreamFieldPanel('table_name'),
            StreamFieldPanel('table_patronymic'),
            StreamFieldPanel('table_phone'),
            StreamFieldPanel('table_cell'),
            StreamFieldPanel('table_status'),
            StreamFieldPanel('table_status_datetime')
        ], heading='Таблица'),
        FieldPanel('accesses_per_page'),
        StreamFieldPanel('api_links')
    ]

    class Meta:
        verbose_name_plural = 'Страница доступов'
        verbose_name = 'Страница доступов'


class StowagePage(Page):
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    page_subheader = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Подзаголовок')

    filter_before = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фильтр - от')

    filter_after = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фильтр - до')

    filter_terminal = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фильтр - по номеру терминала')

    send_report_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отправить отчет')

    filter_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Кнопка отфильтровать')

    invalid_date = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверная дата')

    invalid_terminal = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверный номер терминала')

    invalid_email = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверный email')

    modal_send_report = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отправить отчет')

    modal_success = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отчет отправлен')

    table_number = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Номер')

    table_id = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Идентификатор хранения')

    table_cell = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Номер ячейки')

    table_tariff = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Тариф')

    table_start_date = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Начало хранения')

    table_end_date = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Конец хранения')

    table_sum = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Оплаченная сумма хранения')

    table_status = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Статус хранения')

    table_messages = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сообщения')

    storages_per_page = models.PositiveSmallIntegerField(
        default=5,
        null=True,
        verbose_name='Количество записей на одной странице'
    )

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
            StreamFieldPanel('page_subheader'),
        ], heading='Заголовки'),
        MultiFieldPanel([
            StreamFieldPanel('send_report_text'),
            StreamFieldPanel('filter_button')
        ], heading='Кнопки'),
        MultiFieldPanel([
            StreamFieldPanel('filter_before'),
            StreamFieldPanel('filter_after'),
            StreamFieldPanel('filter_terminal')
        ], heading='Параметры фильтров'),
        MultiFieldPanel([
            StreamFieldPanel('invalid_date'),
            StreamFieldPanel('invalid_terminal'),
            StreamFieldPanel('invalid_email')
        ], heading='Ошибки валидации'),
        MultiFieldPanel([
            StreamFieldPanel('modal_send_report'),
            StreamFieldPanel('modal_success')
        ], heading='Модальные окна'),
        MultiFieldPanel([
            StreamFieldPanel('table_number'),
            StreamFieldPanel('table_id'),
            StreamFieldPanel('table_cell'),
            StreamFieldPanel('table_tariff'),
            StreamFieldPanel('table_start_date'),
            StreamFieldPanel('table_end_date'),
            StreamFieldPanel('table_sum'),
            StreamFieldPanel('table_status'),
            StreamFieldPanel('table_messages')
        ], heading='Таблица'),
        FieldPanel('storages_per_page'),
        StreamFieldPanel('api_links')
    ]

    class Meta:
        verbose_name_plural = 'Страница закладок'
        verbose_name = 'Страница закладок'


class StoragesPage(Page):
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    page_subheader = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Подзаголовок')

    filter_before = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фильтр - от')

    filter_after = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фильтр - до')

    filter_terminal = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фильтр - по номеру терминала')

    send_report_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отправить отчет')

    filter_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Кнопка отфильтровать')

    invalid_date = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверная дата')

    invalid_terminal = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверный номер терминала')

    invalid_email = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверный email')

    modal_send_report = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отправить отчет')

    modal_success = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отчет отправлен')

    table_number = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Номер')

    table_id = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Идентификатор хранения')

    table_cell = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Номер ячейки')

    table_tariff = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Тариф')

    table_start_date = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Начало хранения')

    table_end_date = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Конец хранения')

    table_sum = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Оплаченная сумма хранения')

    table_status = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Статус хранения')

    table_messages = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сообщения')

    storages_per_page = models.PositiveSmallIntegerField(
        default=5,
        null=True,
        verbose_name='Количество записей на одной странице'
    )

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
            StreamFieldPanel('page_subheader'),
        ], heading='Заголовки'),
        MultiFieldPanel([
            StreamFieldPanel('send_report_text'),
            StreamFieldPanel('filter_button')
        ], heading='Кнопки'),
        MultiFieldPanel([
            StreamFieldPanel('filter_before'),
            StreamFieldPanel('filter_after'),
            StreamFieldPanel('filter_terminal')
        ], heading='Параметры фильтров'),
        MultiFieldPanel([
            StreamFieldPanel('invalid_date'),
            StreamFieldPanel('invalid_terminal'),
            StreamFieldPanel('invalid_email')
        ], heading='Ошибки валидации'),
        MultiFieldPanel([
            StreamFieldPanel('modal_send_report'),
            StreamFieldPanel('modal_success')
        ], heading='Модальные окна'),
        MultiFieldPanel([
            StreamFieldPanel('table_number'),
            StreamFieldPanel('table_id'),
            StreamFieldPanel('table_cell'),
            StreamFieldPanel('table_tariff'),
            StreamFieldPanel('table_start_date'),
            StreamFieldPanel('table_end_date'),
            StreamFieldPanel('table_sum'),
            StreamFieldPanel('table_status'),
            StreamFieldPanel('table_messages')
        ], heading='Таблица'),
        FieldPanel('storages_per_page'),
        StreamFieldPanel('api_links')
    ]

    class Meta:
        verbose_name_plural = 'Страница хранений'
        verbose_name = 'Страница хранений'


class TariffsPage(Page):
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    add_tariff_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок (добавить тариф)')

    page_subheader = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Подзаголовок')

    cell_param_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Добавьте хотя бы один типоразмер')

    terminal_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Добавьте хотя бы один терминал')

    tariff_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Добавьте хотя бы один тариф')

    name_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Имя')

    interval_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Интервал')

    invalid_diapason_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Интервал (неверный диапазон)')

    language_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Ввести хотя бы один язык')

    invalid_data = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Проверьте правильность введенных данных')

    price_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Цена')

    name_field = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Наименование')

    text_field = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Текст')

    interval_field = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Интервал')

    price_field = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Цена')

    description_field = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Описание')

    save_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сохранить')

    back_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Вернуться')

    success_add = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Успешное добавление тарифа')

    tariffs_tab = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Тарифы')

    attachments_tab = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Привязки')

    add_tariff_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Добавить тариф')

    add_attachment_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Добавить привязку')

    table_number = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Номер')

    table_name = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Название')

    table_interval = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Интервал')

    table_price = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Цена')

    table_status = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Статус')

    table_status_datetime = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Дата установки статуса')

    delete_tariff = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Вы действительно хотите удалить тариф?')

    success_delete = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Тариф успешно удален')

    table_tariff_name = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Название тарифа')

    table_terminal_number = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Номер терминала')

    table_cell = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Типоразмер ячейки')

    table_position = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Позиция')

    table_datetime = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Дата установки')

    modal_delete_attachment = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Вы действительно хотите удалить привязку?')

    modal_delete_attachment_success = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Привязка успешно удалена!')

    position_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Введите пожалуйста позицию')

    date_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Введите пожалуйста дату')

    add_tariff_attachment_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Добавить привязку')

    field_tariff = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Тариф')

    field_terminal = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Терминал')

    field_cell_parameter = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Типоразмер ячеек')

    field_position = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Позиция')

    field_date_start = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Дата начала')

    field_description = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Описание')

    success_add_attachment = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Привязка успешно добавлена!')

    success_edit_attachment = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Привязка успешно изменена!')

    edit_tariff_attachment_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Изменить привязку')

    tariffs_per_page = models.PositiveSmallIntegerField(
        default=5,
        null=True,
        verbose_name='Количество записей на одной странице'
    )

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
            StreamFieldPanel('page_subheader'),
            StreamFieldPanel('add_tariff_header'),
            StreamFieldPanel('add_tariff_attachment_header'),
            StreamFieldPanel('edit_tariff_attachment_header')
        ], heading='Заголовки'),
        MultiFieldPanel([
            StreamFieldPanel('table_number'),
            StreamFieldPanel('table_name'),
            StreamFieldPanel('table_interval'),
            StreamFieldPanel('table_price'),
            StreamFieldPanel('table_status'),
            StreamFieldPanel('table_status_datetime'),
        ], heading='Таблица (тарифы)'),
        MultiFieldPanel([
            StreamFieldPanel('table_tariff_name'),
            StreamFieldPanel('table_terminal_number'),
            StreamFieldPanel('table_cell'),
            StreamFieldPanel('table_position'),
            StreamFieldPanel('table_datetime'),
        ], heading='Таблица (привязки)'),
        MultiFieldPanel([
            StreamFieldPanel('cell_param_error'),
            StreamFieldPanel('name_error'),
            StreamFieldPanel('terminal_error'),
            StreamFieldPanel('tariff_error'),
            StreamFieldPanel('interval_error'),
            StreamFieldPanel('invalid_diapason_error'),
            StreamFieldPanel('price_error'),
            StreamFieldPanel('position_error'),
            StreamFieldPanel('date_error'),
        ], heading='Ошибки валидации'),
        MultiFieldPanel([
            StreamFieldPanel('invalid_data'),
            StreamFieldPanel('language_error'),
            StreamFieldPanel('success_add'),
            StreamFieldPanel('success_delete'),
            StreamFieldPanel('delete_tariff'),
            StreamFieldPanel('modal_delete_attachment'),
            StreamFieldPanel('modal_delete_attachment_success'),
            StreamFieldPanel('success_add_attachment'),
            StreamFieldPanel('success_edit_attachment')
        ], heading='Модальные окна'),
        MultiFieldPanel([
            StreamFieldPanel('name_field'),
            StreamFieldPanel('price_field'),
            StreamFieldPanel('interval_field'),
            StreamFieldPanel('text_field'),
            StreamFieldPanel('description_field'),
            StreamFieldPanel('field_tariff'),
            StreamFieldPanel('field_terminal'),
            StreamFieldPanel('field_cell_parameter'),
            StreamFieldPanel('field_position'),
            StreamFieldPanel('field_date_start'),
            StreamFieldPanel('field_description')
        ], heading='Заголовки полей'),
        MultiFieldPanel([
            StreamFieldPanel('add_tariff_button'),
            StreamFieldPanel('add_attachment_button'),
            StreamFieldPanel('tariffs_tab'),
            StreamFieldPanel('attachments_tab'),
            StreamFieldPanel('save_button'),
            StreamFieldPanel('back_button')
        ], heading='Кнопки'),
        FieldPanel('tariffs_per_page'),
        StreamFieldPanel('api_links')
    ]

    class Meta:
        verbose_name_plural = 'Страница тарифов'
        verbose_name = 'Страница тарифов'


class DictionaryPage(Page):
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    add_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок - добавить позицию')

    edit_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок - редактировать позицию')

    button_add = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Кнопка добавить')

    filter_dict_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фильтр')

    table_position = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Номер позиции')

    table_name = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Наименование')

    table_description = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Описание')

    position_add_modal = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Добавление типоразмера - сообщение')

    language_error_modal = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Добавление типоразмера - не указан язык')

    position_delete = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Удаление типоразмера - сообщение')

    position_delete_success = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Удаление типоразмера - успешно удален')

    position_edit_success = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Типоразмер успешно изменен!')

    field_name = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Наименование')

    field_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Текст')

    field_height = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Высота')

    field_width = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Ширина')

    field_depth = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Глубина')

    field_weight = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Максимальный вес')

    field_description = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Описание')

    save_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сохранить')

    back_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Вернуться')

    delete_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Кнопка - удалить')

    name_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Имя')

    text_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Tекст')

    height_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Высота')

    width_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Ширина')

    depth_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Глубина')

    weight_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Вес')

    description_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Описание')

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    items_per_page = models.PositiveSmallIntegerField(
        default=2,
        null=True,
        verbose_name='Количество позиций на одной странице'
    )

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
            StreamFieldPanel('add_header'),
            StreamFieldPanel('edit_header'),
            StreamFieldPanel('button_add'),
            StreamFieldPanel('filter_dict_text'),
        ], heading='Заголовки'),
        MultiFieldPanel([
            StreamFieldPanel('table_position'),
            StreamFieldPanel('table_name'),
            StreamFieldPanel('table_description'),
        ], heading='Таблица'),
        MultiFieldPanel([
            StreamFieldPanel('position_delete'),
            StreamFieldPanel('position_add_modal'),
            StreamFieldPanel('language_error_modal'),
            StreamFieldPanel('position_delete_success'),
            StreamFieldPanel('position_edit_success'),
        ], heading='Модальные окна'),
        MultiFieldPanel([
            StreamFieldPanel('field_name'),
            StreamFieldPanel('field_text'),
            StreamFieldPanel('field_height'),
            StreamFieldPanel('field_width'),
            StreamFieldPanel('field_depth'),
            StreamFieldPanel('field_weight'),
            StreamFieldPanel('field_description'),
        ], heading='Надписи над полями'),
        MultiFieldPanel([
            StreamFieldPanel('name_error'),
            StreamFieldPanel('height_error'),
            StreamFieldPanel('width_error'),
            StreamFieldPanel('depth_error'),
            StreamFieldPanel('weight_error'),
            StreamFieldPanel('description_error'),
        ], heading='Ошибки валидации'),
        MultiFieldPanel([
            StreamFieldPanel('back_button'),
            StreamFieldPanel('save_button'),
            StreamFieldPanel('delete_button'),
        ], heading='Кнопки'),
        FieldPanel('items_per_page'),
        StreamFieldPanel('api_links'),
    ]

    class Meta:
        verbose_name = 'Страница справочника'
        verbose_name_plural = 'Страницы справочников'


class AdministratorMainPage(Page):
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    total_terminals_groups_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )

    total_terminals_groups_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Всего групп терминалов')

    total_terminals_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )

    total_terminals_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Всего терминалов')

    online_terminals_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )

    online_terminals_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Количество терминалов онлайн')

    expired_terminals_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )

    expired_terminals_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Просрочена активация')

    pending_terminals_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )

    pending_terminals_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='В ожидании активации')

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
        ], heading='Заголовки'),
        MultiFieldPanel([
            ImageChooserPanel('total_terminals_groups_icon'),
            StreamFieldPanel('total_terminals_groups_text')
        ], heading='Первый блок (Всего групп терминалов)'),
        MultiFieldPanel([
            ImageChooserPanel('total_terminals_icon'),
            StreamFieldPanel('total_terminals_text')
        ], heading='Второй блок (Всего терминалов)'),
        MultiFieldPanel([
            ImageChooserPanel('online_terminals_icon'),
            StreamFieldPanel('online_terminals_text')
        ], heading='Третий блок (Терминалы онлайн)'),
        MultiFieldPanel([
            ImageChooserPanel('expired_terminals_icon'),
            StreamFieldPanel('expired_terminals_text')
        ], heading='Четвертый блок (Просрочена активация)'),
        MultiFieldPanel([
            ImageChooserPanel('pending_terminals_icon'),
            StreamFieldPanel('pending_terminals_text')
        ], heading='Пятый блок (В ожидании активации)'),
        StreamFieldPanel('api_links')
    ]

    class Meta:
        verbose_name = 'Страница администратора (главная)'
        verbose_name_plural = 'Страницы администратора (главные)'


class SettingsPage(Page):
    max_count = 1

    key_activation_time = models.PositiveIntegerField(
        default=90,
        null=True,
        blank=True,
        verbose_name='Срок активации ключа'
    )

    api_path = models.CharField(
        max_length=200,
        null=True,
        default='http://www.terminalsserver.somee.com/api/portal/'
    )

    content_panels = Page.content_panels + [
        FieldPanel('key_activation_time'),
        FieldPanel('api_path')
    ]

    class Meta:
        verbose_name = 'Настройки'


class AdministratorTerminals(Page):
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    page_subheader = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Подзаголовок')

    filter_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фильтр по названию групп')

    modal_prolong_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Продление активации')

    modal_activate_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Срок окончания активации')

    button_activate = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Активировать')

    button_renew = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Продлить')

    button_cancel = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отменить')

    field_date = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Введите дату')

    field_date_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Введите пожалуйста дату')

    cancel_activation = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отклонить запрос на активацию')

    deactivate = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отозвать активацию')

    table_number = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Номер')

    table_name = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Название группы')

    table_config = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Конфигурация')

    table_address = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Адрес')

    table_key = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Ключ')

    table_key_expires = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Окончание ключа')

    table_status = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Статус')

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True, blank=True)

    terminals_per_page = models.PositiveSmallIntegerField(
        default=7,
        null=True,
        verbose_name='Количество терминалов на одной странице'
    )

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
            StreamFieldPanel('page_subheader'),
            StreamFieldPanel('filter_text'),
            StreamFieldPanel('button_activate'),
            StreamFieldPanel('button_renew'),
            StreamFieldPanel('button_cancel')
        ], heading='Заголовки'),
        MultiFieldPanel([
            StreamFieldPanel('modal_prolong_header'),
            StreamFieldPanel('modal_activate_header'),
            StreamFieldPanel('field_date'),
            StreamFieldPanel('field_date_error'),
            StreamFieldPanel('cancel_activation'),
            StreamFieldPanel('deactivate')
        ], heading='Модальные окна'),
        MultiFieldPanel([
            StreamFieldPanel('table_number'),
            StreamFieldPanel('table_name'),
            StreamFieldPanel('table_address'),
            StreamFieldPanel('table_config'),
            StreamFieldPanel('table_key'),
            StreamFieldPanel('table_key_expires'),
            StreamFieldPanel('table_status')
        ], heading='Таблица'),
        FieldPanel('terminals_per_page'),
        StreamFieldPanel('api_links'),
    ]

    class Meta:
        verbose_name = 'Страница терминалов администратора'


class AdministratorProfile(Page):
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    change_pass_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сменить пароль')

    save_profile_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сохранить')

    change_password_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сменить пароль')

    label_name = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Имя')

    label_surname = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фамилия')

    label_patronymic = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отчество')

    label_phone = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Телефон')

    label_password = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Введите пароль')

    label_repeat_password = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Повторите пароль')

    modal_success = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Успешное сохранение')

    invalid_email_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Ошибка - email')

    invalid_name_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Ошибка - имя')

    invalid_surname_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Ошибка - фамилия')

    invalid_phone_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Ошибка - телефон')

    password_success_changed = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пароль успешно изменен')

    invalid_password_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пожалуйста введите пароль')

    invalid_password_repeat_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пожалуйста повторите пароль')

    invalid_password_len_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пароль слишком короткий')

    invalid_password_mismatch_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пароли не совпадают')

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
        ], heading='Мой профиль'),
        MultiFieldPanel([
            StreamFieldPanel('change_pass_header'),
        ], heading='Смена пароля'),
        MultiFieldPanel([
            StreamFieldPanel('label_name'),
            StreamFieldPanel('label_surname'),
            StreamFieldPanel('label_patronymic'),
            StreamFieldPanel('label_phone'),
            StreamFieldPanel('label_password'),
            StreamFieldPanel('label_repeat_password'),
        ], heading='Названия полей'),
        MultiFieldPanel([
            StreamFieldPanel('save_profile_button'),
            StreamFieldPanel('change_password_button'),
        ], heading='Кнопки'),
        MultiFieldPanel([
            StreamFieldPanel('invalid_name_error'),
            StreamFieldPanel('invalid_surname_error'),
            StreamFieldPanel('invalid_phone_error'),
            StreamFieldPanel('invalid_email_error'),
            StreamFieldPanel('invalid_password_error'),
            StreamFieldPanel('invalid_password_repeat_error'),
            StreamFieldPanel('invalid_password_len_error'),
            StreamFieldPanel('invalid_password_mismatch_error')
        ], heading='Ошибки валидации'),
        MultiFieldPanel([
            StreamFieldPanel('modal_success'),
            StreamFieldPanel('password_success_changed')
        ], heading='Модальные окна'),
        StreamFieldPanel('api_links')
    ]

    class Meta:
        verbose_name = 'Страница профиля администратора'


class OwnerProfile(Page):
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    change_pass_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сменить пароль')

    save_profile_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сохранить')

    change_password_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сменить пароль')

    label_name = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Имя')

    label_surname = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фамилия')

    label_patronymic = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отчество')

    label_phone = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Телефон')

    label_password = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Введите пароль')

    label_repeat_password = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Повторите пароль')

    modal_success = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Успешное сохранение')

    invalid_email_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Ошибка - email')

    invalid_name_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Ошибка - имя')

    invalid_surname_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Ошибка - фамилия')

    invalid_phone_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Ошибка - телефон')

    password_success_changed = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пароль успешно изменен')

    invalid_password_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пожалуйста введите пароль')

    invalid_password_repeat_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пожалуйста повторите пароль')

    invalid_password_len_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пароль слишком короткий')

    invalid_password_mismatch_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пароли не совпадают')

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
        ], heading='Мой профиль'),
        MultiFieldPanel([
            StreamFieldPanel('change_pass_header'),
        ], heading='Смена пароля'),
        MultiFieldPanel([
            StreamFieldPanel('label_name'),
            StreamFieldPanel('label_surname'),
            StreamFieldPanel('label_patronymic'),
            StreamFieldPanel('label_phone'),
            StreamFieldPanel('label_password'),
            StreamFieldPanel('label_repeat_password'),
        ], heading='Названия полей'),
        MultiFieldPanel([
            StreamFieldPanel('save_profile_button'),
            StreamFieldPanel('change_password_button'),
        ], heading='Кнопки'),
        MultiFieldPanel([
            StreamFieldPanel('invalid_name_error'),
            StreamFieldPanel('invalid_surname_error'),
            StreamFieldPanel('invalid_phone_error'),
            StreamFieldPanel('invalid_email_error'),
            StreamFieldPanel('invalid_password_error'),
            StreamFieldPanel('invalid_password_repeat_error'),
            StreamFieldPanel('invalid_password_len_error'),
            StreamFieldPanel('invalid_password_mismatch_error')
        ], heading='Ошибки валидации'),
        MultiFieldPanel([
            StreamFieldPanel('modal_success'),
            StreamFieldPanel('password_success_changed')
        ], heading='Модальные окна'),
        StreamFieldPanel('api_links')
    ]

    class Meta:
        verbose_name = 'Страница профиля владельца'


class TerminalGroupsPage(Page):
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    page_subheader = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Подзаголовок')

    filter_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фильтр по названию групп')

    table_name = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Название группы')

    table_fio = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='ФИО')

    table_phone = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Телефон')

    table_configuration = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Конфигурация')

    modal_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Править данные группы')

    modal_button_save = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сохранить')

    modal_button_cancel = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отменить')

    modal_field_name = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Наименование')

    modal_field_description = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Описание')

    modal_field_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Введите пожалуйста наименование')

    groups_per_page = models.PositiveSmallIntegerField(
        default=7,
        null=True,
        verbose_name='Количество групп на одной странице'
    )

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True, blank=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
            StreamFieldPanel('page_subheader'),
            StreamFieldPanel('filter_text'),
        ], heading='Заголовки'),
        MultiFieldPanel([
            StreamFieldPanel('table_name'),
            StreamFieldPanel('table_fio'),
            StreamFieldPanel('table_phone'),
            StreamFieldPanel('table_configuration'),
        ], heading='Таблица'),
        MultiFieldPanel([
            StreamFieldPanel('modal_header'),
            StreamFieldPanel('modal_button_save'),
            StreamFieldPanel('modal_button_cancel'),
            StreamFieldPanel('modal_field_name'),
            StreamFieldPanel('modal_field_description'),
            StreamFieldPanel('modal_field_error'),
        ], heading='Модальные окна'),
        FieldPanel('groups_per_page'),
        StreamFieldPanel('api_links'),
    ]

    class Meta:
        verbose_name = 'Страница групп терминалов'


class AdminEmployeesPage(Page):
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    page_subheader = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Управление сотрудниками')

    change_password_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сменить пароль')

    employees_per_page = models.PositiveSmallIntegerField(
        default=7,
        null=True,
        verbose_name='Количество сотрудников на одной странице'
    )

    add_button_name = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Добавить')

    table_surname = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фамилия')

    table_name = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Имя')

    table_patronymic = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отчество')

    table_phone = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Телефон')

    table_status = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Статус')

    invalid_email_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Введите пожалуйста email')

    invalid_name_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Введите пожалуйста имя')

    invalid_phone_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Введите пожалуйста телефон')

    invalid_surname_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Введите пожалуйста фамилию')

    invalid_password_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Введите пожалуйста пароль')

    invalid_password_repeat_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пожалуйста повторите пароль')

    invalid_password_len_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Слишком короткий пароль')

    invalid_identity_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пожалуйста введите идентификатор')

    invalid_login_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пожалуйста введите логин')

    modal_delete = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Вы точно хотите удалить сотрудника?')

    field_name = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Имя')

    field_surname = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фамилия')

    field_patronymic = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отчество')

    field_phone = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Телефон')

    field_identity = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Идентификатор')

    field_login = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Логин')

    field_password = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пароль')

    field_repeat_password = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Повторите пароль')

    field_give_admin_role = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Дать права на работу с администратороами')

    add_employee_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Добавить сотрудника')

    save_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сохранить')

    back_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Вернуться')

    modal_email_exists = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пользователь с указанным email уже существует')

    modal_phone_exists = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пользователь с указанным телефоном уже существует')

    modal_success_add = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сотрудник успешно добавлен')

    modal_success_edit = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сотрудник успешно изменен')

    modal_role_duplicate = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Вы не можете добавить одинаковые роли')

    edit_employee_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Редактировать сотрудника')

    confirm_delete = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Да (удалить)')

    reject_delete = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отмена (удаление)')

    modal_block = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Блокировать сотрудника')

    modal_unblock = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Разблокировать сотрудника')

    change_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сменить')

    modal_password_changed = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пароль успешно изменен')

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
            StreamFieldPanel('page_subheader'),
            StreamFieldPanel('add_employee_header'),
            StreamFieldPanel('edit_employee_header'),
            StreamFieldPanel('change_password_header'),
        ], heading='Заголовки'),
        MultiFieldPanel([
            StreamFieldPanel('add_button_name'),
            StreamFieldPanel('change_button'),
            StreamFieldPanel('save_button'),
            StreamFieldPanel('back_button')
        ], heading='Кнопки'),
        MultiFieldPanel([
            StreamFieldPanel('table_surname'),
            StreamFieldPanel('table_name'),
            StreamFieldPanel('table_patronymic'),
            StreamFieldPanel('table_phone'),
            StreamFieldPanel('table_status')
        ], heading='Таблица'),
        MultiFieldPanel([
            StreamFieldPanel('invalid_email_error'),
            StreamFieldPanel('invalid_name_error'),
            StreamFieldPanel('invalid_phone_error'),
            StreamFieldPanel('invalid_surname_error'),
            StreamFieldPanel('invalid_password_error'),
            StreamFieldPanel('invalid_password_repeat_error'),
            StreamFieldPanel('invalid_password_len_error'),
            StreamFieldPanel('invalid_identity_error'),
            StreamFieldPanel('invalid_login_error')
        ], heading='Ошибки валидации'),
        MultiFieldPanel([
            StreamFieldPanel('field_name'),
            StreamFieldPanel('field_surname'),
            StreamFieldPanel('field_patronymic'),
            StreamFieldPanel('field_phone'),
            StreamFieldPanel('field_password'),
            StreamFieldPanel('field_repeat_password'),
            StreamFieldPanel('field_give_admin_role')
        ], heading='Надписи над полями ввода'),
        MultiFieldPanel([
            StreamFieldPanel('modal_delete'),
            StreamFieldPanel('modal_block'),
            StreamFieldPanel('modal_unblock'),
            StreamFieldPanel('confirm_delete'),
            StreamFieldPanel('reject_delete'),
            StreamFieldPanel('modal_email_exists'),
            StreamFieldPanel('modal_phone_exists'),
            StreamFieldPanel('modal_success_add'),
            StreamFieldPanel('modal_success_edit'),
            StreamFieldPanel('modal_password_changed'),
        ], heading='Модальные окна'),
        FieldPanel('employees_per_page'),
        StreamFieldPanel('api_links'),
    ]

    class Meta:
        verbose_name = 'Страница сотрудников администратора'


class OwnerEmpoloyeesPage(Page):
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    page_subheader = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Управление сотрудниками')

    employees_per_page = models.PositiveSmallIntegerField(
        default=7,
        null=True,
        verbose_name='Количество сотрудников на одной странице'
    )

    add_button_name = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Добавить')

    table_surname = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фамилия')

    table_name = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Имя')

    table_patronymic = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отчество')

    table_phone = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Телефон')

    table_status = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Статус')

    invalid_email_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Введите пожалуйста email')

    invalid_name_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Введите пожалуйста имя')

    invalid_phone_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Введите пожалуйста телефон')

    invalid_surname_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Введите пожалуйста фамилию')

    invalid_password_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Введите пожалуйста пароль')

    invalid_password_len_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Слишком короткий пароль')

    invalid_identity_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пожалуйста введите идентификатор')

    invalid_login_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пожалуйста введите логин')

    modal_delete = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Вы точно хотите удалить сотрудника?')

    field_name = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Имя')

    field_surname = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фамилия')

    field_patronymic = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отчество')

    field_phone = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Телефон')

    field_identity = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Идентификатор')

    field_login = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Логин')

    field_password = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пароль')

    field_choose_role = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Выбрать роль')

    add_employee_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Добавить сотрудника')

    add_role = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Добавить роль')

    delete_role = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Удалить роль')

    modal_login_exists = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пользователь с указанным логином уже существует')

    modal_identity_exists = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пользователь с указанным идентификатором уже существует')

    modal_success_add = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сотрудник успешно добавлен')

    modal_success_edit = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сотрудник успешно изменен')

    modal_role_duplicate = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Вы не можете добавить одинаковые роли')

    edit_employee_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Редактировать сотрудника')

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
            StreamFieldPanel('page_subheader'),
            StreamFieldPanel('add_employee_header'),
            StreamFieldPanel('edit_employee_header'),
        ], heading='Заголовки'),
        MultiFieldPanel([
            StreamFieldPanel('add_button_name'),
            StreamFieldPanel('add_role'),
            StreamFieldPanel('delete_role')
        ], heading='Кнопки'),
        MultiFieldPanel([
            StreamFieldPanel('table_surname'),
            StreamFieldPanel('table_name'),
            StreamFieldPanel('table_patronymic'),
            StreamFieldPanel('table_phone'),
            StreamFieldPanel('table_status')
        ], heading='Таблица'),
        MultiFieldPanel([
            StreamFieldPanel('invalid_email_error'),
            StreamFieldPanel('invalid_name_error'),
            StreamFieldPanel('invalid_phone_error'),
            StreamFieldPanel('invalid_surname_error'),
            StreamFieldPanel('invalid_password_error'),
            StreamFieldPanel('invalid_password_len_error'),
            StreamFieldPanel('invalid_identity_error'),
            StreamFieldPanel('invalid_login_error')
        ], heading='Ошибки валидации'),
        MultiFieldPanel([
            StreamFieldPanel('field_name'),
            StreamFieldPanel('field_surname'),
            StreamFieldPanel('field_patronymic'),
            StreamFieldPanel('field_phone'),
            StreamFieldPanel('field_identity'),
            StreamFieldPanel('field_login'),
            StreamFieldPanel('field_password'),
            StreamFieldPanel('field_choose_role')
        ], heading='Надписи над полями ввода'),
        MultiFieldPanel([
            StreamFieldPanel('modal_delete'),
            StreamFieldPanel('modal_login_exists'),
            StreamFieldPanel('modal_identity_exists'),
            StreamFieldPanel('modal_success_add'),
            StreamFieldPanel('modal_role_duplicate'),
            StreamFieldPanel('modal_success_edit'),
        ], heading='Модальные окна'),
        FieldPanel('employees_per_page'),
        StreamFieldPanel('api_links'),
    ]

    class Meta:
        verbose_name = 'Страница сотрудников владельца'


class SelectConfigurationPage(Page):
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Выбрать конфигурацию')

    akh_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )

    akh_id = models.PositiveSmallIntegerField(
        default=1,
        null=True,
        verbose_name='ID StorageBox'
    )

    e_safe_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )

    e_safe_id = models.PositiveSmallIntegerField(
        default=2,
        null=True,
        verbose_name='ID SafeBox'
    )

    concierge_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )

    concierge_id = models.PositiveSmallIntegerField(
        default=3,
        null=True,
        verbose_name='ID Concierge'
    )

    button_choose_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Выбрать')

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
            StreamFieldPanel('button_choose_text'),
        ], heading='Заголовок'),
        MultiFieldPanel([
            FieldPanel('akh_id'),
            ImageChooserPanel('akh_icon')
        ], heading='Первый блок (АХК)'),
        MultiFieldPanel([
            FieldPanel('e_safe_id'),
            ImageChooserPanel('e_safe_icon')
        ], heading='Второй блок (ЭС)'),
        MultiFieldPanel([
            FieldPanel('concierge_id'),
            ImageChooserPanel('concierge_icon')
        ], heading='Третий блок (Консьерж)'),
        StreamFieldPanel('api_links'),
    ]

    class Meta:
        verbose_name = 'Страница выбора конфигурации'
        verbose_name_plural = 'Страницы выбора конфигурации'


class OwnerTerminalsPage(Page):
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    page_subheader = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Подзаголовок')

    list_tab = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Список')

    map_tab = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Карта')

    add_terminal_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Добавить')

    terminals_per_page = models.PositiveSmallIntegerField(
        default=7,
        null=True,
        verbose_name='Количество терминалов на одной странице'
    )

    cells_per_page = models.PositiveSmallIntegerField(
        default=7,
        null=True,
        verbose_name='Количество ячеек на одной странице'
    )

    table_number = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Номер')

    table_address = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Адрес')

    table_key = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Ключ')

    table_key_expires = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Срок ключа')

    table_status = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Статус')

    table_datetime = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Дата установки')

    table_cells_count = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Кол-во ячеек')

    table_cells_total = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Всего')

    table_cells_free = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Свободных')

    table_cells_busy = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Занятых')

    table_cells_reserve = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Резерв')

    table_cells_blocked = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Блокировка')

    filter_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фильтр')

    filter_text_all = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Все')

    card_token = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Ключ')

    card_token_expires = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Срок истечения ключа')

    card_status_date = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Дата установки статуса')

    add_terminal_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Добавить терминал')

    add_terminal_description = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Описание терминала')

    add_terminal_address = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Адрес терминала')

    add_terminal_map_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Указать на карте')

    add_terminal_send_request = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отправить запрос на активацию после добавления')

    add_terminal_save = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сохранить')

    add_terminal_back = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Вернуться')

    add_terminal_description_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Введите пожалуйста описание')

    modal_add_success = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Терминал успешно добавлен!')

    modal_delete = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Вы действительно хотите удалить терминал?')

    modal_empty_addr = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пожалуйста укажите адрес терминала')

    modal_edit_success = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Информация о терминале успешно изменена!')

    modal_logs_success = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Логи успешно отправлены на почту!')

    modal_send_activation = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отправить запрос на активацию?')

    modal_cancel_activation = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отменить запрос на активацию?')

    modal_block_confirm = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Вы уверены что хотите заблокировать терминал?')

    modal_logs_email = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Введите адрес почтового ящика')

    modal_open_cell = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Освободить ячейку после вскрытия?')

    modal_open_cell_success = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Команда на вскрытие ячейки отправлена!')

    modal_cell_params_empty = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Добавьте в справочник хотя бы один типоразмер')

    action_delete = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Удалить')

    action_send_request = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отправить запрос на активацию')

    action_logs = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Скачать логи')

    action_block = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заблокировать')

    action_reject = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отменить активацию')

    messages_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Журнал сообщений')

    hide_show_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Свернуть/показать')

    display_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отображать')

    cells_number = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Номер')

    cells_pseudonim = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Псевдоним')

    cells_row = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Ряд')

    cells_column = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Колонка')

    cells_status = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Статус')

    cells_date_status = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Дата установки')

    cells_type = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Тип ячейки')

    cells_parameters = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Параметры')

    coordinates_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Координаты')

    coordinates_not_found = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Координаты (не указаны)')

    invalid_email = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверный email')

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
            StreamFieldPanel('page_subheader'),
            StreamFieldPanel('list_tab'),
            StreamFieldPanel('map_tab'),
            StreamFieldPanel('add_terminal_button'),
        ], heading='Заголовки'),
        FieldPanel('terminals_per_page'),
        FieldPanel('cells_per_page'),
        MultiFieldPanel([
            StreamFieldPanel('table_number'),
            StreamFieldPanel('table_address'),
            StreamFieldPanel('table_status'),
            StreamFieldPanel('table_key'),
            StreamFieldPanel('table_key_expires'),
            StreamFieldPanel('table_datetime'),
            StreamFieldPanel('table_cells_count'),
            StreamFieldPanel('table_cells_total'),
            StreamFieldPanel('table_cells_free'),
            StreamFieldPanel('table_cells_busy'),
            StreamFieldPanel('table_cells_reserve'),
            StreamFieldPanel('table_cells_blocked'),
        ], heading='Таблица'),
        MultiFieldPanel([
            StreamFieldPanel('card_token'),
            StreamFieldPanel('card_token_expires'),
            StreamFieldPanel('card_status_date'),
            StreamFieldPanel('invalid_email'),
        ], heading='Карточка терминала'),
        MultiFieldPanel([
            StreamFieldPanel('add_terminal_text'),
            StreamFieldPanel('add_terminal_description'),
            StreamFieldPanel('add_terminal_address'),
            StreamFieldPanel('add_terminal_map_button'),
            StreamFieldPanel('add_terminal_send_request'),
            StreamFieldPanel('add_terminal_save'),
            StreamFieldPanel('add_terminal_back'),
            StreamFieldPanel('coordinates_text'),
            StreamFieldPanel('coordinates_not_found'),
            StreamFieldPanel('add_terminal_description_error'),
        ], heading='Добавление терминала'),
        MultiFieldPanel([
            StreamFieldPanel('action_delete'),
            StreamFieldPanel('action_send_request'),
            StreamFieldPanel('action_logs'),
            StreamFieldPanel('action_block'),
            StreamFieldPanel('action_reject'),
        ], heading='Действия'),
        MultiFieldPanel([
            StreamFieldPanel('messages_text'),
            StreamFieldPanel('hide_show_text'),
            StreamFieldPanel('display_text'),
        ], heading='Журнал сообщений'),
        MultiFieldPanel([
            StreamFieldPanel('cells_number'),
            StreamFieldPanel('cells_pseudonim'),
            StreamFieldPanel('cells_row'),
            StreamFieldPanel('cells_column'),
            StreamFieldPanel('cells_status'),
            StreamFieldPanel('cells_date_status'),
            StreamFieldPanel('cells_type'),
            StreamFieldPanel('cells_parameters'),
        ], heading='Таблица ячеек'),
        MultiFieldPanel([
            StreamFieldPanel('modal_add_success'),
            StreamFieldPanel('modal_delete'),
            StreamFieldPanel('modal_edit_success'),
            StreamFieldPanel('modal_logs_success'),
            StreamFieldPanel('modal_send_activation'),
            StreamFieldPanel('modal_cancel_activation'),
            StreamFieldPanel('modal_block_confirm'),
            StreamFieldPanel('modal_logs_email'),
            StreamFieldPanel('modal_open_cell'),
            StreamFieldPanel('modal_open_cell_success'),
            StreamFieldPanel('modal_empty_addr'),
            StreamFieldPanel('modal_cell_params_empty'),
        ], heading='Модальные окна'),
        MultiFieldPanel([
            StreamFieldPanel('filter_text'),
            StreamFieldPanel('filter_text_all')
        ], heading='Фильтр'),
        StreamFieldPanel('api_links'),
    ]

    class Meta:
        verbose_name = 'Страница терминалов (кабинет владельца)'
        verbose_name_plural = 'Страницы терминалов (кабинет владельца)'


class RegistrationPage(Page):
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    field_name = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Имя')

    field_surname = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Фамилия')

    field_password = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пароль')

    field_repeat_password = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Повторить пароль')

    sign_up_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Кнопка регистрации')

    invalid_email_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверный email')

    invalid_name_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверное имя')

    invalid_surname_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверная фамилия')

    invalid_password_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверный пароль')

    invalid_reset_password_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверный пароль (повторный)')

    invalid_password_len_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверный пароль (короткий)')

    invalid_password_mismatch_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пароли не совпадают')

    modal_email_sent = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Письмо отправлено')

    modal_user_exists = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пользователь уже существует')

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
        ], heading='Заголовок'),
        MultiFieldPanel([
            StreamFieldPanel('field_name'),
            StreamFieldPanel('field_surname'),
            StreamFieldPanel('field_password'),
            StreamFieldPanel('field_repeat_password'),
            StreamFieldPanel('sign_up_button'),
        ], heading='Надписи над полями'),
        MultiFieldPanel([
            StreamFieldPanel('invalid_email_error'),
            StreamFieldPanel('invalid_name_error'),
            StreamFieldPanel('invalid_surname_error'),
            StreamFieldPanel('invalid_password_error'),
            StreamFieldPanel('invalid_reset_password_error'),
            StreamFieldPanel('invalid_password_len_error'),
            StreamFieldPanel('invalid_password_mismatch_error'),
        ], heading='Ошибки валидации'),
        MultiFieldPanel([
            StreamFieldPanel('modal_email_sent'),
            StreamFieldPanel('modal_user_exists')
        ], heading='Модальные окна'),
        StreamFieldPanel('api_links'),
    ]

    class Meta:
        verbose_name = 'Страница регистрации'
        verbose_name_plural = 'Страницы регистрации'


class PasswordResetEmail(Page):
    max_count = 1

    email_message = RichTextField(
        help_text='Для вставки ссылки используйте слово заключенное в символы "|": ... |ссылке|')

    content_panels = Page.content_panels + [
        FieldPanel('email_message')
    ]

    class Meta:
        verbose_name = 'Шаблон письма для восстановления пароля'
        verbose_name_plural = 'Шаблон письма для восстановления пароля'


class AccountActivationPage(Page):
    max_count = 1

    email_message = RichTextField(
        help_text='Для вставки ссылки используйте слово заключенное в символы "|": ... |ссылке|')

    content_panels = Page.content_panels + [
        FieldPanel('email_message')
    ]

    class Meta:
        verbose_name = 'Шаблон письма для активации аккаунта'
        verbose_name_plural = 'Шаблон письма для активации аккаунта'


class PasswordReset(Page):
    templates = 'akh_app/password_reset.html'
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    invalid_email_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверный email')

    restore_button_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Кнопка восстановить')

    back_to_login = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Кнопка вернуться')

    modal_user_notfound = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пользователь не найден')

    modal_success = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Письмо успешно отправлено')

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
        ], heading='Заголовок'),
        MultiFieldPanel([
            StreamFieldPanel('invalid_email_error'),
        ], heading='Ошибки валидации'),
        MultiFieldPanel([
            StreamFieldPanel('restore_button_text'),
            StreamFieldPanel('back_to_login'),
        ], heading='Кнопки'),
        MultiFieldPanel([
            StreamFieldPanel('modal_user_notfound'),
            StreamFieldPanel('modal_success')
        ], heading='Модальные окна'),
        StreamFieldPanel('api_links')
    ]

    class Meta:
        verbose_name = 'Страница восстановления пароля'
        verbose_name_plural = 'Страницы восстановления пароля'


class ChangePassword(Page):
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    password_field = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Новый пароль')

    repeat_password_field = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Повторите пароль')

    invalid_password_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверный пароль')

    invalid_password_len_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверный пароль (слишком короткий')

    invalid_reset_password_error = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Неверный пароль (повторить')

    invalid_passwords_mismatch = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пароли не совпадают)')

    change_button_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Кнопка сменить')

    modal_success = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Пароль успешно изменен')

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
        ], heading='Заголовок'),
        MultiFieldPanel([
            StreamFieldPanel('password_field'),
            StreamFieldPanel('repeat_password_field')
        ], heading='Поля'),
        MultiFieldPanel([
            StreamFieldPanel('invalid_password_error'),
            StreamFieldPanel('invalid_password_len_error'),
            StreamFieldPanel('invalid_reset_password_error'),
            StreamFieldPanel('invalid_passwords_mismatch'),
        ], heading='Ошибки валидации'),
        MultiFieldPanel([
            StreamFieldPanel('change_button_text')
        ], heading='Кнопки'),
        MultiFieldPanel([
            StreamFieldPanel('modal_success')
        ], heading='Модальные окна'),
        StreamFieldPanel('api_links')
    ]

    class Meta:
        verbose_name = 'Страница смены пароля'
        verbose_name_plural = 'Страницы смены пароля'
