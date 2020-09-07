from wagtail.core import blocks


class ApiBlock(blocks.StructBlock):
    short_name = blocks.CharBlock(required=True)

    class Meta:
        icon = 'pick'
        label = 'Endpoint'


class MultiLangBlock(blocks.StructBlock):
    LANGUAGES = (
        ('1', 'RUS'),
        ('2', 'ENG')
    )
    lang_id = blocks.ChoiceBlock(choices=LANGUAGES)
    content = blocks.CharBlock()

    class Meta:
        icon = 'edit'
        label = 'Add text'
