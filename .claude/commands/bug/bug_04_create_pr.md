---
title: Bug Fix Pull Request Creation & Review
description: Comprehensive pull request workflow for bug fixes with review management
role: Senior Engineer, Tech Lead, Security Specialist
---

## Acting as Senior Engineer, Tech Lead, and Security Specialist

I'll create a comprehensive pull request for the bug fix, manage the review process, and ensure all quality standards are met before merging.

### IMPORTANT ###
All PRs should be based off and merged into the main branch.

### Pre-PR Creation Checklist:

1. **Implementation Verification** (Senior Engineer)
   - Bug fix implemented and tested
   - All tests passing (unit, integration, manual)
   - Code quality checks passed (lint, type-check, build)
   - No regression in existing functionality

2. **Security Review** (Security Specialist)
   - No security vulnerabilities introduced
   - HIPAA compliance maintained
   - Authentication/authorization not compromised
   - No sensitive data exposed in logs or errors

3. **Architecture Compliance** (Tech Lead)
   - Clean architecture principles followed
   - No layer boundary violations
   - Repository pattern maintained
   - Service layer integrity preserved

### Pull Request Creation Workflow:

#### **Phase 1: PR Preparation**

1. **Final Validation** (Senior Engineer)
   - Ensure all commits are properly formatted
   - Verify branch is up to date with `main`
   - Run complete test suite one final time
   - Confirm bug reproduction is resolved

2. **Documentation Preparation** (Senior Engineer)
   - Prepare detailed PR description
   - Document testing approach and results
   - List all files changed and why
   - Include screenshots/videos if UI-related

#### **Phase 2: PR Creation**

1. **GitHub PR Creation** (Senior Engineer)
   - Use GitHub MCP server tool (mcp__github__create_pull_request) to create PR programmatically
   - Create PR with comprehensive description
   - Target branch appropriate (typically `main` unless explicitly requested otherwise)
   - Link to original bug report issue
   - Add appropriate labels and reviewers
   - Set milestone if applicable

2. **Initial Review Setup** (Tech Lead)
   - Assign appropriate reviewers based on complexity
   - Set up review checklist
   - Schedule review timeline
   - Notify stakeholders if critical fix

#### **Phase 3: Review Management**

1. **Code Review Coordination** (Tech Lead)
   - Monitor review progress
   - Address reviewer questions
   - Coordinate between reviewers
   - Ensure timely completion

2. **Feedback Resolution** (Senior Engineer)
   - Address all review comments
   - Make requested changes
   - Re-request review after changes
   - Maintain quality standards

### Pull Request Template:

```markdown
## Bug Fix Summary

**Fixes #[issue-number]**: [Brief description of the bug]

### 🐛 Bug Description
- **Issue**: [Detailed description of the bug]
- **Root Cause**: [What caused the bug]
- **Impact**: [Who/what was affected]
- **Severity**: [Critical/High/Medium/Low]

### 🔧 Fix Details
- **Solution**: [How the bug was fixed]
- **Files Changed**: [List key files and their changes]
- **Architecture Impact**: [Any architecture considerations]
- **Breaking Changes**: [None/List any breaking changes]

### 🧪 Testing Strategy
- **Bug Reproduction**: [How bug was reproduced and verified fixed]
- **Unit Tests**: [New/updated unit tests]
- **Integration Tests**: [New/updated integration tests]
- **Manual Testing**: [Manual testing performed]
- **Regression Testing**: [Tests to prevent regression]

### 📊 Test Results
- **Test Coverage**: [Coverage percentage]
- **All Tests**: ✅ Passing
- **Linting**: ✅ Passing  
- **Type Check**: ✅ Passing
- **Build**: ✅ Successful

### 🔒 Security & Compliance
- **HIPAA Impact**: [Assessment of healthcare compliance]
- **Security Review**: [Security implications assessed]
- **Data Handling**: [Any data handling changes]
- **Authentication**: [Auth/authorization changes]

### 📱 User Impact
- **Before**: [Describe user experience before fix]
- **After**: [Describe improved user experience]
- **Migration Needed**: [Any migration steps required]

### 🎯 Acceptance Criteria
- [ ] Bug is resolved as described
- [ ] No regression in existing functionality
- [ ] All tests pass
- [ ] Code quality standards met
- [ ] Security review completed
- [ ] Documentation updated if needed

### 📸 Screenshots/Demo
[Include before/after screenshots or demo videos if applicable]

### 🔄 Deployment Notes
- **Environment Impact**: [Dev/Staging/Prod considerations]
- **Rollback Plan**: [How to rollback if needed]
- **Monitoring**: [What to monitor after deployment]

---

### Review Checklist for Reviewers:

#### Code Quality Review
- [ ] Code follows clean architecture principles
- [ ] No layer boundary violations
- [ ] Proper error handling implemented
- [ ] TypeScript types are correct
- [ ] Code is readable and maintainable

#### Testing Review
- [ ] Adequate test coverage for fix
- [ ] Tests cover edge cases
- [ ] Integration tests added if needed
- [ ] No flaky tests introduced

#### Security Review
- [ ] No security vulnerabilities
- [ ] HIPAA compliance maintained
- [ ] No sensitive data exposed
- [ ] Proper authentication/authorization

#### Architecture Review
- [ ] Repository pattern maintained
- [ ] Service layer integrity preserved
- [ ] Dependency injection used correctly
- [ ] No anti-patterns introduced

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Review Assignment Strategy:

#### **By Bug Severity:**

**Critical (P0) Bugs:**
- **Required Reviewers**: Tech Lead + Senior Engineer + Security Specialist
- **Review SLA**: 4 hours
- **Approvals Required**: 3

**High (P1) Bugs:**
- **Required Reviewers**: Tech Lead + Senior Engineer
- **Review SLA**: 24 hours
- **Approvals Required**: 2

**Medium (P2) Bugs:**
- **Required Reviewers**: Senior Engineer + 1 other engineer
- **Review SLA**: 48 hours
- **Approvals Required**: 2

**Low (P3) Bugs:**
- **Required Reviewers**: 1 Senior Engineer
- **Review SLA**: 72 hours
- **Approvals Required**: 1

### Review Process Management:

#### **Initial Review Phase**
1. **Automated Checks** (System)
   - CI/CD pipeline runs
   - All tests must pass
   - Code quality checks pass
   - Security scans complete

2. **Code Review** (Assigned Reviewers)
   - Review code changes
   - Verify architecture compliance
   - Check testing adequacy
   - Assess security implications

#### **Feedback Resolution Phase**
1. **Comment Analysis** (Senior Engineer)
   - Categorize feedback (critical, suggestion, question)
   - Plan resolution approach
   - Estimate time for changes
   - Communicate with reviewers

2. **Implementation of Changes** (Senior Engineer)
   - Address critical issues first
   - Make requested code changes
   - Update tests if needed
   - Re-run all quality checks

#### **Final Approval Phase**
1. **Re-review Process** (Reviewers)
   - Verify changes address feedback
   - Ensure no new issues introduced
   - Approve or request additional changes
   - Final security sign-off if needed

### Execution Commands:

```bash
# Pre-PR final checks
git checkout fix/<ticket-id>-<description>
git fetch origin
git rebase origin/main

# Run complete validation
npm run lint
npm run type-check
npm test
npm run build

# Create comprehensive PR using GitHub MCP server
# Use the mcp__github__create_pull_request tool with:
# - owner: repository owner
# - repo: repository name
# - title: "fix: [Bug Title] (#[issue-number])"
# - head: current branch name (fix/<ticket-id>-<description>)
# - base: "main"
# - body: Full PR description using the template above
# - draft: false
# - maintainer_can_modify: true

# Alternative: Create PR using gh CLI
gh pr create \
  --title "fix: [Bug Title] (#[issue-number])" \
  --body "$(cat <<'EOF'
[Use the PR template above with all sections filled out]
EOF
)" \
  --assignee @me \
  --reviewer @tech-lead,@security-specialist \
  --label bug,fix,needs-review \
  --milestone "Sprint X"

# Link PR to issue
gh issue comment [issue-number] --body "🔧 Fix implemented in PR #$(gh pr view --json number -q .number)"

# Monitor PR status
gh pr status
gh pr checks

# Address review feedback (after reviews)
git add .
git commit -m "address: [specific feedback addressed]"
git push origin fix/<ticket-id>-<description>

# Re-request review after changes
gh pr review --approve  # or request changes
```

### Review Feedback Management:

#### **Types of Review Feedback:**

**🔴 Critical Issues** (Must Fix)
- Security vulnerabilities
- Architecture violations
- Breaking changes
- Test failures

**🟡 Suggestions** (Should Consider)
- Performance improvements
- Code clarity enhancements
- Additional test cases
- Documentation updates

**🔵 Questions** (Need Clarification)
- Implementation approach questions
- Architecture decisions
- Test strategy inquiries
- Future considerations

#### **Feedback Resolution Process:**

1. **Acknowledge All Feedback**
   ```markdown
   Thanks for the review! I'll address these items:
   
   - ✅ Fixed security concern in line 45
   - ✅ Added additional test case for edge condition
   - 📝 Regarding architecture question: [explanation]
   - 🔍 Need clarification on suggestion about [topic]
   ```

2. **Make Requested Changes**
   - Fix critical issues immediately
   - Implement reasonable suggestions
   - Ask for clarification when needed
   - Update tests and documentation

3. **Re-request Review**
   - Mark conversations as resolved
   - Tag reviewers for re-review
   - Provide summary of changes made
   - Request specific feedback if needed

### Quality Gates for Bug Fix PRs:

#### **Automated Quality Gates**
- [ ] All tests pass (100% success rate)
- [ ] Code coverage maintained or improved
- [ ] Linting passes without warnings
- [ ] TypeScript compilation successful
- [ ] Build completes successfully
- [ ] Security scans pass

#### **Manual Review Gates**
- [ ] Code review approval from required reviewers
- [ ] Architecture review completed
- [ ] Security review passed (for critical/high bugs)
- [ ] Testing strategy approved
- [ ] Documentation updated if needed

#### **Business Quality Gates**
- [ ] Bug reproduction confirmed resolved
- [ ] No regression in related functionality
- [ ] User acceptance criteria met
- [ ] Performance impact acceptable
- [ ] Deployment plan approved

### Emergency Bug Fix Process:

For critical production bugs requiring immediate deployment:

1. **Fast-Track Review** (30 minutes)
   - Tech Lead + Senior Engineer immediate review
   - Security Specialist consultation if needed
   - Abbreviated but thorough review process

2. **Hot-fix Branch Strategy**
   ```bash
   # Create hotfix from main
   git checkout main
   git checkout -b hotfix/<critical-bug>
   
   # After fix and testing
   gh pr create --base main --title "hotfix: [Critical Bug]"
   
   # After approval, merge to main
   git checkout main
   git merge hotfix/<critical-bug>
   ```

### Next Steps:

After PR approval:
1. Use `/bug_05_merge_pr` to merge the approved bug fix
2. Monitor deployment and verify fix in production
3. Update original issue with resolution details
4. Conduct post-mortem if needed for critical bugs

**Ready to create a comprehensive bug fix PR?** Please provide the branch name and bug details to proceed with the PR creation process.