import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

interface ImageUploaderProps {
  onFileSelected: (file: File) => void;
  initialImage?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFileSelected,
  initialImage,
}) => {
  const [preview, setPreview] = useState<string | null>(
    initialImage || "/default-avatar.png"
  );

  useEffect(() => {
    if (initialImage) {
      setPreview(initialImage);
    }
  }, [initialImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPreview(URL.createObjectURL(file));
      onFileSelected(file);
    }
  };

  return (
    <div style={{ textAlign: "center", position: "relative" }}>
      <div
        style={{
          width: "250px", // Tăng kích thước hình tròn
          height: "250px",
          borderRadius: "50%",
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
          display: "inline-block",
          border: "3px dashed #ccc",
          transition: "all 0.3s ease-in-out",
        }}
        onClick={() => document.getElementById("fileInput")?.click()}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#007bff")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ccc")}
      >
        {/* Ảnh chiếm hết khung tròn */}
        <Image src={preview!} alt="Avatar" layout="fill" objectFit="cover" />
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0, 0, 0, 0.5)",
            borderRadius: "50%",
            padding: "8px",
          }}
        >
          <Camera color="white" size={10} />
        </div>
      </div>

      <input
        type="file"
        id="fileInput"
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />
    </div>
  );
};

export default ImageUploader;
