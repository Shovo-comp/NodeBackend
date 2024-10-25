const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.supabaseUrl
const supabaseKey = process.env.supabaseKey
const supabase = createClient(supabaseUrl, supabaseKey)

const uploadImage = async (file) => {
    console.log('Uploading file:', file); // Log the file object
    const {data, error} = await supabase.storage.from('Shovo').upload(`images/${file.originalname}`, file.buffer)

    if (error) {
        console.error('Error uploading image:', error.message);
        throw new Error('Image uploaded failed', error.message)
    }

    console.log('File uploaded successfully:', data);

    return `${supabaseUrl}/storage/v1/object/public/Shovo/${data.path}`
}


module.exports = {
    uploadImage
}