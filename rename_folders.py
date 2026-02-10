import os
import re

BASE_DIR = "100DaysofCode" # change if needed

def to_kebab_case(name: str) -> str:
    # Convert CamelCase to words
    name = re.sub(r'([a-z])([A-Z])', r'\1-\2', name)
    # Replace underscores and spaces with hyphens
    name = re.sub(r'[_\s]+', '-', name)
    # Lowercase
    return name.lower()

for folder in os.listdir(BASE_DIR):
    old_path = os.path.join(BASE_DIR, folder)

    if os.path.isdir(old_path):
        new_name = to_kebab_case(folder)
        new_path = os.path.join(BASE_DIR, new_name)

        if old_path != new_path:
            print(f"Renaming: {folder} → {new_name}")
            os.rename(old_path, new_path)
