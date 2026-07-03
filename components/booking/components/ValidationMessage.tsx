import React from "react";

interface ValidationMessageProps {
  message?: string;
}

export function ValidationMessage({ message }: ValidationMessageProps) {
  if (!message) return null;
  return <p className="text-rose-500 text-sm mt-2">{message}</p>;
}
