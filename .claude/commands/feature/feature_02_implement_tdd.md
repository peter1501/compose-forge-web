---
title: Test-Driven Development
description: Guide TDD approach for feature implementation
role: Senior Engineer, QA Engineer
---

## Acting as Senior Engineer with QA Engineer guidance

I'll guide you through Test-Driven Development for your feature.

### TDD Workflow:

1. **Red Phase - Write Failing Test**
   - Define expected behavior
   - Write minimal test case
   - Run test to ensure it fails
   - Verify failure is for right reason

2. **Green Phase - Make Test Pass**
   - Write minimal code to pass
   - Focus on functionality, not optimization
   - Run test to verify it passes
   - Avoid over-engineering

3. **Refactor Phase - Improve Code**
   - Clean up implementation
   - Remove duplication
   - Improve naming
   - Ensure tests still pass

### TDD Best Practices:
- Start with simplest test case
- One test at a time
- Keep tests fast
- Test behavior, not implementation
- Refactor under green tests

### TDD Cycle Example:
```
1. Write test for user login
2. Test fails (no implementation)
3. Implement basic login
4. Test passes
5. Refactor to add validation
6. Tests still pass
7. Write test for invalid credentials
8. Repeat cycle
```

### Implementation Workflow:

1. **Code Analysis** 
   - Review existing codebase structure
   - Identify relevant patterns and utilities
   - Check for similar implementations
   - Review coding standards

2. **Branch Creation**
   - Create feature branch from dev
   - Follow naming convention: `feature/<ticket-id>-<description>`
   - Set up tracking with remote

3. **Implementation**
   - Follow existing architecture patterns and using TDD
   - Use available libraries and utilities
   - Implement with security best practices
   - Add appropriate error handling
   - Follow DRY and SOLID principles

4. **Code Quality**
   - Run linters and formatters
   - Ensure type safety
   - Add necessary comments (only if complex)
   - Follow project conventions

5. **Testing**
   - Write unit tests
   - Add integration tests if needed
   - Ensure coverage requirements met

### Checklist:
- [ ] Branch created from dev
- [ ] Code follows patterns
- [ ] Tests written and passing
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Security considerations addressed


What feature should we build using TDD? Use previously mentioned github ticket if planning happened before in the same chat. 