require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const Internship = require('../models/Internship');
const Module = require('../models/Module');
const Assignment = require('../models/Assignment');
const Enrollment = require('../models/Enrollment');
const Submission = require('../models/Submission');
const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  try {
    // Drop old indexes that might conflict
    try {
      await Enrollment.collection.dropIndex('intern_1_internship_1');
      console.log('✓ Dropped old enrollment index');
    } catch (err) {
      // Index might not exist
    }

    // Drop old submission index that uses 'intern' instead of 'user'
    try {
      await mongoose.connection.collection('submissions').dropIndex('assignment_1_intern_1_attemptNumber_1');
      console.log('✓ Dropped old submission index');
    } catch (err) {
      // Index might not exist
    }

    await User.deleteMany({});
    await Internship.deleteMany({});
    await Enrollment.deleteMany({});
    await Announcement.deleteMany({});
    await Module.deleteMany({});
    await Assignment.deleteMany({});
    await Notification.deleteMany({});
    await Submission.deleteMany({});
    console.log('✓ Database cleared');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
};

async function seedDatabase() {
  try {
    console.log('\n🌱 Starting database seeding...\n');
    
    await connectDB();
    await clearDatabase();

    // Seed Users
    console.log('👥 Creating users...');
    
    const admin = await User.create({
      firstName: 'Shashi',
      lastName: 'Kumar',
      email: 'shashicoeb@gmail.com',
      password: 'Shashi@123',
      role: 'admin',
      phone: '+91 9876543210',
      bio: 'Platform administrator with extensive experience in educational technology.',
      skills: ['Management', 'Leadership', 'EdTech']
    });

    const mentors = await User.create([
      {
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@techfield.com',
        password: 'Password123',
        role: 'mentor',
        phone: '+91 9876543211',
        bio: 'Full-stack developer with 10+ years of experience in web technologies.',
        skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
        githubProfile: 'https://github.com/sarahjohnson',
        linkedInProfile: 'https://linkedin.com/in/sarahjohnson'
      },
      {
        firstName: 'Prof. Michael',
        lastName: 'Chen',
        email: 'michael.chen@techfield.com',
        password: 'Password123',
        role: 'mentor',
        phone: '+91 9876543212',
        bio: 'Data scientist specializing in machine learning and AI applications.',
        skills: ['Python', 'TensorFlow', 'Data Analysis', 'ML'],
        githubProfile: 'https://github.com/michaelchen',
        linkedInProfile: 'https://linkedin.com/in/michaelchen'
      },
      {
        firstName: 'Emily',
        lastName: 'Rodriguez',
        email: 'emily.rodriguez@techfield.com',
        password: 'Password123',
        role: 'mentor',
        phone: '+91 9876543213',
        bio: 'UI/UX designer passionate about creating intuitive user experiences.',
        skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
        linkedInProfile: 'https://linkedin.com/in/emilyrodriguez'
      }
    ]);

    const interns = await User.create([
      {
        firstName: 'Rahul',
        lastName: 'Sharma',
        email: 'rahul.sharma@example.com',
        password: 'Password123',
        role: 'intern',
        phone: '+91 9876543214',
        bio: 'Computer science student passionate about web development.',
        skills: ['JavaScript', 'React', 'HTML', 'CSS'],
        githubProfile: 'https://github.com/rahulsharma'
      },
      {
        firstName: 'Priya',
        lastName: 'Patel',
        email: 'priya.patel@example.com',
        password: 'Password123',
        role: 'intern',
        phone: '+91 9876543215',
        bio: 'Aspiring data scientist with strong analytical skills.',
        skills: ['Python', 'Pandas', 'SQL', 'Statistics'],
        githubProfile: 'https://github.com/priyapatel'
      },
      {
        firstName: 'Amit',
        lastName: 'Kumar',
        email: 'amit.kumar@example.com',
        password: 'Password123',
        role: 'intern',
        phone: '+91 9876543216',
        bio: 'Full-stack developer enthusiast learning modern technologies.',
        skills: ['Node.js', 'Express', 'MongoDB', 'React'],
        githubProfile: 'https://github.com/amitkumar'
      },
      {
        firstName: 'Sneha',
        lastName: 'Gupta',
        email: 'sneha.gupta@example.com',
        password: 'Password123',
        role: 'intern',
        phone: '+91 9876543217',
        bio: 'UI/UX design student with a creative mindset.',
        skills: ['Figma', 'Sketch', 'Photoshop', 'Illustrator']
      },
      {
        firstName: 'Vikram',
        lastName: 'Singh',
        email: 'vikram.singh@example.com',
        password: 'Password123',
        role: 'intern',
        phone: '+91 9876543218',
        bio: 'Mobile app developer learning cross-platform technologies.',
        skills: ['React Native', 'Flutter', 'JavaScript', 'Dart'],
        githubProfile: 'https://github.com/vikramsingh'
      }
    ]);

    console.log(`✓ Created ${1 + mentors.length + interns.length} users\n`);

    // Seed Internships
    console.log('💼 Creating internships...');
    const internships = await Internship.create([
      {
        title: 'Full Stack Web Development',
        slug: 'full-stack-web-development',
        description: 'Learn to build modern web applications using React, Node.js, and MongoDB. This comprehensive program covers both frontend and backend development.',
        domain: 'web-development',
        skillLevel: 'intermediate',
        duration: { weeks: 12, hours: 240 },
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-04-15'),
        applicationDeadline: new Date('2025-01-10'),
        maxInterns: 30,
        currentEnrollments: 3,
        mentor: mentors[0]._id,
        prerequisites: ['HTML', 'CSS', 'JavaScript basics'],
        learningOutcomes: ['Build full-stack applications', 'Master React and Node.js', 'Deploy to cloud platforms'],
        status: 'open',
        category: 'Web Development',
        company: 'TechFieldSolution'
      },
      {
        title: 'Data Science & Machine Learning',
        slug: 'data-science-machine-learning',
        description: 'Dive into the world of data science and machine learning. Learn Python, data analysis, visualization, and ML algorithms.',
        domain: 'data-science',
        skillLevel: 'advanced',
        duration: { weeks: 16, hours: 320 },
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-05-30'),
        applicationDeadline: new Date('2025-01-25'),
        maxInterns: 25,
        currentEnrollments: 2,
        mentor: mentors[1]._id,
        prerequisites: ['Python programming', 'Statistics basics', 'Linear algebra'],
        learningOutcomes: ['Analyze complex datasets', 'Build ML models', 'Deploy ML solutions'],
        status: 'open',
        category: 'Data Science',
        company: 'TechFieldSolution'
      },
      {
        title: 'UI/UX Design Mastery',
        slug: 'ui-ux-design-mastery',
        description: 'Master the art of creating beautiful and intuitive user interfaces. Learn design principles, prototyping, and user research.',
        domain: 'ui-ux-design',
        skillLevel: 'beginner',
        duration: { weeks: 10, hours: 200 },
        startDate: new Date('2025-01-20'),
        endDate: new Date('2025-04-01'),
        applicationDeadline: new Date('2025-01-15'),
        maxInterns: 20,
        currentEnrollments: 1,
        mentor: mentors[2]._id,
        prerequisites: ['Basic design knowledge', 'Creativity'],
        learningOutcomes: ['Design user-centric interfaces', 'Create prototypes', 'Conduct user research'],
        status: 'open',
        category: 'Design',
        company: 'TechFieldSolution'
      },
      {
        title: 'Mobile App Development',
        slug: 'mobile-app-development',
        description: 'Build cross-platform mobile applications using React Native and Flutter. Learn mobile UI patterns and deployment.',
        domain: 'mobile-development',
        skillLevel: 'intermediate',
        duration: { weeks: 14, hours: 280 },
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-06-15'),
        applicationDeadline: new Date('2025-02-25'),
        maxInterns: 25,
        currentEnrollments: 0,
        mentor: mentors[0]._id,
        prerequisites: ['JavaScript', 'React basics'],
        learningOutcomes: ['Build native mobile apps', 'Publish to app stores', 'Optimize performance'],
        status: 'draft',
        category: 'Mobile Development',
        company: 'TechFieldSolution'
      },
      {
        title: 'DevOps & Cloud Computing',
        slug: 'devops-cloud-computing',
        description: 'Learn modern DevOps practices, CI/CD pipelines, containerization, and cloud infrastructure management.',
        domain: 'devops',
        skillLevel: 'advanced',
        duration: { weeks: 12, hours: 240 },
        startDate: new Date('2024-12-01'),
        endDate: new Date('2025-03-01'),
        applicationDeadline: new Date('2024-11-25'),
        maxInterns: 20,
        currentEnrollments: 0,
        mentor: mentors[0]._id,
        prerequisites: ['Linux basics', 'Networking', 'Programming'],
        learningOutcomes: ['Set up CI/CD pipelines', 'Manage cloud infrastructure', 'Container orchestration'],
        status: 'archived',
        category: 'DevOps',
        company: 'TechFieldSolution'
      }
    ]);

    console.log(`✓ Created ${internships.length} internships\n`);

    // Seed Modules for Full Stack internship
    console.log('📚 Creating modules and assignments...');
    const modules = await Module.create([
      {
        title: 'Introduction to Web Development',
        description: 'Get started with web development fundamentals, HTML5, CSS3, and responsive design.',
        internship: internships[0]._id,
        order: 1,
        duration: { hours: 20 },
        isPublished: true,
        publishDate: new Date('2025-01-15'),
        lessons: [
          { title: 'HTML5 Fundamentals', order: 1, type: 'video', duration: 60, content: 'Introduction to HTML5 semantic elements and structure.' },
          { title: 'CSS3 Styling', order: 2, type: 'video', duration: 90, content: 'Learn modern CSS3 features and flexbox.' },
          { title: 'Responsive Design', order: 3, type: 'video', duration: 75, content: 'Media queries and mobile-first approach.' }
        ]
      },
      {
        title: 'JavaScript Essentials',
        description: 'Master JavaScript ES6+ features, DOM manipulation, and async programming.',
        internship: internships[0]._id,
        order: 2,
        duration: { hours: 30 },
        isPublished: true,
        publishDate: new Date('2025-01-22'),
        lessons: [
          { title: 'ES6+ Features', order: 1, type: 'video', duration: 120, content: 'Arrow functions, destructuring, spread operators.' },
          { title: 'DOM Manipulation', order: 2, type: 'video', duration: 90, content: 'Working with the Document Object Model.' },
          { title: 'Async JavaScript', order: 3, type: 'video', duration: 100, content: 'Promises, async/await, fetch API.' }
        ]
      },
      {
        title: 'React Fundamentals',
        description: 'Build interactive user interfaces with React, hooks, and state management.',
        internship: internships[0]._id,
        order: 3,
        duration: { hours: 40 },
        isPublished: true,
        publishDate: new Date('2025-02-05'),
        lessons: [
          { title: 'React Components', order: 1, type: 'video', duration: 120, content: 'Functional and class components.' },
          { title: 'React Hooks', order: 2, type: 'video', duration: 150, content: 'useState, useEffect, custom hooks.' },
          { title: 'State Management', order: 3, type: 'video', duration: 100, content: 'Context API and Redux basics.' }
        ]
      },
      {
        title: 'Backend with Node.js',
        description: 'Create RESTful APIs using Node.js, Express, and MongoDB.',
        internship: internships[0]._id,
        order: 4,
        duration: { hours: 35 },
        isPublished: false,
        lessons: [
          { title: 'Node.js Basics', order: 1, type: 'video', duration: 90 },
          { title: 'Express Framework', order: 2, type: 'video', duration: 120 },
          { title: 'MongoDB Integration', order: 3, type: 'video', duration: 110 }
        ]
      }
    ]);

    // Seed Assignments
    const assignments = await Assignment.create([
      {
        title: 'Build a Portfolio Website',
        description: 'Create a responsive personal portfolio website using HTML5, CSS3, and JavaScript. Include sections for about, projects, and contact.',
        module: modules[0]._id,
        internship: internships[0]._id,
        type: 'project',
        dueDate: new Date('2025-02-01'),
        maxScore: 100,
        passingScore: 70,
        allowLateSubmission: true,
        lateSubmissionPenalty: 10,
        instructions: 'Use semantic HTML\nMake it fully responsive\nAdd smooth animations\nDeploy to GitHub Pages',
        createdBy: mentors[0]._id,
        isPublished: true
      },
      {
        title: 'JavaScript Quiz Application',
        description: 'Build an interactive quiz app with timer, score tracking, and results display.',
        module: modules[1]._id,
        internship: internships[0]._id,
        type: 'project',
        dueDate: new Date('2025-02-15'),
        maxScore: 100,
        passingScore: 75,
        allowLateSubmission: true,
        lateSubmissionPenalty: 5,
        instructions: 'Use ES6+ features\nImplement proper error handling\nAdd local storage\nInclude unit tests',
        createdBy: mentors[0]._id,
        isPublished: true
      },
      {
        title: 'React Todo App with API',
        description: 'Create a full-featured todo application with CRUD operations using React and a backend API.',
        module: modules[2]._id,
        internship: internships[0]._id,
        type: 'project',
        dueDate: new Date('2025-03-01'),
        maxScore: 150,
        passingScore: 100,
        allowLateSubmission: false,
        instructions: 'Use React hooks\nImplement authentication\nAdd loading states\nDeploy both frontend and backend',
        createdBy: mentors[0]._id,
        isPublished: true
      }
    ]);

    console.log(`✓ Created ${modules.length} modules and ${assignments.length} assignments\n`);

    // Seed Enrollments
    console.log('📝 Creating enrollments...');
    const enrollments = await Enrollment.create([
      {
        user: interns[0]._id,
        internship: internships[0]._id,
        status: 'active',
        approvedDate: new Date('2025-01-16'),
        progressPercentage: 45,
        totalModulesCompleted: 2,
        totalAssignmentsSubmitted: 2,
        averageScore: 85
      },
      {
        user: interns[1]._id,
        internship: internships[0]._id,
        status: 'active',
        approvedDate: new Date('2025-01-16'),
        progressPercentage: 30,
        totalModulesCompleted: 1,
        totalAssignmentsSubmitted: 1,
        averageScore: 78
      },
      {
        user: interns[2]._id,
        internship: internships[0]._id,
        status: 'active',
        approvedDate: new Date('2025-01-17'),
        progressPercentage: 60,
        totalModulesCompleted: 2,
        totalAssignmentsSubmitted: 2,
        averageScore: 92
      },
      {
        user: interns[3]._id,
        internship: internships[1]._id,
        status: 'approved',
        approvedDate: new Date('2025-02-01'),
        progressPercentage: 0,
        totalModulesCompleted: 0,
        totalAssignmentsSubmitted: 0
      },
      {
        user: interns[4]._id,
        internship: internships[1]._id,
        status: 'active',
        approvedDate: new Date('2025-02-02'),
        progressPercentage: 15,
        totalModulesCompleted: 0,
        totalAssignmentsSubmitted: 0,
        averageScore: 0
      },
      {
        user: interns[0]._id,
        internship: internships[2]._id,
        status: 'pending',
        progressPercentage: 0
      },
      {
        user: interns[3]._id,
        internship: internships[2]._id,
        status: 'active',
        approvedDate: new Date('2025-01-21'),
        progressPercentage: 25,
        totalModulesCompleted: 1,
        averageScore: 88
      }
    ]);

    console.log(`✓ Created ${enrollments.length} enrollments\n`);

    // Seed Submissions
    console.log('📤 Creating submissions...');
    const submissions = await Submission.create([
      {
        assignment: assignments[0]._id,
        user: interns[0]._id,
        submittedAt: new Date('2025-01-30'),
        content: 'Portfolio website showcasing my projects and skills.',
        fileUrl: 'https://github.com/rahulsharma/portfolio',
        status: 'graded',
        score: 85,
        feedback: 'Great work! Design is clean and responsive. Consider adding more interactivity.',
        gradedBy: mentors[0]._id,
        gradedAt: new Date('2025-02-02')
      },
      {
        assignment: assignments[0]._id,
        user: interns[1]._id,
        submittedAt: new Date('2025-01-31'),
        content: 'My personal portfolio with modern design.',
        fileUrl: 'https://github.com/priyapatel/portfolio',
        status: 'graded',
        score: 78,
        feedback: 'Good effort. Work on improving the mobile responsiveness.',
        gradedBy: mentors[0]._id,
        gradedAt: new Date('2025-02-03')
      },
      {
        assignment: assignments[0]._id,
        user: interns[2]._id,
        submittedAt: new Date('2025-01-29'),
        content: 'Fully responsive portfolio with animations.',
        fileUrl: 'https://github.com/amitkumar/portfolio',
        status: 'graded',
        score: 95,
        feedback: 'Excellent work! Outstanding design and implementation.',
        gradedBy: mentors[0]._id,
        gradedAt: new Date('2025-02-01')
      },
      {
        assignment: assignments[1]._id,
        user: interns[2]._id,
        submittedAt: new Date('2025-02-14'),
        content: 'Interactive quiz app with timer and score tracking.',
        fileUrl: 'https://github.com/amitkumar/quiz-app',
        status: 'submitted',
        score: 0
      }
    ]);

    console.log(`✓ Created ${submissions.length} submissions\n`);

    // Seed Announcements
    console.log('📢 Creating announcements...');
    const announcements = await Announcement.create([
      {
        title: 'Welcome to TechFieldSolution LMS!',
        content: 'We are excited to have you join our learning platform. Get ready for an amazing journey of skill development and growth.',
        type: 'general',
        priority: 'high',
        author: admin._id,
        targetAudience: 'all',
        isPublished: true,
        publishDate: new Date('2025-01-10')
      },
      {
        title: 'New Web Development Batch Starting',
        content: 'Our new Full Stack Web Development internship batch starts on January 15th. Make sure to complete the prerequisites before the start date.',
        type: 'event',
        priority: 'high',
        author: mentors[0]._id,
        targetAudience: 'interns',
        internship: internships[0]._id,
        isPublished: true,
        publishDate: new Date('2025-01-12')
      },
      {
        title: 'Assignment Deadline Reminder',
        content: 'Portfolio website assignment is due on February 1st. Make sure to submit your work on time to avoid late submission penalties.',
        type: 'reminder',
        priority: 'medium',
        author: mentors[0]._id,
        targetAudience: 'interns',
        internship: internships[0]._id,
        isPublished: true,
        publishDate: new Date('2025-01-28')
      },
      {
        title: 'Platform Maintenance Schedule',
        content: 'The platform will undergo maintenance on February 10th from 2 AM to 4 AM IST. Please plan your work accordingly.',
        type: 'urgent',
        priority: 'high',
        author: admin._id,
        targetAudience: 'all',
        isPublished: true,
        publishDate: new Date('2025-02-05'),
        expiryDate: new Date('2025-02-11')
      },
      {
        title: 'New UI/UX Design Course Available',
        content: 'We have launched a new UI/UX Design Mastery internship. Check it out if you are interested in design!',
        type: 'update',
        priority: 'medium',
        author: admin._id,
        targetAudience: 'all',
        isPublished: true,
        publishDate: new Date('2025-01-18')
      }
    ]);

    console.log(`✓ Created ${announcements.length} announcements\n`);

    // Seed Notifications
    console.log('🔔 Creating notifications...');
    const notifications = await Notification.create([
      {
        recipient: interns[0]._id,
        sender: admin._id,
        title: 'Enrollment Approved',
        message: 'Your enrollment for Full Stack Web Development has been approved!',
        type: 'enrollment_approved',
        isRead: true,
        readAt: new Date('2025-01-16'),
        link: '/internships'
      },
      {
        recipient: interns[0]._id,
        sender: mentors[0]._id,
        title: 'Assignment Graded',
        message: 'Your Portfolio Website assignment has been graded. Score: 85/100',
        type: 'assignment_graded',
        isRead: false,
        link: '/assignments/portfolio-website'
      },
      {
        recipient: interns[1]._id,
        sender: admin._id,
        title: 'Enrollment Approved',
        message: 'Your enrollment for Full Stack Web Development has been approved!',
        type: 'enrollment_approved',
        isRead: true,
        readAt: new Date('2025-01-16'),
        link: '/internships'
      },
      {
        recipient: interns[2]._id,
        sender: mentors[0]._id,
        title: 'New Module Available',
        message: 'Module "React Fundamentals" is now available in your internship.',
        type: 'module_published',
        isRead: false,
        link: '/modules'
      },
      {
        recipient: interns[3]._id,
        title: 'Welcome to LMS',
        message: 'Welcome to TechFieldSolution LMS! Start exploring available internships.',
        type: 'system',
        isRead: true,
        readAt: new Date('2025-01-10')
      },
      {
        recipient: interns[2]._id,
        sender: mentors[1]._id,
        title: 'New Announcement',
        message: 'New announcement posted: Welcome to Spring 2025 Batch',
        type: 'new_announcement',
        isRead: false,
        link: '/announcements'
      },
      {
        recipient: interns[4]._id,
        sender: mentors[2]._id,
        title: 'Feedback Received',
        message: 'You have received feedback on your recent submission.',
        type: 'feedback_received',
        isRead: false,
        link: '/submissions'
      }
    ]);

    console.log(`✓ Created ${notifications.length} notifications\n`);

    console.log('═══════════════════════════════════════');
    console.log('✅ Database seeding completed successfully!');
    console.log('═══════════════════════════════════════');
    console.log('\n📊 Summary:');
    console.log(`   • Users: ${1 + mentors.length + interns.length} (1 admin, ${mentors.length} mentors, ${interns.length} interns)`);
    console.log(`   • Internships: ${internships.length}`);
    console.log(`   • Modules: ${modules.length}`);
    console.log(`   • Assignments: ${assignments.length}`);
    console.log(`   • Enrollments: ${enrollments.length}`);
    console.log(`   • Submissions: ${submissions.length}`);
    console.log(`   • Announcements: ${announcements.length}`);
    console.log(`   • Notifications: ${notifications.length}`);
    console.log('\n🔑 Test Credentials:');
    console.log('   Admin: shashicoeb@gmail.com / Shashi@123');
    console.log('   Mentor: sarah.johnson@techfield.com / Password123');
    console.log('   Intern: rahul.sharma@example.com / Password123');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
