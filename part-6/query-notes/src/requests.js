const baseUrl = 'http://localhost:3001/notes';

export const getNotes = async () => {
      const response = await fetch(baseUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    };

    