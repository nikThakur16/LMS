/**
 * EduSmart Database Seeder
 * Usage:
 *   node seed.js           → seed without clearing existing data
 *   node seed.js --fresh   → wipe all collections first, then seed
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { configDotenv } from 'dotenv'

configDotenv({ quiet: true })

// ── Models ────────────────────────────────────────────────────────────────────
import { User }       from './src/models/user.model.js'
import { Course }     from './src/models/course.model.js'
import { Modules }    from './src/models/module.model.js'
import { Order }      from './src/models/order.model.js'
import { Enrollment } from './src/models/enrollment.model.js'

// ── Connect ───────────────────────────────────────────────────────────────────
await mongoose.connect(process.env.MONGO_URI)
console.log('\n✅  MongoDB connected\n')

const FRESH = process.argv.includes('--fresh')
if (FRESH) {
  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Modules.deleteMany({}),
    Order.deleteMany({}),
    Enrollment.deleteMany({}),
  ])
  console.log('🗑   Cleared all collections\n')
}

// ── Media helpers ─────────────────────────────────────────────────────────────
// picsum.photos — consistent image per seed keyword (like YouTube thumbnails)
const thumb = (seed) => `https://picsum.photos/seed/${seed}/800/450`

// Public domain MP4 videos — direct stream links, no auth required
// Sources: W3C (w3.org), MDN Web Docs (CC0), W3Schools — all permanently public
const V = {
  // W3C official media files — hosted by the W3C standards body, very stable
  sintelTrailer: 'https://media.w3.org/2010/05/sintel/trailer.mp4',        // ~2 min, 480p
  bunnyTrailer:  'https://media.w3.org/2010/05/bunny/trailer.mp4',         // ~2 min, 480p
  bunnyMovie:    'https://media.w3.org/2010/05/bunny/movie.mp4',           // ~9 min, 480p
  videoMovie:    'https://media.w3.org/2010/05/video/movie_300.mp4',       // ~1 min, small
  // MDN Web Docs CC0 videos — used in MDN live examples, always accessible
  flower:        'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',  // ~1 min
  friday:        'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4',  // ~1 min
  // W3Schools samples — the classic HTML5 video tutorial examples
  w3bbb:         'https://www.w3schools.com/html/mov_bbb.mp4',             // Big Buck Bunny clip
  w3movie:       'https://www.w3schools.com/html/movie.mp4',               // short clip
}

// ── Seed data — every module has a hand-picked video URL ─────────────────────
const COURSES_DATA = [
  {
    title: 'Complete MERN Stack Development',
    description:
      'Master the full JavaScript stack — MongoDB, Express.js, React, and Node.js. Build production-ready full-stack web applications from scratch with real-world projects and best practices.',
    amount: 1499,
    thumbnail: thumb('mern-stack-code'),
    modules: [
      { title: 'Introduction to Node.js and Express',             video: V.sintelTrailer },
      { title: 'Building REST APIs with Express.js',              video: V.bunnyTrailer  },
      { title: 'MongoDB & Mongoose — Schema Design',              video: V.flower        },
      { title: 'React Fundamentals and JSX',                      video: V.friday        },
      { title: 'State Management with React Query & Zustand',     video: V.videoMovie    },
      { title: 'Authentication: JWT & Cookies',                   video: V.w3bbb         },
      { title: 'Deploying MERN Apps to Production',               video: V.bunnyMovie    },
    ],
  },
  {
    title: 'Artificial Intelligence & Machine Learning with Python',
    description:
      'Learn the fundamentals of AI and ML using Python. Covers supervised learning, neural networks, NLP, and hands-on projects using scikit-learn, TensorFlow, and Google Gemini APIs.',
    amount: 1999,
    thumbnail: thumb('ai-machine-learning-neural'),
    modules: [
      { title: 'Python Refresher for Data Science',               video: V.flower        },
      { title: 'Supervised Learning — Regression & Classification', video: V.friday      },
      { title: 'Neural Networks and Deep Learning Basics',        video: V.sintelTrailer },
      { title: 'Natural Language Processing with Transformers',   video: V.bunnyTrailer  },
      { title: 'Working with Google Gemini API',                  video: V.videoMovie    },
      { title: 'Building an AI-Powered Web App',                  video: V.w3movie       },
    ],
  },
  {
    title: 'DevOps & Cloud Engineering Bootcamp',
    description:
      'From Docker containers to Kubernetes orchestration, CI/CD pipelines, and cloud deployment on AWS. Gain hands-on experience with industry-standard DevOps tools and workflows.',
    amount: 2499,
    thumbnail: thumb('devops-docker-cloud-server'),
    modules: [
      { title: 'Linux & Shell Scripting Essentials',              video: V.w3bbb         },
      { title: 'Docker — Containerise Your Applications',         video: V.bunnyTrailer  },
      { title: 'Kubernetes — Orchestration at Scale',             video: V.sintelTrailer },
      { title: 'CI/CD Pipelines with GitHub Actions',             video: V.flower        },
      { title: 'Infrastructure as Code with Terraform',           video: V.friday        },
      { title: 'Monitoring with Prometheus & Grafana',            video: V.videoMovie    },
    ],
  },
  {
    title: 'React Native — Cross-Platform Mobile Development',
    description:
      'Build native iOS and Android apps using React Native and Expo. Covers navigation, state management, camera, push notifications, and publishing to app stores.',
    amount: 1799,
    thumbnail: thumb('react-native-mobile-app'),
    modules: [
      { title: 'Getting Started with Expo & React Native',        video: V.friday        },
      { title: 'Navigation — Stack, Tab, Drawer',                 video: V.flower        },
      { title: 'Styling with StyleSheet & NativeWind',            video: V.videoMovie    },
      { title: 'Connecting to REST APIs & AsyncStorage',          video: V.bunnyTrailer  },
      { title: 'Camera, Location & Push Notifications',           video: V.sintelTrailer },
      { title: 'Publishing to Google Play & App Store',           video: V.w3movie       },
    ],
  },
  {
    title: 'System Design for Software Engineers',
    description:
      'Ace system design interviews and build scalable systems. Covers load balancing, caching, databases, message queues, microservices, and real-world architecture case studies.',
    amount: 2999,
    thumbnail: thumb('system-design-architecture-server'),
    modules: [
      { title: 'Scalability Fundamentals — Vertical vs Horizontal', video: V.bunnyMovie  },
      { title: 'Caching Strategies — Redis & CDN',                video: V.sintelTrailer },
      { title: 'Database Sharding & Replication',                 video: V.w3bbb         },
      { title: 'Message Queues — Kafka & RabbitMQ',               video: V.friday        },
      { title: 'Microservices Architecture Patterns',             video: V.flower        },
      { title: 'Designing YouTube, Twitter & WhatsApp',           video: V.videoMovie    },
    ],
  },
]

// ── Create admin user ─────────────────────────────────────────────────────────
const adminEmail = process.env.ADMIN || 'admin@edusmart.com'
let adminUser = await User.findOne({ email: adminEmail })
if (!adminUser) {
  adminUser = await User.create({
    fullName: 'EduSmart Admin',
    email: adminEmail,
    password: await bcrypt.hash('Admin@123', 10),
    admin: true,
    profilePhoto: 'https://api.dicebear.com/9.x/initials/svg?seed=Admin',
  })
  console.log(`👤  Admin created → ${adminEmail}  |  password: Admin@123`)
} else {
  console.log(`👤  Admin already exists → ${adminEmail}`)
}

// ── Create student users ──────────────────────────────────────────────────────
const STUDENTS_DATA = [
  { fullName: 'Aarav Sharma',  email: 'aarav@student.com',  avatar: 'Aarav'  },
  { fullName: 'Priya Mehta',   email: 'priya@student.com',  avatar: 'Priya'  },
  { fullName: 'Rohan Verma',   email: 'rohan@student.com',  avatar: 'Rohan'  },
]

const students = []
for (const s of STUDENTS_DATA) {
  let student = await User.findOne({ email: s.email })
  if (!student) {
    student = await User.create({
      fullName: s.fullName,
      email: s.email,
      password: await bcrypt.hash('Student@123', 10),
      admin: false,
      profilePhoto: `https://api.dicebear.com/9.x/initials/svg?seed=${s.avatar}`,
    })
    console.log(`👤  Student created → ${s.email}`)
  } else {
    console.log(`👤  Student already exists → ${s.email}`)
  }
  students.push(student)
}

// ── Create courses + modules ──────────────────────────────────────────────────
console.log('\n📚  Seeding courses...\n')
const createdCourses = []

for (const courseData of COURSES_DATA) {
  let course = await Course.findOne({ title: courseData.title })
  if (course) {
    console.log(`   ⏭   Skipping (exists): ${courseData.title}`)
    createdCourses.push(course)
    continue
  }

  // Create modules with their own specific video URLs
  const moduleIds = []
  for (const mod of courseData.modules) {
    const m = await Modules.create({
      title:    mod.title,
      video:    mod.video,
      courseId: null, // patched below
    })
    moduleIds.push(m._id)
  }

  course = await Course.create({
    userId:      adminUser._id,
    title:       courseData.title,
    description: courseData.description,
    amount:      courseData.amount,
    thumbnail:   courseData.thumbnail,
    modules:     moduleIds,
  })

  // Patch courseId back into modules
  await Modules.updateMany({ _id: { $in: moduleIds } }, { courseId: course._id })

  console.log(`   ✅  ${courseData.title}  (${moduleIds.length} modules)`)
  createdCourses.push(course)
}

// ── Enroll students in some courses ──────────────────────────────────────────
console.log('\n🎓  Enrolling students...\n')

const enrollments = [
  { student: students[0], courseIndexes: [0, 1] },
  { student: students[1], courseIndexes: [0, 2, 3] },
  { student: students[2], courseIndexes: [4] },
]

for (const { student, courseIndexes } of enrollments) {
  for (const ci of courseIndexes) {
    const course = createdCourses[ci]
    if (!course) continue

    const alreadyEnrolled = student.purchasedCourse.some(
      (id) => id.toString() === course._id.toString()
    )
    if (alreadyEnrolled) {
      console.log(`   ⏭   Already enrolled: ${student.fullName} → ${course.title}`)
      continue
    }

    const fakeSessionId = `cs_test_seed_${student._id}_${course._id}`
    const existingOrder = await Order.findOne({ stripeSessionId: fakeSessionId })
    if (!existingOrder) {
      await Order.create({
        user:            student._id,
        course:          course._id,
        totalAmount:     course.amount,
        stripeSessionId: fakeSessionId,
      })
      await Enrollment.create({
        userId:          student._id,
        courseId:        course._id,
        stripeSessionId: fakeSessionId,
      })
    }

    await User.findByIdAndUpdate(student._id, {
      $addToSet: { purchasedCourse: course._id },
    })

    console.log(`   ✅  ${student.fullName} enrolled in "${course.title}"`)
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────
const [totalUsers, totalCourses, totalModules, totalOrders] = await Promise.all([
  User.countDocuments(),
  Course.countDocuments(),
  Modules.countDocuments(),
  Order.countDocuments(),
])

console.log('\n' + '─'.repeat(50))
console.log('🌱  Seed complete!\n')
console.log(`   Users     : ${totalUsers}`)
console.log(`   Courses   : ${totalCourses}`)
console.log(`   Modules   : ${totalModules}`)
console.log(`   Orders    : ${totalOrders}`)
console.log('\n' + '─'.repeat(50))
console.log('\n📋  Login credentials:\n')
console.log(`   Admin   → ${adminEmail.padEnd(28)}  password: Admin@123`)
console.log(`   Student → ${'aarav@student.com'.padEnd(28)}  password: Student@123`)
console.log(`   Student → ${'priya@student.com'.padEnd(28)}  password: Student@123`)
console.log(`   Student → ${'rohan@student.com'.padEnd(28)}  password: Student@123`)
console.log('\n' + '─'.repeat(50) + '\n')

await mongoose.disconnect()
