import { Cloudinary } from "@cloudinary/url-gen";

const ImageUploader = () => {
	const cld = new Cloudinary({ cloud: { cloudName: "dgomadqhf" } });

	cld.uploader.upload(
		"https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
		{ public_id: "olympic_flag" },
		function (error, result) {
			if (error) {
				console.log(error);
			}
			console.log(result);
		}
	);
};

export default ImageUploader;
