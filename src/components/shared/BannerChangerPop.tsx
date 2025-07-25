import React from "react";
import Image from "next/image";

import { HoverCardContent } from "@/components/ui/hover-card";

interface BannerChangerPopoverProps {
  handleChangeBanner: (banner: string) => void;
}

const BannerChangerPopover: React.FC<BannerChangerPopoverProps> = ({
  handleChangeBanner,
}) => {
  const banners = [
    "/banner1.svg",
    "/banner2.svg",
    "/banner3.svg",
    "/banner4.svg",
    "/banner5.svg",
    "/banner6.svg",
    "/banner7.svg",
  ];

  return (
    <HoverCardContent className="shadow-md rounded-md p-3">
      <div className="flex flex-nowrap justify-center gap-1">
        {banners.map((banner, index) => (
          <div
            key={index}
            onClick={() => handleChangeBanner(banner)}
            className="cursor-pointer p-1 rounded"
          >
            <Image
              src={banner}
              alt={`Banner ${index + 1}`}
              width={28}
              height={28}
              className="rounded-md hover:scale-110 transition-transform"
            />
          </div>
        ))}
      </div>
    </HoverCardContent>
  );
};

export default BannerChangerPopover;
