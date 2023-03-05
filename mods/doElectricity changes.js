//console.log("doElectricity should be changed");

function doElectricity(pixel) {
	if(typeof(pixel.charge) == "number" && isNaN(pixel.charge)) {
		pixel.charge = 0;
		return;
	};
	if (pixel.charge) {
		// Check each adjacent pixel, if that pixel's charge is false, set it to the same charge
		for (var i = 0; i < adjacentCoords.length; i++) {
			var x = pixel.x+adjacentCoords[i][0];
			var y = pixel.y+adjacentCoords[i][1];
			if (!isEmpty(x,y,true)) {
				var newPixel = pixelMap[x][y];
				var con = elements[newPixel.element].conduct;
				if (con == undefined) {continue}
				if (Math.random() < con) { // If random number is less than conductivity
					if (!newPixel.charge && !newPixel.chargeCD) {
						newPixel.charge = isNaN(pixel.charge) ? 0 : pixel.charge; //Actually set it to the same charge
						if (elements[newPixel.element].colorOn) {
							newPixel.color = pixelColorPick(newPixel);
						}
						if(elements[newPixel.element].onCharge) {
							elements[newPixel.element].onCharge(pixel);
						};
					}
				}
				else if (elements[newPixel.element].insulate != true) { // Otherwise heat the pixel (Resistance simulation)
					newPixel.temp += pixel.charge/4;
					pixelTempCheck(newPixel);
				}
			}
		}
		pixel.charge -= 0.25;
		if (pixel.charge <= 0) {
			delete pixel.charge;
			//console.log(elements[pixel.element].chargeCD);
			var chargeCd = elements[pixel.element].chargeCD ?? 4;
			pixel.chargeCD = chargeCd; //Customizable chargeCD
		}
	}
	// Lower charge cooldown
	else if (pixel.chargeCD) {
		pixel.chargeCD -= 1;
		if (pixel.chargeCD <= 0) {
			delete pixel.chargeCD;
			if (elements[pixel.element].colorOn) {
				pixel.color = pixelColorPick(pixel);
			}
		}
	}
}