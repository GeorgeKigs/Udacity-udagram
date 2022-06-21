"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const util_1 = require("./util/util");
const fs_1 = __importDefault(require("fs"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Init the Express application
    const app = (0, express_1.default)();
    // Set the network port
    const port = process.env.PORT || 8082;
    // Use the body parser middleware for post requests
    app.use(express_1.default.json());
    // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
    // GET /filteredimage?image_url={{URL}}
    // endpoint to filter an image from a public url.
    // IT SHOULD
    //    1
    //    1. validate the image_url query
    //    2. call filterImageFromURL(image_url) to filter the image
    //    3. send the resulting file in the response
    //    4. deletes any files on the server on finish of the response
    // QUERY PARAMATERS
    //    image_url: URL of a publicly accessible image
    // RETURNS
    //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
    /**************************************************************************** */
    //! END @TODO1
    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.send("try GET /filteredimage?image_url={{}}");
    }));
    app.get("/filteredimage", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.query);
        var extenstions = ["jpg", "jpeg", "png", "gif"];
        let url = req.query["image_url"];
        if (typeof url == "string" && url.startsWith("https://")) {
            let ext_list = url.split(".");
            let len_ext = ext_list.length - 1;
            let ext = ext_list[len_ext].toLowerCase();
            if (extenstions.includes(ext)) {
                try {
                    let path = yield (0, util_1.filterImageFromURL)(url);
                    var image = fs_1.default.createReadStream(path);
                    image.on("open", () => {
                        res.set("Content-Type", "image/jpeg");
                        image.pipe(res);
                    });
                    image.on("close", () => {
                        (0, util_1.deleteLocalFiles)([path]);
                    });
                }
                catch (error) {
                    console.log(error);
                    res.status(400).json({
                        message: "the url is invalid",
                    });
                }
            }
            else {
                res.status(400).json({
                    message: "the url is invalid",
                });
            }
        }
        else {
            res.status(400).json({
                message: "the url is invalid",
            });
        }
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
//# sourceMappingURL=server.js.map