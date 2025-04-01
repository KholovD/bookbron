# Contributing Guide

## Development Setup

1. **Clone repository**
```bash
git clone https://github.com/your-org/internetcafe.git
cd internetcafe
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Start development server**
```bash
pnpm dev
```

## Code Style

- Use TypeScript for all new files
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages

### Component Structure

```typescript
// components/MyComponent/index.tsx
import React from 'react';
import { styled } from '@mui/material/styles';

interface Props {
  title: string;
  onAction: () => void;
}

const Container = styled('div')`
  // styles
`;

export const MyComponent: React.FC<Props> = ({ title, onAction }) => {
  return (
    <Container>
      <h1>{title}</h1>
      <button onClick={onAction}>Click me</button>
    </Container>
  );
};
```

## Testing

- Write tests for all new features
- Maintain 80% code coverage
- Use React Testing Library for component tests
- Use MSW for API mocking

## Git Workflow

1. Create feature branch
```bash
git checkout -b feature/my-feature
```

2. Make changes and commit
```bash
git add .
git commit -m "feat: add new feature"
```

3. Push changes
```bash
git push origin feature/my-feature
```

4. Create pull request

## Pull Request Process

1. Update documentation
2. Add/update tests
3. Ensure CI passes
4. Request review
5. Address feedback

## Release Process

1. Update version
```bash
pnpm version patch|minor|major
```

2. Generate changelog
```bash
pnpm changelog
```

3. Create release PR

4. After merge, create GitHub release 