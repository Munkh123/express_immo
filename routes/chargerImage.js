const util = require("util");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(`${__dirname}/../public/images`));
    },
    filename: (req, file, callback) => {
        const match = ["image/png", "image/jpeg"];
        if (match.indexOf(file.mimetype) === -1) {
            const message = `${file.originalname} formats acceptés :png/jpeg.`;
            return callback(message, null);
        }
        const filename = `${Date.now()}${file.originalname}`;
        callback(null, filename);
    }
});
const uploadFiles = multer({ storage: storage }).array("photos", 4);
const uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;