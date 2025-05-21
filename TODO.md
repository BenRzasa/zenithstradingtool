# Notes
GIT COMMITS:
Flag commits with:
[PAGE] for new routes/pages (bump X)
[FEAT] for components (bump Y)
[FIX] for patches (bump Z)
npm run
"bump:page"
"bump:feat"
"bump:fix"

FOR BUMPING THE UPDATES on WINDOWS!!:
npm version major --no-git-tag-version -m "[PAGE] Bump to %s"
            minor
            patch

   git add package.json package-lock.json
   git commit -m "[PAGE] Bump version"
   git tag v7.0.0
   git push origin main --tags

# Stuff to do

## TO FIX:

### LOW PRIORITY -- All pages: Standardize input rules
 - e.g., no 0, Infinity, NaN values allowed in any input boxes (it fucks up stuff)
### DONE -- Misc: Update formatting, add verbosity, clean up code & css files
### DONE -- First: fix github-pages deployment crashing
### DONE -- Quick Summary
### DONE -- Trade Tool
### DONE -- Main Page layout

## TO ADD (No particular order):

### DONE -- Ore Icons
### DONE -- Trade Tool -> Button to "Remove Ores from Inventory"
### DONE -- Trade Tool -> To Receive table & add ores in it to inv
### DONE -- Values -> Custom AV value setting option - saves locally
### DONE -- Custom Background Image (Main page only)
### DONE -- Date & Amount since last CSV change
### DONE -- Custom Value Setting - Per ore
### DONE -- CSV Loader -- Sort by AV gained
### DONE -- Rare Finds Tracker
### DONE -- CSV Editor

### Misc Page -- Box containing "Useful tips & tricks" - link to another card-style page?
 - List of all emblems with perks (+ icons)

### Tentative - SETTINGS PAGE
 - Need ideas here...

### Custom font setting?
 - Might just apply to headers/ore names... or the entire thing fuck it we ball

### Value Chart Page - background transparency/opacity overlay of some sort
 - Pop-up that the user can have (Maybe just make a settings page at this point...)

### Grind Strats - List some of mine and others' favorite grind strats for various ores
 - Format prettily, include drop-down sections for the strategies, categories to open,
pictures, the ore textures, descriptions of the ores, possible lore, etc.
 - Credit the inventor/contributor of the strat
 - e.g., Protireal grind method information, tips and tricks, and so on

### Graphs?
 - AV/hr of layers, Trade data over time, ores gained/NVs gained over time, etc

### And more coming soon... :]