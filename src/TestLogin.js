import React, { useState } from 'react';
import axios from 'axios';

const TestLogin = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const testLogin = async (credentials, testName) => {
    try {
      console.log(`🧪 Testing ${testName}:`, credentials);
      
      const response = await axios.post('/api/auth/login', credentials);
      
      console.log(`✅ ${testName} SUCCESS:`, response.data);
      
      return {
        name: testName,
        status: 'SUCCESS',
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error(`❌ ${testName} FAILED:`, error);
      console.error('Error response:', error.response?.data);
      
      return {
        name: testName,
        status: 'FAILED',
        data: null,
        error: error.response?.data || error.message
      };
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setResults([]);
    
    const tests = [
      {
        name: 'Admin Login',
        credentials: {
          firstName: 'Admin',
          lastName: 'Boshqaruvchi',
          password: 'Admin123!@#',
          role: 'admin'
        }
      },
      {
        name: 'Student Login',
        credentials: {
          firstName: 'Ali',
          lastName: 'Valiyev',
          password: 'Password123!',
          role: 'student'
        }
      },
      {
        name: 'Teacher Login',
        credentials: {
          firstName: 'Malika',
          lastName: 'Tosheva',
          password: 'Password123!',
          role: 'teacher'
        }
      }
    ];

    const testResults = [];
    
    for (const test of tests) {
      const result = await testLogin(test.credentials, test.name);
      testResults.push(result);
    }
    
    setResults(testResults);
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 Login Test Component</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runAllTests} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          {loading ? 'Testing...' : 'Run All Login Tests'}
        </button>
      </div>

      <div>
        <h2>Test Results:</h2>
        {results.map((result, index) => (
          <div 
            key={index} 
            style={{ 
              margin: '10px 0', 
              padding: '15px', 
              border: '1px solid #ccc',
              borderRadius: '5px',
              backgroundColor: result.status === 'SUCCESS' ? '#d4edda' : '#f8d7da'
            }}
          >
            <h3 style={{ 
              color: result.status === 'SUCCESS' ? '#155724' : '#721c24',
              margin: '0 0 10px 0'
            }}>
              {result.status === 'SUCCESS' ? '✅' : '❌'} {result.name}
            </h3>
            
            {result.status === 'SUCCESS' ? (
              <div>
                <p><strong>User:</strong> {result.data.data.user.firstName} {result.data.data.user.lastName}</p>
                <p><strong>Role:</strong> {result.data.data.user.role}</p>
                {result.data.data.user.studentId && <p><strong>Student ID:</strong> {result.data.data.user.studentId}</p>}
                {result.data.data.user.teacherId && <p><strong>Teacher ID:</strong> {result.data.data.user.teacherId}</p>}
                {result.data.data.user.subject && <p><strong>Subject:</strong> {result.data.data.user.subject}</p>}
              </div>
            ) : (
              <div>
                <p style={{ color: '#721c24' }}><strong>Error:</strong> {JSON.stringify(result.error, null, 2)}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h3>Debug Info:</h3>
        <p><strong>Axios Base URL:</strong> {axios.defaults.baseURL}</p>
        <p><strong>Current URL:</strong> {window.location.href}</p>
        <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
        <p><strong>API URL:</strong> {process.env.REACT_APP_API_URL}</p>
      </div>
    </div>
  );
};

export default TestLogin;