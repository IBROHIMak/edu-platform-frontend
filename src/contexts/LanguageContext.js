import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  uz: {
    // Common
    login: 'Kirish',
    logout: 'Chiqish',
    profile: 'Profil',
    dashboard: 'Bosh sahifa',
    settings: 'Sozlamalar',
    save: 'Saqlash',
    cancel: 'Bekor qilish',
    edit: 'Tahrirlash',
    delete: 'O\'chirish',
    loading: 'Yuklanmoqda...',
    error: 'Xatolik',
    success: 'Muvaffaqiyat',
    search: 'Qidirish',
    filter: 'Filtrlash',
    all: 'Barchasi',
    grades: 'Baholar',
    late: 'Kech topshirilgan',
    present: 'Kelgan',
    absent: 'Kelmagan',
    unknown: 'Noma\'lum',
    selectGroupToViewStudents: 'O\'quvchilarni ko\'rish uchun guruhni tanlang',
    noStudentsInGroup: 'Bu guruhda o\'quvchilar yo\'q',
    studentsWillAppearHere: 'O\'quvchilar qo\'shilganda bu yerda ko\'rasiz',
    selectType: 'Turini tanlang',
    classParticipation: 'Dars ishtirokи',
    activityLevel: 'Faollik darajasi',
    claimed: 'Olingan',
    available: 'Olish mumkin',
    locked: 'Qulflangan',
    
    // Status messages
    submitted: 'Topshirilgan',
    overdue: 'Muddati o\'tgan',
    pending: 'Kutilmoqda',
    graded: 'Baholangan',
    noHomework: 'Hozircha uy vazifalari yo\'q',
    noCompetitions: 'Hozircha tanlovlar yo\'q',
    
    // Competition status
    upcoming: 'Kutilmoqda',
    completed: 'Yakunlangan',
    unknown: 'Noma\'lum',
    
    // Admin panel
    welcomeAdmin: 'Xush kelibsiz, Admin!',
    totalUsers: 'Jami foydalanuvchilar',
    quickActions: 'Tezkor harakatlar',
    recentActivity: 'So\'ngi foydalanuvchilar',
    activeUsers: 'Faol foydalanuvchilar',
    activeGroups: 'Faol guruhlar',
    weeklyDistribution: 'Haftalik taqsimot',
    
    // Quick actions
    reportsTitle: 'Hisobotlar',
    reportsDesc: 'Batafsil hisobotlar va analitika',
    userManagementTitle: 'Foydalanuvchi Boshqaruvi',
    userManagementDesc: 'Foydalanuvchilarni to\'liq boshqarish',
    educationTitle: 'Ta\'lim Jarayoni',
    educationDesc: 'Fanlar, guruhlar va jadvallar',
    bonusTitle: 'Bonus va Mukofotlar',
    bonusDesc: 'Motivatsiya tizimi boshqaruvi',
    teacherManagementTitle: 'Ustozlarni boshqarish',
    teacherManagementDesc: 'Ustozlar va ularning guruhlarini ko\'rish',
    analyticsTitle: 'Analitika',
    analyticsDesc: 'Platform statistikasi va hisobotlar',
    settingsTitle: 'Sozlamalar',
    settingsDesc: 'Tizim sozlamalari va konfiguratsiya',
    
    // System status
    systemStatus: 'Tizim holati',
    backendActive: 'Backend serveri: Faol',
    databaseConnected: 'Ma\'lumotlar bazasi: Ulangan',
    allServicesRunning: 'Barcha xizmatlar: Ishlaydi',
    
    // User roles in admin
    teacherRole: 'Ustoz',
    studentRole: 'O\'quvchi',
    parentRole: 'Ota-ona',
    
    // Empty states
    noRecentUsers: 'Hozircha yangi foydalanuvchilar yo\'q',
    
    // Admin welcome message
    adminWelcomeDesc: 'Admin panel orqali platformani to\'liq boshqaring',
    administratorRole: 'Administrator',
    fullAccess: 'To\'liq huquqlar',
    
    // Time and dates
    startDate: 'Boshlanish sanasi',
    
    // Assignment interface
    selectAtLeastOneStudent: 'Kamida bitta o\'quvchini tanlang!',
    confirmRemoveStudents: 'O\'quvchilarni guruhdan chiqarishni tasdiqlaysizmi?',
    studentsRemovedSuccessfully: 'O\'quvchilar muvaffaqiyatli chiqarildi!',
    selectGroupAndTeacher: 'Guruh va o\'qituvchini tanlang!',
    teacherAssignedSuccessfully: 'O\'qituvchi muvaffaqiyatli tayinlandi!',
    viewDetails: 'Batafsil',
    
    // General status
    isActive: 'Faol',
    isInactive: 'Nofaol',
    
    // Date labels
    dueDate: 'Muddat',
    startDate: 'Boshlanish',
    
    // Task types
    daily: 'Kundalik',
    weekly: 'Haftalik',
    social: 'Ijtimoiy',
    project: 'Loyiha',
    
    // Rank suffix
    rankSuffix: '-o\'rin',
    
    // Profile descriptions
    personalInfoDescription: 'Shaxsiy ma\'lumotlar va sozlamalar',
    
    // Platform
    platformName: 'Ingliz Tili Platformasi',
    platformDescription: 'Professional ingliz tili o\'rganish platformasi',
    
    // Auth
    firstName: 'Ism',
    lastName: 'Familiya',
    password: 'Parol',
    studentLogin: 'O\'quvchi kirishi',
    teacherLogin: 'Ustoz kirishi',
    parentLogin: 'Ota-ona kirishi',
    adminLogin: 'Admin kirishi',
    studentDescription: 'O\'quvchi sifatida platformaga kirish',
    teacherDescription: 'Ustoz sifatida platformaga kirish',
    parentDescription: 'Ota-ona sifatida platformaga kirish',
    adminDescription: 'Administrator sifatida platformaga kirish',
    enterFirstName: 'Ismingizni kiriting',
    enterLastName: 'Familiyangizni kiriting',
    enterPassword: 'Parolingizni kiriting',
    studentId: 'O\'quvchi ID',
    teacherId: 'Ustoz ID',
    subject: 'Fan',
    parentType: 'Turi',
    childName: 'Farzand ismi',
    
    // Navigation
    home: 'Bosh sahifa',
    videoLessons: 'Video darslar',
    homework: 'Uy vazifalari',
    assignments: 'Topshiriqlar',
    rewards: 'Mukofotlar',
    competitions: 'Tanlovlar',
    messages: 'Xabarlar',
    rating: 'Reyting',
    progress: 'Rivojlanish',
    groups: 'Guruhlar',
    students: 'O\'quvchilar',
    teachers: 'Ustozlar',
    parents: 'Ota-onalar',
    users: 'Foydalanuvchilar',
    analytics: 'Analitika',
    reports: 'Hisobotlar',
    userManagement: 'Foydalanuvchi boshqaruvi',
    education: 'Ta\'lim jarayoni',
    bonusRewards: 'Bonus va mukofotlar',
    
    // Student Dashboard
    welcomeStudent: 'Xush kelibsiz',
    readyToLearn: 'Bugun ham yangi bilimlar olishga tayyormisiz?',
    totalScore: 'Umumiy ball',
    groupRank: 'Guruhda o\'rni',
    attendance: 'Davomat',
    points: 'Ballar',
    recentHomework: 'So\'ngi uy vazifalari',
    upcomingCompetitions: 'Yaqinlashayotgan tanlovlar',
    bonusTasks: 'Bonus vazifalar',
    quickActions: 'Tezkor harakatlar',
    
    // Teacher Dashboard
    welcomeTeacher: 'Xush kelibsiz',
    manageClasses: 'Sinflaringizni boshqaring',
    
    // Video Lessons
    videoLessonsTitle: 'Video darslar',
    manageVideoContent: 'Video kontentingizni boshqaring',
    uploadVideo: 'Video yuklash',
    totalVideos: 'Jami videolar',
    totalViews: 'Jami ko\'rishlar',
    published: 'Nashr etilgan',
    drafts: 'Qoralamalar',
    videoTitle: 'Video sarlavhasi',
    description: 'Tavsif',
    level: 'Daraja',
    category: 'Kategoriya',
    videoFile: 'Video fayl',
    uploadNewVideo: 'Yangi video yuklash',
    
    // Video Categories
    grammar: 'Grammatika',
    speaking: 'Gapirish',
    writing: 'Yozish',
    reading: 'O\'qish',
    listening: 'Tinglash',
    pronunciation: 'Talaffuz',
    vocabulary: 'Lug\'at',
    
    // Levels
    beginner: 'Boshlang\'ich',
    elementary: 'Elementar',
    intermediate: 'O\'rta',
    upperIntermediate: 'Yuqori o\'rta',
    advanced: 'Ilg\'or',
    proficiency: 'Mukammal',
    
    // Common Actions
    watch: 'Ko\'rish',
    watchNow: 'Hozir ko\'ring',
    watchAgain: 'Qayta ko\'ring',
    bookmark: 'Xatcho\'p',
    share: 'Ulashish',
    download: 'Yuklab olish',
    
    // Status
    active: 'Faol',
    inactive: 'Nofaol',
    completed: 'Bajarilgan',
    pending: 'Kutilmoqda',
    draft: 'Qoralama',
    
    // Time
    duration: 'Davomiyligi',
    uploadDate: 'Yuklangan sana',
    lastLogin: 'Oxirgi kirish',
    
    // Stats
    views: 'ko\'rishlar',
    watched: 'ko\'rilgan',
    saved: 'saqlangan',
    
    // Filters
    allLevels: 'Barcha darajalar',
    allCategories: 'Barcha kategoriyalar',
    searchVideos: 'Videolarni qidiring...',
    
    // Messages
    noVideosFound: 'Videolar topilmadi',
    adjustFilters: 'Qidiruv shartlarini o\'zgartiring',
    videoUploaded: 'Video muvaffaqiyatli yuklandi!',
    videoDeleted: 'Video o\'chirildi!',
    uploadFailed: 'Yuklashda xatolik',
    
    // Admin
    adminPanel: 'Admin panel',
    manageUsers: 'Foydalanuvchilarni boshqarish',
    systemStats: 'Tizim statistikasi',
    
    // Common UI
    close: 'Yopish',
    people: 'kishi',
    selectSubject: 'Fan tanlang',
    mathematics: 'Matematika',
    physics: 'Fizika',
    chemistry: 'Kimyo',
    biology: 'Biologiya',
    
    // Subject names - ONLY ENGLISH LANGUAGE
    englishLanguage: 'Ingliz tili',
    englishGrammar: 'Ingliz tili grammatikasi',
    englishSpeaking: 'Ingliz tili - Gapirish',
    englishWriting: 'Ingliz tili - Yozish',
    englishReading: 'Ingliz tili - O\'qish',
    englishListening: 'Ingliz tili - Tinglash',
    
    // English learning specific terms
    grammarExercises: 'Grammatika mashqlari',
    speakingPractice: 'Gapirish amaliyoti',
    writingTasks: 'Yozish vazifalari',
    readingComprehension: 'O\'qish tushunish',
    listeningExercises: 'Tinglash mashqlari',
    vocabularyBuilding: 'Lug\'at boyitish',
    pronunciationPractice: 'Talaffuz amaliyoti',
    
    // English levels
    beginnerEnglish: 'Boshlang\'ich daraja',
    elementaryEnglish: 'Elementar daraja',
    intermediateEnglish: 'O\'rta daraja',
    upperIntermediateEnglish: 'Yuqori o\'rta daraja',
    advancedEnglish: 'Ilg\'or daraja',
    
    // English class names
    englishClass1: 'Ingliz tili - 1-guruh',
    englishClass2: 'Ingliz tili - 2-guruh',
    englishClass3: 'Ingliz tili - 3-guruh',
    
    // English achievements
    bestEnglishResult: 'Ingliz tilidan eng yaxshi natija',
    englishProgress: 'Ingliz tili rivojlanishi',
    englishSkills: 'Ingliz tili ko\'nikmalari',
    
    // Remove math/physics references
    // mathematics: 'Matematika', - REMOVED
    // physics: 'Fizika', - REMOVED  
    // chemistry: 'Kimyo', - REMOVED
    // biology: 'Biologiya', - REMOVED
    newHomeworkCreated: 'Yangi uy vazifasi yaratildi',
    messageFromParent: 'Ota-onadan xabar keldi',
    homeworkSubmitted: '5 ta uy vazifasi topshirildi',
    hoursAgo: 'soat oldin',
    open: 'Ochish',
    next: 'Keyingi',
    previous: 'Oldingi',
    submit: 'Yuborish',
    reset: 'Qayta o\'rnatish',
    clear: 'Tozalash',
    apply: 'Qo\'llash',
    
    // Parent specific
    personalInfo: 'Shaxsiy ma\'lumotlar',
    childrenInfo: 'Farzandlar haqida ma\'lumot',
    quickStats: 'Tezkor statistika',
    notifications: 'Bildirishnomalar',
    privacy: 'Maxfiylik',
    appSettings: 'Ilova sozlamalari',
    darkMode: 'Tungi rejim',
    language: 'Til',
    father: 'Ota',
    mother: 'Ona',
    phone: 'Telefon',
    email: 'Email',
    address: 'Manzil',
    birthDate: 'Tug\'ilgan sana',
    occupation: 'Kasb',
    group: 'Guruh',
    teacher: 'Ustoz',
    averageGrade: 'O\'rtacha baho',
    
    // Notifications
    homeworkNotifications: 'Uy vazifalari',
    gradesNotifications: 'Baholar',
    attendanceNotifications: 'Davomat',
    messagesNotifications: 'Xabarlar',
    competitionsNotifications: 'Musobaqalar',
    
    // Privacy
    showPhone: 'Telefon raqamini ko\'rsatish',
    showEmail: 'Email manzilini ko\'rsatish',
    allowMessages: 'Xabar yuborishga ruxsat',
    
    // Notifications
    newMessage: 'Yangi xabar',
    newAssignment: 'Yangi topshiriq',
    reminderDue: 'Muddat eslatmasi',
    
    // Additional common terms
    name: 'Ism',
    fullName: 'To\'liq ism',
    role: 'Rol',
    status: 'Holat',
    date: 'Sana',
    time: 'Vaqt',
    description: 'Tavsif',
    details: 'Tafsilotlar',
    back: 'Orqaga',
    forward: 'Oldinga',
    refresh: 'Yangilash',
    update: 'Yangilash',
    create: 'Yaratish',
    add: 'Qo\'shish',
    remove: 'Olib tashlash',
    confirm: 'Tasdiqlash',
    yes: 'Ha',
    no: 'Yo\'q',
    
    // Empty states
    noData: 'Ma\'lumot yo\'q',
    noResults: 'Natija topilmadi',
    emptyList: 'Ro\'yxat bo\'sh',
    noNewHomework: 'Yangi uy vazifalari paydo bo\'lganda bu yerda ko\'rasiz',
    
    // Real platform messages
    realPlatform: 'Haqiqiy ta\'lim platformasi',
    professionalSystem: 'Professional tizim',
    
    // Test accounts
    testAccounts: 'Test hisoblar',
    
    // Error messages
    errorLoadingCompetitions: 'Tanlovlarni yuklashda xatolik',
    successJoinedCompetition: 'Tanlovga muvaffaqiyatli qo\'shildingiz!',
    errorJoiningCompetition: 'Tanlovga qo\'shilishda xatolik',
    successCreatedCompetition: 'Tanlov muvaffaqiyatli yaratildi!',
    errorCreatingCompetition: 'Tanlov yaratishda xatolik',
    errorLoadingGroups: 'Guruhlarni yuklashda xatolik',
    gradeUpdatedSuccessfully: 'Baho muvaffaqiyatli yangilandi!',
    errorUpdatingGrade: 'Bahoni yangilashda xatolik',
    gradeStudent: '{name}ni baholash',
    total: 'Umumiy',
    student: 'O\'quvchi',
    parent: 'Ota-ona',
    studentQuestionExample: 'Ustoz, 7-betdagi misolni tushunmadim',
    selectConversationToChat: 'O\'quvchi yoki ota-ona bilan muloqot qilish uchun suhbatni tanlang',
    homeworkCreatedSuccessfully: 'Uy vazifasi muvaffaqiyatli yaratildi!',
    errorCreatingHomework: 'Uy vazifasi yaratishda xatolik',
    groupCreatedSuccessfully: 'Guruh muvaffaqiyatli yaratildi!',
    errorCreatingGroup: 'Guruh yaratishda xatolik',
    homeworkGraded: '5 ta uy vazifasi baholandi',
    newCompetitionAnnounced: 'Yangi tanlov e\'lon qilindi',
    rewardRuleSequential: 'Mukofotlarni ketma-ket olish kerak',
    rewardRulePrevious: 'Oldingi mukofotni olmay, keyingisini ololmaysiz',
    rewardRuleBonusTasks: 'Bonus vazifalarni bajarib qo\'shimcha ball yig\'ing',
    rewardRulePointsDeducted: 'Ballar mukofot olingandan keyin ayriladi',
    submitHomeworkOnTime: 'Uy vazifalarini o\'z vaqtida topshiring',
    completeBonusTasks: 'Bonus vazifalarni bajaring',
    participateInCompetitions: 'Tanlovlarda ishtirok eting',
    
    // Admin panel specific
    systemSettings: 'Tizim sozlamalari',
    generalSettings: 'Umumiy sozlamalar',
    security: 'Xavfsizlik',
    bonusRewardsSystem: 'Bonus va Mukofotlar Tizimi',
    manageStudentMotivation: 'O\'quvchilarni rag\'batlantirish va motivatsiya tizimini boshqaring',
    reportsAndAnalytics: 'Hisobotlar va Analitika',
    manageAllUsers: 'Barcha foydalanuvchilarni boshqaring va nazorat qiling',
    allRoles: 'Barcha rollar',
    admins: 'Adminlar',
    allUsers: 'Barcha foydalanuvchilar',
    activeStudents: 'Faol o\'quvchilar',
    
    // Student rewards specific
    errorLoadingRewards: 'Mukofotlarni yuklashda xatolik',
    rewardClaimedSuccessfully: 'Mukofot muvaffaqiyatli olingan!',
    errorClaimingReward: 'Mukofotni olishda xatolik',
    rewardsSystem: 'Mukofotlar tizimi',
    noRewardsYet: 'Hozircha mukofotlar yo\'q',
    rewardsComingSoon: 'Tez orada mukofotlar qo\'shiladi',
    claimReward: 'Mukofotni olish',
    participateActivelyInClass: 'Darsda faol ishtirok eting',
    
    // Student rating specific
    ratingSystemNotActive: 'Reyting tizimi hali faollashtirilmagan',
    assignments: 'vazifa',
    groupRankPosition: 'Guruhda {rank}-o\'rin',
    peopleInGroup: 'kishilik guruh',
    groupRating: 'Guruh reytingi',
    attendAllClassesOnTime: 'Barcha darslarga vaqtida keling',
    completeHomeworkOnTime: 'Uy vazifalarini o\'z vaqtida bajaring',
    
    // Student profile specific
    beActiveAndAchieve: 'Faol bo\'ling va yutuqlarga erishing!',
    
    // Messages specific
    parentQuestionExample: 'Farzandimning o\'qish holatini bilmoqchiman',
    chatWithTeacher: 'Ustoz bilan muloqot qiling',
    
    // Homework specific
    algebraExercisesExample: '7-8 betdagi barcha misollar',
    errorLoadingHomework: 'Uy vazifalarini yuklashda xatolik',
    homeworkSubmittedSuccessfully: 'Uy vazifasi muvaffaqiyatli topshirildi!',
    errorSubmittingHomework: 'Uy vazifasini topshirishda xatolik',
    assignmentOverdue: 'Bu vazifaning muddati o\'tib ketgan',
    
    // Bonus tasks
    bonusTaskCompleted: 'Bonus vazifa bajarildi!',
    
    // Additional UI elements
    thisWeekClasses: 'Bu hafta darslar',
    errorLoadingStudents: 'O\'quvchilarni yuklashda xatolik',
    errorSendingMessage: 'Xabar yuborishda xatolik',
    confirmDeleteVideo: 'Videoni o\'chirishni tasdiqlaysizmi?',
    videoUploadedSuccessfully: 'Video muvaffaqiyatli yuklandi!',
    videoDeletedSuccessfully: 'Video muvaffaqiyatli o\'chirildi!',
    failedToDeleteVideo: 'Videoni o\'chirishda xatolik',
    nothingFound: 'Hech narsa topilmadi',
    noConversationsYet: 'Hozircha suhbatlar yo\'q',
    noMessagesYet: 'Hozircha xabarlar yo\'q. Birinchi xabaringizni yuboring!',
    pressEnterToSend: 'Enter tugmasini bosib xabar yuboring',
    firstNameRequired: 'Ism kiritish majburiy',
    lastNameRequired: 'Familiya kiritish majburiy',
    subjectRequired: 'Fan kiritish majburiy',
    
    // Message system
    bulkMessageTitle: 'Ommaviy Xabar Yuborish',
    usersWillReceiveMessage: 'ta foydalanuvchiga xabar yuboriladi',
    enterMessageText: 'Xabar matnini kiriting...',
    send: 'Yuborish',
    sendMessage: 'Xabar Yuborish',
    messageSentSuccessfully: 'Xabar muvaffaqiyatli yuborildi!',
    writeYourMessage: 'Xabaringizni yozing...',
    errorLoadingMessages: 'Xabarlarni yuklashda xatolik',
    
    // Buttons
    deleteButton: 'O\'chirish',
    cancelButton: 'Bekor qilish',
    saveButton: 'Saqlash',
    editButton: 'Tahrirlash',
    
    // Admin User Management
    newUser: 'Yangi Foydalanuvchi',
    selectGroup: 'Guruhni tanlang',
    onlyForNotifications: 'faqat bildirishnomalar uchun',
    emailOptionalNote: 'Email majburiy emas, faqat bildirishnomalar uchun ishlatiladi',
    userCreatedSuccessfully: 'Foydalanuvchi muvaffaqiyatli yaratildi!',
    searchPlaceholder: 'Qidirish...',
    selectedCount: 'ta tanlangan',
    userColumn: 'Foydalanuvchi',
    roleColumn: 'Rol',
    emailColumn: 'Email',
    lastLoginColumn: 'Oxirgi Kirish',
    statusColumn: 'Holat',
    actionsColumn: 'Harakatlar',
    noEmail: 'Email yo\'q',
    never: 'Hech qachon',
    blocked: 'Bloklangan',
    resetPasswordTitle: 'Parolni qayta o\'rnatish',
    editTitle: 'Tahrirlash',
    deleteTitle: 'O\'chirish',
    newPasswordAlert: 'Yangi parol',
    userStatusError: 'Foydalanuvchi holatini o\'zgartirishda xatolik',
    
    // Button labels
    exportButton: 'Export',
    importButton: 'Import',
    
    // Theme toggle
    lightTheme: 'Yorug\'',
    darkTheme: 'Qorong\'u',
    
    // Upload messages
    uploadingVideo: 'Video yuklanmoqda...',
    uploadFailed: 'Yuklash muvaffaqiyatsiz. Qayta urinib ko\'ring.',
    
    // Additional hardcoded text fixes
    teacherComment: 'Ustoz izohi:',
    teacherLabel: 'Ustoz:',
    platformActivityReports: 'Platform faoliyati bo\'yicha batafsil hisobotlar',
    parentLogins: 'Ota-ona Kirimlari',
    parentActivity: 'Ota-onalar Faolligi',
    parentColumn: 'Ota-ona',
    activeStatus: 'Faol',
    lessActiveStatus: 'Kam faol',
    childActiveToday: 'Farzandingiz bugun darsda juda faol edi',
    
    // Additional search and filter texts
    searchTeacher: 'Ustoz qidirish...',
    noHomeworkForFilter: 'Tanlangan filtr bo\'yicha uy vazifalari mavjud emas',
    searchStudent: 'O\'quvchi qidirish...',
    searchUser: 'Foydalanuvchi qidirish...',
    
    // Additional missing translations
    olympiad: 'Olimpiadasi',
    annualEnglishOlympiad: 'Yillik ingliz tili olimpiadasi',
    weekly: 'Haftalik',
    monthly: 'Oylik',
    yearly: 'Yillik',
    teachingSubject: 'O\'qitadigan fan',
    watchVideoExplanation: 'Videoni ko\'ring, u yerda batafsil tushuntirilgan',
    markAsRead: 'O\'qilgan deb belgilash',
    invalidEmailFormat: 'Noto\'g\'ri email format',
    englishLanguageTeaching: 'Ingliz tili o\'qitish',
    
    // Additional time periods
    thisWeek: 'Bu hafta',
    thisMonth: 'Bu oy',
    thisQuarter: 'Bu chorak',
    thisYear: 'Bu yil',
    totalAssigned: 'Jami berilgan',
    assigned: 'Berilgan',
    totalDays: 'Jami kunlar',
    lateDays: 'Kech kelgan',
    attendanceRate: 'Davomat foizi',
    notAssigned: 'Tayinlanmagan',
    childProgress: 'Farzand rivojlanishi',
    parentGreeting: 'Assalomu alaykum! Farzandim haqida gaplashmoqchi edim',
    discussGrades: 'Baholar haqida gaplashish',
    generalFeedback: 'Umumiy baho: Yaxshi natija. Davom eting!',
    
    // Offline Mode translations
    offlineMode: 'Offline rejim',
    retry: 'Qayta urinish',
    connectionLost: 'Internet aloqasi uzildi',
    connectionRestored: 'Internet aloqasi tiklandi',
    offlineDescription: 'Ba\'zi funksiyalar offline rejimda ham ishlaydi',
    onlineDescription: 'Barcha funksiyalar endi mavjud',
    pendingActions: 'ta amal kutilmoqda',
    syncingData: 'Ma\'lumotlar sinxronlanmoqda',
    offline: 'Offline',
    online: 'Online',
    pending: 'Kutilmoqda',
    
    // Additional hardcoded texts that need translation
    algebraExercises: 'Algebra mashqlari',
    solveEquations: 'Tenglamalarni yeching',
    mathOlympiad: 'Matematika Olimpiadasi',
    annualMathOlympiad: 'Yillik matematika olimpiadasi',
    waysToEarnPoints: 'Ball yig\'ish yo\'llari',
    newCompetitionsWillAppear: 'Yangi tanlovlar e\'lon qilinganda bu yerda ko\'rasiz',
    startingSoon: 'Tez orada boshlanadi',
    adminManager: 'Admin Boshqaruvchi',
    englishLanguage: 'Ingliz tili',
    regularAttendance: 'Muntazam davomat',
    submitHomeworkOnTime: 'Uy vazifalarini o\'z vaqtida topshirish',
    mathematicalThinking: 'Matematik fikrlash',
    problemSolving: 'Muammolarni yechish',
    creativeApproach: 'Ijodiy yondashuv',
    
    // Additional missing keys for profile
    quickStats: 'Tezkor statistika',
    achievements: 'Yutuqlar',
    lastLogin: 'Oxirgi kirish',
    now: 'Hozir',
    notProvided: 'Kiritilmagan',
    noAchievements: 'Hozircha yutuqlar yo\'q',
    registeredOn: 'Ro\'yxatdan o\'tgan',
    teamwork: 'Guruhda ishlash',
    timeManagement: 'Vaqtni boshqarish',
    registeredOn: 'Ro\'yxatdan o\'tgan',
    allRoles: 'Barcha rollar',
    never: 'Hech qachon',
    siteName: 'Sayt nomi',
    siteDescription: 'Sayt tavsifi',
    defaultLanguage: 'Standart til',
    allowRegistration: 'Ro\'yxatdan o\'tishga ruxsat',
    newUsersCanRegister: 'Yangi foydalanuvchilar ro\'yxatdan o\'ta olsinmi',
    enableNotifications: 'Bildirishnomalarni yoqish',
    systemNotifications: 'Tizim bildirishnomalarini yoqish/o\'chirish',
    groupSettings: 'Guruh sozlamalari',
    maxStudentsPerGroup: 'Guruhda maksimal o\'quvchilar soni',
    maxStudentsDescription: 'Bir guruhda bo\'lishi mumkin bo\'lgan maksimal o\'quvchilar soni',
    fileSettings: 'Fayl sozlamalari',
    hourly: 'Har soat',
    daily: 'Har kun',
    weekly: 'Har hafta',
    monthly: 'Har oy',
    backupFrequency: 'Ma\'lumotlar bazasining zaxira nusxasi chastotasi',
    additionalExercise: 'Qo\'shimcha mashq',
    solveAdditionalProblems: '5 ta qo\'shimcha masala yeching',
    creativeProject: 'Ijodiy loyiha',
    preparePresentation: 'Fan bo\'yicha prezentatsiya tayyorlang',
    specialBadge: 'Maxsus nishon',
    profileBadge: 'Profildagi maxsus nishon',
    additionalPoint: 'Qo\'shimcha ball',
    extraPointDescription: 'Istalgan fandan +1 ball',
    firstStep: 'Birinchi qadam',
    completeFirstBonus: 'Birinchi bonus vazifani bajaring',
    loveOfReading: 'O\'qish sevgisi',
    readTenBooks: '10 ta kitob o\'qish vazifasini bajaring',
    mathOlympiadTitle: 'Matematik Olimpiada',
    schoolMathCompetition: 'Maktab ichidagi matematik musobaqa',
    creativeProjects: 'Ijodiy Loyihalar',
    bestProjectContest: 'Eng yaxshi loyiha tanlovi',
    bonusTasks: 'Bonus Vazifalar',
    
    // Notifications
    clearNotification: 'O\'chirish',
    clearAllNotifications: 'Barcha bildirishnomalarni o\'chirish',
    
    // Admin actions
    successDeleted: 'Muvaffaqiyatli o\'chirildi!',
    successSaved: 'Muvaffaqiyatli saqlandi!',
    editItem: 'Tahrirlash',
    addNew: 'Yangi Qo\'shish',
    
    // Footer
    allRightsReserved: 'Barcha huquqlar himoyalangan',
    
    // Additional UI elements
    createNewCompetition: 'Yangi tanlov yaratish',
    addRule: 'Qoida qo\'shish',
    newCompetitionsWillAppear: 'Yangi tanlovlar e\'lon qilinganda bu yerda ko\'rasiz',
    myGroups: 'Mening guruhlarim',
    createNewGroup: 'Yangi guruh yaratish',
    newSubject: 'Yangi Fan',
    newGroup: 'Yangi Guruh',
    newLesson: 'Yangi Dars',
    newExam: 'Yangi Imtihon',
    lastUpdate: 'Oxirgi yangilanish',
    groupStatistics: 'Guruhlar bo\'yicha statistika',
    homeworkStatistics: 'Uy vazifalari statistikasi',
    newMessage: 'Yangi xabar',
    registeredOn: 'Ro\'yxatdan o\'tgan',
    createNewHomework: 'Yangi vazifa yaratish',
    
    // Competition specific
    competitions: 'Tanlovlar',
    createCompetition: 'Tanlov yaratish',
    competitionName: 'Tanlov nomi',
    participantGroups: 'Ishtirokchi guruhlar',
    competitionDescription: 'Tanlov haqida qisqacha ma\'lumot',
    endDate: 'Tugash sanasi',
    rules: 'Qoidalar',
    addRule: 'Qoida qo\'shish',
    prizes: 'Mukofotlar',
    position: 'O\'rin',
    prizeDescription: 'Mukofot tavsifi',
    points: 'Ballar',
    manage: 'Boshqarish',
    participants: 'Ishtirokchilar',
    results: 'Natijalar',
    endDate: 'Tugash',
    participantsCount: 'Ishtirokchilar',
    eligibleGroups: 'Ishtirok etishi mumkin bo\'lgan guruhlar',
    selectMultipleGroups: 'Ctrl tugmasini bosib bir nechta guruh tanlang',
    
    // Groups specific
    myGroups: 'Mening guruhlarim',
    createGroup: 'Guruh yaratish',
    groupName: 'Guruh nomi',
    subject: 'Fan',
    level: 'Daraja',
    maxStudents: 'Maksimal o\'quvchilar soni',
    selectLevel: 'Darajani tanlang',
    beginner: 'Boshlang\'ich',
    intermediate: 'O\'rta',
    advanced: 'Yuqori',
    groupDescription: 'Guruh haqida qisqacha ma\'lumot',
    viewStudents: 'O\'quvchilarni ko\'rish',
    noGroupsYet: 'Hozircha guruhlar yo\'q',
    createFirstGroup: 'Birinchi guruhingizni yarating va o\'quvchilarni qo\'shing',
    
    // Admin Education specific
    educationManagement: 'Ta\'lim Jarayoni Boshqaruvi',
    manageSubjectsGroupsSchedules: 'Fanlar, guruhlar, jadvallar va baholash tizimini boshqaring',
    subjects: 'Fanlar',
    schedule: 'Dars Jadvali',
    grading: 'Baholash',
    exams: 'Imtihonlar',
    subjectsList: 'Fanlar Ro\'yxati',
    groupsList: 'Guruhlar',
    classSchedule: 'Dars Jadvali',
    gradingSystemSettings: 'Baholash Tizimi Sozlamalari',
    examsPlan: 'Imtihonlar Rejasi',
    subjectName: 'Fan nomi',
    groupName: 'Guruh Nomi',
    studentsCount: 'O\'quvchilar Soni',
    grade: 'Daraja',
    actions: 'Harakatlar',
    gradingScale: 'Baholash Shkala',
    currentScale: 'Joriy shkala',
    passingGrade: 'O\'tish bali',
    gradingCriteria: 'Baholash Mezonlari',
    examType: 'Imtihon turi',
    duration: 'Davomiyligi',
    minutes: 'daqiqa',
    room: 'Xona',
    monday: 'Dushanba',
    tuesday: 'Seshanba',
    wednesday: 'Chorshanba',
    thursday: 'Payshanba',
    friday: 'Juma',
    saturday: 'Shanba',
    sunday: 'Yakshanba',
    
    // Analytics specific
    analyticsAndReports: 'Analitika va Hisobotlar',
    lastUpdated: 'Oxirgi yangilanish',
    userGrowth: 'Foydalanuvchilar o\'sishi',
    homeworkStatistics: 'Uy vazifalari statistikasi',
    systemHealth: 'Tizim salomatligi',
    serverUptime: 'Server ishlash vaqti',
    errorsCount: 'Xatolar soni',
    allServices: 'Barcha xizmatlar',
    last7Days: 'So\'ngi 7 kun',
    totalCreated: 'Jami yaratilgan',
    ungraded: 'Baholanmagan',
    graded: 'Bajarilgan',
    averageGrade: 'O\'rtacha baho',
    completionRate: 'Bajarilish foizi',
    
    // Parent Home specific
    childEducationProgress: 'Farzandingizning ta\'lim jarayonini kuzatib boring',
    totalScore: 'Umumiy ball',
    attendance: 'Davomat',
    homeworkCompletion: 'Uy vazifalari',
    groupRank: 'Guruhda o\'rni',
    recentResults: 'So\'ngi natijalar',
    overallIndicators: 'Umumiy ko\'rsatkichlar',
    earnedPoints: 'Yig\'ilgan ballar',
    groupPosition: 'Guruhda o\'rni',
    weeklyAttendance: 'Bu hafta davomati',
    days: 'kun',
    quickActions: 'Tezkor harakatlar',
    parentTips: 'Ota-onalar uchun maslahatlar',
    talkWithChild: 'Farzandingiz bilan kundalik suhbatlashing',
    helpWithHomework: 'Uy vazifalarini bajarishda yordam bering',
    stayInTouch: 'Ustoz bilan muntazam aloqada bo\'ling',
    appreciateSuccess: 'Muvaffaqiyatlarni taqdirlang',
    
    // Teacher Home specific
    readyToTeach: 'Bugun ham o\'quvchilaringiz bilan ishlashga tayyormisiz?',
    totalStudents: 'Jami o\'quvchilar',
    groups: 'Guruhlar',
    pendingTasks: 'Kutilayotgan vazifalar',
    unreadMessages: 'O\'qilmagan xabarlar',
    recentActivity: 'So\'ngi faoliyat',
    hoursAgo: 'soat oldin',
    createHomework: 'Uy vazifasi yaratish',
    viewGrades: 'Baholarni ko\'rish',
    createCompetition: 'Tanlov yaratish',
    messages: 'Xabarlar',
    teacher: 'Ustoz',
    groupsTaught: 'guruh',
    
    // Admin Parents specific
    parents: 'Ota-onalar',
    searchParents: 'Ota-ona qidirish...',
    child: 'Farzand',
    father: 'Ota',
    mother: 'Ona',
    children: 'Farzandlar',
    status: 'Holat',
    active: 'Faol',
    inactive: 'Nofaol',
    registeredOn: 'Ro\'yxatdan o\'tgan',
    lastLogin: 'Oxirgi kirish',
    noSearchResults: 'Qidiruv bo\'yicha natija topilmadi',
    noParentsYet: 'Hozircha ota-onalar yo\'q',
    
    // Login page specific
    studentRole: 'O\'quvchi',
    teacherRole: 'O\'qituvchi', 
    parentRole: 'Ota-ona',
    platformDescription: 'Ingliz tili o\'qitish platformasi',
    optional: 'ixtiyoriy',
    userCreatedSuccessfully: 'Foydalanuvchi muvaffaqiyatli yaratildi!',
    groupCreatedSuccessfully: 'Guruh muvaffaqiyatli yaratildi!',
    selectTeacher: 'Ustozni tanlang',
    selectStudents: 'O\'quvchilarni tanlang',
    selected: 'tanlangan',
    noAvailableStudents: 'Guruhsiz o\'quvchilar yo\'q',
    
    // Login error messages
    userNotFound: 'Foydalanuvchi topilmadi',
    checkCredentials: 'Ma\'lumotlaringizni tekshiring',
    accountNotActive: 'Hisob faol emas',
    incorrectPassword: 'Noto\'g\'ri parol',
    
    // Teacher Homework specific
    homework: 'Uy vazifalari',
    createNewHomework: 'Yangi vazifa yaratish',
    noHomeworkYet: 'Hozircha uy vazifalari yo\'q',
    createFirstHomework: 'Birinchi uy vazifangizni yarating',
    createHomework: 'Vazifa yaratish',
    submissionStatus: 'Topshirish holati',
    totalSubmitted: 'Jami topshirgan',
    ungraded: 'Baholanmagan',
    graded: 'Baholangan',
    averageScore: 'O\'rtacha baho',
    viewSubmissions: 'Topshiriqlarni ko\'rish',
    edit: 'Tahrirlash',
    delete: 'O\'chirish',
    homeworkName: 'Vazifa nomi',
    selectGroup: 'Guruhni tanlang',
    description: 'Tavsif',
    homeworkDescription: 'Vazifa haqida qisqacha ma\'lumot',
    dueDate: 'Topshirish muddati',
    exercises: 'Mashqlar',
    addExercise: 'Mashq qo\'shish',
    exercise: 'Mashq',
    exerciseName: 'Mashq nomi',
    points: 'Ballar',
    exerciseDescription: 'Mashq haqida ma\'lumot',
    pageFrom: 'Sahifa (dan)',
    pageTo: 'Sahifa (gacha)',
    exerciseNumbers: 'Mashq raqamlari',
    videoUrl: 'Video URL',
    videoTitle: 'Video nomi',
    explanationVideo: 'Tushuntirish videosi',
    create: 'Yaratish',
    submissions: 'Topshiriqlar',
    noSubmissionsYet: 'Hozircha hech kim topshirmagan',
    submitted: 'Topshirilgan',
    submittedAt: 'Topshirilgan',
    grade: 'Baholash',
    close: 'Yopish',
  },
  ru: {
    // Common
    login: 'Войти',
    logout: 'Выйти',
    profile: 'Профиль',
    dashboard: 'Главная',
    settings: 'Настройки',
    save: 'Сохранить',
    cancel: 'Отмена',
    edit: 'Редактировать',
    delete: 'Удалить',
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успех',
    search: 'Поиск',
    filter: 'Фильтр',
    all: 'Все',
    grades: 'Оценки',
    late: 'Опоздал',
    present: 'Присутствовал',
    absent: 'Отсутствовал',
    unknown: 'Неизвестно',
    selectGroupToViewStudents: 'Выберите группу для просмотра учеников',
    noStudentsInGroup: 'В этой группе нет учеников',
    studentsWillAppearHere: 'Ученики появятся здесь при добавлении',
    selectType: 'Выберите тип',
    classParticipation: 'Участие в уроках',
    activityLevel: 'Уровень активности',
    claimed: 'Получено',
    available: 'Доступно',
    locked: 'Заблокировано',
    
    // Status messages
    submitted: 'Сдано',
    overdue: 'Просрочено',
    pending: 'Ожидается',
    graded: 'Оценено',
    noHomework: 'Пока нет домашних заданий',
    noCompetitions: 'Пока нет конкурсов',
    
    // Competition status
    upcoming: 'Предстоящий',
    completed: 'Завершен',
    unknown: 'Неизвестно',
    
    // Admin panel
    welcomeAdmin: 'Добро пожаловать, Админ!',
    totalUsers: 'Всего пользователей',
    quickActions: 'Быстрые действия',
    recentActivity: 'Недавние пользователи',
    activeUsers: 'Активные пользователи',
    activeGroups: 'Активные группы',
    weeklyDistribution: 'Недельное распределение',
    
    // Quick actions
    reportsTitle: 'Отчеты',
    reportsDesc: 'Подробные отчеты и аналитика',
    userManagementTitle: 'Управление пользователями',
    userManagementDesc: 'Полное управление пользователями',
    educationTitle: 'Образовательный процесс',
    educationDesc: 'Предметы, группы и расписания',
    bonusTitle: 'Бонусы и награды',
    bonusDesc: 'Управление системой мотивации',
    teacherManagementTitle: 'Управление учителями',
    teacherManagementDesc: 'Учителя и их группы',
    analyticsTitle: 'Аналитика',
    analyticsDesc: 'Статистика платформы и отчеты',
    settingsTitle: 'Настройки',
    settingsDesc: 'Системные настройки и конфигурация',
    
    // System status
    systemStatus: 'Состояние системы',
    backendActive: 'Backend сервер: Активен',
    databaseConnected: 'База данных: Подключена',
    allServicesRunning: 'Все сервисы: Работают',
    
    // User roles in admin
    teacherRole: 'Учитель',
    studentRole: 'Ученик',
    parentRole: 'Родитель',
    
    // Empty states
    noRecentUsers: 'Пока нет новых пользователей',
    
    // Admin welcome message
    adminWelcomeDesc: 'Полное управление платформой через админ панель',
    administratorRole: 'Администратор',
    fullAccess: 'Полные права',
    
    // Time and dates
    startDate: 'Дата начала',
    
    // General status
    isActive: 'Активный',
    isInactive: 'Неактивный',
    
    // Date labels
    dueDate: 'Срок сдачи',
    startDate: 'Начало',
    
    // Task types
    daily: 'Ежедневное',
    weekly: 'Еженедельное',
    social: 'Социальное',
    project: 'Проект',
    
    // Rank suffix
    rankSuffix: '-е место',
    
    // Profile descriptions
    personalInfoDescription: 'Личная информация и настройки',
    
    // Platform
    platformName: 'Платформа Английского Языка',
    platformDescription: 'Профессиональная платформа изучения английского',
    
    // Auth
    firstName: 'Имя',
    lastName: 'Фамилия',
    password: 'Пароль',
    studentLogin: 'Вход ученика',
    teacherLogin: 'Вход учителя',
    parentLogin: 'Вход родителя',
    adminLogin: 'Вход администратора',
    studentDescription: 'Войти как ученик',
    teacherDescription: 'Войти как учитель',
    parentDescription: 'Войти как родитель',
    adminDescription: 'Войти как администратор',
    enterFirstName: 'Введите ваше имя',
    enterLastName: 'Введите вашу фамилию',
    enterPassword: 'Введите ваш пароль',
    studentId: 'ID ученика',
    teacherId: 'ID учителя',
    subject: 'Предмет',
    parentType: 'Тип',
    childName: 'Имя ребенка',
    
    // Navigation
    home: 'Главная',
    videoLessons: 'Видео уроки',
    homework: 'Домашние задания',
    assignments: 'Задания',
    rewards: 'Награды',
    competitions: 'Конкурсы',
    messages: 'Сообщения',
    rating: 'Рейтинг',
    progress: 'Прогресс',
    groups: 'Группы',
    students: 'Ученики',
    teachers: 'Учителя',
    parents: 'Родители',
    users: 'Пользователи',
    analytics: 'Аналитика',
    reports: 'Отчеты',
    userManagement: 'Управление пользователями',
    education: 'Образовательный процесс',
    bonusRewards: 'Бонусы и награды',
    
    // Student Dashboard
    welcomeStudent: 'Добро пожаловать',
    readyToLearn: 'Готовы изучать новое сегодня?',
    totalScore: 'Общий балл',
    groupRank: 'Место в группе',
    attendance: 'Посещаемость',
    points: 'Баллы',
    recentHomework: 'Последние задания',
    upcomingCompetitions: 'Предстоящие конкурсы',
    bonusTasks: 'Бонусные задания',
    quickActions: 'Быстрые действия',
    
    // Teacher Dashboard
    welcomeTeacher: 'Добро пожаловать',
    manageClasses: 'Управляйте своими классами',
    
    // Video Lessons
    videoLessonsTitle: 'Видео уроки',
    manageVideoContent: 'Управляйте видео контентом',
    uploadVideo: 'Загрузить видео',
    totalVideos: 'Всего видео',
    totalViews: 'Всего просмотров',
    published: 'Опубликовано',
    drafts: 'Черновики',
    videoTitle: 'Название видео',
    description: 'Описание',
    level: 'Уровень',
    category: 'Категория',
    videoFile: 'Видео файл',
    uploadNewVideo: 'Загрузить новое видео',
    
    // Video Categories
    grammar: 'Грамматика',
    speaking: 'Говорение',
    writing: 'Письмо',
    reading: 'Чтение',
    listening: 'Аудирование',
    pronunciation: 'Произношение',
    vocabulary: 'Словарь',
    
    // Levels
    beginner: 'Начальный',
    elementary: 'Элементарный',
    intermediate: 'Средний',
    upperIntermediate: 'Выше среднего',
    advanced: 'Продвинутый',
    proficiency: 'Профессиональный',
    
    // Common Actions
    watch: 'Смотреть',
    watchNow: 'Смотреть сейчас',
    watchAgain: 'Смотреть снова',
    bookmark: 'Закладка',
    share: 'Поделиться',
    download: 'Скачать',
    
    // Status
    active: 'Активный',
    inactive: 'Неактивный',
    completed: 'Завершено',
    pending: 'Ожидание',
    draft: 'Черновик',
    
    // Time
    duration: 'Длительность',
    uploadDate: 'Дата загрузки',
    lastLogin: 'Последний вход',
    
    // Stats
    views: 'просмотров',
    watched: 'просмотрено',
    saved: 'сохранено',
    
    // Filters
    allLevels: 'Все уровни',
    allCategories: 'Все категории',
    searchVideos: 'Поиск видео...',
    
    // Messages
    noVideosFound: 'Видео не найдены',
    adjustFilters: 'Измените параметры поиска',
    videoUploaded: 'Видео успешно загружено!',
    videoDeleted: 'Видео удалено!',
    uploadFailed: 'Ошибка загрузки',
    
    // Admin
    adminPanel: 'Панель администратора',
    manageUsers: 'Управление пользователями',
    systemStats: 'Статистика системы',
    
    // Common UI
    close: 'Закрыть',
    people: 'человек',
    selectSubject: 'Выберите предмет',
    mathematics: 'Математика',
    physics: 'Физика',
    chemistry: 'Химия',
    biology: 'Биология',
    
    // Subject names - ONLY ENGLISH LANGUAGE
    englishLanguage: 'Английский язык',
    englishGrammar: 'Грамматика английского языка',
    englishSpeaking: 'Английский язык - Говорение',
    englishWriting: 'Английский язык - Письмо',
    englishReading: 'Английский язык - Чтение',
    englishListening: 'Английский язык - Аудирование',
    
    // English learning specific terms
    grammarExercises: 'Упражнения по грамматике',
    speakingPractice: 'Практика говорения',
    writingTasks: 'Письменные задания',
    readingComprehension: 'Понимание прочитанного',
    listeningExercises: 'Упражнения на аудирование',
    vocabularyBuilding: 'Расширение словарного запаса',
    pronunciationPractice: 'Практика произношения',
    
    // English levels
    beginnerEnglish: 'Начальный уровень',
    elementaryEnglish: 'Элементарный уровень',
    intermediateEnglish: 'Средний уровень',
    upperIntermediateEnglish: 'Выше среднего',
    advancedEnglish: 'Продвинутый уровень',
    
    // English class names
    englishClass1: 'Английский язык - Группа 1',
    englishClass2: 'Английский язык - Группа 2',
    englishClass3: 'Английский язык - Группа 3',
    
    // English achievements
    bestEnglishResult: 'Лучший результат по английскому языку',
    englishProgress: 'Прогресс в английском языке',
    englishSkills: 'Навыки английского языка',
    
    // Remove math/physics references
    // mathematics: 'Математика', - REMOVED
    // physics: 'Физика', - REMOVED
    // chemistry: 'Химия', - REMOVED
    // biology: 'Биология', - REMOVED
    
    // English learning messages
    strugglingWithEnglish: 'Похоже, он испытывает трудности с английским языком. Как я могу помочь дома?',
    englishHomework: 'Английский язык - Упражнения по грамматике',
    englishWritingTask: 'Английский язык - Письменное задание',
    
    // Days of week
    monday: 'Понедельник',
    tuesday: 'Вторник',
    wednesday: 'Среда', 
    thursday: 'Четверг',
    friday: 'Пятница',
    
    // Exam types
    semesterExam: 'Семестровый экзамен',
    quarterExam: 'Четвертной экзамен',
    
    // Reasons
    illness: 'Болезнь',
    familyReason: 'Семейные обстоятельства',
    
    // English learning messages
    strugglingWithEnglish: 'U ingliz tili fanidan qiynalayotganga o\'xshaydi. Uyda qanday yordam bera olaman?',
    englishHomework: 'Ingliz tili - Grammatika mashqlari',
    englishWritingTask: 'Ingliz tili - Yozish vazifasi',
    
    // Days of week
    monday: 'Dushanba',
    tuesday: 'Seshanba', 
    wednesday: 'Chorshanba',
    thursday: 'Payshanba',
    friday: 'Juma',
    
    // Exam types
    semesterExam: 'Yarim yillik',
    quarterExam: 'Chorak',
    
    // Reasons
    illness: 'Kasallik',
    familyReason: 'Oilaviy sabab',
    newHomeworkCreated: 'Создано новое домашнее задание',
    messageFromParent: 'Сообщение от родителя',
    homeworkSubmitted: '5 домашних заданий сдано',
    hoursAgo: 'часов назад',
    open: 'Открыть',
    next: 'Далее',
    previous: 'Назад',
    submit: 'Отправить',
    reset: 'Сбросить',
    clear: 'Очистить',
    apply: 'Применить',
    
    // Parent specific
    personalInfo: 'Личная информация',
    childrenInfo: 'Информация о детях',
    quickStats: 'Быстрая статистика',
    notifications: 'Уведомления',
    privacy: 'Конфиденциальность',
    appSettings: 'Настройки приложения',
    darkMode: 'Темный режим',
    language: 'Язык',
    father: 'Отец',
    mother: 'Мать',
    phone: 'Телефон',
    email: 'Email',
    address: 'Адрес',
    birthDate: 'Дата рождения',
    occupation: 'Профессия',
    group: 'Группа',
    teacher: 'Учитель',
    averageGrade: 'Средняя оценка',
    
    // Notifications
    homeworkNotifications: 'Домашние задания',
    gradesNotifications: 'Оценки',
    attendanceNotifications: 'Посещаемость',
    messagesNotifications: 'Сообщения',
    competitionsNotifications: 'Конкурсы',
    
    // Privacy
    showPhone: 'Показывать номер телефона',
    showEmail: 'Показывать email адрес',
    allowMessages: 'Разрешить отправку сообщений',
    
    // Notifications
    newMessage: 'Новое сообщение',
    newAssignment: 'Новое задание',
    reminderDue: 'Напоминание о сроке',
    
    // Additional common terms
    name: 'Имя',
    fullName: 'Полное имя',
    role: 'Роль',
    status: 'Статус',
    date: 'Дата',
    time: 'Время',
    description: 'Описание',
    details: 'Детали',
    back: 'Назад',
    forward: 'Вперед',
    refresh: 'Обновить',
    update: 'Обновить',
    create: 'Создать',
    add: 'Добавить',
    remove: 'Удалить',
    confirm: 'Подтвердить',
    yes: 'Да',
    no: 'Нет',
    
    // Empty states
    noData: 'Нет данных',
    noResults: 'Результаты не найдены',
    emptyList: 'Список пуст',
    noNewHomework: 'Новые домашние задания появятся здесь',
    
    // Real platform messages
    realPlatform: 'Реальная образовательная платформа',
    professionalSystem: 'Профессиональная система',
    
    // Test accounts
    testAccounts: 'Демо аккаунты',
    
    // Error messages
    errorLoadingCompetitions: 'Ошибка загрузки конкурсов',
    successJoinedCompetition: 'Успешно присоединились к конкурсу!',
    errorJoiningCompetition: 'Ошибка присоединения к конкурсу',
    successCreatedCompetition: 'Конкурс успешно создан!',
    errorCreatingCompetition: 'Ошибка создания конкурса',
    errorLoadingGroups: 'Ошибка загрузки групп',
    gradeUpdatedSuccessfully: 'Оценка успешно обновлена!',
    errorUpdatingGrade: 'Ошибка обновления оценки',
    gradeStudent: 'Оценить {name}',
    total: 'Общий',
    student: 'Ученик',
    parent: 'Родитель',
    studentQuestionExample: 'Учитель, я не понял пример на 7-й странице',
    selectConversationToChat: 'Выберите беседу для общения с учеником или родителем',
    homeworkCreatedSuccessfully: 'Домашнее задание успешно создано!',
    errorCreatingHomework: 'Ошибка создания домашнего задания',
    groupCreatedSuccessfully: 'Группа успешно создана!',
    errorCreatingGroup: 'Ошибка создания группы',
    homeworkGraded: '5 домашних заданий оценено',
    newCompetitionAnnounced: 'Объявлен новый конкурс',
    rewardRuleSequential: 'Награды нужно получать последовательно',
    rewardRulePrevious: 'Нельзя получить следующую награду, не получив предыдущую',
    rewardRuleBonusTasks: 'Выполняйте бонусные задания для получения дополнительных баллов',
    rewardRulePointsDeducted: 'Баллы списываются после получения награды',
    submitHomeworkOnTime: 'Сдавайте домашние задания вовремя',
    completeBonusTasks: 'Выполняйте бонусные задания',
    participateInCompetitions: 'Участвуйте в конкурсах',
    
    // Admin panel specific
    systemSettings: 'Системные настройки',
    generalSettings: 'Общие настройки',
    security: 'Безопасность',
    bonusRewardsSystem: 'Система бонусов и наград',
    manageStudentMotivation: 'Управляйте мотивацией и поощрением учеников',
    reportsAndAnalytics: 'Отчеты и аналитика',
    manageAllUsers: 'Управляйте всеми пользователями и контролируйте их',
    allRoles: 'Все роли',
    admins: 'Администраторы',
    allUsers: 'Все пользователи',
    activeStudents: 'Активные ученики',
    
    // Student rewards specific
    errorLoadingRewards: 'Ошибка загрузки наград',
    rewardClaimedSuccessfully: 'Награда успешно получена!',
    errorClaimingReward: 'Ошибка получения награды',
    rewardsSystem: 'Система наград',
    noRewardsYet: 'Пока нет наград',
    rewardsComingSoon: 'Награды скоро появятся',
    claimReward: 'Получить награду',
    participateActivelyInClass: 'Активно участвуйте в уроках',
    
    // Student rating specific
    ratingSystemNotActive: 'Система рейтинга еще не активирована',
    assignments: 'задание',
    groupRankPosition: '{rank}-е место в группе',
    peopleInGroup: 'человек в группе',
    groupRating: 'Рейтинг группы',
    attendAllClassesOnTime: 'Посещайте все занятия вовремя',
    completeHomeworkOnTime: 'Выполняйте домашние задания вовремя',
    
    // Student profile specific
    beActiveAndAchieve: 'Будьте активными и достигайте успехов!',
    
    // Messages specific
    parentQuestionExample: 'Хочу узнать об учебном процессе моего ребенка',
    chatWithTeacher: 'Общайтесь с учителем',
    
    // Homework specific
    algebraExercisesExample: 'Все примеры со страниц 7-8',
    errorLoadingHomework: 'Ошибка загрузки домашних заданий',
    homeworkSubmittedSuccessfully: 'Домашнее задание успешно сдано!',
    errorSubmittingHomework: 'Ошибка сдачи домашнего задания',
    assignmentOverdue: 'Срок сдачи этого задания истек',
    
    // Bonus tasks
    bonusTaskCompleted: 'Бонусное задание выполнено!',
    
    // Additional UI elements
    thisWeekClasses: 'Занятия на этой неделе',
    errorLoadingStudents: 'Ошибка загрузки учеников',
    errorSendingMessage: 'Ошибка отправки сообщения',
    confirmDeleteVideo: 'Вы уверены, что хотите удалить это видео?',
    videoUploadedSuccessfully: 'Видео успешно загружено!',
    videoDeletedSuccessfully: 'Видео успешно удалено!',
    failedToDeleteVideo: 'Не удалось удалить видео',
    nothingFound: 'Ничего не найдено',
    noConversationsYet: 'Пока нет бесед',
    noMessagesYet: 'Пока нет сообщений. Отправьте первое сообщение!',
    pressEnterToSend: 'Нажмите Enter для отправки сообщения',
    firstNameRequired: 'Имя обязательно для заполнения',
    lastNameRequired: 'Фамилия обязательна для заполнения',
    subjectRequired: 'Предмет обязателен для заполнения',
    
    // Message system
    bulkMessageTitle: 'Массовая отправка сообщений',
    usersWillReceiveMessage: 'пользователей получат сообщение',
    enterMessageText: 'Введите текст сообщения...',
    send: 'Отправить',
    sendMessage: 'Отправить сообщение',
    messageSentSuccessfully: 'Сообщение успешно отправлено!',
    writeYourMessage: 'Напишите ваше сообщение...',
    errorLoadingMessages: 'Ошибка загрузки сообщений',
    
    // Buttons
    deleteButton: 'Удалить',
    cancelButton: 'Отмена',
    saveButton: 'Сохранить',
    editButton: 'Редактировать',
    
    // Admin User Management
    newUser: 'Новый пользователь',
    selectGroup: 'Выберите группу',
    onlyForNotifications: 'только для уведомлений',
    emailOptionalNote: 'Email не обязателен, используется только для уведомлений',
    userCreatedSuccessfully: 'Пользователь успешно создан!',
    searchPlaceholder: 'Поиск...',
    selectedCount: 'выбрано',
    userColumn: 'Пользователь',
    roleColumn: 'Роль',
    emailColumn: 'Email',
    lastLoginColumn: 'Последний вход',
    statusColumn: 'Статус',
    actionsColumn: 'Действия',
    noEmail: 'Нет email',
    never: 'Никогда',
    blocked: 'Заблокирован',
    resetPasswordTitle: 'Сбросить пароль',
    editTitle: 'Редактировать',
    deleteTitle: 'Удалить',
    newPasswordAlert: 'Новый пароль',
    userStatusError: 'Ошибка изменения статуса пользователя',
    
    // Button labels
    exportButton: 'Экспорт',
    importButton: 'Импорт',
    
    // Theme toggle
    lightTheme: 'Светлая',
    darkTheme: 'Темная',
    
    // Upload messages
    uploadingVideo: 'Загрузка видео...',
    uploadFailed: 'Загрузка не удалась. Попробуйте еще раз.',
    
    // Additional hardcoded text fixes
    teacherComment: 'Комментарий учителя:',
    teacherLabel: 'Учитель:',
    platformActivityReports: 'Подробные отчеты по активности платформы',
    parentLogins: 'Входы родителей',
    parentActivity: 'Активность родителей',
    parentColumn: 'Родитель',
    activeStatus: 'Активный',
    lessActiveStatus: 'Менее активный',
    childActiveToday: 'Ваш ребенок был очень активен на уроке сегодня',
    
    // Additional search and filter texts
    searchTeacher: 'Поиск учителя...',
    noHomeworkForFilter: 'Нет домашних заданий по выбранному фильтру',
    searchStudent: 'Поиск ученика...',
    searchUser: 'Поиск пользователя...',
    
    // Additional missing translations
    olympiad: 'Олимпиада',
    annualEnglishOlympiad: 'Ежегодная олимпиада по английскому языку',
    weekly: 'Еженедельно',
    monthly: 'Ежемесячно',
    yearly: 'Ежегодно',
    teachingSubject: 'Преподаваемый предмет',
    watchVideoExplanation: 'Посмотрите видео, там подробно объяснено',
    markAsRead: 'Отметить как прочитанное',
    invalidEmailFormat: 'Неверный формат email',
    englishLanguageTeaching: 'Преподавание английского языка',
    
    // Additional time periods
    thisWeek: 'Эта неделя',
    thisMonth: 'Этот месяц',
    thisQuarter: 'Эта четверть',
    thisYear: 'Этот год',
    totalAssigned: 'Всего назначено',
    assigned: 'Назначено',
    totalDays: 'Всего дней',
    lateDays: 'Опозданий',
    attendanceRate: 'Процент посещаемости',
    notAssigned: 'Не назначено',
    childProgress: 'Прогресс ребенка',
    parentGreeting: 'Здравствуйте! Хотел поговорить о моем ребенке',
    discussGrades: 'Обсуждение оценок',
    generalFeedback: 'Общая оценка: Хороший результат. Продолжайте!',
    
    // Offline Mode translations
    offlineMode: 'Автономный режим',
    retry: 'Повторить',
    connectionLost: 'Соединение с интернетом потеряно',
    connectionRestored: 'Соединение с интернетом восстановлено',
    offlineDescription: 'Некоторые функции работают в автономном режиме',
    onlineDescription: 'Все функции теперь доступны',
    pendingActions: 'действий ожидает',
    syncingData: 'Синхронизация данных',
    offline: 'Автономно',
    online: 'Онлайн',
    pending: 'Ожидание',
    
    // Additional hardcoded texts that need translation
    algebraExercises: 'Упражнения по алгебре',
    solveEquations: 'Решите уравнения',
    mathOlympiad: 'Математическая олимпиада',
    annualMathOlympiad: 'Ежегодная математическая олимпиада',
    waysToEarnPoints: 'Способы заработать баллы',
    newCompetitionsWillAppear: 'Новые конкурсы появятся здесь',
    startingSoon: 'Скоро начнется',
    adminManager: 'Администратор',
    englishLanguage: 'Английский язык',
    regularAttendance: 'Регулярное посещение',
    submitHomeworkOnTime: 'Сдавайте домашние задания вовремя',
    mathematicalThinking: 'Математическое мышление',
    problemSolving: 'Решение проблем',
    creativeApproach: 'Творческий подход',
    teamwork: 'Работа в команде',
    timeManagement: 'Управление временем',
    registeredOn: 'Зарегистрирован',
    allRoles: 'Все роли',
    never: 'Никогда',
    siteName: 'Название сайта',
    siteDescription: 'Описание сайта',
    defaultLanguage: 'Язык по умолчанию',
    allowRegistration: 'Разрешить регистрацию',
    newUsersCanRegister: 'Могут ли новые пользователи регистрироваться',
    enableNotifications: 'Включить уведомления',
    systemNotifications: 'Включить/выключить системные уведомления',
    groupSettings: 'Настройки группы',
    maxStudentsPerGroup: 'Максимум учеников в группе',
    maxStudentsDescription: 'Максимальное количество учеников в одной группе',
    fileSettings: 'Настройки файлов',
    hourly: 'Каждый час',
    daily: 'Каждый день',
    weekly: 'Каждую неделю',
    monthly: 'Каждый месяц',
    backupFrequency: 'Частота резервного копирования базы данных',
    additionalExercise: 'Дополнительное упражнение',
    solveAdditionalProblems: 'Решите 5 дополнительных задач',
    creativeProject: 'Творческий проект',
    preparePresentation: 'Подготовьте презентацию по предмету',
    specialBadge: 'Специальный значок',
    profileBadge: 'Специальный значок в профиле',
    additionalPoint: 'Дополнительный балл',
    extraPointDescription: '+1 балл по любому предмету',
    firstStep: 'Первый шаг',
    completeFirstBonus: 'Выполните первое бонусное задание',
    loveOfReading: 'Любовь к чтению',
    readTenBooks: 'Выполните 10 заданий по чтению книг',
    mathOlympiadTitle: 'Математическая олимпиада',
    schoolMathCompetition: 'Школьная математическая олимпиада',
    creativeProjects: 'Творческие проекты',
    bestProjectContest: 'Конкурс лучших проектов',
    bonusTasks: 'Бонусные задания',
    
    // Notifications
    clearNotification: 'Удалить',
    clearAllNotifications: 'Удалить все уведомления',
    
    // Admin actions
    successDeleted: 'Успешно удалено!',
    successSaved: 'Успешно сохранено!',
    editItem: 'Редактировать',
    addNew: 'Добавить новый',
    
    // Footer
    allRightsReserved: 'Все права защищены',
    
    // Additional UI elements
    createNewCompetition: 'Создать новый конкурс',
    addRule: 'Добавить правило',
    newCompetitionsWillAppear: 'Новые конкурсы появятся здесь',
    myGroups: 'Мои группы',
    createNewGroup: 'Создать новую группу',
    newSubject: 'Новый предмет',
    newGroup: 'Новая группа',
    newLesson: 'Новый урок',
    newExam: 'Новый экзамен',
    lastUpdate: 'Последнее обновление',
    groupStatistics: 'Статистика по группам',
    homeworkStatistics: 'Статистика домашних заданий',
    newMessage: 'Новое сообщение',
    registeredOn: 'Зарегистрирован',
    createNewHomework: 'Создать новое задание',
    
    // Competition specific
    competitions: 'Конкурсы',
    createCompetition: 'Создать конкурс',
    competitionName: 'Название конкурса',
    participantGroups: 'Группы участников',
    competitionDescription: 'Краткая информация о конкурсе',
    endDate: 'Дата окончания',
    rules: 'Правила',
    addRule: 'Добавить правило',
    prizes: 'Призы',
    position: 'Место',
    prizeDescription: 'Описание приза',
    points: 'Баллы',
    manage: 'Управление',
    participants: 'Участники',
    results: 'Результаты',
    endDate: 'Окончание',
    participantsCount: 'Участники',
    eligibleGroups: 'Группы, которые могут участвовать',
    selectMultipleGroups: 'Удерживайте Ctrl для выбора нескольких групп',
    
    // Groups specific
    myGroups: 'Мои группы',
    createGroup: 'Создать группу',
    groupName: 'Название группы',
    subject: 'Предмет',
    level: 'Уровень',
    maxStudents: 'Максимальное количество учеников',
    selectLevel: 'Выберите уровень',
    beginner: 'Начальный',
    intermediate: 'Средний',
    advanced: 'Продвинутый',
    groupDescription: 'Краткая информация о группе',
    viewStudents: 'Посмотреть учеников',
    noGroupsYet: 'Пока нет групп',
    createFirstGroup: 'Создайте свою первую группу и добавьте учеников',
    
    // Admin Education specific
    educationManagement: 'Управление образовательным процессом',
    manageSubjectsGroupsSchedules: 'Управляйте предметами, группами, расписаниями и системой оценивания',
    subjects: 'Предметы',
    schedule: 'Расписание занятий',
    grading: 'Оценивание',
    exams: 'Экзамены',
    subjectsList: 'Список предметов',
    groupsList: 'Группы',
    classSchedule: 'Расписание занятий',
    gradingSystemSettings: 'Настройки системы оценивания',
    examsPlan: 'План экзаменов',
    subjectName: 'Название предмета',
    groupName: 'Название группы',
    studentsCount: 'Количество учеников',
    grade: 'Уровень',
    actions: 'Действия',
    gradingScale: 'Шкала оценивания',
    currentScale: 'Текущая шкала',
    passingGrade: 'Проходной балл',
    gradingCriteria: 'Критерии оценивания',
    examType: 'Тип экзамена',
    duration: 'Длительность',
    minutes: 'минут',
    room: 'Кабинет',
    monday: 'Понедельник',
    tuesday: 'Вторник',
    wednesday: 'Среда',
    thursday: 'Четверг',
    friday: 'Пятница',
    saturday: 'Суббота',
    sunday: 'Воскресенье',
    
    // Analytics specific
    analyticsAndReports: 'Аналитика и отчеты',
    lastUpdated: 'Последнее обновление',
    userGrowth: 'Рост пользователей',
    homeworkStatistics: 'Статистика домашних заданий',
    systemHealth: 'Состояние системы',
    serverUptime: 'Время работы сервера',
    errorsCount: 'Количество ошибок',
    allServices: 'Все сервисы',
    last7Days: 'Последние 7 дней',
    totalCreated: 'Всего создано',
    ungraded: 'Не оценено',
    graded: 'Выполнено',
    averageGrade: 'Средняя оценка',
    completionRate: 'Процент выполнения',
    
    // Parent Home specific
    childEducationProgress: 'Следите за образовательным процессом вашего ребенка',
    totalScore: 'Общий балл',
    attendance: 'Посещаемость',
    homeworkCompletion: 'Домашние задания',
    groupRank: 'Место в группе',
    recentResults: 'Последние результаты',
    overallIndicators: 'Общие показатели',
    earnedPoints: 'Набранные баллы',
    groupPosition: 'Место в группе',
    weeklyAttendance: 'Посещаемость на этой неделе',
    days: 'дней',
    quickActions: 'Быстрые действия',
    parentTips: 'Советы для родителей',
    talkWithChild: 'Ежедневно разговаривайте с ребенком',
    helpWithHomework: 'Помогайте с выполнением домашних заданий',
    stayInTouch: 'Регулярно общайтесь с учителем',
    appreciateSuccess: 'Цените успехи',
    
    // Teacher Home specific
    readyToTeach: 'Готовы работать с учениками сегодня?',
    totalStudents: 'Всего учеников',
    groups: 'Группы',
    pendingTasks: 'Ожидающие задания',
    unreadMessages: 'Непрочитанные сообщения',
    recentActivity: 'Последняя активность',
    hoursAgo: 'часов назад',
    createHomework: 'Создать домашнее задание',
    viewGrades: 'Посмотреть оценки',
    createCompetition: 'Создать конкурс',
    messages: 'Сообщения',
    teacher: 'Учитель',
    groupsTaught: 'групп',
    
    // Admin Parents specific
    parents: 'Родители',
    searchParents: 'Поиск родителей...',
    child: 'Ребенок',
    father: 'Отец',
    mother: 'Мать',
    children: 'Дети',
    status: 'Статус',
    active: 'Активный',
    inactive: 'Неактивный',
    registeredOn: 'Зарегистрирован',
    lastLogin: 'Последний вход',
    noSearchResults: 'Результаты поиска не найдены',
    noParentsYet: 'Пока нет родителей',
    
    // Teacher Homework specific
    homework: 'Домашние задания',
    createNewHomework: 'Создать новое задание',
    noHomeworkYet: 'Пока нет домашних заданий',
    createFirstHomework: 'Создайте свое первое домашнее задание',
    createHomework: 'Создать задание',
    submissionStatus: 'Статус сдачи',
    totalSubmitted: 'Всего сдали',
    ungraded: 'Не оценено',
    graded: 'Оценено',
    averageScore: 'Средний балл',
    viewSubmissions: 'Посмотреть работы',
    edit: 'Редактировать',
    delete: 'Удалить',
    homeworkName: 'Название задания',
    selectGroup: 'Выберите группу',
    description: 'Описание',
    homeworkDescription: 'Краткая информация о задании',
    dueDate: 'Срок сдачи',
    exercises: 'Упражнения',
    addExercise: 'Добавить упражнение',
    exercise: 'Упражнение',
    exerciseName: 'Название упражнения',
    points: 'Баллы',
    exerciseDescription: 'Информация об упражнении',
    pageFrom: 'Страница (с)',
    pageTo: 'Страница (до)',
    exerciseNumbers: 'Номера упражнений',
    videoUrl: 'URL видео',
    videoTitle: 'Название видео',
    explanationVideo: 'Объяснительное видео',
    create: 'Создать',
    submissions: 'Работы',
    noSubmissionsYet: 'Пока никто не сдал',
    submitted: 'Сдано',
    submittedAt: 'Сдано',
    grade: 'Оценить',
    close: 'Закрыть',
    
    // Assignment interface
    selectAtLeastOneStudent: 'Выберите хотя бы одного ученика!',
    confirmRemoveStudents: 'Подтвердите удаление учеников из группы?',
    studentsRemovedSuccessfully: 'Ученики успешно удалены!',
    selectGroupAndTeacher: 'Выберите группу и учителя!',
    teacherAssignedSuccessfully: 'Учитель успешно назначен!',
    viewDetails: 'Подробнее',
    
    // Additional missing keys for profile
    quickStats: 'Быстрая статистика',
    achievements: 'Достижения',
    lastLogin: 'Последний вход',
    now: 'Сейчас',
    notProvided: 'Не указано',
    noAchievements: 'Пока нет достижений',
    registeredOn: 'Зарегистрирован',
    
    // Login page specific
    studentRole: 'Ученик',
    teacherRole: 'Учитель', 
    parentRole: 'Родитель',
    platformDescription: 'Платформа для изучения английского языка',
    optional: 'необязательно',
    userCreatedSuccessfully: 'Пользователь успешно создан!',
    groupCreatedSuccessfully: 'Группа успешно создана!',
    selectTeacher: 'Выберите учителя',
    selectStudents: 'Выберите учеников',
    selected: 'выбрано',
    noAvailableStudents: 'Нет доступных учеников',
    
    // Login error messages
    userNotFound: 'Пользователь не найден',
    checkCredentials: 'Проверьте ваши данные',
    accountNotActive: 'Аккаунт не активен',
    incorrectPassword: 'Неверный пароль',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'uz';
  });

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    availableLanguages: [
      { code: 'uz', name: 'O\'zbekcha' },
      { code: 'ru', name: 'Русский' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};