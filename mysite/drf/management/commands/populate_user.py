from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()

class Command(BaseCommand):
    help = "Create a superuser(root user) and a normal user"

    def handle(self, *args, **kwargs):
       #reference: https://stackoverflow.com/a/18504852
        try:     
            # Check if the superuser already exists:
            if not User.objects.filter(username="superuser1").exists():
                superuser = User.objects.create_user("superuser1", password="superuser1")
                superuser.is_superuser = True
                superuser.is_staff = True
                superuser.save()
                self.stdout.write(self.style.SUCCESS("Created superuser!"))
            else:
                self.stderr.write(self.style.ERROR(f'Superuser already exists!'))

            # Check if the normal user already exists:
            if not User.objects.filter(username="user1").exists():
                user = User.objects.create_user("user1", password="user1")
                user.save()
                self.stdout.write(self.style.SUCCESS("Created normal user!"))

            else:
                self.stderr.write(self.style.ERROR("Normal user already exists!"))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error populating users {e}'))
            return
