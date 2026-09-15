import { useState } from "react";

export function useToggle() {
  const [isActive, setIsActive] = useState<boolean>(false);

  const toggle = () => setIsActive(() => !isActive)


  return [isActive, toggle] as const
}