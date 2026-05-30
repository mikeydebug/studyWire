import re

files = [
    '/Users/mayanksoni/Desktop/StudyWire/frontend/src/pages/Dashboard.jsx',
    '/Users/mayanksoni/Desktop/StudyWire/frontend/src/components/Cards.jsx'
]

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()

    # We want to find className=`...` and replace with className={`...`}
    # A simple regex for this that doesn't match already fixed ones
    # Match className= followed by ` then anything non-greedy then `
    # But only if it's not className={`
    # Regex: className=`([^`]*?)` -> className={{`\1`}} wait, no, className={ `\1` }
    
    # Wait, the backtick string can contain nested backticks? No.
    # What about newlines? re.DOTALL
    
    content = re.sub(r'className=`([^`]+)`', r'className={ `\1` }', content, flags=re.DOTALL)

    with open(filepath, 'w') as f:
        f.write(content)

print("Regex fix applied")
