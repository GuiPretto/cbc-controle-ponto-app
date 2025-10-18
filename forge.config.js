module.exports = {
  // ...
  packagerConfig: {
    icon: "./public/icons/icon", // no file extension required
  },
  makers: [
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          icon: "./public/icons/icon.png",
        },
      },
    },
  ],
  // ...
};
