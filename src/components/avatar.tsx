"use client";

import * as React from "react";
import { Avatar as AstryxAvatar } from "@astryxdesign/core/Avatar";

import { cn } from "../lib/cn";

type AvatarContextValue = {
  imageStatus: "idle" | "loaded" | "error";
  setImageStatus: (status: "idle" | "loaded" | "error") => void;
};

const AvatarContext = React.createContext<AvatarContextValue | null>(null);

type AvatarSize =
  | "tiny"
  | "xsmall"
  | "small"
  | "medium"
  | "large"
  | 16
  | 20
  | 24
  | 32
  | 36
  | 40
  | 48
  | 60
  | 64
  | 72
  | 96
  | 128
  | 144
  | 180;

export type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  alt?: string;
  fallbackSrc?: string;
  name?: string;
  size?: AvatarSize;
  src?: string;
};
export type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement>;
export type AvatarFallbackProps = React.HTMLAttributes<HTMLSpanElement> & {
  delayMs?: number;
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, children, alt, fallbackSrc, name, size, src, ...props }, ref) => {
    const [imageStatus, setImageStatus] =
      React.useState<AvatarContextValue["imageStatus"]>("idle");

    if (children === undefined && (src || name)) {
      return (
        <AstryxAvatar
          ref={ref}
          alt={alt}
          fallbackSrc={fallbackSrc}
          name={name}
          size={size as never}
          src={src}
          className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className
          )}
          {...props}
        />
      );
    }

    return (
      <AvatarContext.Provider value={{ imageStatus, setImageStatus }}>
        <div
          ref={ref}
          className={cn(
            "astryx-avatar relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </AvatarContext.Provider>
    );
  }
);
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, onError, onLoad, hidden, ...props }, ref) => {
    const context = React.useContext(AvatarContext);
    const isLoaded = context?.imageStatus === "loaded";

    return (
      <img
        ref={ref}
        className={cn("aspect-square h-full w-full", className)}
        hidden={hidden ?? !isLoaded}
        onError={(event) => {
          context?.setImageStatus("error");
          onError?.(event);
        }}
        onLoad={(event) => {
          context?.setImageStatus("loaded");
          onLoad?.(event);
        }}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className, delayMs: _delayMs, ...props }, ref) => {
    const context = React.useContext(AvatarContext);

    if (context?.imageStatus === "loaded") {
      return null;
    }

    return (
      <span
        ref={ref}
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full bg-muted",
          className
        )}
        {...props}
      />
    );
  }
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
