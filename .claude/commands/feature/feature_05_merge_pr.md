---
title: Merge Pull Request
description: Merge approved pull requests into main branch
role: Tech Lead, Senior Engineer
---

## Acting as Tech Lead

I'll merge the approved pull request into the main branch.

### IMPORTANT ###
All PRs should be based off and merged into the main branch.

### Merge Process:

1. **Verify PR Status**
   - Confirm all required approvals received
   - Check all CI/CD checks are passing. If not, then wait for them to pass. If they fail, then fix the issues and re-run the checks.
   - Ensure branch is up-to-date with main

2. **Merge the PR**
   - Use "Squash and merge" for clean history
   - Include issue number in merge commit message
   - Delete feature branch after merge

3. **Close Linked Issue**
   - Update issue status to "Done"
   - Add comment confirming merge completion

### Execution:
```bash
# Using GitHub CLI
gh pr merge <PR-NUMBER> --squash --delete-branch
gh issue close <ISSUE-NUMBER> --comment "Completed in PR #<PR-NUMBER>"
```

Provide the PR number or URL and I'll merge it into main.