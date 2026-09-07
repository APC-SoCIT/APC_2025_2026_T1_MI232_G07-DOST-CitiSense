from django.core.management.base import BaseCommand
from django.conf import settings
from drf.models import ModelVersion
from transformers import AutoTokenizer, AutoModelForSequenceClassification

class Command(BaseCommand):
    help = "Initialize the base sentiment model and mark it as v1."


    def handle(self, *args, **kwargs):
        save_path = settings.SENTIMENT_MODELS_DIR / "v1"

        if ModelVersion.objects.filter(version_name="v1").exists():
            self.stdout.write(self.style.ERROR("v1 already exists, skipping downloading."))
            return

        self.stdout.write("Downloading base model from HuggingFace...")
        tokenizer = AutoTokenizer.from_pretrained("dost-asti/RoBERTa-tl-sentiment-analysis")
        model = AutoModelForSequenceClassification.from_pretrained("dost-asti/RoBERTa-tl-sentiment-analysis")

        # Save the tokenizer and the model in the specific specific path: BASE_DIR/ml_models/v1
        tokenizer.save_pretrained(save_path)
        model.save_pretrained(save_path)
        self.stdout.write(self.style.SUCCESS(f"Saved base model to {save_path}"))

        v1 = ModelVersion.objects.create(
            version_name="v1",
            model_path=str(save_path)
        )

        # Activate the base model to be used for Sentiment Analysis
        v1.activate()
        self.stdout.write(self.style.SUCCESS("V1 successfully created and activated."))
