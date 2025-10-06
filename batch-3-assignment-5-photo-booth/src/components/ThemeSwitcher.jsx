import React, { useEffect, useState } from "react";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { useTheme } from "../contexts/ThemeContext";
import Button from "../components/ui/Button";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [enabled, setEnabled] = useState(theme === "dark");

  useEffect(() => {
    setEnabled(theme === "dark");
  }, [theme]);

  const handleChange = () => {
    const newTheme = enabled ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <div className={" flex justify-start gap-5 "}>
      <Button
        onClick={handleChange}
        className="flex items-center gap-1.5 font-normal text-black dark:text-slate-300"
      >
        {theme === "dark" ? <IoSunnyOutline /> : <IoMoonOutline />}
      </Button>
    </div>
  );
};

export default ThemeSwitcher;
