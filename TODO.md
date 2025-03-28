# Stuff to do

## FIX:
### 1) First: fix github-pages deployment crashing
 - Wacky fix of duplicating index.html to 404.html??

### 2) Quick Summary
 - Fix Quick Info button moving funkily - must be mapped to cursor globally
 - Dropdown should open when "More Stats" is clicked - should be simple enough

### 3) Trade Tool
 - Fix solid color gradients not working

### 4) Main Page layout
 - Self explanatory

[-] Checkbox?

# TO ADD:
### 1) Ore Icons
 - These MUST be in one folder (or layer folders named precisely to match)
 - Format: `{oreObj.name}_Icon.webp` (or use quotes if needed)
 - Double check that all ore names are correct and exist in the folder
 - FIRST: go through and get all updated ore icons as webps
 - Insert in the name-column cell (should be relatively simple?)
 - Make sure they are all a standard size, and that the name cell has enough room

### 2) Custom Value Setting 
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

### 3) Rare Finds Tracker - Self explanatory, follow layout of JTT
 - Calculate total AV/NV of rare finds, and AV/NV per ore found
 - Manually entered by the user
 - This MUST be persistently stored - create another Context file to store the data

### 4) Grind Strats Page - List some of mine and others' favorite grind strats for various ores
 - Format prettily, include drop-down sections for the strategies, categories to open,
pictures, the ore textures, descriptions of the ores, possible lore, etc.
 - Credit the inventor/contributor of the strat
 - e.g., Protireal grind method information, tips and tricks, and so on

And more coming soon... :]