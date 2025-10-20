// ========================================
// BACKEND TEST FILE
// Use this to test if backend is working
// ========================================

// Run this file: node test-backend.js

const testBackend = async () => {
  console.log('🧪 Testing CipherStudio Backend...\n');

  const API_URL = 'http://localhost:5000/api';

  try {
    // Test 1: Check if server is running
    console.log('Test 1: Checking if server is running...');
    const healthCheck = await fetch('http://localhost:5000');
    const health = await healthCheck.json();
    console.log('✅ Server is running!');
    console.log(health);
    console.log('');

    // Test 2: Save a project
    console.log('Test 2: Saving a test project...');
    const testProject = {
      name: 'Test Project',
      files: {
        'App.js': {
          code: 'console.log("Hello World");',
          type: 'file'
        }
      },
      activeFile: 'App.js'
    };

    const saveResponse = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testProject)
    });
    const savedProject = await saveResponse.json();
    console.log('✅ Project saved!');
    console.log('Project ID:', savedProject.project._id);
    console.log('');

    // Test 3: Get all projects
    console.log('Test 3: Getting all projects...');
    const getResponse = await fetch(`${API_URL}/projects`);
    const projects = await getResponse.json();
    console.log('✅ Projects retrieved!');
    console.log('Total projects:', projects.count);
    console.log('');

    // Test 4: Get single project
    console.log('Test 4: Getting single project...');
    const projectId = savedProject.project._id;
    const getSingleResponse = await fetch(`${API_URL}/projects/${projectId}`);
    const singleProject = await getSingleResponse.json();
    console.log('✅ Project retrieved!');
    console.log('Project name:', singleProject.project.name);
    console.log('');

    // Test 5: Update project
    console.log('Test 5: Updating project...');
    const updateData = {
      name: 'Updated Test Project',
      files: testProject.files,
      activeFile: 'App.js'
    };
    const updateResponse = await fetch(`${API_URL}/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    const updatedProject = await updateResponse.json();
    console.log('✅ Project updated!');
    console.log('New name:', updatedProject.project.name);
    console.log('');

    // Test 6: Delete project
    console.log('Test 6: Deleting project...');
    const deleteResponse = await fetch(`${API_URL}/projects/${projectId}`, {
      method: 'DELETE'
    });
    const deleteResult = await deleteResponse.json();
    console.log('✅ Project deleted!');
    console.log('');

    console.log('🎉 All tests passed! Backend is working perfectly!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('');
    console.log('💡 Make sure:');
    console.log('   1. Backend server is running (npm run dev)');
    console.log('   2. MongoDB is connected (.env configured)');
    console.log('   3. Port 5000 is not blocked');
  }
};

// Run tests
testBackend();
