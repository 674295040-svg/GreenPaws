/**
 * GreenPaws - Initial Seed Data & LocalStorage Management
 * ข้อมูลตั้งต้นสำหรับระบบคลังความรู้, รายการแลกเปลี่ยน, ถาม-ตอบ, แกลเลอรี และผู้ใช้
 */

const STORAGE_KEYS = {
  USERS: 'greenpaws_users',
  CURRENT_USER: 'greenpaws_current_user',
  LISTINGS: 'greenpaws_listings',
  PLANTS: 'greenpaws_plants',
  QA_THREADS: 'greenpaws_qa_threads',
  GALLERY: 'greenpaws_gallery',
  BOOKMARKS: 'greenpaws_bookmarks',
  THEME: 'greenpaws_theme'
};

// 1. ข้อมูลผู้ใช้เริ่มต้น (Default Users & Admin)
const DEFAULT_USERS = [
  {
    id: 'user-admin',
    name: 'Admin GreenPaws',
    email: 'admin@greenpaws.com',
    password: 'admin', // รหัสผ่านสำหรับทดสอบ
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    bio: 'ผู้ดูแลระบบและผู้เชี่ยวชาญด้านพฤกษศาสตร์สำหรับสัตว์เลี้ยง',
    badge: '👑 ผู้ดูแลระบบ',
    favorites: [],
    joinedDate: '2026-01-01'
  },
  {
    id: 'user-1',
    name: 'น้องเนย & เจ้าถั่วพู (แมวส้ม)',
    email: 'noey@example.com',
    password: 'password123',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    bio: 'ทาสแมวส้ม 2 ตัว ชื่นชอบการปลูกเฟิร์นและไม้ฟอกอากาศที่ไม่เป็นพิษ',
    badge: '🌿 สมาชิกทาสแมว',
    favorites: ['list-1', 'list-3'],
    joinedDate: '2026-02-15'
  },
  {
    id: 'user-2',
    name: 'พี่ต้น คนรักป่าชื้น',
    email: 'ton@example.com',
    password: 'password123',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    bio: 'คนทำตู้เทอร์ราเรียมและเพาะพันธุ์ไม้ด่าง พร้อมแลกเปลี่ยนกิ่งพันธุ์',
    badge: '🏺 นักจัดเทอร์ราเรียม',
    favorites: ['list-2'],
    joinedDate: '2026-02-20'
  },
  {
    id: 'user-3',
    name: 'หมอโอ สัตวแพทย์รักสวน',
    email: 'vet.oh@example.com',
    password: 'password123',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80',
    bio: 'สัตวแพทย์ คอยให้คำแนะนำเกี่ยวกับสารพิษในต้นไม้และการปฐมพยาบาลสัตว์เลี้ยง',
    badge: '🩺 สัตวแพทย์ที่ปรึกษา',
    favorites: [],
    joinedDate: '2026-01-10'
  }
];

// 2. ฐานข้อมูลต้นไม้และความปลอดภัยต่อสัตว์เลี้ยง (Pet-Safe & Toxic Plant Database)
const DEFAULT_PLANTS = [
  {
    id: 'plant-1',
    nameTh: 'ต้นคล้า (Calathea)',
    nameEn: 'Calathea (Prayer Plant)',
    scientificName: 'Calathea orbifolia / zebrina',
    safetyStatus: 'safe', // 'safe', 'toxic', 'caution'
    toxicityLevel: 'ปลอดภัย (Non-Toxic)',
    safeFor: ['สุนัข', 'แมว', 'นก', 'สัตว์เลื้อยคลาน'],
    description: 'ไม้ใบสวยลวดลายเอกลักษณ์ ใบจะหุบเวลากลางคืน ปลอดภัย 100% ต่อสัตว์เลี้ยง หากน้องเผลอแทะจะไม่เป็นอันตราย',
    careGuide: 'ชอบแสงรำไร ไม่ชอบแดดตรง ชอบความชื้นสูง ควรรดน้ำเมื่อหน้าดินเริ่มแห้ง ใช้น้ำกรองหรือน้ำพักคลอรีน',
    symptoms: 'ไม่มีพิษ อาจทำให้อาเจียนเล็กน้อยหากกินเส้นใยใบเข้าไปมากเกินไป',
    tags: ['ไม้ใบฟอกอากาศ', 'ปลอดภัยต่อสัตว์เลี้ยง', 'เลี้ยงในห้องได้'],
    image: 'https://images.unsplash.com/photo-1599685315640-9ceab2f58944?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'plant-2',
    nameTh: 'มอนสเตอร่า (Monstera Deliciosa)',
    nameEn: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    safetyStatus: 'toxic',
    toxicityLevel: 'อันตรายปานกลาง (Moderate Toxicity)',
    safeFor: [],
    toxicTo: ['สุนัข', 'แมว'],
    description: 'ราชินีไม้ใบยอดนิยม มีผลึกแคลเซียมออกซาเลต (Insoluble Calcium Oxalates) ที่ระคายเคืองช่องปากและหลอดอาหาร',
    careGuide: 'ชอบแดดรำไร อากาศถ่ายเท รดน้ำสัปดาห์ละ 1-2 ครั้ง',
    symptoms: 'น้ำลายไหลยืด ปากและลิ้นบวม ปวดแสบช่องปาก กลืนอาหารลำบาก หากกินปริมาณมากอาจอาเจียน',
    firstAid: 'ล้างปากด้วยน้ำสะอาด เช็ดคราบยางออก ให้ดื่มน้ำหรือนมปริมาณเล็กน้อยเพื่อบรรเทาอาการแสบร้อน หากไม่ดีขึ้นควรพบแพทย์',
    tags: ['ไม้ใบยอดนิยม', 'มีพิษต่อสัตว์เลี้ยง', 'ต้องวางให้พ้นมือน้อง'],
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'plant-3',
    nameTh: 'เฟิร์นบอสตัน (Boston Fern)',
    nameEn: 'Boston Fern',
    scientificName: 'Nephrolepis exaltata',
    safetyStatus: 'safe',
    toxicityLevel: 'ปลอดภัย (Non-Toxic)',
    safeFor: ['สุนัข', 'แมว', 'นก'],
    description: 'ไม้แขวนฟอกอากาศ ช่วยเพิ่มความชื้นในห้อง เป็นมิตรต่อสัตว์เลี้ยง ปลูกในบ้านได้อย่างสบายใจ',
    careGuide: 'ชอบความชื้นสูง แดดรำไร พ่นละอองน้ำที่ใบสม่ำเสมอ ระวังอย่าให้ดินแห้งสนิท',
    symptoms: 'ไม่มีสารพิษ ไม่เป็นอันตรายต่อน้องหมาและน้องแมว',
    tags: ['ไม้แขวน', 'ฟอกอากาศ', 'ปลอดภัยต่อสัตว์เลี้ยง'],
    image: 'https://images.unsplash.com/photo-1596724803875-9271a7d6e665?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'plant-4',
    nameTh: 'กวักมรกต (ZZ Plant)',
    nameEn: 'ZZ Plant',
    scientificName: 'Zamioculcas zamiifolia',
    safetyStatus: 'toxic',
    toxicityLevel: 'อันตรายปานกลาง (Toxicity: Medium)',
    safeFor: [],
    toxicTo: ['สุนัข', 'แมว'],
    description: 'ต้นไม้อึดทน เลี้ยงง่ายมากในร่ม แต่ทุกส่วนของลำต้นและใบมีผลึกแคลเซียมออกซาเลต ห้ามให้น้องหมาน้องแมวแทะเด็ดขาด',
    careGuide: 'ทนแล้งสูง รดน้ำ 2-3 สัปดาห์ครั้ง อยู่ในที่แสงน้อยได้ดี',
    symptoms: 'ระคายเคืองช่องปากอย่างรุนแรง น้ำลายไหลมาก อาเจียน ท้องเสีย ผิวหนังสัมผัสยางอาจแดงคัน',
    firstAid: 'ล้างปากและผิวหนังด้วยน้ำสะอาดทันที สังเกตอาการหายใจ หากมีอาการบวมมากให้นำส่งโรงพยาบาลสัตว์ทันที',
    tags: ['เลี้ยงง่าย', 'มีพิษ', 'หลีกเลี่ยงหากเลี้ยงสัตว์'],
    image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'plant-5',
    nameTh: 'เปปเปอโรเมีย (Peperomia)',
    nameEn: 'Watermelon Peperomia',
    scientificName: 'Peperomia argyreia',
    safetyStatus: 'safe',
    toxicityLevel: 'ปลอดภัย (Non-Toxic)',
    safeFor: ['สุนัข', 'แมว'],
    description: 'ลายใบคล้ายแตงโม ขนาดกะทัดรัด เหมาะกับวางบนโต๊ะทำงาน ปลอดภัยต่อน้องแมวและสุนัข 100%',
    careGuide: 'ชอบแสงสว่างทางอ้อม ไม่ควรรดน้ำแฉะ ดินโปร่งระบายน้ำได้ดี',
    symptoms: 'ไม่มีพิษ ปลอดภัยหากสัตว์เลี้ยงสัมผัสหรือแทะเล่น',
    tags: ['ไม้ประดับโต๊ะทำงาน', 'ปลอดภัย', 'พืชอวบน้ำอ่อนๆ'],
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'plant-6',
    nameTh: 'ลิลลี่ (Lilies ทุกสายพันธุ์)',
    nameEn: 'True Lilies & Daylilies',
    scientificName: 'Lilium spp. & Hemerocallis spp.',
    safetyStatus: 'toxic',
    toxicityLevel: 'อันตรายถึงชีวิตสำหรับแมว (FATAL TO CATS)',
    safeFor: [],
    toxicTo: ['แมว (อันตรายสูงสุด)', 'สุนัข (อันตรายเล็กน้อยถึงปานกลาง)'],
    description: '⚠️ อันตรายสูงสุดต่อแมว! แม้แต่ละอองเกสรตกลงบนขนแล้วแมวเลีย หรือน้ำในแจกันลิลลี่ก็ทำให้ไตวายเฉียบพลันถึงแก่ชีวิตได้ภายใน 72 ชั่วโมง!',
    careGuide: 'บ้านที่เลี้ยงแมวเด็ดขาด ห้ามนำเข้าบ้านในทุกกรณี',
    symptoms: 'แมวจะเริ่มอาเจียน ซึม เบื่ออาหาร ภายใน 2 ชั่วโมง และไตวายเฉียบพลัน ไม่ปัสสาวะ ชัก และเสียชีวิต',
    firstAid: '⚠️ เหตุฉุกเฉินระดับสูงสุด! นำส่งคลินิกหรือ รพ.สัตว์ 24 ชม. ทันที พร้อมบอกชนิดต้นไม้ แม้เพียงสงสัยว่าสัมผัส',
    tags: ['อันตรายถึงชีวิต', 'ห้ามเลี้ยงเด็ดขาด', 'พิษร้ายแรงในแมว'],
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'plant-7',
    nameTh: 'ต้นเศรษฐีเรือนใน (Spider Plant)',
    nameEn: 'Spider Plant',
    scientificName: 'Chlorophytum comosum',
    safetyStatus: 'safe',
    toxicityLevel: 'ปลอดภัย (Non-Toxic & Pet Safe)',
    safeFor: ['สุนัข', 'แมว'],
    description: 'สุดยอดไม้ฟอกอากาศที่ทนทาน ปลอดภัยต่อน้องๆ น้องแมวมักชอบใบที่ห้อยลงมาแกว่งเล่น (มีฤทธิ์คล้ายแคทนิปอ่อนๆ ทำให้แมวฟิน)',
    careGuide: 'ดูแลง่ายมาก ชอบแสงรำไร ทนต่อการขาดน้ำได้ดี ขยายพันธุ์ง่ายด้วยการตัดกิ่งไหล',
    symptoms: 'ปลอดภัย แต่หากแมวกินใบเข้าไปเยอะมาก อาจสำรอกก้อนเส้นใยออกมาตามสัญชาตญาณ',
    tags: ['ไม้ฟอกอากาศยอดเยี่ยม', 'ปลอดภัย 100%', 'แมวชอบ'],
    image: 'https://images.unsplash.com/photo-1572688484437-c799a7791630?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'plant-8',
    nameTh: 'ไผ่กวนอิม / ว่านเงินไหลมา (Lucky Bamboo & Syngonium)',
    nameEn: 'Syngonium / Arrowhead Plant',
    scientificName: 'Syngonium podophyllum',
    safetyStatus: 'toxic',
    toxicityLevel: 'อันตรายปานกลาง (Toxic)',
    safeFor: [],
    toxicTo: ['สุนัข', 'แมว'],
    description: 'ไม้เลื้อยใบสวยมีหลายสี แต่มีผลึกออกซาเลตทั่วทั้งต้น',
    careGuide: 'ชอบแดดรำไร ความชื้นปานกลาง ตัดชำในน้ำได้',
    symptoms: 'ระคายเคืองช่องปาก น้ำลายไหล กลืนลำบาก หากสัมผัสน้ำยางอาจทำให้ผิวระคายเคือง',
    firstAid: 'ล้างด้วยน้ำสะอาด เช็ดน้ำยางออก ให้จิบน้ำลดอาการแสบร้อน',
    tags: ['ไม้เลื้อย', 'มีพิษ', 'ระวังน้องหมาน้องแมว'],
    image: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=600&q=80'
  }
];

// 3. รายการแลกเปลี่ยนและส่งต่อ (Community Marketplace Listings)
const DEFAULT_LISTINGS = [
  {
    id: 'list-1',
    title: 'มีหน่อต้นคล้า Calathea Orbifolia พร้อมกระถาง อยากแลกกับของเล่นแมวหรือกระบะทราย',
    type: 'swap', // 'swap' (แลกเปลี่ยน) หรือ 'giveaway' (แจกฟรี)
    category: 'plants', // 'plants', 'pets', 'gear', 'seeds'
    offering: 'หน่อคล้าใบกลม รากเดินแข็งแรง 2 กระถาง (Pet-Safe ปลอดภัยต่อแมว)',
    lookingFor: 'ของเล่นแมว คอนโดแมวขนาดเล็ก หรือทรายแมวภูเขาไฟ',
    location: 'สุขุมวิท 71 / นัดรับ BTS พระโขนง',
    contact: 'Line: noey_catlover / โทร 081-xxx-xxxx',
    userId: 'user-1',
    userName: 'น้องเนย & เจ้าถั่วพู',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    userBadge: '🌿 สมาชิกทาสแมว',
    status: 'active', // 'active', 'completed'
    isFeatured: true,
    views: 142,
    createdAt: '2026-03-01',
    image: 'https://images.unsplash.com/photo-1599685315640-9ceab2f58944?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'list-2',
    title: 'แจกฟรีกิ่งชำเปปเปอโรเมียแตงโม 5 กิ่ง และหญ้าแมวสดปลูกเอง',
    type: 'giveaway',
    category: 'plants',
    offering: 'กิ่งชำเปปเปอโรเมียแตงโม รากแน่นๆ + ถาดหญ้าแมวสดพร้อมทาน 1 ถาด',
    lookingFor: 'แจกฟรีสำหรับเพื่อนๆ ที่เลี้ยงแมว (มารับเองหรือออกค่าส่งตามจริง)',
    location: 'อารีย์ / พญาไท กทม.',
    contact: 'Line: @ton_garden',
    userId: 'user-2',
    userName: 'พี่ต้น คนรักป่าชื้น',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    userBadge: '🏺 นักจัดเทอร์ราเรียม',
    status: 'active',
    isFeatured: false,
    views: 98,
    createdAt: '2026-03-03',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'list-3',
    title: 'ส่งต่อกรงกระต่าย / กรงนกขนาดใหญ่ สภาพ 95% อยากแลกกับต้นเฟิร์นข้าหลวงหรือต้นวาสนา',
    type: 'swap',
    category: 'gear',
    offering: 'กรงสัตว์เลี้ยงพับได้ ขนาด 80x60 ซม. ล้างฆ่าเชื้อเรียบร้อย มีถาดรอง',
    lookingFor: 'ต้นเฟิร์นข้าหลวงกอใหญ่ หรือไม้ฟอกอากาศที่ปลอดภัยกับน้องกระต่าย',
    location: 'นนทบุรี / บางใหญ่ / ถนนกาญจนาภิเษก',
    contact: 'Line: bunny_home99',
    userId: 'user-3',
    userName: 'หมอโอ สัตวแพทย์รักสวน',
    userAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80',
    userBadge: '🩺 สัตวแพทย์ที่ปรึกษา',
    status: 'active',
    isFeatured: true,
    views: 215,
    createdAt: '2026-03-05',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'list-4',
    title: 'หาบ้านใหม่ให้น้องลูกแมวส้ม 2 ตัว วัย 2 เดือน น่ารักและคุ้นคน ปลูกต้นหญ้าแมวแถมให้ด้วย',
    type: 'giveaway',
    category: 'pets',
    offering: 'ลูกแมวเพศผู้ 1 เพศเมีย 1 กินอาหารเม็ดได้แล้ว เข้ากระบะทรายเป็น',
    lookingFor: 'ขอคนรักสัตว์จริง เลี้ยงระบบปิด และพร้อมดูแลตลอดอายุขัย',
    location: 'ลาดพร้าว / เกษตรนวมินทร์',
    contact: 'FB: Noey Adoptions / 089-xxx-xxxx',
    userId: 'user-1',
    userName: 'น้องเนย & เจ้าถั่วพู',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    userBadge: '🌿 สมาชิกทาสแมว',
    status: 'active',
    isFeatured: true,
    views: 340,
    createdAt: '2026-03-06',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80'
  }
];

// 4. กระทู้ถาม-ตอบปัญหาชุมชน (Q&A Threads & Solutions)
const DEFAULT_QA_THREADS = [
  {
    id: 'qa-1',
    title: 'น้องแมวเผลอไปแทะใบมอนสเตอร่าแหว่งไปนิดนึง มีอาการน้ำลายไหล ทำอย่างไรดีครับ?',
    category: 'toxic-emergency', // 'toxic-emergency', 'plant-health', 'pet-behavior', 'home-garden'
    categoryLabel: '🚨 สารพิษ & อาการฉุกเฉิน',
    content: 'เมื่อ 20 นาทีที่แล้ว เห็นน้องแมวเดินไปเคี้ยวปลายใบมอนสเตอร่า ตอนนี้เห็นน้องเริ่มเลียริมฝีปากบ่อยๆ และมีน้ำลายไหลยืดเล็กน้อย ควรปฐมพยาบาลเบื้องต้นยังไง และเมื่อไหร่ต้องรีบพาไปหาหมอครับ?',
    authorId: 'user-2',
    authorName: 'พี่ต้น คนรักป่าชื้น',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-03-04 10:30',
    solved: true, // มีคำตอบที่แก้ปัญหาได้แล้ว
    solutionId: 'ans-1',
    answers: [
      {
        id: 'ans-1',
        authorId: 'user-3',
        authorName: 'หมอโอ สัตวแพทย์รักสวน',
        authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80',
        authorBadge: '🩺 สัตวแพทย์ที่ปรึกษา',
        isSolution: true,
        createdAt: '2026-03-04 10:45',
        content: `**แนวทางปฏิบัติทันทีครับ:**
1. ใช้ผ้าชุบน้ำสะอาดเช็ดรอบปากและลิ้นเพื่อขจัดเศษยางและผลึกแคลเซียมออกซาเลตออกให้หมด
2. ป้อนน้ำสะอาดหรือโยเกิร์ตรสธรรมชาติ/นมแพะ 1 ช้อนชา เพื่อช่วยเคลือบและเจือจางผลึกที่ทำให้แสบคอ
3. **ห้ามทำให้อาเจียนเด็ดขาด** เพราะผลึกจะขูดหลอดอาหารรอบสอง
4. สังเกตอาการทางเดินหายใจ หากลิ้นบวมมากจนหายใจติดขัด หรืออาเจียนไม่หยุดเกิน 1 ชม. ให้นำส่งคลินิกสัตว์ทันทีครับ`
      },
      {
        id: 'ans-2',
        authorId: 'user-1',
        authorName: 'น้องเนย & เจ้าถั่วพู',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        authorBadge: '🌿 สมาชิกทาสแมว',
        isSolution: false,
        createdAt: '2026-03-04 11:10',
        content: 'ที่บ้านเคยโดนเหมือนกันค่ะ ตอนนั้นหมอให้เช็ดปากแล้วป้อนน้ำหวาน/นมแพะ อาการดีขึ้นใน 3-4 ชั่วโมง หลังจากนั้นต้องเอาต้นไม้ขึ้นแขวนผนังเลยค่ะ เป็นกำลังใจให้นะคะ'
      }
    ]
  },
  {
    id: 'qa-2',
    title: 'ต้นเศรษฐีเรือนในใบไหม้ที่ปลาย เกิดจากอะไร และเป็นอันตรายต่อนกแก้วไหม?',
    category: 'plant-health',
    categoryLabel: '🌿 สุขภาพต้นไม้ & สัตว์เลี้ยง',
    content: 'เลี้ยงต้นเศรษฐีเรือนในไว้ใกล้กรงนกแก้วฟอร์พัส สังเกตว่าช่วงนี้ปลายใบมีรอยไหม้สีน้ำตาล อยากรู้ว่าเกิดจากอะไร และถ้าปล่อยนกออกมาเกาะเล่น จะมีอันตรายต่อนกไหมครับ?',
    authorId: 'user-1',
    authorName: 'น้องเนย & เจ้าถั่วพู',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-03-05 14:15',
    solved: true,
    solutionId: 'ans-3',
    answers: [
      {
        id: 'ans-3',
        authorId: 'user-admin',
        authorName: 'Admin GreenPaws',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        authorBadge: '👑 ผู้ดูแลระบบ',
        isSolution: true,
        createdAt: '2026-03-05 14:40',
        content: `**สาเหตุและคำแนะนำครับ:**
1. ปลายใบไหม้ของเศรษฐีเรือนใน มักเกิดจาก **คลอรีนและฟลูออไรด์ในน้ำประปา** ให้เปลี่ยนมาใช้น้ำกรองหรือน้ำประปาที่รองทิ้งไว้ 24-48 ชม.
2. ต้นเศรษฐีเรือนใน (Spider Plant) **ปลอดภัยต่อนกแก้วและสัตว์เลี้ยง 100% (Non-toxic)** นกสามารถแทะเล่นได้ไม่เป็นพิษ แต่ระวังเรื่องดินปลูกอย่าให้มีปุ๋ยเคมีเม็ดบนหน้าดินครับ`
      }
    ]
  },
  {
    id: 'qa-3',
    title: 'อยากจัดตู้เทอร์ราเรียมระบบปิด แต่กลัวความชื้นทำให้เกิดรา มีวิธีป้องกันอย่างไร?',
    category: 'home-garden',
    categoryLabel: '🏺 ตู้พืช & สวนในบ้าน',
    content: 'กำลังจะเริ่มหัดทำตู้เทอร์ราเรียมมอสและเฟิร์นจิ๋วในห้องแอร์ แต่กังวลเรื่องเชื้อราในตู้ปิด มีเทคนิคหรือตัวช่วยธรรมชาติอะไรบ้างไหมครับ?',
    authorId: 'user-3',
    authorName: 'หมอโอ สัตวแพทย์รักสวน',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-03-06 09:20',
    solved: false,
    solutionId: null,
    answers: [
      {
        id: 'ans-4',
        authorId: 'user-2',
        authorName: 'พี่ต้น คนรักป่าชื้น',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        authorBadge: '🏺 นักจัดเทอร์ราเรียม',
        isSolution: false,
        createdAt: '2026-03-06 10:00',
        content: 'แนะนำให้ใส่ "Springtails (แมลงหางดีด)" ลงไปในตู้ครับ ตัวจิ๋วไม่ทำร้ายพืชและสัตว์ แต่จะคอยกินสปอร์เชื้อราและซากใบเน่าในตู้ได้อย่างมีประสิทธิภาพมาก เป็นระบบ Bioactive แท้ๆ เลยครับ'
      }
    ]
  }
];

// 5. โหมดแสดงรูปภาพอวดมุมสวนและสัตว์เลี้ยง (Showcase Gallery Items)
const DEFAULT_GALLERY = [
  {
    id: 'gal-1',
    title: 'มุมกาแฟข้างหน้าต่างกับตู้ไม้น้ำและน้องแมวการ์ฟิลด์',
    category: 'cute-pets', // 'indoor-garden', 'terrarium', 'cute-pets', 'balcony'
    categoryLabel: '🐾 สัตว์เลี้ยงกับสวนสวย',
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80',
    description: 'จัดมุมนี้เพื่อให้ได้รับแสงเช้า น้องแมวชอบมานอนอาบแดดข้างๆ กระถางเปปเปอโรเมียและตู้ปลา สบายตาทั้งวันเลยค่ะ',
    tags: ['แมวส้ม', 'เปปเปอโรเมีย', 'สวนมุมโปรด', 'PetSafe'],
    authorId: 'user-1',
    authorName: 'น้องเนย & เจ้าถั่วพู',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    likes: 84,
    likedBy: ['user-2', 'user-3'],
    createdAt: '2026-03-02'
  },
  {
    id: 'gal-2',
    title: 'ตู้เทอร์ราเรียมมอสสดและหินภูเขาไฟ เลียนแบบป่าดิบชื้น',
    category: 'terrarium',
    categoryLabel: '🏺 ตู้เทอร์ราเรียม & พืชจิ๋ว',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    description: 'ใช้เวลาจัดเกือบ 4 ชั่วโมง เลเยอร์ชั้นล่างเป็นเม็ดดินเผา ถ่านชาโคล และมอสขนนก ปิดฝาไว้แทบไม่ต้องรดน้ำเลยครับ',
    tags: ['เทอร์ราเรียม', 'มอสสด', 'Bioactive', 'ตู้กระจก'],
    authorId: 'user-2',
    authorName: 'พี่ต้น คนรักป่าชื้น',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    likes: 126,
    likedBy: ['user-1', 'user-admin'],
    createdAt: '2026-03-03'
  },
  {
    id: 'gal-3',
    title: 'มุมฟอกอากาศในห้องนั่งเล่น เน้นต้นไม้ปลอดภัยสำหรับน้องหมาคอร์กี้',
    category: 'indoor-garden',
    categoryLabel: '🌿 มุมจัดสวนในบ้าน',
    image: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=800&q=80',
    description: 'คัดเลือกเฉพาะ Calathea, Boston Fern และ Spider Plant ทั้งหมดวางบนชั้นยกสูง น้องคอร์กี้วิ่งเล่นได้ปลอดภัย ไม่ต้องคอยพะวง',
    tags: ['ห้องนั่งเล่นสีเขียว', 'คอร์กี้', 'BostonFern', 'SafePlants'],
    authorId: 'user-3',
    authorName: 'หมอโอ สัตวแพทย์รักสวน',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80',
    likes: 92,
    likedBy: ['user-1'],
    createdAt: '2026-03-04'
  },
  {
    id: 'gal-4',
    title: 'สวนจิ๋วระเบียงคอนโด 3 ตร.ม. สวรรค์ของกระต่ายน้อย',
    category: 'balcony',
    categoryLabel: '🪴 สวนระเบียงคอนโด',
    image: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=800&q=80',
    description: 'ปลูกหญ้าทิโมธีสดและโรสแมรี่ในกระถางแขวน ระเบียงปูหญ้าเทียมให้น้องกระต่ายวิ่งเล่นรับลมยามเย็น สดชื่นมาก',
    tags: ['สวนระเบียง', 'กระต่าย', 'หญ้าสด', 'คอนโดพื้นที่น้อย'],
    authorId: 'user-admin',
    authorName: 'Admin GreenPaws',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    likes: 110,
    likedBy: ['user-1', 'user-2', 'user-3'],
    createdAt: '2026-03-05'
  }
];

// Helper Function ในการโหลดหรือตั้งค่า LocalStorage อัตโนมัติ
function initLocalStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PLANTS)) {
    localStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(DEFAULT_PLANTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LISTINGS)) {
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(DEFAULT_LISTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.QA_THREADS)) {
    localStorage.setItem(STORAGE_KEYS.QA_THREADS, JSON.stringify(DEFAULT_QA_THREADS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKMARKS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(['list-1']));
  }
}

// เรียกทำงานทันทีที่โหลดไฟล์
initLocalStorage();
