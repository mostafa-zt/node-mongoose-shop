const fs = require('fs');
const path = require('path');
class Utility {
    static createGuid() {
        function _p8(s) {
            var p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    }

    static isNumeric(str) {
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }

    static digitsOnly = string => [...string].every(c => '0123456789'.includes(c));

    static formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            let j = (i.length > 3) ? i.length % 3 : 0;

            return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {
            console.log(e)
        }
    };

    static deleteFile(filePath) {
        // const p = path.normalize(filePath);
        const _filePath = filePath.replace('\\', '');
        const fileExist = fs.existsSync(_filePath);
        // fs.access(filePath , )
        fs.access(_filePath, fs.constants.F_OK, (err) => {
            if (!err) {
                fs.unlinkSync(_filePath, (err) => {
                    if (err) {
                        throw new Error(err);
                    }
                });
            }
            // console.log(`${filePath} ${err ? 'does not exist' : 'exists'}`);
        });
        // if (fileExist) {
        //     fs.unlinkSync(filePath, (callback) => {
        //         if (callback) {
        //             throw new Error(callback);
        //             // return true
        //         }
        //     });
        // }
    }
}

module.exports = Utility;