from wagtail.core import blocks


class ApiBlock(blocks.StructBlock):
    short_name = blocks.CharBlock(required=True)

    class Meta:
        icon = 'pick'
        label = 'Endpoint'
