import re

pattern = r'^\d{2,3}-\d+$'
string = '123-456'

match = re.match(pattern, string)
if match:
    print("Valid phone number")
else:
    print("Invalid phone number")