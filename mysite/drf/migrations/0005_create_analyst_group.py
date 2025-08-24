
from django.db import migrations

# create an analyst group
def create_analyst_group(apps, schema_editor):

    SentimentPost = apps.get_model("drf", "SentimentPost")
    Group = apps.get_model("auth", "Group")
    ContentType = apps.get_model("contenttypes", "ContentType")
    Permission = apps.get_model("auth", "Permission")
    analyst_group, created = Group.objects.get_or_create(name="analyst")
    analyst_ct = ContentType.objects.get_for_model(SentimentPost)
    analyst_permission = Permission.objects.filter(content_type=analyst_ct)
    analyst_group.permissions.set(analyst_permission)

class Migration(migrations.Migration):
    dependencies = [
        ("drf", "0004_alter_archivepost_title"),
        ("auth", "0012_alter_user_first_name_max_length"),
        ("contenttypes", "0002_remove_content_type_name"),
        ]
    operations = [
        migrations.RunPython(create_analyst_group)
    ]