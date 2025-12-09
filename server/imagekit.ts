import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
});

export interface ImageKitAuthParams {
  token: string;
  expire: number;
  signature: string;
}

export function getImageKitAuthParams(): ImageKitAuthParams {
  return imagekit.getAuthenticationParameters();
}

export async function uploadImage(
  file: string | Buffer,
  fileName: string,
  folder: string = 'products'
): Promise<{ url: string; fileId: string }> {
  try {
    const response = await imagekit.upload({
      file,
      fileName,
      folder: `aqeel-pharmacy/${folder}`,
    });
    
    return {
      url: response.url,
      fileId: response.fileId,
    };
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw error;
  }
}

export async function deleteImage(fileId: string): Promise<void> {
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error('ImageKit delete error:', error);
    throw error;
  }
}

export { imagekit };
