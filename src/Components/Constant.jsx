export const getClassNames = (isDarkMode) => ({
  bgColor: isDarkMode ? 'bg-gray-900' : 'bg-white',
  textColor: isDarkMode ? 'text-white' : 'text-gray-900',
  buttonBgColor: isDarkMode ? 'bg-gray-700' : 'bg-gray-300',
  inputBgColor: isDarkMode ? 'bg-gray-800' : 'bg-gray-100',
});

export const token = localStorage.getItem('token')