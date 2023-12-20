const Store = require('electron-store');
const store = new Store();

exports.resIn = class {
    resIn() {
        let skinUrlInput = document.getElementById('skinUrlInput')
        let skinUrlInputR = document.getElementById('skinUrlInputR')
        let skinUrlInputB = document.getElementById('skinUrlInputB')
        let indUrlInput = document.getElementById('indUrlInput')
        let url = store.get("skinUrl")
        let urlR = store.get("skinUrlR")
        let urlB = store.get("skinUrlB")
        let urlInd = store.get("indUrl")
        if (url === "" || url === null || urlR === "" || urlR === null || urlB === "" || urlB === null || urlInd === "" || urlInd === null) {
            store.set("skinUrl", "https://i.imgur.com/DuIFdsQ.png");
            store.set("skinUrlR", "https://i.imgur.com/f9qx7uo.png");
            store.set("skinUrlB", "https://i.imgur.com/um1vHZg.png");
            store.set("indUrl", "https://i.imgur.com/rVaV2HD.png")
            url = store.get("skinUrl")
            urlR = store.get("skinUrlR")
            urlB = store.get("skinUrlB")
            urlInd = store.get("indUrl")
        }
        skinUrlInput.value = url
        skinUrlInputR.value = urlR
        skinUrlInputB.value = urlB
        indUrlInput.value = urlInd

    }
    resChange(val) {
        store.set("skinUrl", val)
        console.log(val)
    }
    resChangeR(val) {
        store.set("skinUrlR", val)
        console.log(val)
    }
    resChangeB(val) {
        store.set("skinUrlB", val)
        console.log(val)
    }
    indChange(val) {
        store.set("indUrl", val)
        console.log(val)
    }
    resReset() {
        store.set("skinUrl", "https://i.imgur.com/DuIFdsQ.png");
        store.set("skinUrlR", "https://i.imgur.com/f9qx7uo.png");
        store.set("skinUrlB", "https://i.imgur.com/um1vHZg.png");
        store.set("indUrl", "https://i.imgur.com/rVaV2HD.png")
        this.resIn()
    }
}