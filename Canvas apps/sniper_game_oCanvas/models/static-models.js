var staticModels = (function(){

    var staticField = document.getElementById('images');
    var drawer = staticField.getContext('2d');
    var staticItems = [];


    function addStaticObject(type, size, coordinates, showInterval, showSpeed) {
        if (getAllPlayerProvisions().length >= Settings.GamePerformance.Constraints.MaxStaticItemsAllowed) return;

        coordinates = coordinates || {x: Math.random() * staticField.width, y: Math.random() * staticField.height};
        // var id = models.getUniqueId();
        var staticItem = {
            image: document.createElement('img'),
            // id: id,
            name: type,
            isStatic: true,
            disappear: function () {
                removeStaticItem(this);
            },
            x: coordinates.x,
            y: coordinates.y
        };
        staticItem.image.src = getItemImageSource(type);
        staticItems.push(staticItem);
        showScalingUp(staticItem, size, showInterval, showSpeed);

        return staticItem;
    }

    function getItemImageSource(type) {
        var destination = 'img/';
        switch (type){
            case 'health': return destination + 'firstAidKit.png';
            break;
            case 'ammoBag': return destination + 'ammoBag.png';
            break;
            case 'ammo': return destination + 'bullet.png';
            break;
            case 'grave': return destination + 'grave.gif';
            break;
            case 'silverArmour': return destination + 'shield_silver.png';
            break;
            case 'goldenArmour': return destination + 'shield_gold.png';
            break;
            default: break;
        }
    }

    function addManyStaticObjectsByType(count, type, size, coord, showSpeed) {
        for (var i = 0; i < count; i++) {
            addStaticObject(type, size, coord, showSpeed)
        }
    }

    function getAllStaticItems() {
        return staticItems;
    }

    function getAllStaticItemsByName(name) {
        return staticItems.filter(function (item) {
            return item.name === name;
        })
    }

    function getAllPlayerProvisions() {
        return staticItems.filter(function (item) {
            return item.name !== 'grave';
        })
    }

    function removeStaticItem(item) {
        drawer.clearRect(item.x, item.y, item.image.width, item.image.height);
        // makeImageTransparent(item);
        staticItems.splice(staticItems.indexOf(item), 1);
    }

    // function makeImageTransparent(item) {
    //     var img = drawer.createImageData(item.x, item.y);
    //     for (var i = img.data.length; --i >= 0; ){
    //         img.data[i] = 0;
    //     }
    //     drawer.putImageData(img, item.x, item.y)
    // }

    function megaDeathCaused(){
        return getAllStaticItemsByName('grave').length >= Settings.Gameplay.MinDeathsNeededForMegadeath;
    }


    function showScalingUp(item, size, interval, speed) {
        interval = interval || 35;
        size = size || 50; // 50px
        speed = speed || 8;
        var scale = 0,
            image = item.image;

        // a rectangular image
        image.width = 0;
        image.height = 0;
        var timer = setInterval(function () {
            scale = scale + speed;
            drawer.clearRect(item.x, item.y, image.width, image.height);
            drawer.drawImage(image, item.x, item.y, image.width, image.height);
            image.width += speed;
            image.height += speed;
            if (scale >= size)
            {
                window.clearInterval(timer);
            }
        }, interval, 'showScalingUp')
    }


    return {
        addStaticObject: addStaticObject,
        addManyStaticObjectsByType: addManyStaticObjectsByType,
        getAllStaticItems: getAllStaticItems,
        removeStaticItem: removeStaticItem,
        megaDeathCaused: megaDeathCaused,
        getAllPlayerProvisions: getAllPlayerProvisions
    }

}());