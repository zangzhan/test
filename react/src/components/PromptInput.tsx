import React from "react";
import TextInput from "./TextInput";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
  maxLength?: number;
}

const DEFAULT_MAX_LENGTH = 500;

const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "请输入提示词...",
  className = "",
  maxLength = DEFAULT_MAX_LENGTH,
}) => {
  const [touched, setTouched] = React.useState(false);
  const length = value.length;
  const isEmpty = length === 0;
  const isTooLong = length > maxLength;
  const isInvalid = isEmpty || isTooLong;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSubmit && !isInvalid) {
      onSubmit();
    }
  };

  const handleChange = (val: string) => {
    if (!touched) setTouched(true);
    onChange(val);
  };

  return (
    <form
      className={`flex flex-col gap-1 w-full ${className}`}
      onSubmit={e => {
        e.preventDefault();
        if (!isInvalid && onSubmit) onSubmit();
        setTouched(true);
      }}
    >
      <TextInput
        value={value}
        onChange={e => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1"
        maxLength={maxLength}
      />
      <div className="flex justify-between items-center mt-1 text-xs">
        <span className={isTooLong ? "text-red-500" : "text-gray-400"}>
          {length}/{maxLength}
        </span>
        {touched && isEmpty && <span className="text-red-500">提示词不能为空</span>}
        {isTooLong && <span className="text-red-500">超出最大字数限制</span>}
      </div>
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        disabled={isInvalid}
      >
        生成
      </button>
    </form>
  );
};

export default PromptInput; 