# hex-game
 A Hexagonal Game Board Generator

To define a hex:
new Hex(q-coordinate, r-coordinate, class-string)

This checks whether a hex exists at q,r and if not, it will create one and insert it into Hexes[q,r]
The class string gets put on the polygon so that your CSS can select it.

To draw the hexes: 
Hexes.forEach(element => { element.draw() })