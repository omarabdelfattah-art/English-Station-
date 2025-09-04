/**
 * Validation Utility Tests
 *
 * Comprehensive test suite for the validation utility functions
 * Tests security features, input validation, and data sanitization
 */

import {
  validateEmail,
  validatePassword,
  sanitizeText,
  validateName,
  validateText,
  validateNumber,
  validateUrl,
  escapeSql,
  rateLimit,
  validateForm
} from './validation';

describe('Email Validation', () => {
  test('should validate correct email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.email+tag@example.co.uk')).toBe(true);
    expect(validateEmail('user123@example-domain.com')).toBe(true);
  });

  test('should reject invalid email addresses', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('notanemail')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('user..double@example.com')).toBe(false);
  });

  test('should reject emails longer than 254 characters', () => {
    const longEmail = 'a'.repeat(250) + '@example.com';
    expect(validateEmail(longEmail)).toBe(false);
  });
});

describe('Password Validation', () => {
  test('should validate strong passwords', () => {
    const result = validatePassword('StrongPass123!');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should reject weak passwords', () => {
    expect(validatePassword('short')).toEqual({
      isValid: false,
      errors: expect.arrayContaining(['Password must be at least 8 characters long'])
    });

    expect(validatePassword('nouppercase123!')).toEqual({
      isValid: false,
      errors: expect.arrayContaining(['Password must contain at least one uppercase letter'])
    });

    expect(validatePassword('NOLOWERCASE123!')).toEqual({
      isValid: false,
      errors: expect.arrayContaining(['Password must contain at least one lowercase letter'])
    });

    expect(validatePassword('NoNumbers!')).toEqual({
      isValid: false,
      errors: expect.arrayContaining(['Password must contain at least one number'])
    });

    expect(validatePassword('NoSpecial123')).toEqual({
      isValid: false,
      errors: expect.arrayContaining(['Password must contain at least one special character (!@#$%^&*)'])
    });
  });

  test('should reject passwords longer than 128 characters', () => {
    const longPassword = 'A'.repeat(129) + '1!';
    const result = validatePassword(longPassword);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be no more than 128 characters long');
  });
});

describe('Text Sanitization', () => {
  test('should sanitize HTML content', () => {
    const maliciousInput = '<script>alert("xss")</script><p>Hello World</p>';
    const sanitized = sanitizeText(maliciousInput);
    expect(sanitized).toBe('alert("xss")Hello World');
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('<p>');
  });

  test('should handle empty/null inputs', () => {
    expect(sanitizeText('')).toBe('');
    expect(sanitizeText(null)).toBe('');
    expect(sanitizeText(undefined)).toBe('');
  });

  test('should trim whitespace', () => {
    expect(sanitizeText('  hello world  ')).toBe('hello world');
  });
});

describe('Name Validation', () => {
  test('should validate valid names', () => {
    const result = validateName('John Doe');
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe('John Doe');
    expect(result.error).toBeNull();
  });

  test('should reject invalid names', () => {
    expect(validateName('')).toEqual({
      isValid: false,
      sanitized: '',
      error: 'Name is required'
    });

    expect(validateName('A')).toEqual({
      isValid: false,
      sanitized: 'A',
      error: 'Name must be at least 2 characters long'
    });

    expect(validateName('Name with numbers 123')).toEqual({
      isValid: false,
      sanitized: 'Name with numbers 123',
      error: 'Name can only contain letters, spaces, hyphens, and apostrophes'
    });
  });

  test('should handle names with allowed special characters', () => {
    const result = validateName("O'Connor-Smith");
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe("O'Connor-Smith");
  });
});

describe('Generic Text Validation', () => {
  test('should validate text within length limits', () => {
    const result = validateText('Hello World', { minLength: 5, maxLength: 20 });
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe('Hello World');
    expect(result.error).toBeNull();
  });

  test('should reject text outside length limits', () => {
    expect(validateText('Hi', { minLength: 5 })).toEqual({
      isValid: false,
      sanitized: 'Hi',
      error: 'Text must be at least 5 characters long'
    });

    expect(validateText('This is a very long text that exceeds the maximum length', { maxLength: 20 })).toEqual({
      isValid: false,
      sanitized: 'This is a very long text that exceeds the maximum length',
      error: 'Text must be no more than 20 characters long'
    });
  });

  test('should allow empty text when specified', () => {
    const result = validateText('', { allowEmpty: true });
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe('');
  });
});

describe('Number Validation', () => {
  test('should validate valid numbers', () => {
    expect(validateNumber(42)).toEqual({
      isValid: true,
      sanitized: 42,
      error: null
    });

    expect(validateNumber('123')).toEqual({
      isValid: true,
      sanitized: 123,
      error: null
    });

    expect(validateNumber(3.14, { allowDecimal: true })).toEqual({
      isValid: true,
      sanitized: 3.14,
      error: null
    });
  });

  test('should reject invalid numbers', () => {
    expect(validateNumber('')).toEqual({
      isValid: false,
      sanitized: null,
      error: 'Number is required'
    });

    expect(validateNumber('notanumber')).toEqual({
      isValid: false,
      sanitized: null,
      error: 'Invalid number format'
    });
  });

  test('should enforce number constraints', () => {
    expect(validateNumber(-5, { allowNegative: false })).toEqual({
      isValid: false,
      sanitized: null,
      error: 'Negative numbers are not allowed'
    });

    expect(validateNumber(0, { allowZero: false })).toEqual({
      isValid: false,
      sanitized: null,
      error: 'Zero is not allowed'
    });

    expect(validateNumber(150, { max: 100 })).toEqual({
      isValid: false,
      sanitized: null,
      error: 'Number must be no more than 100'
    });
  });
});

describe('URL Validation', () => {
  test('should validate valid URLs', () => {
    expect(validateUrl('https://example.com')).toBe(true);
    expect(validateUrl('http://localhost:3000')).toBe(true);
  });

  test('should reject invalid URLs', () => {
    expect(validateUrl('')).toBe(false);
    expect(validateUrl('not-a-url')).toBe(false);
    expect(validateUrl('ftp://example.com')).toBe(false);
  });
});

describe('SQL Injection Prevention', () => {
  test('should escape SQL injection characters', () => {
    expect(escapeSql("' OR '1'='1")).toBe("\\' OR \\'1\\'=\\'1");
    expect(escapeSql('" OR ""="')).toBe('\\" OR \\"\\"=\\"');
    expect(escapeSql('; DROP TABLE users;')).toBe('\\; DROP TABLE users\\;');
  });

  test('should handle empty input', () => {
    expect(escapeSql('')).toBe('');
    expect(escapeSql(null)).toBe('');
  });
});

describe('Rate Limiting', () => {
  test('should allow function calls within rate limit', () => {
    const mockFn = jest.fn();
    const rateLimitedFn = rateLimit(mockFn, 100);

    rateLimitedFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
  });

  test('should block rapid successive calls', () => {
    const mockFn = jest.fn();
    const rateLimitedFn = rateLimit(mockFn, 1000); // 1 second delay

    rateLimitedFn('first');
    expect(() => rateLimitedFn('second')).toThrow('Too many requests. Please wait before trying again.');
  });
});

describe('Form Validation', () => {
  test('should validate complete forms successfully', () => {
    const formData = {
      email: 'user@example.com',
      password: 'StrongPass123!',
      name: 'John Doe'
    };

    const rules = {
      email: { type: 'email' },
      password: { type: 'password' },
      name: { type: 'name' }
    };

    const result = validateForm(formData, rules);
    expect(result.isFormValid).toBe(true);
    expect(result.fieldResults.email.isValid).toBe(true);
    expect(result.fieldResults.password.isValid).toBe(true);
    expect(result.fieldResults.name.isValid).toBe(true);
  });

  test('should identify form validation errors', () => {
    const formData = {
      email: 'invalid-email',
      password: 'weak',
      name: ''
    };

    const rules = {
      email: { type: 'email' },
      password: { type: 'password' },
      name: { type: 'name' }
    };

    const result = validateForm(formData, rules);
    expect(result.isFormValid).toBe(false);
    expect(result.fieldResults.email.isValid).toBe(false);
    expect(result.fieldResults.password.isValid).toBe(false);
    expect(result.fieldResults.name.isValid).toBe(false);
  });
});