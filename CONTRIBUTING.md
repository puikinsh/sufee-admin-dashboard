# Contributing to Sufee Admin Dashboard

Thank you for your interest in contributing to Sufee Admin Dashboard! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Issues

1. **Check existing issues** to avoid duplicates
2. **Use issue templates** when available
3. **Provide detailed information**:
   - Browser and version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Suggesting Features

1. **Open a discussion** first for major features
2. **Provide use cases** and examples
3. **Consider Bootstrap 5 compatibility**

### Code Contributions

#### Setup Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/sufee-admin-dashboard.git
   cd sufee-admin-dashboard
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

#### Development Guidelines

##### Code Style
- Use 2 spaces for indentation
- Follow existing code patterns
- Keep lines under 120 characters
- Use meaningful variable names

##### HTML
- Use semantic HTML5 elements
- Follow Bootstrap 5 conventions
- Include proper ARIA labels for accessibility
- Use data attributes for JavaScript hooks

##### CSS/SCSS
- Follow BEM naming convention where applicable
- Use SCSS variables for colors and spacing
- Avoid !important unless necessary
- Mobile-first approach for responsive design

##### JavaScript
- Use ES6+ features
- Use vanilla JavaScript only - jQuery has been completely removed
- Add JSDoc comments for functions
- Handle errors appropriately

#### Commit Guidelines

- Use clear, descriptive commit messages
- Reference issue numbers when applicable
- Keep commits focused and atomic

Examples:
```
feat: add dark mode toggle to header
fix: resolve sidebar animation jump on collapse
docs: update README with new installation steps
style: format code according to guidelines
```

#### Pull Request Process

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Write/update code
   - Add/update tests if applicable
   - Update documentation

3. **Test your changes**:
   - Run development server
   - Test in multiple browsers
   - Check responsive behavior
   - Ensure no console errors

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Submit pull request**:
   - Provide clear description
   - Reference related issues
   - Include screenshots for UI changes
   - List breaking changes if any

### Documentation

- Update README.md for new features
- Add JSDoc comments for new functions
- Update CHANGELOG.md following Keep a Changelog format
- Include code examples where helpful

## Project Structure

```
src/
├── partials/       # Reusable HTML components
├── scripts/        # JavaScript modules
│   ├── components/ # UI components
│   └── utils/      # Utility functions
├── styles/         # SCSS files
│   └── components/ # Component styles
└── *.html          # Page templates
```

## Testing

While automated tests are not yet configured, please:
- Manually test all changes
- Check browser console for errors
- Verify responsive behavior
- Test with keyboard navigation

## Questions?

- Check existing documentation
- Look at similar components for patterns
- Open a discussion for clarification

Thank you for contributing to Sufee Admin Dashboard!