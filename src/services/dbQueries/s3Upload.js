import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const validateEnv = () => {
  if (!process.env.REACT_APP_AWS_REGION) {
    throw new Error('AWS region is required in environment variables');
  }
  if (!process.env.REACT_APP_S3_BUCKET_NAME) {
    throw new Error('S3 bucket name is required in environment variables');
  }
};

const getS3Client = () => {
  validateEnv();
  
  return new S3Client({
    region: process.env.REACT_APP_AWS_REGION,
    requestChecksumCalculation: 'WHEN_REQUIRED',
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY || ''
    }
  });
};

export const s3BaseUrl = `https://${process.env.REACT_APP_S3_BUCKET_NAME}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/`;

const MAX_FILE_SIZE = parseInt(process.env.REACT_APP_MAX_FILE_SIZE, 10) || 2 * 1024 * 1024; // Default to 2MB

export const uploadToS3 = async (file, type = 'users') => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)} MB.`);
  }

  const s3Client = getS3Client();
  const key = `${type}/${uuidv4()}-${file.name}`;

  const params = {
    Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: file.type,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return `${s3BaseUrl}${key}`;
  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};


// List files from S3
export const listFromS3 = async (params) => {
  const s3Client = getS3Client();
  const { type, prefix } = params;
  const commandParams = {
    Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
    Prefix: type || '',  
    MaxKeys: 1000
  };

  try {
    const data = await s3Client.send(new ListObjectsV2Command(commandParams));


    if (!data.Contents || data.Contents.length === 0) {
      console.log('No files found in the S3 bucket.');
      return [];  
    }

    return data.Contents.map(item => ({
      Key: item.Key,
      LastModified: item.LastModified,
      Size: item.Size,
      Url: `${s3BaseUrl}${item.Key}`
    }));
  } catch (error) {
    console.error('Error listing files from S3:', error);
    throw new Error('Failed to list files from S3.');
  }
};


export const deleteFromS3 = async (params) => {
  const s3Client = getS3Client();

  const { urls } = params;

  if (!Array.isArray(urls)) {
    throw new Error('Invalid delete parameters. "urls" should be an array.');
  }

  const validUrls = urls.filter(url => typeof url === 'string' && url.trim() !== '');

  if (validUrls.length === 0) {
    console.log('No valid URLs to delete.');
    return [];  
  }

  try {
    await Promise.all(
      validUrls.map(async (url) => {
        if (!url) {
          console.log('Skipping invalid URL:', url);
          return;
        }
        const key = url.replace(s3BaseUrl, '');  
        await s3Client.send(new DeleteObjectCommand({
          Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
          Key: key,
        }));
      })
    );

    return validUrls;  
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error('Failed to delete files from S3.');
  }
};
