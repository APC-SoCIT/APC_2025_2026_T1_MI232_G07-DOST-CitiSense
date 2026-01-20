from django.core.management.base import BaseCommand
from drf.models import cleaned_feedback, labeled_feedback
from drf.utils import analyze_sentiment
import time
import sys

# Reference: https://docs.djangoproject.com/en/6.0/howto/custom-management-commands/
class Command(BaseCommand): 
    help = "This management command is for putting a sentiment in each field"

    def handle(self, *args, **options):
        start_time = time.time()
        
        # Initialize an update, error, and skipped count
        update_count = 0
        error_count = 0
        skipped_count = 0

        labeled = labeled_feedback.objects.all()
        total = labeled.count()
   
        
        self.stdout.write(f"Starting sentiment labeling for {total} row(s)...\n")
        
        # For each index and item in the labeled feedback, loop through it; index is used for progress count
        for index, item in enumerate(labeled):

           # Progress count 
            self.stdout.write(f"\rProcessing {index + 1} out of {total} row(s)", ending="")
            self.stdout.flush()

            try:
                # If the current item in the loop doesn't have a sentiment to it, then put one
                if item.sentiment is not None:
                    sentiment = analyze_sentiment(item.feedback.comments)
                    item.sentiment = sentiment
                    update_count += 1
                    item.save() 
                    
                else: 
                    skipped_count += 1

            # Print error messages or something
            except Exception as e:
                error_count += 1
                self.stderr.write(self.style.ERROR(f"Error labeling: {e} "))

        end_time = time.time()
        duration = end_time - start_time
        
        # Start in newline, show how many seconds the labeling process took
        self.stdout.write("\r" + " " * 64 + "\r", ending="")       
        self.stdout.write(f"Processed {total} row(s) in {duration:.2f} seconds.")

        # Print how many rows got updated, regardless if there was an error
        if update_count > 0:
            self.stdout.write(self.style.SUCCESS(f"Successfully put sentiment into {update_count} row(s)."))

        # Print how many rows got an error
        if error_count > 0:    
            self.stdout.write(self.style.ERROR(f"Failed to put sentiment on {error_count} row(s)."))
        
        # Print how many rows got skipped when applying a sentiment to, as they already have sentiment in their fields
        if skipped_count > 0:
            self.stdout.write(self.style.WARNING(f"Skipped {skipped_count} row(s) (already labeled)"))