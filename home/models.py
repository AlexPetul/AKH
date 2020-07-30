from django.db import models

from wagtail.core.models import Page
from wagtail.core.fields import StreamField
from akh_app.blocks import ApiBlock
from wagtail.admin.edit_handlers import FieldPanel, MultiFieldPanel, StreamFieldPanel, FieldRowPanel
from wagtail.images.edit_handlers import ImageChooserPanel


class HomePage(Page):
    templates = "akh_app/index.html"
    max_count = 1

    page_header = models.CharField(
        max_length=200,
        null=True,
        verbose_name='Заголовок на странице (ru)',
        default='Текущая конфигурация'
    )

    page_header_en = models.CharField(
        max_length=200,
        null=True,
        verbose_name='Заголовок на странице (en)',
        default='Current configuration'
    )

    stat_tab = models.CharField(
        max_length=200,
        null=True,
        verbose_name='Статистика (ru)',
        default='Статистика'
    )

    stat_tab_en = models.CharField(
        max_length=200,
        null=True,
        verbose_name='Статистика (en)',
        default='Statistics'
    )

    messages_tab = models.CharField(
        max_length=200,
        null=True,
        verbose_name='Сообщения терминалов (ru)',
        default='Сообщения терминалов'
    )

    messages_tab_en = models.CharField(
        max_length=200,
        null=True,
        verbose_name='Сообщения терминалов (en)',
        default='Terminal messages'
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
        verbose_name='Текст (ru)',
        default='Всего терминалов'
    )

    total_terminals_text_en = models.CharField(
        max_length=400,
        null=True,
        blank=True,
        verbose_name='Текст (en)',
        default='Total terminals'
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
        verbose_name='Текст (ru)',
        default='Количество терминалов онлайн'
    )

    online_terminals_text_en = models.CharField(
        max_length=400,
        null=True,
        blank=True,
        verbose_name='Текст (en)',
        default='Online terminals count'
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
        verbose_name='Текст (ru)',
        default='Просрочена активация'
    )

    expired_terminals_text_en = models.CharField(
        max_length=400,
        null=True,
        blank=True,
        verbose_name='Текст (en)',
        default='Activation expired'
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
        verbose_name='Текст (ru)',
        default='В ожидании активации'
    )

    pending_terminals_text_en = models.CharField(
        max_length=400,
        null=True,
        blank=True,
        verbose_name='Текст (en)',
        default='Waiting for activation'
    )

    blocked_terminals_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )

    blocked_terminals_text = models.CharField(
        max_length=400,
        null=True,
        blank=True,
        verbose_name='Текст (ru)',
        default='Заблокированных терминалов'
    )

    blocked_terminals_text_en = models.CharField(
        max_length=400,
        null=True,
        blank=True,
        verbose_name='Текст (en)',
        default='Blocked terminals'
    )

    active_terminals_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )

    active_terminals_text = models.CharField(
        max_length=400,
        null=True,
        blank=True,
        verbose_name='Текст (ru)',
        default='Количество активных терминалов'
    )

    active_terminals_text_en = models.CharField(
        max_length=400,
        null=True,
        blank=True,
        verbose_name='Текст (en)',
        default='Active terminals count'
    )

    display_text = models.CharField(
        max_length=50,
        null=True,
        blank=True,
        verbose_name='Отображать (ru)',
        default='Отображать'
    )

    display_text_en = models.CharField(
        max_length=50,
        null=True,
        blank=True,
        verbose_name='Отображать (en)',
        default='Display'
    )

    change_config_button = models.CharField(
        max_length=50,
        null=True,
        blank=True,
        verbose_name='Сменить (ru)',
        default='Сменить'
    )

    change_config_button_en = models.CharField(
        max_length=50,
        null=True,
        blank=True,
        verbose_name='Сменить (en)',
        default='Change'
    )

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldPanel('page_header'),
            FieldPanel('page_header_en')
        ], heading='Заголовок'),
        MultiFieldPanel([
            FieldRowPanel([
                FieldPanel('stat_tab'),
                FieldPanel('stat_tab_en')
            ]),
            FieldRowPanel([
                FieldPanel('messages_tab'),
                FieldPanel('messages_tab_en')
            ]),
        ], heading='Вкладки'),
        MultiFieldPanel([
            ImageChooserPanel('total_terminals_icon'),
            FieldRowPanel([
                FieldPanel('total_terminals_text'),
                FieldPanel('total_terminals_text_en')
            ])
        ], heading='Первый блок (Всего терминалов)'),
        MultiFieldPanel([
            ImageChooserPanel('online_terminals_icon'),
            FieldRowPanel([
                FieldPanel('online_terminals_text'),
                FieldPanel('online_terminals_text_en')
            ])
        ], heading='Второй блок (Терминалы онлайн)'),
        MultiFieldPanel([
            ImageChooserPanel('expired_terminals_icon'),
            FieldRowPanel([
                FieldPanel('expired_terminals_text'),
                FieldPanel('expired_terminals_text_en')
            ])
        ], heading='Третий блок (Просрочена активация)'),
        MultiFieldPanel([
            ImageChooserPanel('pending_terminals_icon'),
            FieldRowPanel([
                FieldPanel('pending_terminals_text'),
                FieldPanel('pending_terminals_text_en')
            ])
        ], heading='Четвертый блок (В ожидании активации)'),
        MultiFieldPanel([
            ImageChooserPanel('blocked_terminals_icon'),
            FieldRowPanel([
                FieldPanel('blocked_terminals_text'),
                FieldPanel('blocked_terminals_text_en')
            ])
        ], heading='Пятый блок (Заблокированные терминалы)'),
        MultiFieldPanel([
            ImageChooserPanel('active_terminals_icon'),
            FieldRowPanel([
                FieldPanel('active_terminals_text'),
                FieldPanel('active_terminals_text_en')
            ])
        ], heading='Активные терминалы'),
        MultiFieldPanel([
            FieldRowPanel([
                FieldPanel('display_text'),
                FieldPanel('display_text_en')
            ])
        ], heading='Сообщения'),
        FieldRowPanel([
            FieldPanel('change_config_button'),
            FieldPanel('change_config_button_en')
        ]),
        StreamFieldPanel('api_links')
    ]

    class Meta:
        verbose_name = 'Главная страница'
        verbose_name_plural = 'Главные страницы'

