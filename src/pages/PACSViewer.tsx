import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import cornerstone from "cornerstone-core";
import cornerstoneTools from "cornerstone-tools";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";

export default function PACSViewer() {
  const { appointmentId } = useParams();
  const elementRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  ////////////////////////////////////////////////////////////////
  // 🔥 Fetch Study Images
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/dicom/appointments/${appointmentId}/images`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const result = await response.json();
        console.log("📦 API Response:", result);

        if (!response.ok) {
          console.error("❌ API Error:", result);
          return;
        }

        if (result?.data?.images?.length > 0) {
          const fileUrl = result.data.images[0].file_url;

          // 🔥 Important: BASE URL should NOT contain /api
          const base = import.meta.env.VITE_API_BASE_URL;
          const fullUrl = `${base}${fileUrl}`;

          console.log("🖼 Correct DICOM URL:", fullUrl);

          setImageUrl(fullUrl);
        }
      } catch (error) {
        console.error("❌ Fetch Error:", error);
      }
    };

    if (appointmentId) {
      fetchImages();
    }
  }, [appointmentId]);

  ////////////////////////////////////////////////////////////////
  // 🔥 Load DICOM (With Auth Header Support)
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (!imageUrl || !elementRef.current) return;

    const token = localStorage.getItem("access_token");

    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    // 🔥 Add Authorization header to DICOM requests
    cornerstoneWADOImageLoader.configure({
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      },
    });

    cornerstone.enable(elementRef.current);

    const imageId = `wadouri:${imageUrl}`;

    cornerstone
      .loadImage(imageId)
      .then((image) => {
        cornerstone.displayImage(elementRef.current!, image);

        cornerstoneTools.init();

        cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
        cornerstoneTools.addTool(cornerstoneTools.PanTool);
        cornerstoneTools.addTool(cornerstoneTools.WwwcTool);

        cornerstoneTools.setToolActive("Zoom", { mouseButtonMask: 1 });
        cornerstoneTools.setToolActive("Pan", { mouseButtonMask: 4 });
        cornerstoneTools.setToolActive("Wwwc", { mouseButtonMask: 2 });
      })
      .catch((err) => {
        console.error("❌ DICOM Load Error:", err);
      });
  }, [imageUrl]);

  ////////////////////////////////////////////////////////////////
  // 🔥 UI
  ////////////////////////////////////////////////////////////////
  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div
        ref={elementRef}
        className="w-full h-full"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
