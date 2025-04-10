# Stuff to do

## TO FIX:

### DONE -- Misc: Update formatting, add verbosity, clean up code & css files
### DONE -- First: fix github-pages deployment crashing
### DONE -- Quick Summary
### DONE -- Trade Tool
### DONE -- Main Page layout

## TO ADD (No particular order):

### DONE -- Ore Icons
### DONE -- Trade Tool -> Button to "Remove Ores from Inventory"
### DONE -- Trade Tool -> To Receive table & add ores in it to inv

### Custom Value Setting - Maybe
 - e.g., you value an ore at 50 AV while the standard rate is 30AV.
 - Have the user search for an ore, then enter a value in "Ore Per AV" OR "AV Per Ore"
    - Use a similar interface to the Trade Tool search box and table
 - Those two options could be in a dropdown/checkmark selection
 - Once "Ore Per AV" is entered, simply modify the baseValue of the ore
 to match it. e.g., 15.5 Ore Per AV would result in a baseValue of 15.5.
 - Likewise, if "AV Per Ore" is entered, take that number (let's say "50")
 and modify it to become 0.02 baseValue (divide 1 by the number - 0.2 = 1/50)
 - These custom values will then need to be updated in the dictionaries
 - Probably should provide an option to "revert back to standard values"
    - This would discard all the user's changes and revert to John/NAN standard vals

### Rare Finds Tracker - Self explanatory, follow layout of JTT
 - Calculate total AV/NV of rare finds, and AV/NV per ore found
 - Manually entered by the user
 - This MUST be persistently stored - create another Context file to store the data

### Grind Strats - List some of mine and others' favorite grind strats for various ores
 - Format prettily, include drop-down sections for the strategies, categories to open,
pictures, the ore textures, descriptions of the ores, possible lore, etc.
 - Credit the inventor/contributor of the strat
 - e.g., Protireal grind method information, tips and tricks, and so on


### Graphs?
 - AV/hr of layers, Trade data over time, ores gained/NVs gained over time, etc

### And more coming soon... :]