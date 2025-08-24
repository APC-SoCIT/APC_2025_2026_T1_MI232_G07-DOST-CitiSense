from django.contrib import admin
from drf.models import ArchivePost
from django.utils.html import format_html

class ArchiveAdmin(admin.ModelAdmin):
    list_display = ["author", "title", "image", "date_created"]
    list_filter = ["author"]   #list filter by author
    readonly_fields = ["date_created", "thumbnail"] #fields inside each cell in the table
    search_fields = ["author__username", "title"] #for searching
    
    #reference: https://stackoverflow.com/a/49854418
    #show the thumbnail of the saved image
    def thumbnail(self, obj):
        return format_html('<img src="{}" style="width:350px; \
                           height: 200px"/>'.format(obj.image.url))

    thumbnail.short_description = 'thumbnail'

admin.site.register(ArchivePost, ArchiveAdmin)      