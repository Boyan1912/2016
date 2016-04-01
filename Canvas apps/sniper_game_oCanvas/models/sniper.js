var sniper = canvas.display.sprite({
    x: 150,
    y: 150,
    origin: { x: "center", y: "center" },
    image: "img/sniperflipped.png",
    generate: true,
    width: 53,
    height: 63,
    direction: "x",
    duration: 30
});

canvas.addChild(sniper);
