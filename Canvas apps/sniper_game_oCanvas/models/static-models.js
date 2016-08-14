var staticModels = (function(models){

    var staticField = document.getElementById('images');
    var drawer = staticField.getContext('2d');
    var staticItems = [];


    function addStaticObject(type, coordinates) {
        coordinates = coordinates || {x: Math.random() * staticField.width, y: Math.random() * staticField.height};
        var id = models.getUniqueId();
        var staticItem = {
            image: document.createElement('img'),
            id: id,
            name: type,
            isStatic: true,
            disappear: function () {
                console.log(this);
                removeStaticItem(this);
            },
            x: coordinates.x,
            y: coordinates.y
        };
        staticItem.image.src = "img/" + type + ".png";

        staticItems.push(staticItem);

        show(staticItem);
    }

    function getAllStaticItems() {
        return staticItems;
    }
    
    function removeStaticItem(item) {
        drawer.clearRect(item.x, item.y, item.image.width, item.image.height);
        staticItems.splice(staticItems.indexOf(item), 1);
    }


    function show(item)
    {
        var scale = 1.0;
        var timer = setInterval(function () {

            scale = scale + 0.10;
            var image = item.image;
            drawer.drawImage(image, item.x, item.y, (image.width / 2) * scale, (image.height / 2) * scale);
            if (scale > 2.0)
            {
                clearInterval(timer);
            }
        }, 100)
    }


    return {
        addStaticObject: addStaticObject,
        getAllStaticItems: getAllStaticItems,
        removeStaticItem: removeStaticItem
    }

}(modelsService));