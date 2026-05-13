const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

window.inventory = {
    items: [],
    add(item) {
        this.items.push(item);
    },
    remove(item) {
        const i = this.items.indexOf(item);
        if (i !== -1) this.items.splice(i, 1);
    }
};

class WoodenSword {
    constructor() {
        this.name = "Wooden Sword";
        this.objectType = "weapon";
        this.damage = 5;

        this.img = new Image();
        this.img.src = "textures/WoodenSword.png";
    }

    attack() {
        console.log(this + "attacks");
    }
}

window.hotbar = {
    slots: new Array(9).fill(null),
    selected: 0
};

document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (key >= "1" && key <= "9") {
        hotbar.selected = parseInt(key) - 1;
    }
});

window.hotbar.slots[0] = new WoodenSword();
