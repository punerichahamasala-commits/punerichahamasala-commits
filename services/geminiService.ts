import { GoogleGenAI, Type } from "@google/genai";
import { Employee, Status, Perimeter, Analysis, TeamAnalysis, ActionPlan } from "../types";

const getScoreForPerimeter = (employee: Employee, perimeter: Perimeter): number => {
  return employee.proficiency.find(p => p.perimeter === perimeter)?.score || 0;
};

const handleError = (error: any, context: string): never => {
  console.error(`Error generating ${context} from Gemini API:`, error);
  const errorMessage = error.toString();
  if (errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
      throw new Error("You've exceeded your API request limit. Please wait a moment and try again.");
  }
  throw new Error(`Failed to generate ${context} from the API. Please check your connection or API key.`);
}

export const generateProficiencyAnalysis = async (employee: Employee, overallScore: number, status: Status): Promise<Analysis | null> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    throw new Error("API key is not configured.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
You are an expert HR and Learning & Development consultant. Your task is to analyze an employee's post-training proficiency data and provide a detailed "Gap & Strength" analysis. The perimeters are based on learning transfer theory.

Based on the following employee data, generate a JSON object that adheres to the provided schema.

Employee Data:
- Name: ${employee.name}
- Training Completed: ${employee.training}
- Overall Score: ${overallScore}/100
- Status: ${status}

Perimeter Scores (out of 5):
- Perceived Utility & Relevance: ${getScoreForPerimeter(employee, Perimeter.PERCEIVED_UTILITY)}
- Learning Application & Frequency: ${getScoreForPerimeter(employee, Perimeter.LEARNING_APPLICATION_FREQUENCY)}
- Performance Improvement: ${getScoreForPerimeter(employee, Perimeter.PERFORMANCE_IMPROVEMENT)}
- Manager Support: ${getScoreForPerimeter(employee, Perimeter.MANAGER_SUPPORT)}
- Peer Support: ${getScoreForPerimeter(employee, Perimeter.PEER_SUPPORT)}
- Workplace Enablers & Barriers: ${getScoreForPerimeter(employee, Perimeter.WORKPLACE_ENABLERS)}

Detailed Data (for context):
${JSON.stringify(employee.proficiency, null, 2)}

Analysis Guidelines:
1. If the status is 'Green':
   - 'analysisTitle' should be "Benefits & New Scope".
   - 'message' should be positive, highlighting their success and potential.
   - 'rootCause' should be null.
   - 'recommendations' should focus on growth: mentorship, advanced training, role expansion, and recognition.

2. If the status is 'Yellow' or 'Red':
   - 'analysisTitle' should be "Key Strategies & Real Solutions".
   - 'message' should clearly identify the challenges.
   - 'rootCause' should correlate low-scoring perimeters. For example, if 'Manager Support' is low and 'Learning Application & Frequency' is low, state that the lack of managerial support is likely a key barrier to applying the new skills.
   - 'recommendations' should be a concrete, actionable plan for the Manager, Employee, and HR, directly addressing the low-scoring areas.

Generate only the JSON object.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysisTitle: { type: Type.STRING },
            message: { type: Type.STRING },
            rootCause: { type: Type.STRING },
            recommendations: {
              type: Type.OBJECT,
              properties: {
                manager: { type: Type.ARRAY, items: { type: Type.STRING } },
                employee: { type: Type.ARRAY, items: { type: Type.STRING } },
                hr: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["manager", "employee", "hr"],
            },
          },
          required: ["analysisTitle", "message", "recommendations"],
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as Analysis;
  } catch (error) {
    handleError(error, "analysis");
  }
};

export const generateActionPlan = async (employee: Employee, analysis: Analysis): Promise<ActionPlan | null> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    throw new Error("API key is not configured.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
You are an expert Learning & Development coach. Based on the provided employee proficiency analysis, create a detailed and actionable development plan. The goal is to address the identified gaps and leverage the employee's strengths for growth.

The output must be a JSON object that adheres to the provided schema.

Employee Data:
- Name: ${employee.name}
- Role: ${employee.role}
- Training Completed: ${employee.training}

Proficiency Analysis Summary:
- Analysis Title: ${analysis.analysisTitle}
- Message: ${analysis.message}
- Root Cause (if any): ${analysis.rootCause || 'N/A'}
- Recommendations:
  - For Manager: ${analysis.recommendations.manager.join(', ')}
  - For Employee: ${analysis.recommendations.employee.join(', ')}
  - For HR: ${analysis.recommendations.hr.join(', ')}

Action Plan Guidelines:
1.  **Goal**: Create a single, concise, and aspirational goal for the employee based on the analysis.
2.  **Action Steps**: Generate 3-5 concrete action steps.
    -   'step': A specific, measurable action.
    -   'owner': Assign a primary owner ('Employee', 'Manager', or 'HR').
    -   'timeline': Provide a realistic timeline (e.g., "Within 2 weeks", "Next 30 days", "Ongoing").
    -   'resources': Suggest relevant resources (e.g., "Company's learning portal", " mentorship from a senior team member", "Specific online course"). If no specific resource, suggest a general one.
    -   'status': The initial status for all steps must be "Not Started".

Generate only the JSON object.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            goal: { type: Type.STRING },
            actionSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.STRING },
                  owner: { type: Type.STRING },
                  timeline: { type: Type.STRING },
                  resources: { type: Type.STRING },
                  status: { type: Type.STRING },
                },
                required: ["step", "owner", "timeline", "resources", "status"],
              },
            },
          },
          required: ["goal", "actionSteps"],
        },
      },
    });

    const jsonText = response.text.trim();
    const parsedPlan = JSON.parse(jsonText);
    return { ...parsedPlan, employeeId: employee.id } as ActionPlan;
  } catch (error) {
    handleError(error, "action plan");
  }
};


export const generateTeamAnalysis = async (employees: Employee[]): Promise<TeamAnalysis | null> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    throw new Error("API key is not configured.");
  }
   if (employees.length === 0) {
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const teamData = employees.map(e => ({
    name: e.name,
    scores: e.proficiency.map(p => ({ perimeter: p.perimeter, score: p.score }))
  }));

  const prompt = `
You are an expert HR and Learning & Development consultant. Your task is to analyze the post-training proficiency data for a team of employees in the same role and provide a team-level analysis.

Team Role: ${employees[0].role}
Training Completed: ${employees[0].training}

Team Proficiency Data (Scores out of 5):
${JSON.stringify(teamData, null, 2)}

Analysis Guidelines:
1.  **Identify Common Strengths**: Find perimeters where most or all employees scored high (4 or 5). Provide a brief insight for each strength.
2.  **Identify Common Gaps**: Find perimeters where most or all employees scored low (1, 2, or 3). These are areas for collective improvement. Provide a brief insight for each gap.
3.  **Provide Team Recommendations**: Based on the common gaps, suggest 3-5 concrete, actionable recommendations for the team, manager, or HR. These should be team-focused (e.g., group workshops, clarifying role expectations, improving resources) rather than individual-focused.

Generate only the JSON object adhering to the schema.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            commonStrengths: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  perimeter: { type: Type.STRING },
                  insight: { type: Type.STRING },
                },
                required: ["perimeter", "insight"],
              },
            },
            commonGaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  perimeter: { type: Type.STRING },
                  insight: { type: Type.STRING },
                },
                required: ["perimeter", "insight"],
              },
            },
            teamRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["commonStrengths", "commonGaps", "teamRecommendations"],
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as TeamAnalysis;
  } catch (error) {
    handleError(error, "team analysis");
  }
};