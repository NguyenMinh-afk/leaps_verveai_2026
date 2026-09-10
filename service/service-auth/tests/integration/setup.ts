// Integration test setup
// This file is executed before running integration tests

// Set test environment variables
process.env['NODE_ENV'] = 'test';
process.env['DATABASE_URL'] = 'postgresql://postgres:password@localhost:5432/verveai_auth_test?schema=auth';
process.env['JWT_SECRET'] = 'test-secret-min-32-chars!!';
process.env['CONSUL_HOST'] = 'localhost';
process.env['CONSUL_PORT'] = '8500';
