export function updateCSSVariables(colorChanges: Record<string, string>) {
  Object.entries(colorChanges).forEach(([variable, value]) => {
    document.documentElement.style.setProperty(variable, value);
  });
}

export function resetCSSVariables(colorChanges: Record<string, string>) {
  Object.keys(colorChanges).forEach((variable) => {
    document.documentElement.style.removeProperty(variable);
  });
}
