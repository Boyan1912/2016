var rocket = canvas.display.sprite({
    x: -1000,
    y: sniper.y,
    origin: { x: "center", y: "center" },
    image: "img/rocket.png",
    generate: true,
    width: 26,
    height: 49,
    direction: "x",
    duration: 60
});

canvas.addChild(rocket);