const Store = require('electron-store');
const store = new Store();

exports.resIn = class {
    resIn() {
        let skinUrlInput = document.getElementById('skinUrlInput')
        let skinUrlInputR = document.getElementById('skinUrlInputR')
        let skinUrlInputB = document.getElementById('skinUrlInputB')
        let url = store.get("skinUrl")
        let urlR = store.get("skinUrlR")
        let urlB = store.get("skinUrlB")
        if (url === "" || url === null || urlR === "" || urlR === null || urlB === "" || urlB === null) {
            store.set("skinUrl", "https://i.imgur.com/DuIFdsQ.png");
            store.set("skinUrlR", "https://i.imgur.com/f9qx7uo.png");
            store.set("skinUrlB", "https://i.imgur.com/um1vHZg.png");
            url = store.get("skinUrl")
            urlR = store.get("skinUrlR")
            urlB = store.get("skinUrlB")
        }
        skinUrlInput.value = url
        skinUrlInputR.value = urlR
        skinUrlInputB.value = urlB
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
    resReset() {
        store.set("skinUrl", "https://i.imgur.com/DuIFdsQ.png");
        store.set("skinUrlR", "https://i.imgur.com/f9qx7uo.png");
        store.set("skinUrlB", "https://i.imgur.com/um1vHZg.png");
        this.resIn()
    }
}