export async function generateVideoThumbnail(videoFile: File): Promise<File> {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement("video");
      const url = URL.createObjectURL(videoFile);
      
      video.src = url;
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.playsInline = true;
      
      // Load the metadata and the first frame
      video.onloadeddata = () => {
        // Set time to 0.1s to guarantee we get a frame (sometimes 0.0 is blank)
        video.currentTime = 0.1;
      };
      
      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        // Create a lower quality / lower resolution version for faster loading
        const MAX_WIDTH = 1280;
        let width = video.videoWidth;
        let height = video.videoHeight;
        
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Could not get 2d context"));
          return;
        }
        
        ctx.drawImage(video, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          if (blob) {
            const fileName = videoFile.name.replace(/\.[^/.]+$/, "") + "-poster.jpg";
            const file = new File([blob], fileName, { type: "image/jpeg" });
            resolve(file);
          } else {
            reject(new Error("Could not create blob from canvas"));
          }
        }, "image/jpeg", 0.7); // 0.7 quality for smaller file size
      };
      
      video.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(new Error("Error loading video for thumbnail generation"));
      };
      
      // Load the video completely if needed
      video.load();
    } catch (error) {
      reject(error);
    }
  });
}
