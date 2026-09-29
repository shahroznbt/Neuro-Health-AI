
import * as daikon from 'daikon';

export const parseDicom = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const arrayBuffer = e.target?.result as ArrayBuffer;
                if (!arrayBuffer) {
                    reject(new Error("Failed to read file"));
                    return;
                }

                // Parse DICOM using daikon
                const data = new DataView(arrayBuffer);
                const image = daikon.Series.parseImage(data);

                if (!image) {
                    reject(new Error("Could not parse DICOM image"));
                    return;
                }

                // Get raw pixel data
                const rawData = image.getInterpretedData();
                const numPixels = image.getNumberOfFrames() * image.getRows() * image.getCols();

                if (!rawData) {
                    reject(new Error("No pixel data found"));
                    return;
                }

                // Determine min/max for normalization (simple window/level)
                let min = 65536;
                let max = -65536;
                for (let i = 0; i < rawData.length; i++) {
                    const val = rawData[i];
                    if (val < min) min = val;
                    if (val > max) max = val;
                }
                const range = max - min;

                // Create a canvas to render the image
                const canvas = document.createElement('canvas');
                canvas.width = image.getCols();
                canvas.height = image.getRows();
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error("Could not get canvas context"));
                    return;
                }

                const imageData = ctx.createImageData(canvas.width, canvas.height);
                const pixelData = imageData.data;

                // Render pixels to canvas (Grayscale)
                for (let i = 0; i < rawData.length; i++) {
                    // Normalize to 0-255
                    // Simple linear scaling. Real DICOM viewing needs Window Width/Center logic from tags
                    // but this suffices for "enable dicom support" demo.
                    let val = rawData[i];
                    let norm = 0;
                    if (range > 0) {
                        norm = Math.floor(((val - min) / range) * 255);
                    }

                    const p = i * 4;
                    pixelData[p] = norm;     // R
                    pixelData[p + 1] = norm; // G
                    pixelData[p + 2] = norm; // B
                    pixelData[p + 3] = 255;  // Alpha
                }

                ctx.putImageData(imageData, 0, 0);
                resolve(canvas.toDataURL('image/png'));

            } catch (err) {
                console.error("DICOM Parsing Error:", err);
                reject(err);
            }
        };

        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(file);
    });
};
