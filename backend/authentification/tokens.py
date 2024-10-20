from django.contrib.auth.tokens import PasswordResetTokenGenerator
from datetime import timedelta
from django.utils import timezone
from django.utils.http import int_to_base36

class CustomPasswordResetTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):

        return (
            str(user.pk) + str(timestamp) + str(user.is_active)
        )

    def is_token_valid_for_user(self, user, timestamp):
   
        token_time = timezone.now() - timedelta(days=3)
        return timestamp >= int_to_base36(token_time)

custom_token_generator = CustomPasswordResetTokenGenerator()
