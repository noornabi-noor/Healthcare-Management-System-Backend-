import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params: async (req, file) => {
        const originalName = file.originalname;
        const extension = originalName.split(".").pop()?.toLocaleLowerCase();

        // Validate file extension
        const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
        if (!allowedExtensions.includes(extension || "")) {
            throw new Error(`Invalid file format. Allowed: ${allowedExtensions.join(", ")}`);
        }

        const fileNameWithoutExtension = originalName
            .split(".")
            .slice(0, -1)
            .join(".")
            .toLowerCase()
            .replace(/\s+/g, "-")
            // eslint-disable-next-line no-useless-escape
            .replace(/[^a-z0-9\-]/g, "");

        const uniqueName =
            Math.random().toString(36).substring(2) +
            "-" +
            Date.now() +
            "-" +
            fileNameWithoutExtension;

        const folder = extension === "pdf" ? "pdfs" : "images";

        console.log(`📤 Uploading "${originalName}" to Cloudinary at folder: ph-healthcare/${folder}/${uniqueName}`);

        return {
            folder: `ph-healthcare/${folder}`,
            public_id: uniqueName,
            resource_type: "auto"
        }
    }
})

export const multerUpload = multer({ 
    storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max file size
    fileFilter: (req, file, cb) => {
        // Additional file validation
        const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];
        if (allowedMimes.includes(file.mimetype)) {
            console.log(`✅ File validation passed: ${file.originalname} (${file.mimetype})`);
            cb(null, true);
        } else {
            console.error(`❌ Invalid MIME type: ${file.mimetype}`);
            cb(new Error(`Invalid MIME type: ${file.mimetype}`));
        }
    }
})