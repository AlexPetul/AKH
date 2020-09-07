from django.db import models

from wagtail.core.models import Page
from wagtail.core.fields import StreamField
from akh_app.blocks import ApiBlock, MultiLangBlock
from wagtail.admin.edit_handlers import MultiFieldPanel, StreamFieldPanel
from wagtail.images.edit_handlers import ImageChooserPanel


class HomePage(Page):
    templates = "akh_app/index.html"
    max_count = 1

    page_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заголовок')

    stat_tab = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Статистика')

    messages_tab = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сообщения терминалов')

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

    blocked_terminals_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )

    blocked_terminals_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Заблокированных терминалов')

    active_terminals_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )

    active_terminals_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Количество активных терминалов')

    display_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Отображать')

    change_config_button = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сменить')

    currency_header = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Текущая валюта')

    payments_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )

    payments_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Сумма платежей за сутки')

    storage_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )

    storage_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Кол-во хранений за сутки')

    collections_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )

    collections_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Кол-во инкассаций за сутки')

    cell_attachments_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )

    cell_attachments_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Кол-во доступов за сутки')

    cash_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )

    cash_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Общая сумма наличных денег')

    mark_icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Иконка',
        related_name='+'
    )

    mark_text = StreamField([
        ('lang_select', MultiLangBlock())
    ], null=True, verbose_name='Количество закладок за сутки')

    api_links = StreamField([
        ('api_block', ApiBlock())
    ], null=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            StreamFieldPanel('page_header'),
            StreamFieldPanel('currency_header'),
        ], heading='Заголовки'),
        MultiFieldPanel([
            StreamFieldPanel('stat_tab'),
            StreamFieldPanel('messages_tab'),
        ], heading='Вкладки'),
        MultiFieldPanel([
            ImageChooserPanel('total_terminals_icon'),
            StreamFieldPanel('total_terminals_text')
        ], heading='Первый блок (Всего терминалов)'),
        MultiFieldPanel([
            ImageChooserPanel('online_terminals_icon'),
            StreamFieldPanel('online_terminals_text'),
        ], heading='Второй блок (Терминалы онлайн)'),
        MultiFieldPanel([
            ImageChooserPanel('expired_terminals_icon'),
            StreamFieldPanel('expired_terminals_text'),
        ], heading='Третий блок (Просрочена активация)'),
        MultiFieldPanel([
            ImageChooserPanel('pending_terminals_icon'),
            StreamFieldPanel('pending_terminals_text')
        ], heading='Четвертый блок (В ожидании активации)'),
        MultiFieldPanel([
            ImageChooserPanel('blocked_terminals_icon'),
            StreamFieldPanel('blocked_terminals_text'),
        ], heading='Пятый блок (Заблокированные терминалы)'),
        MultiFieldPanel([
            ImageChooserPanel('active_terminals_icon'),
            StreamFieldPanel('active_terminals_text')
        ], heading='Активные терминалы'),
        MultiFieldPanel([
            ImageChooserPanel('payments_icon'),
            StreamFieldPanel('payments_text')
        ], heading='Общая сумма платежей'),
        MultiFieldPanel([
            ImageChooserPanel('storage_icon'),
            StreamFieldPanel('storage_text'),
        ], heading='Количество хранений за сутки'),
        MultiFieldPanel([
            ImageChooserPanel('collections_icon'),
            StreamFieldPanel('collections_text')
        ], heading='Количество инкассаций за сутки'),
        MultiFieldPanel([
            ImageChooserPanel('cell_attachments_icon'),
            StreamFieldPanel('cell_attachments_text'),
        ], heading='Количество доступов за сутки'),
        MultiFieldPanel([
            ImageChooserPanel('mark_icon'),
            StreamFieldPanel('mark_text'),
        ], heading='Количество закладок за сутки'),
        MultiFieldPanel([
            ImageChooserPanel('cash_icon'),
            StreamFieldPanel('cash_text'),
        ], heading='Количество наличных денег'),
        MultiFieldPanel([
            StreamFieldPanel('display_text'),
            StreamFieldPanel('change_config_button'),
        ], heading='Сообщения'),
        StreamFieldPanel('api_links')
    ]

    class Meta:
        verbose_name = 'Главная страница'
        verbose_name_plural = 'Главные страницы'
