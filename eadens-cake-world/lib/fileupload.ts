export async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Products'); // Replace with your Cloudinary upload preset
    
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dktlyfpst/image/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading file:', error);
      return '/placeholder.svg';
    }
  }