import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
	// Init the Express application
	const app = express();

	// Set the network port
	const port = process.env.PORT || 8082;

	// Use the body parser middleware for post requests
	app.use(express.json());

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
	app.get("/", async (req, res) => {
		res.send("try GET /filteredimage?image_url={{}}");
	});

	app.get("/filteredimage", async (req: Request, res: Response) => {
		console.log(req.query);

		var extenstions = ["jpg", "jpeg", "png", "gif"];
		let url = req.query["image_url"];

		if (typeof url == "string" && url.startsWith("https://")) {
			let ext_list = url.split(".");
			let len_ext = ext_list.length - 1;
			let ext = ext_list[len_ext].toLowerCase();

			if (extenstions.includes(ext)) {
				try {
					let path: string = await filterImageFromURL(url);
					await deleteLocalFiles([path]);
					res.send(path);
				} catch (error) {
					console.log(error);
					res.json({
						message: "the url is invalid",
					});
				}
			} else {
				res.json({
					message: "the url is invalid",
				});
			}
		} else {
			res.json({
				message: "the url is invalid",
			});
		}
	});

	// Start the Server
	app.listen(port, () => {
		console.log(`server running http://localhost:${port}`);
		console.log(`press CTRL+C to stop server`);
	});
})();
