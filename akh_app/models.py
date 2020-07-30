from django.db import models
from django.contrib.auth.models import User

from wagtail.snippets.models import register_snippet
from wagtail.admin.edit_handlers import FieldPanel, MultiFieldPanel, StreamFieldPanel, FieldRowPanel
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
class LeftMenu(models.Model):
    menu_icon = models.ImageField(verbose_name='Иконка', null=True)
    menu_label = models.CharField(max_length=20, verbose_name='Название', null=True)
    # related_page = models.ForeignKey('Page', on_delete=models.SET_NULL, null=True, blank=True)
    is_visible = models.BooleanField(default=True, verbose_name='Отображать в меню', null=True)

    def __str__(self):
        return self.menu_label

    class Meta:
        verbose_name_plural = 'Боковое меню'
        verbose_name = 'Боковое меню'


class CommonRoutes:
    pass


class LoginPage(Page):
    max_count = 1

    page_header = models.CharField(
        max_length=100,
        verbose_name='Заголовок страницы',
        null=True,
        help_text='Данный заголовок будет отображаться сверху на вкладке страницы.'
    )
    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        FieldPanel('page_header'),
        StreamFieldPanel('api_links'),
    ]

    class Meta:
        verbose_name = 'Страница авторизации'
        verbose_name_plural = 'Страницы авторизации'


class DictionaryPage(Page):
    max_count = 1

    page_header = models.CharField(
        max_length=100,
        null=True,
        verbose_name='Заголовок на странице (ru)',
        default='Справочники'
    )

    page_header_en = models.CharField(
        max_length=100,
        null=True,
        verbose_name='Заголовок на странице (en)',
        default='Dictionaries'
    )

    button_add = models.CharField(
        max_length=50,
        null=True,
        verbose_name='Добавить (ru)',
        default='Добавить'
    )

    button_add_en = models.CharField(
        max_length=50,
        null=True,
        verbose_name='Добавить (en)',
        default='Add'
    )

    filter_dict_text = models.CharField(
        max_length=50,
        null=True,
        verbose_name='Фильтр (ru)',
        default='Фильтр'
    )

    filter_dict_text_en = models.CharField(
        max_length=50,
        null=True,
        verbose_name='Фильтр (en)',
        default='Filter'
    )

    table_position = models.CharField(
        max_length=50,
        null=True,
        verbose_name='Номер позиции - таблица (ru)',
        default='Номер позиции'
    )

    table_position_en = models.CharField(
        max_length=50,
        null=True,
        verbose_name='Position number - Table (en)',
        default='Position number'
    )

    table_name = models.CharField(
        max_length=50,
        null=True,
        verbose_name='Наименование - таблица (ru)',
        default='Номер позиции'
    )

    table_name_en = models.CharField(
        max_length=50,
        null=True,
        verbose_name='Name - Table (en)',
        default='Name'
    )

    table_description = models.CharField(
        max_length=50,
        null=True,
        verbose_name='Описание - таблица (ru)',
        default='Описание'
    )

    table_description_en = models.CharField(
        max_length=50,
        null=True,
        verbose_name='Description - Table (en)',
        default='Description'
    )

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    items_per_page = models.PositiveSmallIntegerField(
        default=2,
        null=True,
        verbose_name='Количество позиций на одной странице'
    )

    content_panels = Page.content_panels + [
        FieldRowPanel([
            FieldPanel('page_header'),
            FieldPanel('page_header_en')
        ]),
        FieldRowPanel([
            FieldPanel('button_add'),
            FieldPanel('button_add_en')
        ]),
        FieldRowPanel([
            FieldPanel('filter_dict_text'),
            FieldPanel('filter_dict_text_en')
        ]),
        MultiFieldPanel([
            FieldRowPanel([
                FieldPanel('table_position'),
                FieldPanel('table_position_en')
            ]),
            FieldRowPanel([
                FieldPanel('table_name'),
                FieldPanel('table_name_en')
            ]),
            FieldRowPanel([
                FieldPanel('table_description'),
                FieldPanel('table_description_en')
            ])
        ], heading='Таблица (Table)'),
        FieldPanel('items_per_page'),
        StreamFieldPanel('api_links'),
    ]

    class Meta:
        verbose_name = 'Страница справочника'
        verbose_name_plural = 'Страницы справочников'


class AdministratorMainPage(Page):
    max_count = 1

    page_header = models.CharField(
        max_length=200,
        null=True,
        verbose_name='Заголовок на странице'
    )

    total_terminals_groups_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )
    total_terminals_groups_text = models.CharField(
        max_length=400,
        null=True,
        blank=True,
        verbose_name='Текст',
        default='Всего групп терминалов'
    )

    total_terminals_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )
    total_terminals_text = models.CharField(
        max_length=400,
        null=True,
        blank=True,
        verbose_name='Текст',
        default='Всего терминалов'
    )

    online_terminals_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )
    online_terminals_text = models.CharField(
        max_length=400,
        null=True,
        blank=True,
        verbose_name='Текст',
        default='Количество терминалов онлайн'
    )

    expired_terminals_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )
    expired_terminals_text = models.CharField(
        max_length=400,
        null=True,
        blank=True,
        verbose_name='Текст',
        default='Просрочена активация'
    )

    pending_terminals_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )
    pending_terminals_text = models.CharField(
        max_length=400,
        null=True,
        blank=True,
        verbose_name='Текст',
        default='В ожидании активации'
    )

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        FieldPanel('page_header'),
        MultiFieldPanel([
            ImageChooserPanel('total_terminals_groups_icon'),
            FieldPanel('total_terminals_groups_text')
        ], heading='Первый блок (Всего групп терминалов)'),
        MultiFieldPanel([
            ImageChooserPanel('total_terminals_icon'),
            FieldPanel('total_terminals_text')
        ], heading='Второй блок (Всего терминалов)'),
        MultiFieldPanel([
            ImageChooserPanel('online_terminals_icon'),
            FieldPanel('online_terminals_text')
        ], heading='Третий блок (Терминалы онлайн)'),
        MultiFieldPanel([
            ImageChooserPanel('expired_terminals_icon'),
            FieldPanel('expired_terminals_text')
        ], heading='Четвертый блок (Просрочена активация)'),
        MultiFieldPanel([
            ImageChooserPanel('pending_terminals_icon'),
            FieldPanel('pending_terminals_text')
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

    page_header = models.CharField(
        max_length=100,
        verbose_name='Заголовок на странице',
        null=True,
        default='Теминалы'
    )

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True, blank=True)

    terminals_per_page = models.PositiveSmallIntegerField(
        default=7,
        null=True,
        verbose_name='Количество терминалов на одной странице'
    )

    content_panels = Page.content_panels + [
        FieldPanel('page_header'),
        FieldPanel('terminals_per_page'),
        StreamFieldPanel('api_links'),
    ]

    class Meta:
        verbose_name = 'Страница терминалов администратора'


class AdministratorProfile(Page):
    max_count = 1

    page_header = models.CharField(
        max_length=100,
        verbose_name='Заголовок на странице (ru)',
        null=True,
        default='Мой профиль'
    )

    page_header_en = models.CharField(
        max_length=100,
        verbose_name='Заголовок на странице (en)',
        null=True,
        default='My profile'
    )

    change_password_header = models.CharField(
        max_length=100,
        verbose_name='Заголовок для смены пароля (ru)',
        null=True,
        default='Сменить пароль'
    )

    change_password_header_en = models.CharField(
        max_length=100,
        verbose_name='Заголовок для смены пароля (en)',
        null=True,
        default='Change password'
    )

    save_profile_button = models.CharField(
        max_length=100,
        verbose_name='Кнопка сохранить (ru)',
        null=True,
        default='Сохранить'
    )

    save_profile_button_en = models.CharField(
        max_length=100,
        verbose_name='Кнопка сохранить (en)',
        null=True,
        default='Save'
    )

    change_password_button = models.CharField(
        max_length=100,
        verbose_name='Кнопка сменить пароль (ru)',
        null=True,
        default='Сменить пароль'
    )

    change_password_button_en = models.CharField(
        max_length=100,
        verbose_name='Кнопка сменить пароль (en)',
        null=True,
        default='Change password'
    )

    label_name = models.CharField(
        max_length=100,
        verbose_name='Название поля имени (ru)',
        null=True,
        default='Имя'
    )

    label_name_en = models.CharField(
        max_length=100,
        verbose_name='Название поля имени (en)',
        null=True,
        default='Name'
    )

    label_surname = models.CharField(
        max_length=100,
        verbose_name='Название поля фамилии (ru)',
        null=True,
        default='Фамилия'
    )

    label_surname_en = models.CharField(
        max_length=100,
        verbose_name='Название поля фамилии (en)',
        null=True,
        default='Surname'
    )

    label_patronymic = models.CharField(
        max_length=100,
        verbose_name='Название поля отчество (ru)',
        null=True,
        default='Отчество'
    )

    label_patronymic_en = models.CharField(
        max_length=100,
        verbose_name='Название поля отчество (en)',
        null=True,
        default='Patronymic'
    )

    label_phone = models.CharField(
        max_length=100,
        verbose_name='Название поля телефона (ru)',
        null=True,
        default='Телефон'
    )

    label_phone_en = models.CharField(
        max_length=100,
        verbose_name='Название поля телефона (en)',
        null=True,
        default='Phone'
    )

    label_password = models.CharField(
        max_length=100,
        verbose_name='Название поля смены пароля (ru)',
        null=True,
        default='Введите пароль'
    )

    label_password_en = models.CharField(
        max_length=100,
        verbose_name='Название поля подтверждения пароля (en)',
        null=True,
        default='Input password'
    )

    label_password_repeat = models.CharField(
        max_length=100,
        verbose_name='Название поля подтверждения пароля (ru)',
        null=True,
        default='Повторите пароль'
    )

    label_password_repeat_en = models.CharField(
        max_length=100,
        verbose_name='Название поля подтверждения пароля (en)',
        null=True,
        default='Repeat password'
    )

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldRowPanel([
                FieldPanel('page_header'),
                FieldPanel('page_header_en'),
            ])
        ], heading='Мой профиль'),
        MultiFieldPanel([
            FieldRowPanel([
                FieldPanel('change_password_header'),
                FieldPanel('change_password_header_en')
            ])
        ], heading='Смена пароля'),
        MultiFieldPanel([
            FieldRowPanel([
                FieldPanel('label_name'),
                FieldPanel('label_name_en')
            ]),
            FieldRowPanel([
                FieldPanel('label_surname'),
                FieldPanel('label_surname_en')
            ]),
            FieldRowPanel([
                FieldPanel('label_patronymic'),
                FieldPanel('label_patronymic_en')
            ]),
            FieldRowPanel([
                FieldPanel('label_phone'),
                FieldPanel('label_phone_en')
            ]),
            FieldRowPanel([
                FieldPanel('label_password'),
                FieldPanel('label_password_en')
            ])
        ], heading='Названия полей'),
        MultiFieldPanel([
            FieldRowPanel([
                FieldPanel('save_profile_button'),
                FieldPanel('save_profile_button_en')
            ]),
            FieldRowPanel([
                FieldPanel('change_password_button'),
                FieldPanel('change_password_button_en')
            ])
        ], heading='Кнопки'),
        StreamFieldPanel('api_links')
    ]

    class Meta:
        verbose_name = 'Страница профиля'


class TerminalGroupsPage(Page):
    max_count = 1

    page_header = models.CharField(
        max_length=100,
        verbose_name='Заголовок на странице',
        null=True,
        default='Сотрудники'
    )

    groups_per_page = models.PositiveSmallIntegerField(
        default=7,
        null=True,
        verbose_name='Количество групп на одной странице'
    )

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True, blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('page_header'),
        FieldPanel('groups_per_page'),
        StreamFieldPanel('api_links'),
    ]

    class Meta:
        verbose_name = 'Страница групп терминалов'


class AdminEmployeesPage(Page):
    max_count = 1

    page_header = models.CharField(
        max_length=100,
        verbose_name='Заголовок на странице',
        null=True,
        default='Сотрудники'
    )

    employees_per_page = models.PositiveSmallIntegerField(
        default=7,
        null=True,
        verbose_name='Количество сотрудников на одной странице'
    )

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True, blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('page_header'),
        FieldPanel('employees_per_page'),
        StreamFieldPanel('api_links'),
    ]

    class Meta:
        verbose_name = 'Страница сотрудников администратора'


class OwnerEmpoloyeesPage(Page):
    max_count = 1

    page_header = models.CharField(
        max_length=100,
        verbose_name='Заголовок на странице (ru)',
        null=True,
        default='Сотрудники'
    )

    page_header_en = models.CharField(
        max_length=100,
        verbose_name='Заголовок на странице (en)',
        null=True,
        default='Employees'
    )

    page_subheader = models.CharField(
        max_length=100,
        verbose_name='Подзаголовок на странице (ru)',
        null=True,
        default='Управление сотрудниками'
    )

    page_subheader_en = models.CharField(
        max_length=100,
        verbose_name='Подзаголовок на странице (en)',
        null=True,
        default='Employee management'
    )

    employees_per_page = models.PositiveSmallIntegerField(
        default=7,
        null=True,
        verbose_name='Количество сотрудников на одной странице'
    )

    add_button_name = models.CharField(
        max_length=100,
        verbose_name='Кнопка добавить сотрудника (ru)',
        null=True,
        default='Добавить'
    )

    add_button_name_en = models.CharField(
        max_length=100,
        verbose_name='Кнопка добавить сотрудника (en)',
        null=True,
        default='Add'
    )

    table_surname = models.CharField(
        max_length=100,
        verbose_name='Фамилия (ru)',
        null=True,
        default='Фамилия'
    )

    table_surname_en = models.CharField(
        max_length=100,
        verbose_name='Фамилия (en)',
        null=True,
        default='Surname'
    )

    table_name = models.CharField(
        max_length=100,
        verbose_name='Имя (ru)',
        null=True,
        default='Имя'
    )

    table_name_en = models.CharField(
        max_length=100,
        verbose_name='Имя (en)',
        null=True,
        default='First name'
    )

    table_patronymic = models.CharField(
        max_length=100,
        verbose_name='Отчество (ru)',
        null=True,
        default='Отчество'
    )

    table_patronymic_en = models.CharField(
        max_length=100,
        verbose_name='Отчество (en)',
        null=True,
        default='Patronymic'
    )

    table_phone = models.CharField(
        max_length=100,
        verbose_name='Телефон (ru)',
        null=True,
        default='Телефон'
    )

    table_phone_en = models.CharField(
        max_length=100,
        verbose_name='Телефон (en)',
        null=True,
        default='Phone'
    )

    table_status = models.CharField(
        max_length=100,
        verbose_name='Статус (ru)',
        null=True,
        default='Статус'
    )

    table_status_en = models.CharField(
        max_length=100,
        verbose_name='Статус (en)',
        null=True,
        default='Status'
    )


    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldRowPanel([
                FieldPanel('page_header'),
                FieldPanel('page_subheader')
            ])
        ], heading='Заголовки'),
        FieldRowPanel([
            FieldPanel('add_button_name'),
            FieldPanel('add_button_name_en')
        ]),
        MultiFieldPanel([
            FieldRowPanel([
                FieldPanel('table_surname'),
                FieldPanel('table_surname_en')
            ]),
            FieldRowPanel([
                FieldPanel('table_name'),
                FieldPanel('table_name_en')
            ]),
            FieldRowPanel([
                FieldPanel('table_patronymic'),
                FieldPanel('table_patronymic_en')
            ]),
            FieldRowPanel([
                FieldPanel('table_phone'),
                FieldPanel('table_phone_en')
            ]),
            FieldRowPanel([
                FieldPanel('table_status'),
                FieldPanel('table_status_en')
            ]),
        ], heading='Таблица'),
        FieldPanel('employees_per_page'),
        StreamFieldPanel('api_links'),
    ]

    class Meta:
        verbose_name = 'Страница сотрудников владельца'


class SelectConfigurationPage(Page):
    max_count = 1

    page_header = models.CharField(
        max_length=100,
        verbose_name='Заголовок на странице (ru)',
        null=True,
        default='Выбрать конфигурацию'
    )

    page_header_en = models.CharField(
        max_length=100,
        verbose_name='Заголовок на странице (en)',
        null=True,
        default='Choose configuration'
    )

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

    button_choose_text = models.CharField(
        max_length=300,
        verbose_name='Кнопка выбрать конфигурацию (ru)',
        null=True,
        default='Выбрать'
    )

    button_choose_text_en = models.CharField(
        max_length=300,
        verbose_name='Кнопка выбрать конфигурацию (en)',
        null=True,
        default='Choose'
    )

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldRowPanel([
                FieldPanel('page_header'),
                FieldPanel('page_header_en')
            ])
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
        FieldRowPanel([
            FieldPanel('button_choose_text'),
            FieldPanel('button_choose_text_en')
        ]),
        StreamFieldPanel('api_links'),
    ]

    class Meta:
        verbose_name = 'Страница выбора конфигурации'
        verbose_name_plural = 'Страницы выбора конфигурации'


class OwnerTerminalsPage(Page):
    max_count = 1

    page_header = models.CharField(
        max_length=100,
        verbose_name='Заголовок на странице (ru)',
        null=True,
        default='Терминалы'
    )

    page_header_en = models.CharField(
        max_length=100,
        verbose_name='Заголовок на странице (en)',
        null=True,
        default='Terminals'
    )

    page_subheader = models.CharField(
        max_length=100,
        verbose_name='Подзаголовок на странице (ru)',
        null=True,
        default='Список всех терминалов'
    )

    page_subheader_en = models.CharField(
        max_length=100,
        verbose_name='Подзаголовок на странице (en)',
        null=True,
        default='List of terminals'
    )

    list_tab = models.CharField(
        max_length=100,
        verbose_name='Список (ru)',
        null=True,
        default='Список'
    )

    list_tab_en = models.CharField(
        max_length=100,
        verbose_name='Список (ru)',
        null=True,
        default='List'
    )

    map_tab = models.CharField(
        max_length=100,
        verbose_name='Карта (ru)',
        null=True,
        default='Карта'
    )

    map_tab_en = models.CharField(
        max_length=100,
        verbose_name='Карта (en)',
        null=True,
        default='Map'
    )

    add_terminal_button = models.CharField(
        max_length=100,
        verbose_name='Кнопка добавить (ru)',
        null=True,
        default='Добавить'
    )

    add_terminal_button_en = models.CharField(
        max_length=100,
        verbose_name='Кнопка добавить (en)',
        null=True,
        default='Add'
    )

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

    table_number = models.CharField(
        max_length=100,
        verbose_name='Таблица - номер (ru)',
        null=True,
        default='Номер'
    )

    table_number_en = models.CharField(
        max_length=100,
        verbose_name='Таблица - номер (en)',
        null=True,
        default='Number'
    )

    table_address = models.CharField(
        max_length=100,
        verbose_name='Таблица - адрес (ru)',
        null=True,
        default='Адрес'
    )

    table_address_en = models.CharField(
        max_length=100,
        verbose_name='Таблица - адрес (en)',
        null=True,
        default='Address'
    )

    table_key = models.CharField(
        max_length=100,
        verbose_name='Таблица - ключ (ru)',
        null=True,
        default='Ключ'
    )

    table_key_en = models.CharField(
        max_length=100,
        verbose_name='Таблица - ключ (en)',
        null=True,
        default='Token'
    )

    table_key_expires = models.CharField(
        max_length=100,
        verbose_name='Таблица - срок ключа (ru)',
        null=True,
        default='Срок ключа'
    )

    table_key_expires_en = models.CharField(
        max_length=100,
        verbose_name='Таблица - срок ключа (en)',
        null=True,
        default='Token expires'
    )

    table_status = models.CharField(
        max_length=100,
        verbose_name='Таблица - статус (ru)',
        null=True,
        default='Статус'
    )

    table_status_en = models.CharField(
        max_length=100,
        verbose_name='Таблица - статус (en)',
        null=True,
        default='Status'
    )

    table_datetime = models.CharField(
        max_length=100,
        verbose_name='Таблица - дата установки (ru)',
        null=True,
        default='Дата установки'
    )

    table_datetime_en = models.CharField(
        max_length=100,
        verbose_name='Таблица - дата установки (en)',
        null=True,
        default='Datetime'
    )

    table_cells_count = models.CharField(
        max_length=100,
        verbose_name='Таблица - количество ячеек (ru)',
        null=True,
        default='Кол-во ячеек'
    )

    table_cells_count_en = models.CharField(
        max_length=100,
        verbose_name='Таблица - количество ячеек (en)',
        null=True,
        default='Cells count'
    )

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldRowPanel([
                FieldPanel('page_header'),
                FieldPanel('page_header_en')
            ]),
            FieldRowPanel([
                FieldPanel('page_subheader'),
                FieldPanel('page_subheader_en')
            ]),
            FieldRowPanel([
                FieldPanel('list_tab'),
                FieldPanel('list_tab_en')
            ]),
            FieldRowPanel([
                FieldPanel('map_tab'),
                FieldPanel('map_tab_en')
            ]),
            FieldRowPanel([
                FieldPanel('add_terminal_button'),
                FieldPanel('add_terminal_button_en')
            ])
        ], heading='Заголовки'),
        FieldPanel('terminals_per_page'),
        FieldPanel('cells_per_page'),
        MultiFieldPanel([
            FieldRowPanel([
                FieldPanel('table_number'),
                FieldPanel('table_number_en')
            ]),
            FieldRowPanel([
                FieldPanel('table_status'),
                FieldPanel('table_status_en')
            ]),
            FieldRowPanel([
                FieldPanel('table_key'),
                FieldPanel('table_key_en')
            ]),
            FieldRowPanel([
                FieldPanel('table_key_expires'),
                FieldPanel('table_key_expires_en')
            ]),
            FieldRowPanel([
                FieldPanel('table_status'),
                FieldPanel('table_status_en')
            ]),
            FieldRowPanel([
                FieldPanel('table_datetime'),
                FieldPanel('table_datetime_en')
            ]),
            FieldRowPanel([
                FieldPanel('table_cells_count'),
                FieldPanel('table_cells_count_en')
            ])
        ], heading='Таблица'),
        StreamFieldPanel('api_links'),
    ]

    class Meta:
        verbose_name = 'Страница терминалов (кабинет владельца)'
        verbose_name_plural = 'Страницы терминалов (кабинет владельца)'


class RegistrationPage(Page):
    max_count = 1

    page_header = models.CharField(
        max_length=100,
        verbose_name='Заголовок на странице',
        null=True,
        default='Регистрация пользователя'
    )
    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        FieldPanel('page_header'),
        StreamFieldPanel('api_links'),
    ]

    class Meta:
        verbose_name = 'Страница регистрации'
        verbose_name_plural = 'Страницы регистрации'


class PasswordResetEmail(Page):
    template = 'akh_app/auth/reset_password_mail.html'
    max_count = 1

    email_message = RichTextField()

    content_panels = Page.content_panels + [
        FieldPanel('email_message')
    ]

    class Meta:
        verbose_name = 'Шаблон письма для восстановления пароля'
        verbose_name_plural = 'Шаблон письма для восстановления пароля'


class PasswordReset(Page):
    templates = 'akh_app/password_reset.html'
    max_count = 1

    page_header = models.CharField(
        max_length=100,
        verbose_name='Заголовок страницы',
        null=True,
        help_text='Данный заголовок будет отображаться сверху на вкладке страницы.'
    )
    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        FieldPanel('page_header'),
        StreamFieldPanel('api_links'),
    ]

    class Meta:
        verbose_name = 'Страница восстановления пароля'
        verbose_name_plural = 'Страницы восстановления пароля'


