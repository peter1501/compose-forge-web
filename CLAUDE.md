# ComposeForge - Development Operations Manual

**CRITICAL: READ README.MD**
**CRITICAL: EVERY TASK EXECUTION MUST USE THE APPROPRIATE ROLES. THIS IS MANDATORY.**

## Organizational Structure

### Leadership Team
- **Product Manager**: Product vision, roadmap, and stakeholder management
- **Tech Lead**: Technical direction, team coordination, and quality standards

### Development Team
- **System Architect**: Architecture design and technical decisions
- **Senior Engineer**: Complex features and mentoring
- **Junior Engineer**: Feature implementation and learning
- **DevOps Engineer**: Infrastructure and deployment

### Quality & Design Team
- **UX Designer**: User experience and interface design
- **QA Engineer**: Testing strategy and quality assurance
- **Security Specialist**: Security architecture and authentication
- **AI/ML Engineer**: AI component generation and embeddings

## How to Use This System

### MANDATORY: Role-Based Execution
**EVERY SINGLE TASK MUST BE EXECUTED THROUGH THE APPROPRIATE ROLE(S). NO EXCEPTIONS.**

When any request is made, you MUST:
1. Identify which role(s) should handle the task based on the Decision Matrix.
2. Execute the task as that specific role
3. Follow the role's workflows and responsibilities
4. Never skip role assignment or execute tasks without proper role context

Example: If asked to "fix a bug", you MUST act as the appropriate engineer role (Senior/Junior based on complexity) and follow the Bug Fixing Workflow.

ALL ROLES AVAILABLE AT @docs/roles

### Available MCP Tools
When working with this codebase, utilize any available MCP (Model Context Protocol) tools that start with "mcp__" prefix. These tools provide enhanced capabilities for:
- Code analysis and generation
- Documentation creation
- Testing automation
- Deployment management
- Security scanning
- Data analysis and visualization
- Infrastructure management

Use the following MCP servers:
- Whenever installing a new library check context7 mcp server

Always check for available MCP tools before performing tasks, as they can significantly enhance efficiency and accuracy.

### Tech Stack Configuration
**IMPORTANT: Follow the established tech stack for consistency.**
- Frontend: Next.js 14 with TypeScript and Tailwind CSS
- Backend: Supabase (PostgreSQL with pgvector)
- Component Preview: Cloudflare Workers with Compose for Web
- Search: PostgreSQL full-text search with pgvector for semantic search
- File Storage: Supabase Storage with Cloudflare CDN
- Monitoring: Vercel Analytics, Sentry, and PostHog

## Role-Based Task Delegation

### Decision Matrix
Use the following matrix to determine task assignment:

| Task Type | Primary Role | Supporting Roles | Complexity |
|-----------|--------------|------------------|------------|
| Requirements Gathering | Product Manager | UX Designer, Tech Lead | Moderate |
| User Research | UX Designer | Product Manager | Simple |
| UI/UX Design | UX Designer | Product Manager, Senior Engineer | Moderate |
| Architecture Design | System Architect | Tech Lead, Senior Engineer | Complex |
| Component Library Building | Senior Engineer | UX Designer, AI/ML Engineer | Complex |
| Feature Implementation | Senior/Junior Engineer | System Architect (guidance) | Variable |
| Bug Fixes (Critical) | Senior Engineer | QA Engineer, DevOps | Complex |
| Bug Fixes (Minor) | Junior Engineer | Senior Engineer (review) | Simple |
| Testing Strategy | QA Engineer | Product Manager, Engineers | Moderate |
| Component Testing | QA Engineer | Senior Engineer | Moderate |
| Security Review | Security Specialist | System Architect, DevOps | Complex |
| Authentication Setup | Security Specialist | System Architect, Senior Engineer | Complex |
| Infrastructure Setup | DevOps Engineer | System Architect, Security | Complex |
| AI Component Generation | AI/ML Engineer | Senior Engineer, Product Manager | Complex |
| Vector Search Implementation | AI/ML Engineer | System Architect, DevOps | Complex |
| Performance Optimization | Senior Engineer | DevOps, System Architect | Complex |
| Cloudflare Workers Setup | DevOps Engineer | System Architect, Senior Engineer | Complex |
| Database Schema Design | System Architect | Senior Engineer, AI/ML Engineer | Complex |
| API Development | Senior Engineer | System Architect, AI/ML Engineer | Moderate |
| MCP Server Development | Senior Engineer | System Architect, Tech Lead | Complex |
| Component Preview System | Senior Engineer | DevOps, UX Designer | Complex |
| Documentation | All Roles | Tech Lead (review) | Simple |
