export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with an error (non-2xx)
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return data?.message || 'Bad Request: Please check your input.';
      case 401:
        return 'Unauthorized: Please login again.';
      case 403:
        return 'Forbidden: You do not have permission.';
      case 404:
        return data?.message || 'Resource not found.';
      case 500:
        return 'Internal Server Error: Please try again later.';
      default:
        return data?.message || 'An unexpected error occurred.';
    }
  } else if (error.request) {
    // Request was made but no response received
    return 'Network Error: Cannot reach the server. Please check your connection.';
  } else {
    // Errors related to setting up the request
    return error.message || 'Something went wrong while preparing the request.';
  }
};
