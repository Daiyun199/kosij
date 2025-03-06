export const getAuthToken = (): string | null => {
    let token = localStorage.getItem("authToken");
  
    if (!token) {
      const cookies = document.cookie.split("; ");
      const tokenCookie = cookies.find((row) => row.startsWith("authToken="));
      token = tokenCookie ? tokenCookie.split("=")[1] : null;
    }
  
    return token;
  };
  