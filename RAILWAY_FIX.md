# Railway Database Path Fix

Fixed hardcoded SQLite database paths that were causing startup crashes:

- autolex_core.py: Changed to relative path using os.getcwd()
- senior_ai_manager.py: Changed to relative path using os.getcwd()

This resolves: sqlite3.OperationalError: unable to open database file