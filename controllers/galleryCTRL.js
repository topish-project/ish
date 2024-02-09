const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const GalleryPost = require("../../models/gallery");
const { Users } = require("../models/users");
const { handleResponse } = require("../utils/handleResponse");
require("dotenv/config");

const s3 = new S3Client({
    region: process.env.AWS_S3_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    },
});

// Define the file filter to accept image and video formats
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4",
        "video/quicktime",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Invalid file format. Only images (jpeg, png, gif) and videos (mp4, quicktime) are allowed."
            )
        );
    }
};

const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            // Adjust the key function to include the original filename with extension
            const fileExtension = file.mimetype.split("/")[1];
            cb(null, "Users-gallery-post/" + `file-${Date.now()}.${fileExtension}`);
        },
    }),
    fileFilter: fileFilter,
}).single("file"); // Use "file" as the field name for both images and videos


class GalleryCTRL {
    async createGalleryPost(req, res, next) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            } else if (req.user.role !== "JobSeeker") {
                return handleResponse(res, 401, 'error', 'You are not allowed!', {}, 0);
            }

            // Populate the jobSeeker property in req.user, if we don't send jobSeeker property by user.req
            const UserId = req.user.id;
            const user = await Users.findOne({ _id: UserId }).populate("jobSeeker");

            if (!user || !user.jobSeeker) {
                return handleResponse(res, 401, 'error', 'User not found or jobSeeker property missing', {}, 0);
            }

            upload(req, res, async (err) => {
                if (err) {
                    return handleResponse(res, 400, 'error', err.message, {}, 0);
                }

                req.body.image = req.file.location;
                req.body.createdBy = user.jobSeeker._id;

                const gallery = await GalleryPost.create(req.body);

                return handleResponse(res, 200, 'success', 'Gallery post created successfully', { gallery }, 1);
            });
        } catch (error) {
            console.error("Error in createGalleryPost function:", error);
            return handleResponse(res, 500, 'error', 'Something went wrong', {}, 0);
        }
    }

    async deleteGalleryPost(req, res, next) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            } else if (req.user.role !== "JobSeeker") {
                return handleResponse(res, 401, 'error', 'You are not allowed!', {}, 0);
            }

            const {
                params: { id: galleryID },
            } = req;

            const deleteGallery = await GalleryPost.findOneAndDelete({
                _id: galleryID,
                createdBy: req.user.jobSeeker._id,
            });

            if (!deleteGallery) {
                return handleResponse(res, 404, 'error', "The post wasn't found!", {}, 0);
            }

            // Retrieve the S3 object URL from deleteGallery
            const imageURL = deleteGallery.image;

            if (imageURL) {
                // Extract the S3 object key from the URL
                const urlParts = imageURL.split("/");
                const key =
                    urlParts[urlParts.length - 2] + "/" + urlParts[urlParts.length - 1];

                // Debugging: Check the S3 key value
                console.log("S3 key to delete:", key);

                const deleteParams = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: key,
                };

                const deleteCommand = new DeleteObjectCommand(deleteParams);

                // Attempt to delete the object from S3
                try {
                    await s3.send(deleteCommand);
                    console.log("File deleted from S3.");
                } catch (error) {
                    console.error("Error deleting file from S3:", error);
                }
            }

            return handleResponse(res, 200, 'success', 'Gallery post deleted successfully', { deleteGallery }, 1);
        } catch (error) {
            console.error("Error deleting gallery post:", error);
            return handleResponse(res, 500, 'error', 'Something went wrong', {}, 0);
        }
    }


    async getAllGalleryPost(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            const galleryPosts = await GalleryPost.find();

            return handleResponse(res, 200, 'success', 'Gallery posts retrieved successfully', { galleryPosts }, galleryPosts.length);
        } catch (error) {
            console.error("Error in getAllGalleryPost function:", error);
            return handleResponse(res, 500, 'error', 'Internal Server Error', {}, 0);
        }
    }


    async getAllMyGalleryPost(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            } else if (req.user.role !== "JobSeeker") {
                return handleResponse(res, 401, 'error', 'You are not allowed!', {}, 0);
            }

            const userId = req.user.jobSeeker._id;
            const galleryPosts = await GalleryPost.find({ createdBy: userId });

            return handleResponse(res, 200, 'success', 'Your gallery posts retrieved successfully', { galleryPosts }, galleryPosts.length);
        } catch (error) {
            console.error("Error in getAllMyGalleryPost function:", error);
            return handleResponse(res, 500, 'error', 'Internal Server Error', {}, 0);
        }
    }

    async getGalleryPost(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            const galleryPostId = req.params.id;
            const galleryPost = await GalleryPost.findById(galleryPostId);

            if (!galleryPost) {
                return handleResponse(res, 404, 'error', 'Gallery post not found', {}, 0);
            }

            return handleResponse(res, 200, 'success', 'Gallery post retrieved successfully', { galleryPost }, 1);
        } catch (error) {
            console.error("Error in getGalleryPost function:", error);
            return handleResponse(res, 500, 'error', 'Internal Server Error', {}, 0);
        }
    }


    async updateGalleryPost(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            } else if (req.user.role !== "JobSeeker") {
                return handleResponse(res, 401, 'error', 'You are not allowed!', {}, 0);
            }

            const {
                params: { id: galleryId },
            } = req;

            const updatedGalleryPost = await GalleryPost.findOneAndUpdate(
                { _id: galleryId, createdBy: req.user.jobSeeker._id },
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );

            if (!updatedGalleryPost) {
                return handleResponse(res, 404, 'error', "Gallery post not found or you don't have permission to update it.", {}, 0);
            }

            return handleResponse(res, 200, 'success', 'Gallery post updated successfully', { galleryPost: updatedGalleryPost }, 1);
        } catch (error) {
            console.error("Error in updateGalleryPost function:", error);
            return handleResponse(res, 500, 'error', 'Internal Server Error', {}, 0);
        }
    }

}

module.exports = GalleryCTRL;
