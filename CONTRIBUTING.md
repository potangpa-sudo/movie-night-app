# Contributing to Movie Night App

Thank you for your interest in contributing to Movie Night App! We welcome contributions from everyone.

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git
- TMDB API Key

### Setup Development Environment
1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/movie-night-app.git`
3. Set up the development environment following the README instructions
4. Create a new branch: `git checkout -b feature/your-feature-name`

## 📋 Development Guidelines

### Code Style
- **Python**: Follow PEP 8 guidelines
- **JavaScript/React**: Use ESLint configuration provided
- **CSS**: Use consistent naming conventions (kebab-case for classes)

### Commit Messages
Use clear, descriptive commit messages:
- `feat: add movie trailer integration`
- `fix: resolve cast image loading issue`
- `docs: update deployment instructions`
- `test: add unit tests for API endpoints`

### Pull Request Process
1. Ensure all tests pass: `npm test` and `python -m pytest`
2. Update documentation if needed
3. Add tests for new features
4. Submit PR with clear description of changes

## 🧪 Testing

### Backend Tests
```bash
source venv/bin/activate
python -m pytest test_app.py -v --cov
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:coverage
```

## 🎯 Areas for Contribution

### 🌟 High Priority
- [ ] User registration and profile management
- [ ] Movie watchlist persistence (database integration)
- [ ] Movie ratings and user reviews
- [ ] Social features (sharing, following)

### 🔧 Enhancements
- [ ] Advanced movie filtering (genre, year, rating)
- [ ] Movie recommendation algorithm
- [ ] Offline support with service workers
- [ ] Performance optimizations

### 🐛 Bug Reports
- Use GitHub Issues with clear reproduction steps
- Include browser/OS information
- Provide error logs when possible

### 📚 Documentation
- Improve setup instructions
- Add code comments
- Create video tutorials
- Translate documentation

## 🔒 Security

Please report security vulnerabilities privately to [security@yourapp.com] rather than using public issues.

## 📞 Getting Help

- 💬 **Discussions**: Use GitHub Discussions for questions
- 🐛 **Issues**: Use GitHub Issues for bugs
- 📧 **Email**: Contact maintainers directly for sensitive topics

## 🎉 Recognition

Contributors will be:
- Listed in the README
- Acknowledged in release notes
- Invited to join the core team (for significant contributions)

Thank you for making Movie Night App better! 🎬
