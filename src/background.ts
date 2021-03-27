import * as background from "./background/Background";
import { statusCode } from "./background/main.store";

for (const [key, value] of Object.entries(background)) {
    window[key] = value;
}

window["log"] = function () {
    console.log(...arguments);
};

window['chrome'].commands.onCommand.addListener(function (command) {
    if (command === "toggle-recording") {
        switch (statusCode.get()) {
            case 0:
                background.record();
                break;
            case 1:
                background.cut();
                break;
        }
    }
});
