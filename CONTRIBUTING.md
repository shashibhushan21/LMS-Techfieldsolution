# Contributing to TechFieldSolution LMS

Thank you for considering contributing to our LMS platform! This document provides guidelines for contributing.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach

### Pull Requests

1. **Fork the repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Write clear commit messages
   - Add tests for new features
   - Update documentation as needed

4. **Test your changes**
   ```bash
   npm test
   ```

5. **Commit your changes**
   ```bash
   git commit -m "Add: Clear description of changes"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear description
   - Reference related issues
   - Include screenshots for UI changes

## Code Style Guidelines

### JavaScript/Node.js

- Use ES6+ features
- Follow Airbnb style guide
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### React/Next.js

- Use functional components with hooks
- Follow component naming conventions
- Extract reusable components
- Use proper prop types
- Implement error boundaries

### CSS/Tailwind

- Use Tailwind utility classes
- Follow mobile-first approach
- Maintain consistent spacing
- Use semantic class names

## Commit Message Guidelines

Format: `Type: Description`

Types:
- `Add:` New feature or file
- `Fix:` Bug fix
- `Update:` Modify existing feature
- `Refactor:` Code restructuring
- `Docs:` Documentation changes
- `Style:` Code formatting
- `Test:` Add or update tests
- `Chore:` Maintenance tasks

Examples:
```
Add: User profile edit functionality
Fix: Assignment submission file upload error
Update: Dashboard loading performance
Docs: API endpoint documentation
```

## Development Setup

See [SETUP.md](./SETUP.md) for detailed setup instructions.

## Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Maintain test coverage above 80%

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Documentation

- Update README.md if needed
- Document new API endpoints in API_DOCS.md
- Add inline comments for complex logic
- Update setup instructions if dependencies change

## Code Review Process

1. PR is submitted
2. Automated tests run
3. Code review by maintainers
4. Changes requested if needed
5. Approval and merge

## Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow code of conduct

## Questions?

Feel free to:
- Open an issue for discussion
- Join our community chat
- Email: dev@techfieldsolution.com

Thank you for contributing! 🎉
