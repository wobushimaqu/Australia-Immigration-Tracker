import { Occupation, DataPoint } from '../types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const generateData = (baseScore: number, volatility: number, seed: number, baseVolume: number): DataPoint[] => {
    return MONTHS.map((m, i) => {
        // Score generation
        const timeComponent = (i + (seed % 12)) * 0.5;
        const scoreNoise = Math.sin(timeComponent) * volatility + (Math.cos(i * 0.8) * 1.5);
        
        // Volume generation
        // Invitations happen in rounds, so we simulate spikes
        const hasRound = (i + seed) % 3 === 0; 
        const invitationCount = hasRound ? Math.floor(Math.random() * 100) + 20 : 0;
        
        // Applications (Backlog) slowly grows, drops when invitations happen
        const growthRate = Math.floor(Math.random() * 30) + 10;
        // Simulating a fluctuating backlog based on baseVolume
        const backlogNoise = Math.sin(i * 0.2) * (baseVolume * 0.1);
        const applications = Math.floor(baseVolume + (i * growthRate) - (invitationCount * 0.5) + backlogNoise);

        return {
            month: m,
            score189: Math.min(100, Math.max(65, Math.round(baseScore + scoreNoise))),
            score190: Math.min(100, Math.max(65, Math.round(baseScore - 5 + scoreNoise))),
            score491: Math.min(100, Math.max(65, Math.round(baseScore - 15 + scoreNoise))),
            invitations: invitationCount,
            applications: Math.max(0, applications)
        };
    });
};

const DEFINITIONS = [
    // ICT & Technology
    { c: '261111', t: 'ICT Business Analyst', cat: 'ICT', b: 85, vol: 2500 },
    { c: '261112', t: 'Systems Analyst', cat: 'ICT', b: 85, vol: 1800 },
    { c: '261311', t: 'Analyst Programmer', cat: 'ICT', b: 85, vol: 2000 },
    { c: '261312', t: 'Developer Programmer', cat: 'ICT', b: 85, vol: 2200 },
    { c: '261313', t: 'Software Engineer', cat: 'ICT', b: 85, vol: 3500 },
    { c: '261314', t: 'Software Tester', cat: 'ICT', b: 90, vol: 1200 },
    { c: '261399', t: 'Software and Applications Programmers nec', cat: 'ICT', b: 90, vol: 1000 },
    { c: '262111', t: 'Database Administrator', cat: 'ICT', b: 85, vol: 800 },
    { c: '262112', t: 'ICT Security Specialist', cat: 'ICT', b: 90, vol: 1500 },
    { c: '262113', t: 'SystemsAdministrator', cat: 'ICT', b: 85, vol: 900 },
    { c: '263111', t: 'Computer Network and Systems Engineer', cat: 'ICT', b: 80, vol: 1600 },
    { c: '263112', t: 'Network Administrator', cat: 'ICT', b: 80, vol: 700 },
    { c: '263113', t: 'Network Analyst', cat: 'ICT', b: 80, vol: 600 },
    { c: '263212', t: 'ICT Support Engineer', cat: 'ICT', b: 80, vol: 500 },
    { c: '135112', t: 'ICT Project Manager', cat: 'ICT', b: 85, vol: 1300 },
    { c: '261211', t: 'Multimedia Specialist', cat: 'ICT', b: 85, vol: 400 },
    { c: '261212', t: 'Web Developer', cat: 'ICT', b: 85, vol: 1100 },

    // Engineering
    { c: '233111', t: 'Chemical Engineer', cat: 'Engineering', b: 85, vol: 600 },
    { c: '233112', t: 'Materials Engineer', cat: 'Engineering', b: 85, vol: 300 },
    { c: '233211', t: 'Civil Engineer', cat: 'Engineering', b: 85, vol: 2800 },
    { c: '233212', t: 'Geotechnical Engineer', cat: 'Engineering', b: 85, vol: 400 },
    { c: '233213', t: 'Quantity Surveyor', cat: 'Engineering', b: 80, vol: 500 },
    { c: '233214', t: 'Structural Engineer', cat: 'Engineering', b: 85, vol: 600 },
    { c: '233215', t: 'Transport Engineer', cat: 'Engineering', b: 85, vol: 300 },
    { c: '233311', t: 'Electrical Engineer', cat: 'Engineering', b: 85, vol: 1400 },
    { c: '233411', t: 'Electronics Engineer', cat: 'Engineering', b: 85, vol: 900 },
    { c: '233511', t: 'Industrial Engineer', cat: 'Engineering', b: 85, vol: 500 },
    { c: '233512', t: 'Mechanical Engineer', cat: 'Engineering', b: 85, vol: 1900 },
    { c: '233513', t: 'Production or Plant Engineer', cat: 'Engineering', b: 85, vol: 400 },
    { c: '233611', t: 'Mining Engineer (Excluding Petroleum)', cat: 'Engineering', b: 85, vol: 300 },
    { c: '233612', t: 'Petroleum Engineer', cat: 'Engineering', b: 90, vol: 200 },
    { c: '233911', t: 'Aeronautical Engineer', cat: 'Engineering', b: 85, vol: 300 },
    { c: '233913', t: 'Biomedical Engineer', cat: 'Engineering', b: 85, vol: 400 },
    { c: '233914', t: 'Engineering Technologist', cat: 'Engineering', b: 90, vol: 1100 },
    { c: '233915', t: 'Environmental Engineer', cat: 'Engineering', b: 85, vol: 500 },
    { c: '233916', t: 'Naval Architect', cat: 'Engineering', b: 80, vol: 100 },
    { c: '312211', t: 'Civil Engineering Draftsperson', cat: 'Engineering', b: 75, vol: 400 },
    { c: '312311', t: 'Electrical Engineering Draftsperson', cat: 'Engineering', b: 75, vol: 300 },
    { c: '313212', t: 'Telecommunications Field Engineer', cat: 'Engineering', b: 80, vol: 200 },
    { c: '313213', t: 'Telecommunications Network Planner', cat: 'Engineering', b: 80, vol: 200 },
    { c: '313214', t: 'Telecommunications Technical Officer or Technologist', cat: 'Engineering', b: 80, vol: 300 },

    // Health & Medical
    { c: '254499', t: 'Registered Nurse (NEC)', cat: 'Health', b: 70, vol: 3000 },
    { c: '254411', t: 'Nurse Practitioner', cat: 'Health', b: 70, vol: 200 },
    { c: '254412', t: 'Registered Nurse (Aged Care)', cat: 'Health', b: 65, vol: 1500 },
    { c: '254413', t: 'Registered Nurse (Child and Family Health)', cat: 'Health', b: 65, vol: 400 },
    { c: '254414', t: 'Registered Nurse (Community Health)', cat: 'Health', b: 65, vol: 500 },
    { c: '254415', t: 'Registered Nurse (Critical Care and Emergency)', cat: 'Health', b: 65, vol: 800 },
    { c: '254416', t: 'Registered Nurse (Developmental Disability)', cat: 'Health', b: 65, vol: 200 },
    { c: '254417', t: 'Registered Nurse (Disability and Rehabilitation)', cat: 'Health', b: 65, vol: 300 },
    { c: '254418', t: 'Registered Nurse (Medical)', cat: 'Health', b: 65, vol: 1200 },
    { c: '254422', t: 'Registered Nurse (Mental Health)', cat: 'Health', b: 65, vol: 600 },
    { c: '254423', t: 'Registered Nurse (Perioperative)', cat: 'Health', b: 65, vol: 400 },
    { c: '254424', t: 'Registered Nurse (Surgical)', cat: 'Health', b: 65, vol: 500 },
    { c: '254425', t: 'Registered Nurse (Paediatrics)', cat: 'Health', b: 65, vol: 400 },
    { c: '253111', t: 'General Practitioner', cat: 'Health', b: 80, vol: 1100 },
    { c: '253112', t: 'Resident Medical Officer', cat: 'Health', b: 85, vol: 900 },
    { c: '253999', t: 'Medical Practitioners nec', cat: 'Health', b: 80, vol: 300 },
    { c: '251211', t: 'Medical Diagnostic Radiographer', cat: 'Health', b: 75, vol: 600 },
    { c: '251511', t: 'Hospital Pharmacist', cat: 'Health', b: 85, vol: 700 },
    { c: '251513', t: 'Retail Pharmacist', cat: 'Health', b: 90, vol: 800 },
    { c: '252111', t: 'Chiropractor', cat: 'Health', b: 70, vol: 200 },
    { c: '252312', t: 'Dentist', cat: 'Health', b: 85, vol: 900 },
    { c: '252411', t: 'Occupational Therapist', cat: 'Health', b: 70, vol: 500 },
    { c: '252511', t: 'Physiotherapist', cat: 'Health', b: 75, vol: 800 },
    { c: '252611', t: 'Podiatrist', cat: 'Health', b: 70, vol: 200 },
    { c: '252711', t: 'Audiologist', cat: 'Health', b: 75, vol: 200 },
    { c: '252712', t: 'Speech Pathologist', cat: 'Health', b: 75, vol: 400 },
    { c: '234511', t: 'Life Scientist (General)', cat: 'Health', b: 80, vol: 200 },
    { c: '234611', t: 'Medical Laboratory Scientist', cat: 'Health', b: 80, vol: 700 },
    { c: '234711', t: 'Veterinarian', cat: 'Health', b: 75, vol: 400 },
    { c: '272311', t: 'Clinical Psychologist', cat: 'Health', b: 75, vol: 500 },
    { c: '272312', t: 'Educational Psychologist', cat: 'Health', b: 75, vol: 200 },
    { c: '272313', t: 'Organisational Psychologist', cat: 'Health', b: 80, vol: 100 },
    { c: '272314', t: 'Psychotherapist', cat: 'Health', b: 80, vol: 150 },
    { c: '272511', t: 'Social Worker', cat: 'Health', b: 70, vol: 1200 },
    { c: '411111', t: 'Ambulance Officer', cat: 'Health', b: 80, vol: 300 },

    // Education
    { c: '241111', t: 'Early Childhood Teacher', cat: 'Education', b: 70, vol: 1800 },
    { c: '241213', t: 'Primary School Teacher', cat: 'Education', b: 75, vol: 1500 },
    { c: '241311', t: 'Middle School Teacher', cat: 'Education', b: 75, vol: 600 },
    { c: '241411', t: 'Secondary School Teacher', cat: 'Education', b: 70, vol: 2200 },
    { c: '241511', t: 'Special Needs Teacher', cat: 'Education', b: 70, vol: 400 },
    { c: '241512', t: 'Teacher of the Hearing Impaired', cat: 'Education', b: 70, vol: 100 },
    { c: '241513', t: 'Teacher of the Sight Impaired', cat: 'Education', b: 70, vol: 100 },
    { c: '241599', t: 'Special Education Teachers nec', cat: 'Education', b: 75, vol: 200 },
    { c: '134111', t: 'Child Care Centre Manager', cat: 'Education', b: 75, vol: 300 },

    // Business & Finance
    { c: '221111', t: 'Accountant (General)', cat: 'Business', b: 95, vol: 4500 },
    { c: '221112', t: 'Management Accountant', cat: 'Business', b: 95, vol: 1200 },
    { c: '221113', t: 'Taxation Accountant', cat: 'Business', b: 95, vol: 1000 },
    { c: '221213', t: 'External Auditor', cat: 'Business', b: 90, vol: 1500 },
    { c: '221214', t: 'Internal Auditor', cat: 'Business', b: 90, vol: 600 },
    { c: '222112', t: 'Finance Broker', cat: 'Business', b: 85, vol: 400 },
    { c: '222311', t: 'Financial Investment Adviser', cat: 'Business', b: 85, vol: 500 },
    { c: '222312', t: 'Financial Investment Manager', cat: 'Business', b: 90, vol: 300 },
    { c: '224711', t: 'Management Consultant', cat: 'Business', b: 90, vol: 2000 },
    { c: '224999', t: 'Information and Organisation Professionals nec', cat: 'Business', b: 90, vol: 300 },
    { c: '132211', t: 'Finance Manager', cat: 'Business', b: 90, vol: 800 },
    { c: '225113', t: 'Marketing Specialist', cat: 'Business', b: 90, vol: 1800 },
    { c: '223111', t: 'Human Resource Adviser', cat: 'Business', b: 90, vol: 900 },
    { c: '132311', t: 'Human Resource Manager', cat: 'Business', b: 95, vol: 400 },

    // Trades
    { c: '321111', t: 'Automotive Electrician', cat: 'Trades', b: 70, vol: 400 },
    { c: '321211', t: 'Motor Mechanic (General)', cat: 'Trades', b: 70, vol: 1200 },
    { c: '321212', t: 'Diesel Motor Mechanic', cat: 'Trades', b: 70, vol: 500 },
    { c: '321213', t: 'Motorcycle Mechanic', cat: 'Trades', b: 70, vol: 200 },
    { c: '321214', t: 'Small Engine Mechanic', cat: 'Trades', b: 75, vol: 150 },
    { c: '322211', t: 'Sheetmetal Trades Worker', cat: 'Trades', b: 75, vol: 300 },
    { c: '322311', t: 'Metal Fabricator', cat: 'Trades', b: 75, vol: 600 },
    { c: '322313', t: 'Welder (First Class)', cat: 'Trades', b: 75, vol: 700 },
    { c: '323211', t: 'Fitter (General)', cat: 'Trades', b: 75, vol: 800 },
    { c: '323212', t: 'Fitter and Turner', cat: 'Trades', b: 75, vol: 600 },
    { c: '323213', t: 'Fitter - Welder', cat: 'Trades', b: 75, vol: 400 },
    { c: '323214', t: 'Metal Machinist (First Class)', cat: 'Trades', b: 75, vol: 500 },
    { c: '324111', t: 'Panelbeater', cat: 'Trades', b: 70, vol: 300 },
    { c: '324311', t: 'Vehicle Painter', cat: 'Trades', b: 70, vol: 250 },
    { c: '331111', t: 'Bricklayer', cat: 'Trades', b: 65, vol: 500 },
    { c: '331211', t: 'Carpenter and Joiner', cat: 'Trades', b: 65, vol: 800 },
    { c: '331212', t: 'Carpenter', cat: 'Trades', b: 65, vol: 1500 },
    { c: '331213', t: 'Joiner', cat: 'Trades', b: 70, vol: 400 },
    { c: '332211', t: 'Painting Trades Worker', cat: 'Trades', b: 65, vol: 600 },
    { c: '333111', t: 'Glazier', cat: 'Trades', b: 70, vol: 200 },
    { c: '333211', t: 'Fibrous Plasterer', cat: 'Trades', b: 70, vol: 150 },
    { c: '333212', t: 'Solid Plasterer', cat: 'Trades', b: 70, vol: 150 },
    { c: '333411', t: 'Wall and Floor Tiler', cat: 'Trades', b: 65, vol: 400 },
    { c: '334111', t: 'Plumber (General)', cat: 'Trades', b: 75, vol: 1000 },
    { c: '334112', t: 'Airconditioning and Mechanical Services Plumber', cat: 'Trades', b: 75, vol: 300 },
    { c: '334115', t: 'Roof Plumber', cat: 'Trades', b: 75, vol: 200 },
    { c: '341111', t: 'Electrician (General)', cat: 'Trades', b: 80, vol: 1800 },
    { c: '341112', t: 'Electrician (Special Class)', cat: 'Trades', b: 80, vol: 400 },
    { c: '342111', t: 'Airconditioning and Refrigeration Mechanic', cat: 'Trades', b: 75, vol: 600 },
    { c: '351311', t: 'Chef', cat: 'Trades', b: 75, vol: 2500 },
    { c: '351411', t: 'Cook', cat: 'Trades', b: 80, vol: 1500 },
    { c: '394111', t: 'Cabinetmaker', cat: 'Trades', b: 70, vol: 300 },
    { c: '399111', t: 'Boat Builder and Repairer', cat: 'Trades', b: 75, vol: 100 },
    { c: '399112', t: 'Shipwright', cat: 'Trades', b: 75, vol: 50 },

    // Sciences & Other
    { c: '234111', t: 'Agricultural Consultant', cat: 'Science', b: 75, vol: 200 },
    { c: '234112', t: 'Agricultural Scientist', cat: 'Science', b: 75, vol: 300 },
    { c: '234211', t: 'Chemist', cat: 'Science', b: 80, vol: 400 },
    { c: '234311', t: 'Environmental Scientist', cat: 'Science', b: 80, vol: 600 },
    { c: '234411', t: 'Geologist', cat: 'Science', b: 80, vol: 300 },
    { c: '234412', t: 'Geophysicist', cat: 'Science', b: 80, vol: 100 },
    { c: '234914', t: 'Physicist', cat: 'Science', b: 85, vol: 100 },
    { c: '232111', t: 'Architect', cat: 'Science', b: 75, vol: 1200 },
    { c: '232112', t: 'Landscape Architect', cat: 'Science', b: 75, vol: 300 },
    { c: '232212', t: 'Surveyor', cat: 'Science', b: 75, vol: 400 },
    { c: '232213', t: 'Cartographer', cat: 'Science', b: 75, vol: 100 },
    { c: '232214', t: 'Other Spatial Scientist', cat: 'Science', b: 75, vol: 100 },
    { c: '272411', t: 'Historian', cat: 'Science', b: 85, vol: 50 },
    { c: '272413', t: 'Translator', cat: 'Science', b: 90, vol: 600 },
    
    // Legal
    { c: '271111', t: 'Barrister', cat: 'Legal', b: 80, vol: 200 },
    { c: '271311', t: 'Solicitor', cat: 'Legal', b: 80, vol: 1400 },
];

export const ALL_OCCUPATIONS: Occupation[] = DEFINITIONS.map(item => {
    // Generate data
    const volatility = item.b > 85 ? 3 : 5; 
    const seed = parseInt(item.c.substring(0, 4)); 
    const data = generateData(item.b, volatility, seed, item.vol);
    
    // Determine trend based on last 3 months vs first 3 months
    const startAvg = (data[0].score189 + data[1].score189) / 2;
    const endAvg = (data[data.length-1].score189 + data[data.length-2].score189) / 2;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (endAvg > startAvg + 1.5) trend = 'up';
    else if (endAvg < startAvg - 1.5) trend = 'down';

    // Generate generic description
    const description = `Eligible for skilled migration under ANZSCO ${item.c}. This ${item.cat} occupation involves tasks related to ${item.t.toLowerCase()}. Track the latest invitation rounds and application backlog below.`;

    return {
        code: item.c,
        title: item.t,
        category: item.cat,
        trend,
        description,
        data
    };
});