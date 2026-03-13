import os
import glob
import re

api_dir = 'c:/Users/Jaynielilie/Documents/Projects/CYVE/backend/api'

for file in glob.glob(os.path.join(api_dir, '*.php')):
    if file.endswith('middleware.php') or file.endswith('response.php') or file.endswith('db_setup.php'):
        continue
        
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace include/require config.php
    content = re.sub(r"(include|require|require_once)\s+['\"](?:\.\./)?config\.php['\"];", "require_once 'middleware.php';", content)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Refactored API endpoints!")
