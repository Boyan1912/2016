var staticModels = (function(models){

    var staticField = document.getElementById('images');
    var drawer = staticField.getContext('2d');
    var staticItems = [];


    function addStaticObject(type, size, coordinates) {
        coordinates = coordinates || {x: Math.random() * staticField.width, y: Math.random() * staticField.height};
        var id = models.getUniqueId();
        var staticItem = {
            image: document.createElement('img'),
            id: id,
            name: type,
            isStatic: true,
            disappear: function () {
                removeStaticItem(this);
            },
            x: coordinates.x,
            y: coordinates.y
        };
        staticItem.image.src = getItemsImageSource(type);

        staticItems.push(staticItem);

        showScalingUp(staticItem, size);
    }

    function getItemsImageSource(type) {
        var destination = 'img/';
        switch (type){
            case 'health': return destination + 'firstAidKit.png';
            break;
            case 'ammoBag': return destination + 'ammoBag.png';
            break;
            case 'ammo': return destination + 'bullet.png';
                break;
        }
    }

    function addManyStaticObjectsByType(count, type, size, coord) {
        for (var i = 0; i < count; i++) {
            addStaticObject(type, size)
        }
    }

    function getAllStaticItems() {
        return staticItems;
    }
    
    function removeStaticItem(item) {
        drawer.clearRect(item.x, item.y, item.image.width, item.image.height);
        staticItems.splice(staticItems.indexOf(item), 1);
    }


    function showScalingUp(item, size, speed)
    {
        speed = speed || 50;
        size = size || 60; // 60px
        var scale = 0,
            image = item.image;

        // a rectangular image
        image.width = 0;
        image.height = 0;
        var timer = setInterval(function () {
            scale = scale + 10;
            drawer.clearRect(item.x, item.y, image.width, image.height);
            drawer.drawImage(image, item.x, item.y, image.width, image.height);
            image.width += 10;
            image.height += 10;
            if (scale >= size)
            {
                clearInterval(timer);
            }
        }, speed)
    }


    return {
        addStaticObject: addStaticObject,
        addManyStaticObjectsByType: addManyStaticObjectsByType,
        getAllStaticItems: getAllStaticItems,
        removeStaticItem: removeStaticItem
    }

}(modelsService));