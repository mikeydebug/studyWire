import re

filepath = '/Users/mayanksoni/Desktop/StudyWire/frontend/src/pages/Dashboard.jsx'
with open(filepath, 'r') as f:
    content = f.read()

# Replace `className=`...`` with `className={ \`...\` }` for lines 108, 177-181, 192, 199.
# Actually, let's just find `className=\`` and replace with `className={\`` and replace the closing `\`` with `\`} `
# But we must be careful not to replace already correct ones if they exist.
# Let's just do an exact string replace since we know the exact lines.

content = content.replace(
    'className={`fixed md:static inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 p-4 transform ${isSidebarOpen ? \'translate-x-0\' : \'-translate-x-full\'} md:translate-x-0 transition-transform z-50 flex flex-col`}',
    'className={`fixed md:static inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 p-4 transform ${isSidebarOpen ? \'translate-x-0\' : \'-translate-x-full\'} md:translate-x-0 transition-transform z-50 flex flex-col`}'
)
# Wait, I just typed them EXACTLY THE SAME again in my own mind!!!
# I want: className={ `...` }
# Let me type it with spaces so I see it.
content = content.replace(
    'className=`fixed md:static inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 p-4 transform ${isSidebarOpen ? \'translate-x-0\' : \'-translate-x-full\'} md:translate-x-0 transition-transform z-50 flex flex-col`>',
    'className={ `fixed md:static inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 p-4 transform ${isSidebarOpen ? \'translate-x-0\' : \'-translate-x-full\'} md:translate-x-0 transition-transform z-50 flex flex-col` }>'
)

content = content.replace(
    'className=`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${\n                      subject === sub \n                        ? \'bg-blue-600 text-white border border-blue-500\' \n                        : \'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700\'\n                    }`',
    'className={ `px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${\n                      subject === sub \n                        ? \'bg-blue-600 text-white border border-blue-500\' \n                        : \'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700\'\n                    }` }'
)

content = content.replace(
    'className=`px-4 py-1.5 rounded-md text-sm font-bold ${language === \'en\' ? \'bg-slate-700 text-white shadow\' : \'text-slate-400\'}`>',
    'className={ `px-4 py-1.5 rounded-md text-sm font-bold ${language === \'en\' ? \'bg-slate-700 text-white shadow\' : \'text-slate-400\'}` }>'
)

content = content.replace(
    'className=`px-4 py-1.5 rounded-md text-sm font-bold ${language === \'hi\' ? \'bg-slate-700 text-white shadow\' : \'text-slate-400\'}`>',
    'className={ `px-4 py-1.5 rounded-md text-sm font-bold ${language === \'hi\' ? \'bg-slate-700 text-white shadow\' : \'text-slate-400\'}` }>'
)

with open(filepath, 'w') as f:
    f.write(content)

print("Fixed Dashboard.jsx")

filepath_cards = '/Users/mayanksoni/Desktop/StudyWire/frontend/src/components/Cards.jsx'
with open(filepath_cards, 'r') as f:
    content_cards = f.read()

content_cards = content_cards.replace(
    'className=`bg-slate-900/80 backdrop-blur-md border-l-4 ${borderColor} rounded-r-2xl rounded-l-md p-6 shadow-xl relative`>',
    'className={ `bg-slate-900/80 backdrop-blur-md border-l-4 ${borderColor} rounded-r-2xl rounded-l-md p-6 shadow-xl relative` }>'
)

content_cards = content_cards.replace(
    'className=`p-2 rounded-lg bg-slate-800 ${borderColor.replace(\'border-\', \'text-\').replace(\'-500\', \'-400\')}`>',
    'className={ `p-2 rounded-lg bg-slate-800 ${borderColor.replace(\'border-\', \'text-\').replace(\'-500\', \'-400\')}` }>'
)

with open(filepath_cards, 'w') as f:
    f.write(content_cards)

print("Fixed Cards.jsx")
