import packageJson from "../../package.json";
export function GetVersion() {
  return packageJson.version;
}