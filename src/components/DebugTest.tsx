import React, { useEffect, useState } from 'react';
import api from "../services/api";
import { ENDPOINTS } from "../services/api";

export const DebugTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing...');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('Making API request...');
        
        // Use the correct endpoint from ENDPOINTS
        const result = await api.get(ENDPOINTS.POLLS.LIST);
        
        console.log('API response status:', result.status);
        console.log('Full URL called:', result.config.url);
        
        setStatus('✅ Success with api.get!');
        setResponse(result.data);
        console.log('API Response:', result.data);
        
      } catch (error: any) {
        setStatus('❌ API Error');
        setError(error.message || 'An error occurred');
        console.error('API Error Details:', error);
        
        // Log more details about the error
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
          console.error('Error request:', error.request);
        }
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Debug Test - API Get</h2>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>API URL:</strong> https://online-poll-backend-ehm8.onrender.com/api/polls/</p>
      
      {error && (
        <div style={{ color: 'red' }}>
          <p><strong>Error:</strong> {error}</p>
          <p>Check the browser console for detailed error information.</p>
        </div>
      )}
      
      {response && (
        <div>
          <p><strong>Poll Count:</strong> {response.count}</p>
          <p><strong>First Poll Title:</strong> {response.results[0]?.title}</p>
          <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
            <h3>Poll Details:</h3>
            <p><strong>Title:</strong> {response.results[0]?.title}</p>
            <p><strong>Description:</strong> {response.results[0]?.description}</p>
            <p><strong>Created by:</strong> {response.results[0]?.created_by}</p>
            <p><strong>Total Votes:</strong> {response.results[0]?.total_votes}</p>
            <h4>Options:</h4>
            <ul>
              {response.results[0]?.options?.map((option: any) => (
                <li key={option.id}>
                  {option.text}: {option.vote_count} votes
                </li>
              ))}
            </ul>
          </div>
          <details style={{ marginTop: '20px' }}>
            <summary>Raw JSON Response</summary>
            <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
              {JSON.stringify(response, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};