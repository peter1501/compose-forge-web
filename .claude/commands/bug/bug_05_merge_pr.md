---
title: Bug Fix PR Merge & Deployment
description: Merge approved bug fix pull requests and manage deployment process
role: Tech Lead, Senior Engineer, DevOps Engineer
---

## Acting as Tech Lead, Senior Engineer, and DevOps Engineer

I'll manage the final merge process for approved bug fix pull requests, ensuring proper deployment and post-merge validation while maintaining our clean architecture and healthcare compliance standards.

### IMPORTANT ###
ALWAYS base PRs off dev and merge back into dev. main is for release only!!!

### Pre-Merge Validation:

1. **Final Review Verification** (Tech Lead)
   - All required approvals received
   - All review comments resolved
   - CI/CD pipeline successful
   - Security review completed (if required)

2. **Quality Gate Confirmation** (Senior Engineer)
   - All tests passing (100% success rate)
   - Code coverage maintained or improved
   - Performance benchmarks met
   - No new security warnings

3. **Deployment Readiness** (DevOps Engineer)
   - Target branch (`dev`) is stable
   - Deployment pipeline ready
   - Rollback plan confirmed
   - Monitoring systems prepared

### Bug Fix Merge Workflow:

#### **Phase 1: Pre-Merge Checks**

1. **Automated Validation** (System)
   - CI/CD pipeline status verification
   - Test suite execution results
   - Security scan results
   - Build artifact validation

2. **Manual Verification** (Tech Lead + Senior Engineer)
   - Code review completion confirmation
   - Architecture compliance verification
   - Bug resolution validation
   - Regression test results review

#### **Phase 2: Merge Execution**

1. **Branch Synchronization** (Senior Engineer)
   - Ensure fix branch is up-to-date with `dev`
   - Resolve any conflicts if present
   - Verify tests still pass after sync
   - Final commit message preparation

2. **Merge Strategy Selection** (Tech Lead)
   - **Squash Merge**: For single logical fix (preferred)
   - **Merge Commit**: For complex fixes with multiple commits
   - **Rebase Merge**: For linear history (when appropriate)

#### **Phase 3: Post-Merge Validation**

1. **Deployment Monitoring** (DevOps Engineer)
   - Monitor automatic deployment to staging
   - Verify deployment success
   - Run smoke tests on staging environment
   - Prepare production deployment if needed

2. **Issue Management** (Tech Lead)
   - Update original bug report issue
   - Mark issue as resolved
   - Document resolution details
   - Schedule production deployment

### Merge Execution Checklist:

#### **Pre-Merge Requirements**
- [ ] **All Approvals Received**
  - [ ] Required reviewers approved
  - [ ] Security review completed (if needed)
  - [ ] Architecture review passed
  - [ ] QA validation completed

- [ ] **Quality Gates Passed**
  - [ ] All tests passing (unit, integration, e2e)
  - [ ] Code coverage >= baseline
  - [ ] Linting and type checking passed
  - [ ] Build successful
  - [ ] Security scans passed

- [ ] **Documentation Complete**
  - [ ] PR description comprehensive
  - [ ] Code comments added where needed
  - [ ] API documentation updated (if applicable)
  - [ ] Architecture docs updated (if applicable)

#### **Merge Process Requirements**
- [ ] **Branch Management**
  - [ ] Fix branch synchronized with `dev`
  - [ ] No merge conflicts
  - [ ] All commits properly formatted
  - [ ] Commit messages follow convention

- [ ] **Validation Testing**
  - [ ] Full test suite run after sync
  - [ ] Manual validation completed
  - [ ] Performance impact assessed
  - [ ] Cross-browser testing (if UI changes)

### Merge Strategy Guidelines:

#### **Squash Merge (Preferred for Bug Fixes)**
```bash
# Squash merge for clean history
gh pr merge <pr-number> --squash --delete-branch

# Alternative manual squash
git checkout dev
git merge --squash fix/<ticket-id>-<description>
git commit -m "fix: [comprehensive bug fix description]

Resolves issue with [detailed description]
- Fixed root cause in [component/service]
- Added comprehensive test coverage
- Verified no regression introduced
- Maintained clean architecture compliance

Fixes #<issue-number>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin dev
git branch -D fix/<ticket-id>-<description>
```

#### **Regular Merge (For Complex Fixes)**
```bash
# Preserve commit history for complex fixes
gh pr merge <pr-number> --merge --delete-branch

# Or manual merge
git checkout dev
git merge fix/<ticket-id>-<description>
git push origin dev
git branch -D fix/<ticket-id>-<description>
```

### Post-Merge Process:

#### **Immediate Actions (Within 15 minutes)**

1. **Deployment Verification** (DevOps Engineer)
   ```bash
   # Monitor deployment status
   npx amplify status
   
   # Check application health
   curl -f https://your-staging-url/health-check
   
   # Verify CI/CD pipeline
   gh run list --limit 5
   ```

2. **Smoke Testing** (Senior Engineer)
   - Test the specific bug fix functionality
   - Verify related features still work
   - Check error monitoring dashboards
   - Validate performance metrics

#### **Issue Management (Within 30 minutes)**

1. **GitHub Issue Updates** (Tech Lead)
   ```bash
   # Close the original bug issue
   gh issue close <issue-number> --comment "🎉 Bug fixed and merged in PR #<pr-number>

   **Resolution Summary:**
   - Root cause: [brief description]
   - Fix: [brief solution description]  
   - Testing: [test coverage added]
   - Deployed to: staging

   Ready for production deployment."
   ```

2. **Documentation Updates** (Senior Engineer)
   - Update known issues list (if applicable)
   - Document lessons learned
   - Update troubleshooting guides
   - Add to release notes

#### **Production Deployment Planning (Within 1 hour)**

1. **Deployment Strategy** (DevOps Engineer + Tech Lead)
   - Schedule production deployment
   - Prepare rollback plan
   - Set up monitoring alerts
   - Notify stakeholders

2. **Risk Assessment** (Tech Lead)
   - Evaluate deployment risk level
   - Plan deployment window
   - Prepare communication plan
   - Schedule team availability

### Critical Bug Fast-Track Merge:

For critical production bugs requiring immediate deployment:

#### **Emergency Merge Process**
```bash
# Emergency hotfix merge to main
git checkout main
git pull origin main
git merge hotfix/<critical-bug> --no-ff
git push origin main

# Tag the emergency release
git tag -a emergency-fix-v$(date +%Y%m%d-%H%M%S) -m "Emergency fix for critical bug #<issue>"
git push origin emergency-fix-v$(date +%Y%m%d-%H%M%S)

# Cherry-pick to dev branch
git checkout dev
git cherry-pick <merge-commit-hash>
git push origin dev
```

#### **Emergency Deployment**
```bash
# Immediate production deployment
npx amplify push --yes

# Monitor deployment
watch -n 5 'npx amplify status'

# Immediate smoke test
curl -f https://your-production-url/health-check
```

### Monitoring and Validation:

#### **Deployment Monitoring Dashboard**
- **Health Checks**: Application availability and response time
- **Error Rates**: Monitor for new errors or increased error rates
- **Performance Metrics**: Response time, memory usage, CPU utilization
- **User Analytics**: User behavior and feature usage
- **Security Alerts**: Authentication failures, suspicious activity

#### **Post-Deployment Validation**
1. **Automated Testing** (15 minutes post-deployment)
   ```bash
   # Run automated test suite against staging
   npm run test:staging
   
   # Run integration tests
   npm run test:integration:staging
   ```

2. **Manual Validation** (30 minutes post-deployment)
   - Test specific bug fix functionality
   - Verify user workflows
   - Check admin functionality
   - Validate data integrity

3. **Stakeholder Notification** (1 hour post-deployment)
   - Notify product manager of successful deployment
   - Update customer support team
   - Inform security team if security-related
   - Document deployment completion

### Rollback Procedures:

#### **When to Rollback**
- New critical bugs introduced
- Performance degradation > 20%
- Security vulnerabilities detected
- Data integrity issues
- HIPAA compliance concerns

#### **Rollback Execution**
```bash
# Quick rollback using git
git checkout dev
git revert <merge-commit-hash>
git push origin dev

# Or rollback to previous release
git reset --hard <previous-stable-commit>
git push --force origin dev

# Trigger emergency deployment
npx amplify push --yes
```

### Success Metrics:

#### **Merge Success Criteria**
- [ ] Bug fix deployed successfully
- [ ] No new issues introduced
- [ ] Performance maintained or improved
- [ ] All monitoring systems green
- [ ] User feedback positive
- [ ] Security standards maintained

#### **Process Improvement**
- **Merge Time**: Track time from approval to production
- **Quality Metrics**: Post-deployment bug count
- **Process Efficiency**: Review process optimization
- **Team Satisfaction**: Developer experience feedback

### Execution Commands:

```bash
# Pre-merge final validation
gh pr status <pr-number>
gh pr checks <pr-number>

# Execute merge (choose strategy)
gh pr merge <pr-number> --squash --delete-branch
# OR
gh pr merge <pr-number> --merge --delete-branch

# Post-merge validation
git checkout dev
git pull origin dev
npm run lint
npm run type-check
npm test
npm run build

# Update issue
gh issue close <issue-number> --comment "Fixed in PR #<pr-number>"

# Monitor deployment
npx amplify status
gh run list --limit 3

# Production deployment (when ready)
npx amplify push --yes
```

### Healthcare Compliance Considerations:

#### **HIPAA Audit Requirements**
- Document all changes affecting patient data
- Maintain audit trail of deployments
- Verify data encryption remains intact
- Confirm access controls unchanged

#### **Regulatory Compliance**
- No PHI exposed during deployment
- Backup procedures followed
- Security protocols maintained
- Compliance documentation updated

### Next Steps After Successful Merge:

1. **Monitor Production Deployment**
   - Watch for 24 hours minimum
   - Review error logs and metrics
   - Validate user feedback

2. **Post-Mortem (For Critical Bugs)**
   - Conduct lessons learned session
   - Document prevention strategies
   - Update development processes
   - Share insights with team

3. **Process Improvement**
   - Review merge process efficiency
   - Identify automation opportunities
   - Update documentation
   - Plan preventive measures

**Ready to merge an approved bug fix PR?** Please provide the PR number and I'll guide you through the comprehensive merge and deployment process.