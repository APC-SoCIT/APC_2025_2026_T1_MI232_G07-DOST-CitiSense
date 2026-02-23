
from django.db import migrations

# Create a file migration group that can only add a migration file
def create_filemigration_group(apps, schema_editor):
    Group = apps.get_model("auth", "Group")
    Permission = apps.get_model("auth", "Permission")
    ContentType = apps.get_model("contenttypes", "ContentType")
    FileMigration = apps.get_model("drf", "FileMigration")

    # Create the group
    filemigration_group, created  = Group.objects.get_or_create(name="File migration")
    ct = ContentType.objects.get_for_model(FileMigration)
    filemigration_perms = Permission.objects.get(codename="add_filemigration", content_type=ct)
    filemigration_group.permissions.add(filemigration_perms)


class Migration(migrations.Migration):
    dependencies = [
        ("drf", "0012_alter_filemigration_options"),
        ("auth", "0012_alter_user_first_name_max_length"),
        ("contenttypes", "0002_remove_content_type_name"),
        ]
    operations = [
        migrations.RunPython(create_filemigration_group)
    ]