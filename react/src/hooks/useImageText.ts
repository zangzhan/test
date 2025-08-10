import { useState } from "react";

export type ImageStyle = "realistic" | "cartoon" | "sketch" | "anime";

interface UseImageTextResult {
  prompt: string;
  setPrompt: (val: string) => void;
  style: ImageStyle;
  setStyle: (val: ImageStyle) => void;
  imageUrl?: string;
  loading: boolean;
  error?: string;
  submit: () => void;
  reset: () => void;
}

export default function useImageText(): UseImageTextResult {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<ImageStyle>("realistic");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const submit = () => {
    setLoading(true);
    setError(undefined);
    setImageUrl(undefined);
    setTimeout(() => {
      if (Math.random() < 0.8) {
        setImageUrl("https://placehold.co/512x320/png?text=AI+Image");
        setLoading(false);
      } else {
        setError("图片生成失败，请重试。");
        setLoading(false);
      }
    }, 1800);
  };

  const reset = () => {
    setPrompt("");
    setImageUrl(undefined);
    setError(undefined);
    setLoading(false);
    setStyle("realistic");
  };

  return {
    prompt,
    setPrompt,
    style,
    setStyle,
    imageUrl,
    loading,
    error,
    submit,
    reset,
  };
} 