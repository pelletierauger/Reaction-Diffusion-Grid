function seedPalette() {
    return {
        name: "randomlyGenerated",
        data: {
            redOsc: Math.floor(Math.random() * 10),
            redMin: Math.floor(Math.random() * 255),
            redMax: Math.floor(Math.random() * 255),
            greenOsc: Math.floor(Math.random() * 10),
            greenMin: Math.floor(Math.random() * 255),
            greenMax: Math.floor(Math.random() * 255),
            blueOsc: Math.floor(Math.random() * 10),
            blueMin: Math.floor(Math.random() * 255),
            blueMax: Math.floor(Math.random() * 255)
        }
    }
}

//Rose, gris et vert
// 151, 110, 6, 37, 250, 5, 213, 46, 6
// paletteSeed = makePalette(6, 46, 213, 5, 250, 37, 6, 110, 151);

// Cyan, brun, jaune
// 249, 1, 2, 209, 77, 6, 137, 223, 4
// paletteSeed = makePalette(4, 223, 137, 6, 77, 209, 2, 1, 249);

// Good seedPalettes : format : blue, green, red (Max, Min, Osc);
// 38, 72, 7, 196, 88, 4, 169, 215, 5
// 86, 173, 8, 190, 133, 7, 114, 31, 4
// 81, 12, 5, 191, 140, 6, 167, 37, 4
// 208, 34, 2, 250, 228, 7, 184, 63, 6
// 47, 143, 2, 32, 249, 6, 112, 233, 1

// Super beau rouge et bleu : 
// 222, 60, 4, 9, 116, 4, 205, 26, 3
// Gris, rose, vert :
// 151,110,6,37,250,5,213,46,6
// Vert et brun
// 56, 6, 2, 104, 191, 9, 83, 239, 5
// Terre, gris
// 33, 120, 6, 120, 9, 9, 232, 180, 2
// Cyan, brun, jaune
// 249, 1, 2, 209, 77, 6, 137, 223, 4
// Rose, gris, vert
// 163, 0, 9, 178, 145, 8, 244, 144, 2
// Mauve et turquoise
// 208, 153, 5, 50, 136, 1, 122, 80, 6
// Autre mauve et turquoise, moins bon
// 111, 204, 7, 53, 141, 1, 86, 62, 7
// Orange et brun verdâtre
// 99, 71, 9, 78, 93, 1, 130, 253, 3
// Surprenant mélange de rose, orange et brun
// 12, 111, 3, 57, 16, 4, 92, 248, 7
// Autre mauve et turquoise
// 252, 212, 5, 80, 26, 8, 99, 25, 2
// Saumon, vert et gris
// 25, 181, 2, 133, 60, 8, 88, 231, 8
// Orange brunâtre et rose
// 216, 62, 4, 67, 100, 6, 153, 90, 9
// Orange vif et rose
// 174, 39, 9, 54, 43, 9, 243, 94, 8

function makePalette(rO, rMi, rMa, gO, gMi, gMa, bO, bMi, bMax) {
    return {
        redOsc: rO,
        redMin: rMi,
        redMax: rMa,
        greenOsc: gO,
        greenMin: gMi,
        greenMax: gMa,
        blueOsc: bO,
        blueMin: bMi,
        blueMax: bMax,
    }
}

function adjustLevels(dark, mid, light, values) {
    var originalMid = 255 / 2;
    var stretchedMid = map(originalMid, 0, 255, 0 + dark, 255 + light);
    var vals = [values.r, values.g, values.b];
    for (var i = 0; i < vals.length; i++) {

        vals[i] = map(vals[i], 0, 255, 0 + dark, 255 + light);

        // midPoint Shifting Algorithm : what is between 0 and 128 must be mapped between 0 and 178,
        // what is between 129 and 255 must be mapped between 179 and 255.

        // Adjusted for dark and light : 
        // what is between dark and originalMid must mapped between dark and (originalMid + mid),
        // what is between originalMid and light must be mapped between (originalMid + mid) and light;
        // console.log(vals[i]);
        if (vals[i] >= 0 + dark && vals[i] <= stretchedMid) {
            // console.log("Darker! : " + vals[i]);
            vals[i] = map(vals[i], dark, stretchedMid, dark, stretchedMid + mid);
            // console.log("Darker after ! : " + vals[i]);
        } else if (vals[i] > originalMid && vals[i] <= 255 + light) {
            // console.log("Lighter! : " + vals[i]);
            vals[i] = map(vals[i], stretchedMid, light, stretchedMid + mid, light);
            // console.log("Lighter after! : " + vals[i]);
        }

        //Then we constrain the value to proper rgb values.
        vals[i] = constrain(vals[i], 0, 255);
        //We round the value.
        vals[i] = Math.round(vals[i]);

    }
    values.r = vals[0];
    values.g = vals[1];
    values.b = vals[2];
    return values;
    //For every argument starting at arguments[3], do this...
    // for (var i = 3; i < arguments.length; i++) {

    // }

}