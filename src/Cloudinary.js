import  {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
    cloud_name: 'ddvf7and4',
    api_key: '581534592428331',
    api_secret: 'NlndHaNVt75Hh8NqXNmDkOVIS7Q',
    secure: true
  });

export async function uploadImage(filePath){
    return await cloudinary.uploader.upload(filePath, {
        folder: 'images'
    })
}

export async function deleteImage(public_id){
    return await cloudinary.uploader.destroy(public_id)
}