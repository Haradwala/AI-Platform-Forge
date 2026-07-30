"use strict";
/**
 * workflow-template-registry.ts — Pre-built workflow templates for Forge Automation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowTemplateRegistry = void 0;
class WorkflowTemplateRegistry {
    templates = new Map();
    constructor() {
        this.registerDefaults();
    }
    registerDefaults() {
        this.register({
            id: 'template_ci_verification',
            name: 'CI/CD Verification Pipeline',
            description: 'Runs typechecking, linting, and automated unit tests.',
            category: 'ci',
            format: 'yaml',
            content: `name: "CI Verification"
id: "ci_verification"
on:
  push:
    branches: [main, develop]
jobs:
  verify:
    name: "Code Verification"
    steps:
      - name: "Run Tests"
        action: "term.run_tests"
        params:
          testCommand: "pnpm test"
      - name: "Run Linter"
        action: "term.run_lint"
        params:
          lintCommand: "pnpm lint"
`
        });
        this.register({
            id: 'template_agent_code_review',
            name: 'Automated Agent Code Review',
            description: 'Dispatches Reviewer and Architect agents to review workspace code quality and architecture.',
            category: 'review',
            format: 'yaml',
            content: `name: "Automated Code Review"
id: "agent_code_review"
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  review:
    name: "Multi-Agent Code Review"
    steps:
      - name: "Architect Review"
        agent: "Architect"
        prompt: "Review workspace code architecture for modularity and Clean Architecture compliance."
        output_artifact: "arch_review.md"
      - name: "Code Quality Scan"
        agent: "Reviewer"
        input_artifact: "arch_review.md"
        prompt: "Perform deep security and code quality inspection on modified files."
        output_artifact: "code_review.md"
`
        });
        this.register({
            id: 'template_agent_refactor_pipeline',
            name: 'Autonomous Refactoring & Verification',
            description: 'Uses Planner, Refactorer, and Tester agents to safely optimize legacy modules.',
            category: 'refactor',
            format: 'yaml',
            content: `name: "Autonomous Refactoring"
id: "agent_refactor"
on:
  manual: {}
jobs:
  refactor:
    name: "Agent Refactoring Workflow"
    steps:
      - name: "Planning Refactor"
        agent: "Planner"
        prompt: "Create step-by-step refactoring plan to clean up complex modules."
        output_artifact: "refactor_plan.md"
      - name: "Execute Refactor"
        agent: "Refactorer"
        input_artifact: "refactor_plan.md"
        prompt: "Apply refactoring edits according to plan."
      - name: "Verify Tests"
        action: "term.run_tests"
`
        });
        this.register({
            id: 'template_security_audit',
            name: 'Automated Security & Vulnerability Scan',
            description: 'Scans dependencies and codebase for security vulnerabilities.',
            category: 'security',
            format: 'yaml',
            content: `name: "Security Audit"
id: "security_audit"
on:
  schedule:
    cron: "0 0 * * *"
jobs:
  audit:
    name: "Security Inspection"
    steps:
      - name: "Run Security Audit"
        action: "term.run_command"
        params:
          command: "pnpm audit"
      - name: "Security Reviewer"
        agent: "Reviewer"
        prompt: "Analyze security audit findings and provide mitigation recommendations."
`
        });
    }
    register(template) {
        this.templates.set(template.id, template);
    }
    list() {
        return Array.from(this.templates.values());
    }
    get(id) {
        return this.templates.get(id);
    }
}
exports.WorkflowTemplateRegistry = WorkflowTemplateRegistry;
//# sourceMappingURL=workflow-template-registry.js.map