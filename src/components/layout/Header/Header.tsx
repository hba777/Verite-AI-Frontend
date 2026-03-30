import React from "react";
import { RiGeminiFill } from "react-icons/ri";
import { BiSquareRounded } from "react-icons/bi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/router";

// Helper component for the icon
interface CustomFeatureIconProps {
  size?: number;
  className?: string;
}

const CustomFeatureIcon: React.FC<CustomFeatureIconProps> = ({
  size = 20,
  className,
}) => {
  // Calculate the overlay size to be proportional to the base icon.
  const overlaySize = size * 0.6;

  return (
    // 1. A container to position the icons relative to each other.
    <span
      style={{
        position: "relative",
        display: "inline-block",
        width: size,
        height: size,
      }}
      className={className}
    >
      {/* 2. The base square icon. */}
      <BiSquareRounded
        size={size}
        className="text-gray-400"
        style={{ position: "absolute" }}
      />

      {/* 3. The Gemini icon as the overlay. */}
      <RiGeminiFill
        size={overlaySize}
        className="text-gray-400"
        style={{
          position: "absolute",
          top: "-10%", // Adjust percentage for perfect corner placement
          right: "-10%", // Adjust percentage for perfect corner placement
        }}
      />
    </span>
  );
};

// Added isAtTop prop
const Header = ({
  isVisible,
  isAtTop,
}: {
  isVisible: boolean;
  isAtTop: boolean;
}) => {
  const { user, logout } = useUser();
  const router = useRouter();
  const initial =
    (user?.username || user?.email || "").charAt(0).toUpperCase() || "U";
  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[1000] bg-black backdrop-blur-sm transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${isVisible && !isAtTop ? "border-b border-white/20" : ""}`}
      >
        <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 2xl:px-12 3xl:px-16">
          <nav className="flex h-14 items-center justify-between">
            <div className="flex items-center space-x-8">
              {/* Main heading - weight 400 (links to homepage) */}
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/");
                }}
                className="text-xl text-white px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 font-normal"
              >
                Verité AI
              </a>
            </div>

            {/* Buttons - weight 450 */}
            <div className="flex items-center space-x-2">
              {/* <a
                href="#"
                className="hidden items-center rounded-full text-gray-400 transition-colors sm:inline-flex bg-[#191919] hover:bg-[#222323] font-extralight
              px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                }}
              >
                <CustomFeatureIcon className="mr-2" />
                Start Detecting
              </a> */}

              <button
                onClick={() => router.push("/dashboard")}
                className="hidden items-center rounded-full text-gray-400 transition-colors sm:inline-flex bg-[#191919] hover:bg-[#222323] font-extralight
              px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                }}
              >
                <RiGeminiFill size={20} className="text-gray-400 mr-2" />
                Try Detection
              </button>

              {user ? (
                <div className="relative">
                  <details className="group">
                    <summary className="list-none cursor-pointer">
                      <Avatar>
                        {user?.profile_url ? (
                          <AvatarImage
                            src={user.profile_url}
                            alt={user?.username || "User"}
                          />
                        ) : (
                          <AvatarFallback className="bg-[#191919] text-gray-300">
                            {initial}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </summary>
                    <div className="absolute right-0 mt-2 w-44 rounded-lg border border-white/10 bg-black/90 text-white shadow-lg">
                      <button
                        onClick={async () => {
                          await logout();
                          router.back();
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-white/10"
                      >
                        Logout
                      </button>
                    </div>
                  </details>
                </div>
              ) : null}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
