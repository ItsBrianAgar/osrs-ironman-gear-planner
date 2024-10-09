export const setFavicon = (faviconUrl) => {
  const link = document.querySelector("link[rel~='icon']");
  if (link) {
    link.href = faviconUrl;
  } else {
    const newLink = document.createElement("link");
    newLink.rel = "icon";
    newLink.href = faviconUrl;
    document.head.appendChild(newLink);
  }
};

export const setPageTitle = (title) => {
  document.title = title;
};
