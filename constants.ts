import { Employee, Perimeter, User } from './types';

export const MOCK_EMPLOYEE_EXCELLING: Employee = {
  id: 1,
  name: "Sarah Jones",
  role: "Data Analyst",
  department: "Data Science",
  training: "Advanced Python for Data Science",
  managerId: 101,
  trainingEffectiveness: 5,
  trainerName: "Dr. Alan Grant",
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
  department: "Project Management",
  training: "Agile Project Management",
  managerId: 102,
  trainingEffectiveness: 2,
  trainerName: "Jane Smith",
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
  department: "Data Science",
  training: "Advanced Python for Data Science",
  managerId: 101,
  trainingEffectiveness: 4,
  trainerName: "Dr. Alan Grant",
  proficiency: [
    { perimeter: Perimeter.PERCEIVED_UTILITY, score: 4, questions: [ { id: 'pu1-3', text: "Do you feel the Python skills are critical for your role?", answer: 4 }, { id: 'pu2-3', text: "Has the training made you more confident in your work?", answer: "Yes, for some tasks, but I'm struggling to apply the more advanced concepts." } ] },
    { perimeter: Perimeter.LEARNING_APPLICATION_FREQUENCY, score: 2, questions: [ { id: 'laf1-3', text: "How often do you use libraries like pandas or scikit-learn from the training?", answer: "Only once or twice a month. I'm not getting projects where I can use them." } ] },
    { perimeter: Perimeter.PERFORMANCE_IMPROVEMENT, score: 2, questions: [ { id: 'pi1-3', text: "Can you provide an example of a project where the training led to a significant improvement?", answer: "Not really. I've tried to use some new methods, but my results haven't improved much yet." }, { id: 'pi2-3', text: "Are there any blockers to applying the more advanced concepts?", answer: "I feel like I need more hands-on guidance. The training was fast-paced and I'm having trouble troubleshooting on my own." } ] },
    { perimeter: Perimeter.MANAGER_SUPPORT, score: 2, questions: [ { id: 'ms1-3', text: "Does your manager encourage you to use your new Python skills?", answer: 2 } ] },
    { perimeter: Perimeter.PEER_SUPPORT, score: 5, questions: [ { id: 'ps1-3', text: "Do you collaborate with other data analysts using these skills?", answer: "Yes, Sarah is very helpful and often shares tips and reviews my code." } ] },
    { perimeter: Perimeter.WORKPLACE_ENABLERS, score: 2, questions: [ { id: 'we1-3', text: "Do you have the necessary software and data access to apply your training?", answer: 4 }, {id: 'we2-3', text: "Do you feel you have enough time to practice these new skills?", answer: "No, project deadlines are very tight."} ] },
  ],
};

const MOCK_EMPLOYEE_4: Employee = {
  id: 4,
  name: "Michael Brown",
  role: "Junior Project Coordinator",
  department: "Project Management",
  training: "Agile Project Management",
  managerId: 102,
  trainingEffectiveness: 3,
  trainerName: "Jane Smith",
  proficiency: [
    { perimeter: Perimeter.PERCEIVED_UTILITY, score: 5, questions: [{ id: 'pu1-4', text: "Do you believe Agile methodologies are the right fit for your projects?", answer: 5 }] },
    { perimeter: Perimeter.LEARNING_APPLICATION_FREQUENCY, score: 3, questions: [{ id: 'laf1-4', text: "How frequently are you able to use Agile ceremonies like daily stand-ups or retrospectives?", answer: "Only for one of my three projects. The others still use a waterfall approach." }] },
    { perimeter: Perimeter.PERFORMANCE_IMPROVEMENT, score: 4, questions: [{ id: 'pi1-4', text: "Have you seen improvements in the project that is using Agile?", answer: "Yes, communication is much better and we catch issues faster." }] },
    { perimeter: Perimeter.MANAGER_SUPPORT, score: 5, questions: [{ id: 'ms1-4', text: "Does your manager advocate for using Agile on more projects?", answer: 5 }] },
    { perimeter: Perimeter.PEER_SUPPORT, score: 4, questions: [{ id: 'ps1-4', text: "Are your teammates on board with the Agile approach?", answer: "Mostly, but there's some resistance to change from a few senior members." }] },
    { perimeter: Perimeter.WORKPLACE_ENABLERS, score: 3, questions: [{ id: 'we1-4', text: "Does the project management software support Agile workflows well?", answer: "Not really, we're using a tool that's not designed for Kanban boards, which makes it clumsy." }, { id: 'we2-4', text: "Is there organizational buy-in for a full Agile transformation?", answer: "It's happening, but slowly. There's a mix of methodologies right now which creates confusion." }] },
  ],
};

// --- NEW DATA ---

// Team 1: Leadership Development
const MOCK_EMPLOYEE_5: Employee = {
  id: 5,
  name: "Liam Parker",
  role: "Aspiring Team Lead",
  department: "Product",
  training: "Leadership Development Program",
  managerId: 101,
  trainingEffectiveness: 2,
  trainerName: "Dr. Evelyn Reed",
  proficiency: [
    { perimeter: Perimeter.PERCEIVED_UTILITY, score: 3, questions: [{ id: 'pu1-5', text: "Do you find the leadership concepts from the training relevant to your career goals?", answer: 3 }, { id: 'pu2-5', text: "Are you concerned the concepts are too theoretical?", answer: "Yes, it's hard to see how they apply without a team to manage." }] },
    { perimeter: Perimeter.LEARNING_APPLICATION_FREQUENCY, score: 2, questions: [{ id: 'laf1-5', text: "Have you had the opportunity to lead a project or a significant task since the training?", answer: "No, not yet." }, { id: 'laf2-5', text: "How often do you practice skills like delegation or providing constructive feedback?", answer: "Rarely, as I don't have a team to manage." }] },
    { perimeter: Perimeter.PERFORMANCE_IMPROVEMENT, score: 3, questions: [{ id: 'pi1-5', text: "Has the training helped you in your current role?", answer: "It's helped me understand my manager's perspective better, but I haven't been able to apply the leadership skills directly." }] },
    { perimeter: Perimeter.MANAGER_SUPPORT, score: 2, questions: [{ id: 'ms1-5', text: "Has your manager assigned you any tasks with leadership responsibilities (e.g., mentoring a junior, leading a meeting)?", answer: 2 }, { id: 'ms2-5', text: "Have you discussed a development plan with your manager for transitioning into a lead role?", answer: "We had one conversation, but there haven't been any follow-up actions." }] },
    { perimeter: Perimeter.PEER_SUPPORT, score: 2, questions: [{ id: 'ps1-5', text: "Do your peers see you as a potential leader?", answer: 2 }, { id: 'ps2-5', text: "Do your peers come to you for guidance or support?", answer: "Not really, they usually go to the existing team leads." }] },
    { perimeter: Perimeter.WORKPLACE_ENABLERS, score: 3, questions: [{ id: 'we1-5', text: "Are there clear pathways or opportunities for moving into leadership roles in your department?", answer: 3 }] },
  ],
};

const MOCK_EMPLOYEE_6: Employee = {
  id: 6,
  name: "Chloe Adams",
  role: "Aspiring Team Lead",
  department: "Product",
  training: "Leadership Development Program",
  managerId: 101,
  trainingEffectiveness: 4,
  trainerName: "Dr. Evelyn Reed",
  proficiency: [
    { perimeter: Perimeter.PERCEIVED_UTILITY, score: 3, questions: [{ id: 'pu1-6', text: "Do you find the leadership concepts from the training relevant to your career goals?", answer: 5 }, { id: 'pu2-6', text: "Do you see a clear opportunity to apply these skills in a formal leadership role in the near future?", answer: "I'm not sure. The training is great, but there aren't any open team lead positions right now, and I'm not sure what the future plan is." }] },
    { perimeter: Perimeter.LEARNING_APPLICATION_FREQUENCY, score: 4, questions: [{ id: 'laf1-6', text: "Have you had the opportunity to lead a project or a significant task since the training?", answer: "Yes, my manager let me lead the last feature rollout." }] },
    { perimeter: Perimeter.PERFORMANCE_IMPROVEMENT, score: 4, questions: [{ id: 'pi1-6', text: "How did leading the feature rollout go?", answer: "It went well! The team responded positively, and we hit our deadline." }] },
    { perimeter: Perimeter.MANAGER_SUPPORT, score: 5, questions: [{ id: 'ms1-6', text: "Does your manager actively look for opportunities for you to practice leadership skills?", answer: 5 }] },
    { perimeter: Perimeter.PEER_SUPPORT, score: 5, questions: [{ id: 'ps1-6', text: "Did your team support you when you were leading the feature rollout?", answer: 5 }] },
    { perimeter: Perimeter.WORKPLACE_ENABLERS, score: 4, questions: [{ id: 'we1-6', text: "Do you feel the company culture supports promoting from within?", answer: 4 }] },
  ],
};

// Team 2: Customer Service
const MOCK_EMPLOYEE_7: Employee = {
  id: 7,
  name: "Olivia Chen",
  role: "Customer Support Rep",
  department: "Customer Support",
  training: "Customer Service Excellence",
  managerId: 102,
  trainingEffectiveness: 5,
  trainerName: "Jane Smith",
  proficiency: [
    { perimeter: Perimeter.PERCEIVED_UTILITY, score: 5, questions: [{id: 'pu1-7', text: "Has the training on de-escalation techniques been useful?", answer: 5 }] },
    { perimeter: Perimeter.LEARNING_APPLICATION_FREQUENCY, score: 5, questions: [{id: 'laf1-7', text: "How often do you use the new communication strategies?", answer: "In almost every customer interaction." }] },
    { perimeter: Perimeter.PERFORMANCE_IMPROVEMENT, score: 5, questions: [{id: 'pi1-7', text: "Have you seen a change in your customer satisfaction scores?", answer: "Yes, my CSAT score has increased by 10% since the training." }] },
    { perimeter: Perimeter.MANAGER_SUPPORT, score: 4, questions: [{id: 'ms1-7', text: "Does your manager recognize your improved performance?", answer: 4 }] },
    { perimeter: Perimeter.PEER_SUPPORT, score: 4, questions: [{id: 'ps1-7', text: "Do you share best practices with your team?", answer: 4 }] },
    { perimeter: Perimeter.WORKPLACE_ENABLERS, score: 2, questions: [{id: 'we1-7', text: "Do your tools and systems help or hinder you when applying your new skills?", answer: "They hinder me. Our CRM is very slow, and I can't log customer interactions efficiently, which sometimes makes it hard to apply the more personalized techniques I learned." }] },
  ],
};

const MOCK_EMPLOYEE_8: Employee = {
  id: 8,
  name: "Noah Rodriguez",
  role: "Customer Support Rep",
  department: "Customer Support",
  training: "Customer Service Excellence",
  managerId: 102,
  trainingEffectiveness: 3,
  trainerName: "Jane Smith",
  proficiency: [
    { perimeter: Perimeter.PERCEIVED_UTILITY, score: 2, questions: [{id: 'pu1-8', text: "Do you think the training was relevant?", answer: 2 }, { id: 'pu2-8', text: "Why do you feel that way?", answer: "Some of the scenarios felt unrealistic for the types of calls I usually handle." }] },
    { perimeter: Perimeter.LEARNING_APPLICATION_FREQUENCY, score: 2, questions: [{id: 'laf1-8', text: "How often are you able to successfully apply the de-escalation techniques?", answer: "Only a few times a week. I often revert to my old habits under pressure." }] },
    { perimeter: Perimeter.PERFORMANCE_IMPROVEMENT, score: 3, questions: [{id: 'pi1-8', text: "Have your key metrics (e.g., first call resolution) improved?", answer: "Only slightly. I feel like I'm handling calls better, but it's not showing in the numbers yet." }] },
    { perimeter: Perimeter.MANAGER_SUPPORT, score: 3, questions: [{id: 'ms1-8', text: "Does your manager provide coaching based on the training concepts?", answer: 3 }] },
    { perimeter: Perimeter.PEER_SUPPORT, score: 2, questions: [{id: 'ps1-8', text: "Does your team collaborate to solve difficult customer issues?", answer: "Not really. Everyone mostly works on their own queue. It feels very siloed." }, {id: 'ps2-8', text: "Is there a culture of knowledge sharing on your team?", answer: "No, there's no formal process for it, and people are often too busy to help." }] },
    { perimeter: Perimeter.WORKPLACE_ENABLERS, score: 4, questions: [{id: 'we1-8', text: "Do you have the right tools for the job?", answer: 4 }] },
  ],
};

// Team 3: Cloud Architecture
const MOCK_EMPLOYEE_9: Employee = {
  id: 9,
  name: "Ava Nguyen",
  role: "Cloud Engineer",
  department: "Cloud Engineering",
  training: "Cloud Solutions Architecture (AWS)",
  managerId: 103,
  trainingEffectiveness: 5,
  trainerName: "Dr. Alan Grant",
  proficiency: [
    { perimeter: Perimeter.PERCEIVED_UTILITY, score: 5, questions: [{id: 'pu1-9', text: "Was the Cloud Solutions Architecture training directly applicable to your work?", answer: "Yes, 100%. We started using the serverless patterns we learned about the very next week." }] },
    { perimeter: Perimeter.LEARNING_APPLICATION_FREQUENCY, score: 5, questions: [{id: 'laf1-9', text: "How frequently do you apply the concepts from the training?", answer: "Daily. It's fundamental to my current project." }] },
    { perimeter: Perimeter.PERFORMANCE_IMPROVEMENT, score: 5, questions: [{id: 'pi1-9', text: "Can you give an example of a positive business outcome from applying the training?", answer: "We re-architected a service using principles from the training, which has reduced our infrastructure costs for that service by 40%." }] },
    { perimeter: Perimeter.MANAGER_SUPPORT, score: 5, questions: [{id: 'ms1-9', text: "Does your manager give you the autonomy to implement new architectures?", answer: 5 }] },
    { perimeter: Perimeter.PEER_SUPPORT, score: 5, questions: [{id: 'ps1-9', text: "Does your team embrace new cloud technologies and patterns?", answer: "Absolutely, we are all eager to learn and improve our systems." }] },
    { perimeter: Perimeter.WORKPLACE_ENABLERS, score: 5, questions: [{id: 'we1-9', text: "Do you have the necessary budget and tools to build and experiment with new cloud solutions?", answer: 5 }] },
  ],
};

const MOCK_EMPLOYEE_10: Employee = {
  id: 10,
  name: "James Kim",
  role: "Cloud Engineer",
  department: "Cloud Engineering",
  training: "Cloud Solutions Architecture (AWS)",
  managerId: 103,
  trainingEffectiveness: 4,
  trainerName: "Dr. Alan Grant",
  proficiency: [
    { perimeter: Perimeter.PERCEIVED_UTILITY, score: 3, questions: [{id: 'pu1-10', text: "Do you believe the cloud skills are important for your role?", answer: 3 }, {id: 'pu2-10', text: "Do you feel the training was too theoretical?", answer: "Yes, it covered a lot of concepts but not enough hands-on examples for our specific environment." }] },
    { perimeter: Perimeter.LEARNING_APPLICATION_FREQUENCY, score: 2, questions: [{id: 'laf1-10', text: "How often have you had a chance to design a new cloud component since the training?", answer: "I haven't had a chance yet. I'm mostly doing maintenance on existing systems." }] },
    { perimeter: Perimeter.PERFORMANCE_IMPROVEMENT, score: 2, questions: [{id: 'pi1-10', text: "Have you been able to improve any of the existing systems using your new knowledge?", answer: "I've made some suggestions, but I'm not sure how to implement them. The training was very high-level, and I'm struggling with the practical application." }, {id: 'pi2-10', text: "Do you feel confident in your ability to apply the training?", answer: 2 }] },
    { perimeter: Perimeter.MANAGER_SUPPORT, score: 3, questions: [{id: 'ms1-10', text: "Has your manager paired you with a senior engineer to help apply the training?", answer: "No, but he has mentioned it might be a good idea." }] },
    { perimeter: Perimeter.PEER_SUPPORT, score: 2, questions: [{id: 'ps1-10', text: "Are your peers available to answer questions?", answer: "Not often. Most senior engineers are too busy with their own projects to provide guidance." }] },
    { perimeter: Perimeter.WORKPLACE_ENABLERS, score: 3, questions: [{id: 'we1-10', text: "Are there sandbox environments where you can safely practice and experiment?", answer: 3 }] },
  ],
};

// --- MANAGERIAL TRAINING DATA ---
const MANAGER_AS_TRAINEE_1: Employee = {
  id: 101, // Corresponds to Maria Garcia's user ID
  name: "Maria Garcia",
  role: "Manager",
  department: "Leadership",
  training: "Strategic Leadership Workshop",
  trainingEffectiveness: 4,
  trainerName: "Dr. Evelyn Reed",
  proficiency: [
    { perimeter: Perimeter.STRATEGIC_THINKING, score: 4, questions: [{id: 'st1-101', text: "How has the training improved your ability to align team goals with company objectives?", answer: 4 }] },
    { perimeter: Perimeter.TEAM_LEADERSHIP, score: 5, questions: [{id: 'tl1-101', text: "Are you applying new techniques to motivate your team?", answer: "Yes, the situational leadership models have been very effective."}] },
    { perimeter: Perimeter.CONFLICT_RESOLUTION, score: 4, questions: [{id: 'cr1-101', text: "Do you feel better equipped to handle interpersonal conflicts within your team?", answer: 4 }] },
    { perimeter: Perimeter.PERFORMANCE_IMPROVEMENT, score: 5, questions: [{id: 'pi1-101', text: "Have you seen a positive impact on your team's performance since the training?", answer: "Yes, team velocity is up by 15%." }] },
  ]
};

const MANAGER_AS_TRAINEE_2: Employee = {
  id: 102, // Corresponds to David Chen's user ID
  name: "David Chen",
  role: "Manager",
  department: "Leadership",
  training: "Strategic Leadership Workshop",
  trainingEffectiveness: 3,
  trainerName: "Dr. Evelyn Reed",
  proficiency: [
    { perimeter: Perimeter.STRATEGIC_THINKING, score: 3, questions: [{id: 'st1-102', text: "How has the training improved your ability to align team goals with company objectives?", answer: "I understand the concepts, but struggle to translate high-level strategy into daily tasks for my team." }] },
    { perimeter: Perimeter.TEAM_LEADERSHIP, score: 4, questions: [{id: 'tl1-102', text: "Are you applying new techniques to motivate your team?", answer: "I've tried a few, with mixed results."}] },
    { perimeter: Perimeter.CONFLICT_RESOLUTION, score: 2, questions: [{id: 'cr1-102', text: "Do you feel better equipped to handle interpersonal conflicts within your team?", answer: "No, I'm still not comfortable mediating disputes and tend to avoid them." }] },
    { perimeter: Perimeter.PERFORMANCE_IMPROVEMENT, score: 3, questions: [{id: 'pi1-102', text: "Have you seen a positive impact on your team's performance since the training?", answer: "Not yet, I think I need more coaching on how to apply these skills." }] },
  ]
};

const MANAGER_AS_TRAINEE_3: Employee = {
  id: 103, // Corresponds to Ben Carter's user ID
  name: "Ben Carter",
  role: "Manager",
  department: "Leadership",
  training: "Strategic Leadership Workshop",
  trainingEffectiveness: 5,
  trainerName: "Dr. Evelyn Reed",
  proficiency: [
    { perimeter: Perimeter.STRATEGIC_THINKING, score: 5, questions: [{id: 'st1-103', text: "How has the training improved your ability to align team goals with company objectives?", answer: 5 }] },
    { perimeter: Perimeter.TEAM_LEADERSHIP, score: 4, questions: [{id: 'tl1-103', text: "Are you applying new techniques to motivate your team?", answer: "Yes, the coaching models have been particularly helpful for the senior engineers."}] },
    { perimeter: Perimeter.CONFLICT_RESOLUTION, score: 4, questions: [{id: 'cr1-103', text: "Do you feel better equipped to handle interpersonal conflicts within your team?", answer: 4 }] },
    { perimeter: Perimeter.PERFORMANCE_IMPROVEMENT, score: 5, questions: [{id: 'pi1-103', text: "Have you seen a positive impact on your team's performance since the training?", answer: "Yes, the team's deployment frequency has increased by 20% due to clearer strategic direction." }] },
  ]
};


export const MOCK_EMPLOYEES: Employee[] = [
  MOCK_EMPLOYEE_EXCELLING,
  MOCK_EMPLOYEE_STRUGGLING,
  MOCK_EMPLOYEE_3,
  MOCK_EMPLOYEE_4,
  MOCK_EMPLOYEE_5,
  MOCK_EMPLOYEE_6,
  MOCK_EMPLOYEE_7,
  MOCK_EMPLOYEE_8,
  MOCK_EMPLOYEE_9,
  MOCK_EMPLOYEE_10,
  MANAGER_AS_TRAINEE_1,
  MANAGER_AS_TRAINEE_2,
  MANAGER_AS_TRAINEE_3,
];

export const MOCK_USERS: User[] = [
    { id: 101, name: "Maria Garcia (Manager)", role: 'Manager', managesIds: [1, 3, 5, 6] },
    { id: 102, name: "David Chen (Manager)", role: 'Manager', managesIds: [2, 4, 7, 8] },
    { id: 103, name: "Ben Carter (Manager)", role: 'Manager', managesIds: [9, 10] },
    { id: 2, name: "John Davis (Employee)", role: 'Employee', employeeId: 2 },
    { id: 201, name: "HR Admin", role: 'HR' },
    { id: 301, name: "CEO (Higher Mgmt)", role: 'Higher Management' },
];

export const ROLES = [...new Set(MOCK_EMPLOYEES.map(e => e.role))];

export const PERIMETERS_ORDER: Perimeter[] = [
  Perimeter.PERCEIVED_UTILITY,
  Perimeter.LEARNING_APPLICATION_FREQUENCY,
  Perimeter.PERFORMANCE_IMPROVEMENT,
  Perimeter.MANAGER_SUPPORT,
  Perimeter.PEER_SUPPORT,
  Perimeter.WORKPLACE_ENABLERS,
  Perimeter.STRATEGIC_THINKING,
  Perimeter.TEAM_LEADERSHIP,
  Perimeter.CONFLICT_RESOLUTION,
];