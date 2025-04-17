// This will import all the ore icons as an object with a name key
// Saves me from having to make 250+ import statements...
export const importAllOreIcons = (r) => {
  let icons = {};
  const importAll = (r) => r.keys().forEach((key) => {
    const oreKey = key.replace('./', '').replace('_Icon.webp', '');
    icons[oreKey] = r(key).default;
  });

  importAll(require.context('../images/ore-icons', false, /_Icon\.webp$/));
  return icons;
}