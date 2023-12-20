const Store = require('electron-store');
const store = new Store();

exports.resIn = class {
    resIn() {
        let skinUrlInput = document.getElementById('skinUrlInput')
        let url = store.get("skinUrl")
        let urlR = store.get("skinUrlR")
        let urlB = store.get("skinUrlB")
        if (url === "" || url === null || urlR === "" || urlR === null || urlB === "" || urlB === null) {
            store.set("skinUrl", "https://voxiom.io/package/cb1d14c1ff0efb6a282b.png");
            store.set("skinUrlR", "https://voxiom.io/package/aef55bdd0c3c3c3734f8.png");
            store.set("skinUrlB", "https://voxiom.io/package/ecca1227c2e0406be225.png");
            url = store.get("skinUrl")
            urlR = store.get("skinUrlR")
            urlB = store.get("skinUrlB")
        }
        skinUrlInput.value = url
    }
    resChange(val) {
        store.set("skinUrl", val)
    }
    resChangeR(val) {
        store.set("skinUrlR", val)
    }
    resChangeB(val) {
        store.set("skinUrlB", val)
    }
    resReset() {
        store.set("skinUrl", "https://voxiom.io/package/cb1d14c1ff0efb6a282b.png");
        store.set("skinUrlR", "https://voxiom.io/package/aef55bdd0c3c3c3734f8.png");
        store.set("skinUrlB", "https://voxiom.io/package/ecca1227c2e0406be225.png");
        this.resIn()
    }
}