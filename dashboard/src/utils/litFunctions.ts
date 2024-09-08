import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Adjust this to your server's URL

export async function encrypt(message: string): Promise<void> {
  try {
    const response = await axios.post(`${API_BASE_URL}/encrypt`, { message });
    const { ciphertext, dataToEncryptHash } = response.data;
    console.log(ciphertext, dataToEncryptHash);
    // Save to localStorage
    localStorage.setItem('litEncryption', JSON.stringify({ ciphertext, dataToEncryptHash }));
    console.log('Encryption data saved to localStorage');
  } catch (error) {
    console.error('Error encrypting message:', error);
    throw error;
  }
}

export async function decrypt(): Promise<string> {
  try {
    // Retrieve from localStorage
    const storedData = localStorage.getItem('litEncryption');
    if (!storedData) {
      throw new Error('No encryption data found in localStorage');
    }

    const { ciphertext, dataToEncryptHash } = JSON.parse(storedData);

    const response = await axios.post(`${API_BASE_URL}/decrypt`, { ciphertext, dataToEncryptHash });
    const { decryptedData } = response.data;

    return decryptedData;
  } catch (error) {
    console.error('Error decrypting message:', error);
    throw error;
  }
}
