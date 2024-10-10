async function fetchItemData(itemName, versionIndex = null) {
  try {
    const url =
      versionIndex !== null
        ? `http://localhost:3001/api/item/${encodeURIComponent(
            itemName
          )}/${versionIndex}`
        : `http://localhost:3001/api/item/${encodeURIComponent(itemName)}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();

    if (data.message === "Multiple versions found") {
      return {
        multipleOptions: true,
        options: data.options,
      };
    }

    if (!data.name || !data.description) {
      throw new Error("Invalid data structure received from server");
    }

    return data;
  } catch (error) {
    console.error("Could not fetch OSRS item:", error);
    throw error;
  }
}

export default fetchItemData;
