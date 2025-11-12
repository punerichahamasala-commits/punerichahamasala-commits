
import { Employee, Perimeter, User } from './types';

export const MOCK_EMPLOYEE_EXCELLING: Employee = {
  id: 1,
  name: "Sarah Jones",
  role: "Data Analyst",
  training: "Advanced Python for Data Science",
  managerId: 101,
  proficiency: [
    {
      perimeter: Perimeter.PERCEIVED_UTILITY,
      score: 5,
      questions: [
        { id: 'pu1', text: "How directly are the trained skills applicable to your primary projects?", answer: 5 },
        { id: 'pu2', text: "Has the training helped you solve problems more effectively or creatively?", answer: "Yes, it opened up new approaches for data modeling." }
      ]
    },
    {
      perimeter: Perimeter.LEARNING_APPLICATION_FREQUENCY,
      score: 5,
      questions: [
        { id: 'laf1', text: "How many days after training did you first apply the new skill on a real task?", answer: "2 days" },
        { id: 'laf2', text: "In the past month, how often have you used the skills from the training?", answer: "Daily" },
        { id: 'laf3', text: "Have you sought out new projects to apply your learning?", answer: "Yes, I volunteered for the new predictive analytics initiative." }
      ]
    },
    {
      perimeter: Perimeter.PERFORMANCE_IMPROVEMENT,
      score: 5,
      questions: [
        { id: 'pi1', text: "Provide an example of a task that is now faster or higher quality due to the training.", answer: "Automated a weekly reporting script, saving approx. 4 hours per week." },
        { id: 'pi2', text: "Has the employee's work led to any measurable positive business outcomes?", answer: "The automated report led to a 5% improvement in identifying sales trends." },
      ]
    },
    {
      perimeter: Perimeter.MANAGER_SUPPORT,
      score: 4,
      questions: [
        { id: 'ms1', text: "Does your manager provide opportunities to use your new skills?", answer: 5 },
        { id: 'ms2', text: "Does your manager provide constructive feedback on your use of the new skills?", answer: 4 },
      ]
    },
    {
      perimeter: Perimeter.PEER_SUPPORT,
      score: 5,
      questions: [
        { id: 'ps1', text: "Do you feel your team members are supportive when you try new methods learned in training?", answer: 5 },
        { id: 'ps2', text: "Have you shared any of your new knowledge with your teammates?", answer: "Yes, I held a brief demo in our last team meeting." }
      ]
    },
    {
      perimeter: Perimeter.WORKPLACE_ENABLERS,
      score: 4,
      questions: [
        { id: 'we1', text: "Do you have the necessary tools and resources to apply your training?", answer: 5 },
        { id: 'we2', text: "Do you have sufficient time in your schedule to practice and apply the new skills?", answer: 4 }
      ]
    }
  ]
};

export const MOCK_EMPLOYEE_STRUGGLING: Employee = {
  id: 2,
  name: "John Davis",
  role: "Junior Project Coordinator",
  training: "Agile Project Management",
  managerId: 102,
  proficiency: [
    {
      perimeter: Perimeter.PERCEIVED_UTILITY,
      score: 4,
      questions: [
        { id: 'pu1', text: "How directly are the trained skills applicable to your primary projects?", answer: 4 },
        { id: 'pu2', text: "Has the training helped you solve problems more effectively or creatively?", answer: "Somewhat, but my projects are not fully Agile yet." }
      ]
    },
    {
      perimeter: Perimeter.LEARNING_APPLICATION_FREQUENCY,
      score: 2,
      questions: [
        { id: 'laf1', text: "How many days after training did you first apply the new skill on a real task?", answer: "21 days (3 weeks)" },
        { id: 'laf2', text: "In the past month, how often have you used the skills from the training?", answer: "Once or twice" },
      ]
    },
    {
      perimeter: Perimeter.PERFORMANCE_IMPROVEMENT,
      score: 3,
      questions: [
        { id: 'pi1', text: "Provide an example of a task that is now faster or higher quality due to the training.", answer: "I was able to set up a Kanban board for a small internal task." },
        { id: 'pi2', text: "Are you able to integrate the new skills with your existing workflow?", answer: 3 },
      ]
    },
    {
      perimeter: Perimeter.MANAGER_SUPPORT,
      score: 2,
      questions: [
        { id: 'ms1', text: "Does your manager provide opportunities to use your new skills?", answer: 2 },
        { 
          id: 'ms2', 
          text: "Does your manager provide constructive feedback on your use of the new skills?", 
          answer: 2,
          followUp: {
            onAnswer: 2,
            question: {
              id: 'ms2-followup',
              text: "Could you specify what type of support or feedback would be helpful?",
              answer: "I would appreciate more frequent check-ins and clearer expectations on how to apply Agile to my specific projects."
            }
          }
        },
      ]
    },
    {
      perimeter: Perimeter.PEER_SUPPORT,
      score: 3,
      questions: [
        { id: 'ps1', text: "Do you feel your team members are supportive when you try new methods learned in training?", answer: 3 },
      ]
    },
    {
      perimeter: Perimeter.WORKPLACE_ENABLERS,
      score: 2,
      questions: [
        { id: 'we1', text: "Do you have the necessary tools and resources to apply your training (e.g., software, templates)?", answer: 2 },
        { id: 'we2', text: "Do you have sufficient time in your schedule to practice and apply the new skills?", answer: 3 },
        { id: 'we3', text: "Manager Observation: Have you noticed signs of stress or difficulty when the employee tries to apply the training?", answer: "Yes, seems overwhelmed and defaults to old methods under pressure." }
      ]
    }
  ]
};

const MOCK_EMPLOYEE_3: Employee = {
  id: 3,
  name: "Emily White",
  role: "Data Analyst",
  training: "Advanced Python for Data Science",
  managerId: 101,
  proficiency: [
    { perimeter: Perimeter.PERCEIVED_UTILITY, score: 5, questions: [] },
    { perimeter: Perimeter.LEARNING_APPLICATION_FREQUENCY, score: 4, questions: [] },
    { perimeter: Perimeter.PERFORMANCE_IMPROVEMENT, score: 3, questions: [] },
    { perimeter: Perimeter.MANAGER_SUPPORT, score: 4, questions: [] },
    { perimeter: Perimeter.PEER_SUPPORT, score: 5, questions: [] },
    { perimeter: Perimeter.WORKPLACE_ENABLERS, score: 4, questions: [] },
  ],
};

const MOCK_EMPLOYEE_4: Employee = {
  id: 4,
  name: "Michael Brown",
  role: "Junior Project Coordinator",
  training: "Agile Project Management",
  managerId: 102,
  proficiency: [
    { perimeter: Perimeter.PERCEIVED_UTILITY, score: 5, questions: [] },
    { perimeter: Perimeter.LEARNING_APPLICATION_FREQUENCY, score: 3, questions: [] },
    { perimeter: Perimeter.PERFORMANCE_IMPROVEMENT, score: 4, questions: [] },
    { perimeter: Perimeter.MANAGER_SUPPORT, score: 5, questions: [] },
    { perimeter: Perimeter.PEER_SUPPORT, score: 4, questions: [] },
    { perimeter: Perimeter.WORKPLACE_ENABLERS, score: 3, questions: [] },
  ],
};

export const MOCK_EMPLOYEES: Employee[] = [
  MOCK_EMPLOYEE_EXCELLING,
  MOCK_EMPLOYEE_STRUGGLING,
  MOCK_EMPLOYEE_3,
  MOCK_EMPLOYEE_4
];

export const MOCK_USERS: User[] = [
    { id: 101, name: "Maria Garcia (Manager)", role: 'Manager', managesIds: [1, 3] },
    { id: 102, name: "David Chen (Manager)", role: 'Manager', managesIds: [2, 4] },
    { id: 2, name: "John Davis (Employee)", role: 'Employee', employeeId: 2 },
    { id: 201, name: "HR Admin", role: 'HR' }
];

export const ROLES = [...new Set(MOCK_EMPLOYEES.map(e => e.role))];

export const PERIMETERS_ORDER: Perimeter[] = [
  Perimeter.PERCEIVED_UTILITY,
  Perimeter.LEARNING_APPLICATION_FREQUENCY,
  Perimeter.PERFORMANCE_IMPROVEMENT,
  Perimeter.MANAGER_SUPPORT,
  Perimeter.PEER_SUPPORT,
  Perimeter.WORKPLACE_ENABLERS,
];