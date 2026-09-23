# Portfolio Copilot: Client Capability Guide

## 1. Purpose

Portfolio Copilot is a read-only assistant embedded in the Real Estate Intelligence dashboard. It uses AWS Bedrock with the `openai.gpt-oss-120b-1:0` model to answer questions about the project data supplied by the dashboard.

The assistant is designed for quick portfolio exploration and evidence-based summaries. It does not change project records, perform transactions, or make decisions on behalf of the user.

## 2. Data Used By The Chatbot

Each question is sent with a compact dashboard context. The context contains:

### Portfolio-level information

- Total number of projects
- Total outstanding amount
- Portfolio health summary, including project health categories
- A data-status note identifying the current information as sample/calculated dashboard data

### Project-level information

For each project, or for the selected project when the user is viewing project detail:

- Project ID and project name
- Location and project type
- Budget
- Planned progress percentage
- Actual progress percentage
- Planned-versus-actual variance
- Current budget utilization percentage
- Remaining budget
- Expected completion date
- Key milestones, including target dates and status
- Recorded risks, including risk text and level

The underlying dashboard contains additional sales and trend data, but the current chatbot context intentionally sends only the fields above. A value visible elsewhere in the dashboard is not automatically available to the chatbot unless it is included in this context.

## 3. Questions The Chatbot Can Answer

The following are representative supported questions. Answers are based on the supplied project context and may be portfolio-wide or limited to the currently selected project.

1. **Which projects are delayed?**
   Based on each project's health status.

2. **Which projects are at risk?**
   Based on projects marked `At Risk` and their recorded risk information.

3. **Which projects are on track?**
   Based on each project's health status.

4. **What is the portfolio health, project count, and total outstanding amount?**
   Based on the portfolio health summary, `totalProjects`, and `totalOutstanding` values.

5. **What is the average actual progress percentage across all projects?**
   Calculated from the `actualPct` value for each project in the supplied context.

6. **Which project has made the most progress?**
   Compared using project `actualPct` values.

7. **Which project has the lowest actual progress?**
   Compared using project `actualPct` values.

8. **Which project has the largest schedule variance?**
   Compared using the planned-versus-actual `variance` value.

9. **Which project has the highest budget?**
   Compared using the project `budget` values.

10. **Which projects have used the highest percentage of their budget?**
    Compared using `budgetUtilCurrent`.

11. **Which projects have the most remaining budget?**
    Compared using `remainingBudget`.

12. **What is the budget utilization of a specific project?**
    Based on that project's `budgetUtilCurrent` value.

13. **What is the planned progress versus actual progress for a project?**
    Compared using `plannedPct`, `actualPct`, and `variance`.

14. **What is the expected completion date for each project?**
    Based on the recorded `expectedCompletion` field.

15. **Which milestones are delayed, completed, or upcoming, and what risks are recorded?**
   Based on milestone names, target dates, statuses, and the project's recorded risk text and risk level.

## 4. How Answers Should Be Interpreted

- The assistant summarizes the data available at the time of the request.
- A response may be portfolio-wide or project-specific depending on the dashboard view.
- Percentages and comparisons are calculated from supplied dashboard values.
- The current data is labelled as sample/calculated data; it should not be treated as a live system of record.
- When data is missing, the assistant should say that it is unavailable rather than invent an answer.
- The `sources` returned with an answer identify the relevant project or context fields used.

## 5. Questions The Chatbot Cannot Reliably Answer Today

### A. Sales, bookings, collections, or units sold

Examples:

- Which project has the most units sold?
- What is the booking conversion rate by project?
- Which project has the highest collections this month?
- What is the current sales revenue forecast?

Reason: although some of these metrics appear in dashboard calculations, they are not currently included in the compact chatbot context sent to Bedrock.

### B. Prescriptive solutions or decisions

Examples:

- What exact solution should management implement to recover a delayed project?
- Which contractor should be replaced?
- Should we approve additional budget?
- Create a recovery plan and assign owners.

Reason: the assistant is read-only and reports recorded information. It does not have authorization, operational workflows, contracts, resource plans, or approval rules needed to make or execute decisions.

### C. Live or external information

Examples:

- What is today's market price in Dubai?
- What is the latest material cost or interest rate?
- What changed in the project since yesterday?
- What is the weather or regulatory status affecting a project?

Reason: the chatbot has no live external data connection and only receives the dashboard context supplied with the request.

### D. Guaranteed forecasts

Examples:

- What will the final cost be?
- Will the project definitely finish by its target date?
- What will progress be next month?
- What is the probability of delay?

Reason: the assistant can describe current variance and recorded dates, but the current implementation does not provide a validated forecasting model or confidence calculation.

## 6. Recommended Client Usage

Use Portfolio Copilot to:

- Find projects requiring attention
- Compare progress, schedule variance, and budget utilization
- Review expected completion dates
- Summarize milestones and recorded risks
- Ask follow-up questions about a selected project

Use the dashboard's source reports and business owners for:

- Financial approvals
- Contractual or operational decisions
- Corrective action plans
- Live sales and collections reporting
- Forecasts and commitments

## 7. Capability Boundary

Portfolio Copilot is an evidence-based dashboard assistant, not an autonomous project manager. Its answers are limited to the fields supplied by the application and should be validated against the organization's source systems before being used for formal reporting or decisions.
