const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:3002" }));
app.use(express.json());

async function saveResponseToFile(itemName, data) {
  const fileName = `${itemName.replace(/\s+/g, "_")}_response.txt`;
  const filePath = path.join(__dirname, "responses", fileName);

  try {
    await fs.mkdir(path.join(__dirname, "responses"), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`Response saved to ${filePath}`);
  } catch (error) {
    console.error("Error saving response to file:", error);
  }
}

async function searchItem(itemName) {
  const response = await axios.get(
    `https://oldschool.runescape.wiki/w/Special:Browse`,
    {
      params: {
        title: "Special:Browse",
        format: "json",
        article: itemName,
      },
    }
  );
  return response.data;
}

function processItemData(data, versionIndex = 0) {
  const mainData = data.data;
  const versions = data.sobj;

  if (!versions || versions.length === 0) {
    return processMainData(mainData);
  }

  const versionData = versions[versionIndex].data;
  const itemData = {};

  // Process main data
  mainData.forEach((item) => {
    if (
      item.property === "All_Item_Name" &&
      item.dataitem.length > versionIndex
    ) {
      itemData.name = item.dataitem[versionIndex].item;
    }
    if (item.property === "All_Image" && item.dataitem.length > versionIndex) {
      itemData.imageFilename = item.dataitem[versionIndex].item.split("#")[0];
    }
    // Add other properties as needed
  });

  // Process version-specific data
  versionData.forEach((item) => {
    switch (item.property) {
      case "Item_Name":
        itemData.name = item.dataitem[0].item;
        break;
      case "Examine":
        itemData.description = item.dataitem[0].item;
        break;
      case "Value":
        itemData.value = parseInt(item.dataitem[0].item);
        break;
      case "Weight":
        itemData.weight = parseFloat(item.dataitem[0].item);
        break;
      case "Is_members_only":
        itemData.membersOnly = item.dataitem[0].item === "t";
        break;
      case "Equipment_slot":
        itemData.equipmentSlot = item.dataitem[0].item;
        break;
      // Add other properties as needed
    }
  });

  if (itemData.imageFilename) {
    itemData.imageUrl = `https://oldschool.runescape.wiki/images/${encodeURIComponent(
      itemData.imageFilename
    )}`;
    delete itemData.imageFilename;
  }

  return itemData;
}

function processMainData(mainData) {
  const itemData = {};
  mainData.forEach((item) => {
    switch (item.property) {
      case "All_Item_Name":
      case "Item_Name":
        itemData.name = item.dataitem[0].item;
        break;
      case "Examine":
        itemData.description = item.dataitem[0].item;
        break;
      case "Value":
        itemData.value = parseInt(item.dataitem[0].item);
        break;
      case "All_Weight":
      case "Weight":
        itemData.weight = parseFloat(item.dataitem[0].item);
        break;
      case "All_Is_members_only":
      case "Is_members_only":
        itemData.membersOnly = item.dataitem[0].item === "t";
        break;
      case "All_Equipment_slot":
      case "Equipment_slot":
        itemData.equipmentSlot = item.dataitem[0].item;
        break;
      case "All_Image":
      case "Image":
        itemData.imageFilename = item.dataitem[0].item.split("#")[0];
        break;
      // Add other properties as needed
    }
  });

  if (itemData.imageFilename) {
    itemData.imageUrl = `https://oldschool.runescape.wiki/images/${encodeURIComponent(
      itemData.imageFilename
    )}`;
    delete itemData.imageFilename;
  }

  return itemData;
}

app.get("/api/item/:name", async (req, res) => {
  try {
    const itemName = req.params.name;
    let data = await searchItem(itemName);

    await saveResponseToFile(itemName, data);

    if (data && data.data) {
      const itemVersions = data.data.find(
        (item) => item.property === "All_Item_Name"
      );

      if (itemVersions && itemVersions.dataitem.length > 1) {
        // Multiple versions found, return the list of options
        const options = itemVersions.dataitem.map((version, index) => ({
          name: version.item,
          id: data.data.find((item) => item.property === "All_Item_ID")
            ?.dataitem[index]?.item,
          versionIndex: index,
        }));

        return res.json({
          message: "Multiple versions found",
          options: options,
        });
      } else {
        // Single item found, process as before
        const itemData = processItemData(data);
        if (!itemData || !itemData.name || !itemData.description) {
          return res
            .status(404)
            .json({ error: `Item "${itemName}" not found or incomplete data` });
        }
        res.json(itemData);
      }
    } else {
      res
        .status(404)
        .json({ error: `Item "${itemName}" not found in OSRS Wiki` });
    }
  } catch (error) {
    console.error("Error fetching item:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch item data", details: error.message });
  }
});

app.get("/api/item/:name/:versionIndex", async (req, res) => {
  try {
    const itemName = req.params.name;
    const versionIndex = parseInt(req.params.versionIndex);
    let data = await searchItem(itemName);

    const itemData = processItemData(data, versionIndex);
    if (!itemData || !itemData.name || !itemData.description) {
      return res.status(404).json({
        error: `Item "${itemName}" version not found or incomplete data`,
      });
    }
    res.json(itemData);
  } catch (error) {
    console.error("Error fetching item version:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch item data", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
