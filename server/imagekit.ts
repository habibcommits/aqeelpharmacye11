import ImageKit from 'imagekit';

let imagekitInstance: ImageKit | null = null;

function getImageKit(): ImageKit {
  if (!imagekitInstance) {
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
      throw new Error('ImageKit credentials are not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT environment variables.');
    }

    imagekitInstance = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });
  }
  return imagekitInstance;
}

export interface ImageKitAuthParams {
  token: string;
  expire: number;
  signature: string;
}

export function getImageKitAuthParams(): ImageKitAuthParams {
  return getImageKit().getAuthenticationParameters();
}

export async function uploadImage(
  file: string | Buffer,
  fileName: string,
  folder: string = 'products'
): Promise<{ url: string; fileId: string }> {
  try {
    const response = await getImageKit().upload({
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
    await getImageKit().deleteFile(fileId);
  } catch (error) {
    console.error('ImageKit delete error:', error);
    throw error;
  }
}

export const imagekit = {
  get instance() {
    return getImageKit();
  }
};
