const STORAGE_PREFIX = "fulfillment_hub_";

export const getStoredData = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!stored) return defaultValue;
    return JSON.parse(stored);
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);
    return defaultValue;
  }
};

export const setStoredData = (key, value) => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    window.dispatchEvent(
      new CustomEvent("fulfillment-data-updated", {
        detail: { key },
      })
    );
  } catch (error) {
    console.error(`Unable to save ${key}:`, error);
  }
};

export const removeStoredData = (key) => {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch (error) {
    console.error(`Unable to remove ${key}:`, error);
  }
};

export const clearFulfillmentData = () => {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error("Unable to clear fulfillment data:", error);
  }
};

export const resetFulfillmentData = () => {
  const confirmed = window.confirm(
    "Reset all demo data? This will remove your saved changes and restore the original sample data."
  );

  if (!confirmed) return;

  clearFulfillmentData();
  window.location.reload();
};
