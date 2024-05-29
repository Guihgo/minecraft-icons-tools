"use strict";
class MinecraftIconsTools {
    reloadData() {
        console.log("init");
    }
    transform() {
    }
    orderAndCategorize() {
    }
    exportIcons() {
    }
}
if (process.argv[2].indexOf("--reload-data") !== -1) {
    const minecraftIconsTools = new MinecraftIconsTools();
    minecraftIconsTools.reloadData();
}
