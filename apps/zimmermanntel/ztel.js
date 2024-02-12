String.prototype.replaceAll = function(search, replacement) {
    return this.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.shuffle = function () {
    var a = this.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}

var alphabetNumbers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

var axis = generateAxis();
var grid = generateGrid();

function generateGrid() {
    return alphabetNumbers.shuffle();
}

function generateAxis() {
    return alphabetNumbers.shuffle().substring(0, 6);
}

function encrypt(axises, zimmermannGrid, message) {
    grid = zimmermannGrid.toUpperCase();
    axis = axises.toUpperCase();
    var encryptedMessage = "";

    if(grid.length !== 36) {
        return "Sorry, but your message could not be encrypted because the " +
        "grid length was not thirty-six characters.";
    }
    if(axis.length !== 6) {
        return "Sorry, but your message could not be encrypted because the " +
        "axis value was not six characters.";
    }

    message = message.replaceAll(" ", "").replace(/\W/g, "").toUpperCase();

    for(i = 0; i < message.length; i++) {
        for(j = 0; j < 36; j++) {
            if(grid.charAt((Math.floor(j / 6) * 6) + (j % 6))
                === message.charAt(i)) {
                    encryptedMessage += axis.charAt(Math.floor(j / 6))
                        + axis.charAt(j % 6);
            }
        }
    }

    var tempMessage = encryptedMessage;
    return encryptedMessage;
}

function decrypt(axises, zimmermannGrid, message) {
    grid = zimmermannGrid.toUpperCase();
    axis = axises.toUpperCase();

    if(grid.length !== 36) {
        return "Sorry, but your message could not be decrypted because the " +
        "grid length was not thirty-six characters.";
    }
    if(axis.length !== 6) {
        return "Sorry, but your message could not be decrypted because the " +
        "axis value was not six characters.";
    }

    message = message.replaceAll(" ", "").toUpperCase().replace(/\W/g, "");

    var decryptedMessage = "";
    for(i = 0; i < message.length; i = i + 2) {
        for(j = 0; j < 36; j++) {
            if("" + axis.charAt(Math.floor(j / 6)) + axis.charAt(j -
                (Math.floor(j / 6) * 6)) ===
                    message.substring(i, i + 2).toUpperCase()) {
                        decryptedMessage += grid.substring(j, j + 1);
            }
        }
    }
    return decryptedMessage;
}

function encFromDoc() {
    document.getElementById("outputDisplay").innerHTML =
        encrypt(document.getElementById("axisVals").value,
            document.getElementById("gridVals").value,
                document.getElementById("userIn").value);
}

function decFromDoc() {
    document.getElementById("outputDisplay").innerHTML =
        decrypt(document.getElementById("axisVals").value,
            document.getElementById("gridVals").value,
                document.getElementById("userIn").value);
}
