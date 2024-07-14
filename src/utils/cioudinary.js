import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
    cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
    api_key: `${process.env.CLOUDINARY_API_KEY}`,
    api_secret: `${process.env.CLOUDINARY_SECRET_KEY}` // Click 'View Credentials' below to copy your API secret
});

export const cloudinaryUpload = async (localpath , folder) => {
    try {
        const uploadResult = await cloudinary.uploader
       .upload(
           localpath , {
                resource_type : "auto",
                folder,
                use_filename : true,
                unique_filename : true
           }
       ) 
       fs.unlinkSync(localpath)
        return uploadResult;
    } catch (error) {
        console.log("cloudinary error" , error.message);
    }
}

export const cloudinaryDelete = async (publicId) => {
    try {
        const deleteResult = cloudinary.uploader
        .destroy(
            publicId,{
                invalidate : true
            }
        )
        return deleteResult
    } catch (error) {
        console.log("cloudinary deleted error" , error.message);
    }
}

/*(async function() {

    cloudinary.config({ 
        cloud_name: 'dwhecnggl', 
        api_key: '967553925258728', 
        api_secret: `${process.env.CLOUDINARY_SECRET_KEY}` // Click 'View Credentials' below to copy your API secret
    });
    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
               public_id: 'shoes',
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('shoes', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('shoes', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);    
})();*/