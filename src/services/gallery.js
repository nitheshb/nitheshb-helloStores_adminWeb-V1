// import request from './request';

// const galleryService = {
//   getAll: (params) =>
//     request.get('dashboard/galleries/storage/files', { params }),
//   upload: (data) => request.post('dashboard/galleries', data),
//   delete: (params) =>
//     request.post('dashboard/galleries/storage/files/delete', {}, { params }),
// };

// export default galleryService;





import { uploadToS3, listFromS3, deleteFromS3, s3BaseUrl } from './dbQueries/s3Upload';

const galleryService = {

  getAll: async (params) => {
    try {
      const files = await listFromS3(params);
      
      const transformed = files && files.length > 0 
        ? files.map(file => ({
            id: file.Key,  
            path: file.Url,
            isset: false,    
            size: file.Size, 
          }))
        : [];  

      return {
        data: {
          data: transformed,  
        },
        meta: {
          current_page: params.page || 1,
          total: transformed.length,  
          last_page: Math.ceil(transformed.length / params.perPage),
          per_page: params.perPage || 10,
        }
      };
    } catch (error) {
      console.error('Gallery list error:', error);
      throw error;
    }
  },

  upload: async (data) => {
    try {
      const file = data.get('image');
      const type = data.get('type') || 'users';
      
      if (!file) throw new Error('No file provided');
      
      const url = await uploadToS3(file, type);
      return {
        data: {
          title: url,
          type: type,
          path: url,
          base_path: s3BaseUrl
        },
        message: 'Image uploaded successfully'
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  delete: async (params) => {
    try {
      
      const urls = Object.values(params); 
  
      
      if (!Array.isArray(urls)) {
        throw new Error('Invalid delete parameters. "urls" should be an array.');
      }
  
      const deletedUrls = await deleteFromS3({ urls });
  
      return {
        data: deletedUrls.map(url => ({
          title: url.split('/').pop(),  
          path: url,
          type: url.split('/')[3],  
          success: true,
        })),
        message: 'Files deleted successfully',
      };
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }
  
  
};

export default galleryService;