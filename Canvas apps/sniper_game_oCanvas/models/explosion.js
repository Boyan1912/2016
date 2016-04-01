var explosion = canvas.display.sprite({
    x: -1000,
    y: 0,
    origin: { x: "center", y: "center" },
    image: "img/explosion.png",
    generate: true,
    width: 128,
    height: 128,
    direction: "x",
    duration: 60,
    frame: 1,
    loop: false
});

canvas.addChild(explosion);