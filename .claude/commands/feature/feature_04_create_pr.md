---
title: Comprehensive Pull Request Workflow
description: Complete workflow for creating PRs, conducting reviews, and addressing feedback
role: Senior Engineer, Tech Lead, Security Specialist
---

## Acting as Senior Engineer, Tech Lead, and Security Specialist

I'll execute the complete pull request workflow from creation through review to feedback resolution.

### IMPORTANT ###
ALWAYS base PRs off dev and merge back into dev. main is for release only!!!

## Phase 1: PR Creation (Senior Engineer with Tech Lead review)

### Pre-PR Checklist
- All tests passing
- Linting/formatting complete
- Type checking passes
- Coverage requirements met
- Branch up-to-date with dev

### PR Preparation
- Review all changes
- Group related commits
- Clean commit history
- Remove debug code
- Verify no secrets exposed

### PR Documentation (Tech Lead standards)
- Clear, descriptive title
- Comprehensive description
- Link to related issues
- Screenshots if UI changes
- Breaking changes noted

### PR Content Structure
```markdown
## Summary
- Brief description of changes
- Why these changes were made
- Impact on system

## Changes
- List of specific changes
- Technical approach taken
- Any alternatives considered

## Testing
- Tests added/modified
- Manual testing performed
- Edge cases considered

## Checklist
- [ ] Tests passing
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Security reviewed
```

### Post-PR Actions
- Assign reviewers
- Add labels
- Link to project board
- Notify team

## Phase 2: PR Review Process

### Initial Assessment (Tech Lead)
- PR scope appropriate
- Related to approved work
- Branch naming correct
- Target branch appropriate (ALWAYS target `dev` unless explicitely requested to target another branch)
- Conflicts resolved

### Code Review (Senior Engineer)
- Logic correctness
- Code quality and style
- Performance implications
- Test coverage adequate
- Error handling proper
- No code duplication

### Security Review (Security Specialist)
- Input validation present
- Authentication checks
- Authorization verified
- No hardcoded secrets
- SQL injection prevention
- XSS protection
- Dependency vulnerabilities

### Architecture Review (Tech Lead)
- Follows patterns
- Scalability considered
- Maintainability good
- Documentation complete
- Breaking changes handled

### Testing Verification (Senior Engineer)
- Tests comprehensive
- Edge cases covered
- Integration tests present
- Performance acceptable
- No flaky tests

### Review Comments Format
- **[MUST FIX]**: Critical issues
- **[SHOULD FIX]**: Important improvements
- **[CONSIDER]**: Suggestions
- **[QUESTION]**: Clarifications needed
- **[PRAISE]**: Good practices noted

## Phase 3: Feedback Resolution (Senior Engineer)

### Fetch PR Comments
- Use `gh` CLI to get all comments
- Categorize by priority
- Group related feedback
- Identify blockers

### Prioritization
- **Critical**: Security/breaking issues
- **High**: Logic errors, bugs
- **Medium**: Code quality, performance
- **Low**: Style, suggestions

### Implementation Strategy
- Address blockers first
- Group similar changes
- Maintain commit atomicity
- Test after each change

### Response Protocol
- Acknowledge each comment
- Explain implementation approach
- Provide rationale for disagreements
- Mark resolved when complete

### Validation
- Re-run all tests
- Verify fixes don't break other code
- Update documentation if needed
- Request re-review

### Comment Response Templates
- **Fixed**: "Fixed in commit [hash]. [brief explanation]"
- **Clarification**: "Could you clarify [specific aspect]? I understood it as [interpretation]."
- **Alternative**: "I implemented [alternative] because [reason]. Happy to discuss."
- **Won't Fix**: "I believe the current approach is better because [reason]. Open to discuss."

## Execution Options

1. **Create PR**: Prepare and submit new pull request
2. **Review PR**: Comprehensive review of existing PR
3. **Fix Feedback**: Address review comments and feedback
4. **Full Workflow**: Execute all phases for complete PR lifecycle

Provide PR number, URL, or specify which phase to execute.