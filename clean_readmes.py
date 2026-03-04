import os

def remove_blank_lines_from_readme(root_dir="FRONTENDPROJECTS"):
    """
    Removes blank lines from all README.md files found within the specified
    root directory and its subdirectories.
    """
    print(f"Searching for README.md files in '{os.path.abspath(root_dir)}'...")
    found_readme_count = 0
    modified_readme_count = 0

    # Walk through the root directory
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Look for README.md in the current directory
        if "README.md" in filenames:
            readme_path = os.path.join(dirpath, "README.md")
            found_readme_count += 1
            print(f"\nProcessing: {readme_path}")

            try:
                # Read original content
                with open(readme_path, 'r', encoding='utf-8') as f_read:
                    lines = f_read.readlines()

                # Filter out blank lines (lines containing only whitespace)
                non_blank_lines = [line for line in lines if line.strip()]

                # Check if any changes were made
                if len(lines) != len(non_blank_lines):
                    # Write back the filtered content to the same file
                    with open(readme_path, 'w', encoding='utf-8') as f_write:
                        f_write.writelines(non_blank_lines)
                    print("  -> Blank lines removed.")
                    modified_readme_count += 1
                else:
                    print("  -> No blank lines found to remove.")

            except FileNotFoundError:
                print(f"  Error: README.md not found at {readme_path} (should not happen).")
            except Exception as e:
                print(f"  An error occurred while processing {readme_path}: {e}")

    print(f"\n--- Script Finished ---")
    print(f"Found {found_readme_count} README.md files.")
    print(f"Modified {modified_readme_count} README.md files (removed blank lines).")
    if found_readme_count == 0:
        print(f"No 'README.md' files were found. Make sure the script is run from a directory where 'FRONTENDPROJECTS' exists, or adjust the 'root_dir' variable.")

# Run the script
if __name__ == "__main__":
    remove_blank_lines_from_readme()