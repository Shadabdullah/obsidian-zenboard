export interface ThemeClasses {
  overlay: string;
  bg: string;
  inputBg: string;
  text: string;
  textSecondary: string;
  buttonBg: string;
  buttonText: string;
  activeBg: string;
  activeText: string;
  border: string;
  dropdownBg: string;
}

export const getThemeClasses = (isDarkTheme: boolean): ThemeClasses => ({
  overlay: "bg-black bg-opacity-50",
  bg: isDarkTheme ? "bg-gray-900" : "bg-white",
  inputBg: isDarkTheme
    ? "bg-gray-800 border-gray-700"
    : "bg-gray-50 border-gray-200",
  text: isDarkTheme ? "text-white" : "text-gray-900",
  textSecondary: isDarkTheme ? "text-gray-400" : "text-gray-600",
  buttonBg: isDarkTheme
    ? "bg-gray-800 hover:bg-gray-700"
    : "bg-gray-100 hover:bg-gray-200",
  buttonText: isDarkTheme
    ? "text-gray-400 hover:text-gray-200"
    : "text-gray-600 hover:text-gray-800",
  activeBg: "bg-blue-500",
  activeText: "text-white",
  border: isDarkTheme ? "border-gray-700" : "border-gray-200",
  dropdownBg: isDarkTheme
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200",
});
