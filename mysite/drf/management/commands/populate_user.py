from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from allauth.account.models import EmailAddress

User = get_user_model()

class Command(BaseCommand):
    help = "Create a superuser(root user) and a normal user"

    def handle(self, *args, **kwargs):
       #reference: https://stackoverflow.com/a/18504852
        try:     
            # Check if the superuser already exists:
            if not User.objects.filter(username="superuser1").exists():
                superuser = User.objects.create_user("superuser1", email= "superuser1@stii.dost.gov.ph", first_name="Super", last_name="User", password="superuser1")
                superuser.is_superuser = True
                superuser.is_staff = True
                superuser.is_registered=True
                superuser.save()

                # For successfully verifying the email of the user to login to CitiSense
                EmailAddress.objects.create(user=superuser, email=superuser.email, verified=True, primary=True)

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

            if not User.objects.filter(username="user2").exists():
                user2 = User.objects.create_user(
                    "user2",
                    email="user2@stii.dost.gov.ph",
                    first_name="User",
                    last_name="2",
                    password="Password123!",
                )
                user2.is_registered = True
                user2.save()

                # For successfully verifying the email of the user to login to CitiSense
                EmailAddress.objects.create(user=user2, email=user2.email, verified=True, primary=True)

                self.stdout.write(self.style.SUCCESS("Created user2!"))
            else:
                self.stderr.write(self.style.ERROR("User 2 already exists!"))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error populating users {e}'))
            return
