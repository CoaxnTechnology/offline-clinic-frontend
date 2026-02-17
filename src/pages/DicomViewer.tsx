import { useEffect, useRef } from "react";
import cornerstone from "cornerstone-core";
import cornerstoneTools from "cornerstone-tools";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";

interface Props {
  fileUrl: string;
}

export default function DicomViewer({ fileUrl }: Props) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fileUrl || !elementRef.current) return;

    const token = localStorage.getItem("access_token");

    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    cornerstoneWADOImageLoader.configure({
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      },
    });

    cornerstone.enable(elementRef.current);

    const imageId = `wadouri:${fileUrl}`;

    cornerstone.loadImage(imageId).then((image) => {
      cornerstone.displayImage(elementRef.current!, image);

      cornerstoneTools.init();
      cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
      cornerstoneTools.addTool(cornerstoneTools.PanTool);
      cornerstoneTools.addTool(cornerstoneTools.WwwcTool);

      cornerstoneTools.setToolActive("Zoom", { mouseButtonMask: 1 });
      cornerstoneTools.setToolActive("Pan", { mouseButtonMask: 4 });
      cornerstoneTools.setToolActive("Wwwc", { mouseButtonMask: 2 });
    });
  }, [fileUrl]);

  return (
    <div className="mt-4 h-[400px] bg-black rounded-lg overflow-hidden">
      <div ref={elementRef} className="w-full h-full" />
    </div>
  );
}
