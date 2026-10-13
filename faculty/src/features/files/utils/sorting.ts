/**
 * Sort items alphabetically by name (A-Z)
 */
export const sortByNameAsc = <T extends { name: string }>(items: T[]): T[] => {
  return [...items].sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
  );
};

/**
 * Sort items alphabetically by name (Z-A)
 */
export const sortByNameDesc = <T extends { name: string }>(items: T[]): T[] => {
  return [...items].sort((a, b) =>
    b.name.toLowerCase().localeCompare(a.name.toLowerCase()),
  );
};
